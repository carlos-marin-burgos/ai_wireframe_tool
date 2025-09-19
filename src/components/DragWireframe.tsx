/*
 * Enhanced DragWireframe Component
 * 
 * Features:
 * 1. Cross-container moves - Elements can be moved between .row, .col, .section, etc.
 * 2. Drag mode toggle - Button to enable/disable dragging to prevent accidental moves
 * 3. Ordering metadata - Semantic structure tracking for better diffing
 * 
 * Usage:
 * <DragWireframe 
 *   htmlContent={wireframeHtml}
 *   onUpdateContent={(newHtml) => setWireframeHtml(newHtml)}
 *   onOrderingChange={(metadata) => console.log('Structure changed:', metadata)}
 * />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import './DragWireframe.css';

interface OrderingMetadata {
    id: string;
    tagName: string;
    className?: string;
    textContent?: string;
    children: OrderingMetadata[];
}

interface DragWireframeProps {
    htmlContent: string;
    onUpdateContent?: (newContent: string) => void;
    onOrderingChange?: (metadata: OrderingMetadata[]) => void;
}

// Generate ordering metadata from DOM structure
function generateOrderingMetadata(element: Element, index: number = 0): OrderingMetadata {
    const id = element.id || `element-${element.tagName.toLowerCase()}-${index}`;

    return {
        id,
        tagName: element.tagName.toLowerCase(),
        className: element.className || undefined,
        textContent: element.textContent?.trim().substring(0, 50) || undefined,
        children: Array.from(element.children).map((child, childIndex) =>
            generateOrderingMetadata(child, childIndex)
        )
    };
}

// Find all containers that can accept drops (rows, cols, sections, etc.)
function findDragContainers(rootElement: HTMLElement): HTMLElement[] {
    const containers = [rootElement]; // Always include the root

    // More conservative approach - only add containers that make sense for drag operations
    // NOTE: 'article' removed from selectors to prevent individual components inside cards from being draggable
    const selectors = [
        '.row', '.col', '.column',
        '.container', '.container-fluid', '.section', '.grid',
        '[data-droppable="true"]',
        '.card-body', '.panel-body',
        'main', 'section', // Removed 'article' - articles should be draggable items, not containers
        '.hero', '.hero-section', '.hero-banner',
        'form', '.form-section', '.form-group'
    ];

    selectors.forEach(selector => {
        const elements = rootElement.querySelectorAll(selector);
        elements.forEach(el => {
            if (el instanceof HTMLElement) {
                // Additional check: only add if element has sufficient content area for drops
                const rect = el.getBoundingClientRect();
                if (rect.width > 50 && rect.height > 30) {
                    containers.push(el);
                }
            }
        });
    });

    return [...new Set(containers)]; // Remove duplicates
}
function sanitizeHTML(html: string): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    try {
        // Clean up common AI response artifacts and malformed HTML
        let cleanHtml = html.trim();

        // Remove markdown code blocks if they exist
        cleanHtml = cleanHtml.replace(/^```html\s*/gi, '');
        cleanHtml = cleanHtml.replace(/^```\s*/gi, '');
        cleanHtml = cleanHtml.replace(/```\s*$/gi, '');

        // Remove any leading/trailing quotes or artifacts
        cleanHtml = cleanHtml.replace(/^['"`]+|['"`]+$/g, '');

        // If it's a complete HTML document, extract styles and body content
        if (cleanHtml.includes('<html') && cleanHtml.includes('</html>')) {
            // Extract styles from head
            const styleMatches = cleanHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
            let styles = '';
            if (styleMatches) {
                styles = styleMatches.join('\n');
            }

            // Extract body content
            const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                // Combine styles with body content
                cleanHtml = styles + bodyMatch[1];
            }
        }

        // Validate that we have some HTML tags
        if (!cleanHtml.includes('<') || !cleanHtml.includes('>')) {
            return `<div style="padding: 20px; color: #666; font-family: 'Segoe UI', sans-serif;">
                <p><strong>⚠️ HTML Rendering Issue</strong></p>
                <p>The wireframe content appears to be malformed. Please try regenerating the wireframe.</p>
            </div>`;
        }

        return cleanHtml;
    } catch (error) {
        return `<div style="padding: 20px; color: #dc3545; font-family: 'Segoe UI', sans-serif;">
            <p><strong>❌ HTML Parsing Error</strong></p>
            <p>Failed to parse wireframe content. Please try regenerating the wireframe.</p>
        </div>`;
    }
}

const DragWireframe: React.FC<DragWireframeProps> = React.memo(({
    htmlContent,
    onUpdateContent,
    onOrderingChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragulaRef = useRef<any>(null);
    const [isDragEnabled, setIsDragEnabled] = useState(false);
    const isDragEnabledRef = useRef<boolean>(false); // live flag for event handlers
    const [dragContainers, setDragContainers] = useState<HTMLElement[]>([]);
    const currentEditingRef = useRef<HTMLElement | null>(null);
    const augmentedRef = useRef<boolean>(false);
    const editableTaggedRef = useRef<boolean>(false);
    const insertionMarkerRef = useRef<HTMLDivElement | null>(null);
    const formattingToolbarRef = useRef<HTMLDivElement | null>(null);
    const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const activeDragElementRef = useRef<HTMLElement | null>(null);
    const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
    const cleanupMarkerRef = useRef<(() => void) | null>(null);
    const simpleModeRef = useRef<boolean>(false); // fallback simple direct-children mode
    const reinitRequestedRef = useRef<boolean>(false);
    const previousContentRef = useRef<string>(''); // Track previous content to prevent unnecessary re-renders
    const onUpdateContentRef = useRef<((content: string) => void) | undefined>();
    const [isTransitioning, setIsTransitioning] = useState(false); // Animation state for mode switching

    // Keep callback ref updated
    onUpdateContentRef.current = onUpdateContent;

    // Create (once) the insertion marker element
    const getInsertionMarker = () => {
        if (!insertionMarkerRef.current) {
            const marker = document.createElement('div');
            marker.className = 'insertion-gap-marker';
            marker.setAttribute('aria-hidden', 'true');
            insertionMarkerRef.current = marker;
        }
        return insertionMarkerRef.current!;
    };

    // Determine target container under pointer (supports cross-container)
    const resolveContainerFromPoint = (clientX: number, clientY: number): HTMLElement | null => {
        const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
        if (!el) return null;
        return el.closest('.dragula-container.drag-enabled') as HTMLElement | null;
    };

    // Position insertion marker based on pointer Y relative to siblings
    const updateInsertionMarker = (evt: MouseEvent) => {
        const container = resolveContainerFromPoint(evt.clientX, evt.clientY) || containerRef.current;
        if (!container) return;
        const marker = getInsertionMarker();
        // Collect candidate siblings (direct children only)
        const children = Array.from(container.children).filter(ch => ch !== marker && ch !== activeDragElementRef.current) as HTMLElement[];
        if (children.length === 0) {
            // Empty container -> append marker
            if (marker.parentElement !== container) container.appendChild(marker);
            return;
        }
        // Find insertion point
        const y = evt.clientY;
        let placed = false;
        for (let i = 0; i < children.length; i++) {
            const rect = children[i].getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            if (y < midpoint) {
                if (children[i].previousSibling === marker) {
                    placed = true; break;
                }
                container.insertBefore(marker, children[i]);
                placed = true;
                break;
            }
        }
        if (!placed) {
            if (children[children.length - 1].nextSibling !== marker) {
                container.appendChild(marker);
            }
        }
    };

    // Remove editable markers (used when entering drag mode)
    const clearEditableMarkers = () => {
        if (!containerRef.current) return;
        const tagged = containerRef.current.querySelectorAll('[data-editable="true"]');
        tagged.forEach(n => n.removeAttribute('data-editable'));
        editableTaggedRef.current = false;
    };

    // Clear any inline hover outlines left from edit mode
    const clearInlineHoverStyles = () => {
        if (!containerRef.current) return;
        const outlined = containerRef.current.querySelectorAll('[style]');
        outlined.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            // We only clear the lightweight hover outline, not active editing outline (which should already be finished)
            if (node.style.outline === '1px solid var(--color-primary-medium)' || node.style.outline === '1px solid rgb(117, 147, 175)') {
                node.style.outline = '1px solid transparent';
            }
        });
    };

    // Tag elements that are eligible for inline text editing with data-editable
    const markEditableElements = () => {
        if (!containerRef.current) return;
        editableTaggedRef.current = true;
        const candidates = containerRef.current.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,button,label,li,td,th,div');
        candidates.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            if (node.getAttribute('data-editing') === 'true') return;
            // Reuse existing heuristic
            if (isEligibleEditable(node)) {
                node.setAttribute('data-editable', 'true');
            } else {
                node.removeAttribute('data-editable');
            }
        });
    };

    // Tag structural blocks (forms, hero, card groups) as draggable blocks if they are not already direct children
    const augmentDraggableBlocks = () => {
        if (!containerRef.current) return;
        if (augmentedRef.current) return; // run once per content load
        const root = containerRef.current;

        // Clear any existing draggable-block classes first
        root.querySelectorAll('.draggable-block').forEach(el => {
            el.classList.remove('draggable-block');
            el.removeAttribute('data-struct-block');
        });

        const blockSelectors = [
            'form', '.form-section', '.form-group',
            '.hero', '.hero-section', '.hero-banner',
            '.card-group', '.card', '.feature', '.feature-block',
            'header:not(.ms-learn-topnav)', 'footer:not(.ms-learn-topnav)',
            'nav:not(.ms-learn-nav)', 'aside', 'main', 'section', 'article'
        ];

        // First pass: mark structural elements
        let markedCount = 0;
        blockSelectors.forEach(sel => {
            root.querySelectorAll(sel).forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                // Avoid marking the root container itself
                if (node === root) return;
                // Skip elements that are too small or likely to be decorative
                const rect = node.getBoundingClientRect();
                if (rect.width < 50 || rect.height < 30) return;
                // Skip if it's inside another draggable block (to avoid nested draggables)
                if (node.closest('.draggable-block')) return;

                node.classList.add('draggable-block');
                node.setAttribute('data-struct-block', sel);
                markedCount++;
            });
        });

        // Fallback: if nothing was tagged, mark first-level element children
        if (markedCount === 0) {
            const firstLevel = Array.from(root.children).filter(el =>
                el.tagName !== 'STYLE' &&
                el.tagName !== 'SCRIPT' &&
                !el.classList.contains('insertion-gap-marker')
            ) as HTMLElement[];

            firstLevel.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.width > 20 && rect.height > 20) {
                    el.classList.add('draggable-block');
                    el.setAttribute('data-struct-block', 'auto-first-level');
                    markedCount++;
                }
            });
        }

        // If still nothing marked, force-mark visible elements
        if (markedCount === 0) {
            const allElements = Array.from(root.querySelectorAll('*')).filter(el => {
                if (!(el instanceof HTMLElement)) return false;
                if (el === root) return false;
                const rect = el.getBoundingClientRect();
                return rect.width > 50 && rect.height > 30;
            }) as HTMLElement[];

            // Take the first few large elements
            allElements.slice(0, 5).forEach(el => {
                if (!el.closest('.draggable-block')) {
                    el.classList.add('draggable-block');
                    el.setAttribute('data-struct-block', 'fallback');
                    markedCount++;
                }
            });
        }

        // eslint-disable-next-line no-console
        console.log('[Wireframe Drag] Draggable blocks marked:', markedCount);
        augmentedRef.current = true;
    };

    // Finish editing helper
    const finishEditing = useCallback((el: HTMLElement | null, save: boolean = true) => {
        if (!el) return;

        // Prevent multiple calls to finishEditing for the same element
        if (el.getAttribute('data-editing') !== 'true') return;

        if (el.contentEditable === 'true') {
            el.contentEditable = 'false';
        }
        el.style.outline = '';
        el.style.backgroundColor = '';
        el.style.border = '';
        el.removeAttribute('data-editing');
        setShowFormattingToolbar(false);

        // Only call onUpdateContent if content actually changed and we have a valid container
        if (save && containerRef.current && onUpdateContentRef.current) {
            console.log('[DEBUG] finishEditing - calling onUpdateContent with setTimeout');
            // Use setTimeout to prevent immediate re-render loops
            setTimeout(() => {
                if (containerRef.current && onUpdateContentRef.current) {
                    console.log('[DEBUG] finishEditing - executing onUpdateContent');
                    onUpdateContentRef.current(containerRef.current.innerHTML);
                }
            }, 0);
        }

        currentEditingRef.current = null;
    }, []); // Removed onUpdateContent dependency - using ref instead

    // Formatting toolbar functions
    const executeFormatCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (currentEditingRef.current) {
            currentEditingRef.current.focus();
        }
    };

    const positionFormattingToolbar = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();

        if (containerRect) {
            // Since toolbar is now inside the container, calculate relative position
            const containerScrollTop = containerRef.current?.scrollTop || 0;
            const containerScrollLeft = containerRef.current?.scrollLeft || 0;

            let top = (rect.top - containerRect.top) + containerScrollTop - 45;
            let left = (rect.left - containerRect.left) + containerScrollLeft;

            // Ensure toolbar doesn't go off-screen within the container
            const toolbarWidth = 140; // Estimated toolbar width
            const toolbarHeight = 32; // Estimated toolbar height

            // Adjust horizontal position if too far right
            if (left + toolbarWidth > containerRect.width - 20) {
                left = containerRect.width - toolbarWidth - 20;
            }

            // Adjust vertical position if too close to top
            if (top < 10) {
                top = (rect.bottom - containerRect.top) + containerScrollTop + 5; // Position below element
            }

            // Ensure minimum margins within container
            left = Math.max(10, left);
            top = Math.max(10, top);

            setToolbarPosition({ top, left });
        }
    };    // Function to update ordering metadata
    const updateOrderingMetadata = () => {
        if (!containerRef.current || !onOrderingChange) return;

        const metadata = Array.from(containerRef.current.children).map((child, index) =>
            generateOrderingMetadata(child, index)
        );
        onOrderingChange(metadata);
    };

    // Function to toggle drag mode with fade animation
    const toggleDragMode = () => {
        // Start fade animation
        setIsTransitioning(true);

        // Brief fade out
        setTimeout(() => {
            const next = !isDragEnabledRef.current;
            isDragEnabledRef.current = next; // update ref first so immediate drags see correct state
            setIsDragEnabled(next);

            // Fade back in
            setTimeout(() => {
                setIsTransitioning(false);
            }, 150); // Fade in duration
        }, 150); // Fade out duration
    };

    // Heuristic to decide if an element is eligible for inline editing
    const isEligibleEditable = (el: HTMLElement): boolean => {
        if (!el) return false;
        if (!el.textContent || !el.textContent.trim()) return false;

        const tag = el.tagName;
        const classList = Array.from(el.classList);

        // Never make structural/container elements editable
        const containerClasses = ['card', 'card-body', 'card-header', 'card-footer', 'container', 'container-fluid', 'row', 'col', 'navbar', 'nav', 'section', 'hero', 'jumbotron'];
        if (containerClasses.some(cls => classList.includes(cls))) {
            return false;
        }

        // Never make elements with Bootstrap grid classes editable
        if (classList.some(cls => cls.match(/^col-/) || cls === 'col')) {
            return false;
        }

        // Always editable text elements
        const alwaysEditable = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON', 'LABEL', 'LI', 'TD', 'TH'];
        if (alwaysEditable.includes(tag)) {
            // But not if they contain other block elements
            const hasBlockChildren = Array.from(el.children).some(child => {
                const childTag = child.tagName;
                return ['DIV', 'SECTION', 'HEADER', 'FOOTER', 'UL', 'OL', 'NAV', 'MAIN', 'ASIDE', 'TABLE', 'FORM'].includes(childTag);
            });
            return !hasBlockChildren;
        }

        // For DIVs, be very restrictive - only if it's clearly a text wrapper
        if (tag === 'DIV') {
            // Must not have any child elements at all (pure text div)
            if (el.children.length > 0) return false;

            // Must have substantial text content
            if (el.textContent.trim().length < 5) return false;

            // Must not have container-like classes
            const hasContainerClass = classList.some(cls =>
                cls.includes('card') ||
                cls.includes('container') ||
                cls.includes('wrapper') ||
                cls.includes('section') ||
                cls.includes('row') ||
                cls.includes('col')
            );
            return !hasContainerClass;
        }

        return false;
    };

    // Apply hover styles dynamically (delegated) so we don't attach per-node listeners
    const applyHoverStyling = (container: HTMLElement) => {
        container.addEventListener('mouseover', (e) => {
            if (isDragEnabledRef.current) return; // live check
            const target = e.target as HTMLElement;
            if (!container.contains(target)) return;
            if (target && isEligibleEditable(target) && target.contentEditable !== 'true') {
                target.style.outline = '1px solid var(--color-primary-medium)';
                target.style.cursor = 'text';
            }
        });
        container.addEventListener('mouseout', (e) => {
            const target = e.target as HTMLElement;
            if (target && target.getAttribute('data-editing') !== 'true' && target.contentEditable !== 'true') {
                target.style.outline = '1px solid transparent';
            }
        });
    };

    // Handle click on editable elements
    // Delegated click handler installed on container only
    const handleContainerClick = (e: MouseEvent) => {
        if (isDragEnabledRef.current) return; // editing disabled in drag mode (live ref)
        if (!containerRef.current) return;
        const target = e.target as HTMLElement;
        if (!target || !containerRef.current.contains(target)) return;

        // Walk up to find eligible editable element (some clicks may hit nested spans)
        let el: HTMLElement | null = target;
        const stopNode = containerRef.current;
        while (el && el !== stopNode && !isEligibleEditable(el)) {
            el = el.parentElement;
        }
        if (!el || el === stopNode) return;

        // Prevent starting editing if already editing this element
        if (el.getAttribute('data-editing') === 'true') return;

        // If clicking same editing element -> reselect
        if (currentEditingRef.current === el && el.contentEditable === 'true') {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
            return;
        }

        // Finish previous element with a small delay to prevent race conditions
        if (currentEditingRef.current && currentEditingRef.current !== el) {
            finishEditing(currentEditingRef.current);
            // Small delay to prevent immediate re-editing
            setTimeout(() => {
                startEditing(el as HTMLElement);
            }, 10);
            return;
        }

        startEditing(el);
    };

    // Separate function to start editing to avoid code duplication
    const startEditing = (el: HTMLElement) => {
        if (!el || el.getAttribute('data-editing') === 'true') return;

        // Start editing new element
        el.contentEditable = 'true';
        el.setAttribute('data-editing', 'true');
        el.style.backgroundColor = 'var(--color-background-light)';
        el.style.outline = '2px solid var(--color-primary-medium-dark)';
        el.focus();
        currentEditingRef.current = el;

        // Show formatting toolbar
        positionFormattingToolbar(el);
        setShowFormattingToolbar(true);

        // Remove generic editable tag while actively editing (avoid double styles)
        el.removeAttribute('data-editable');
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        const handleKeyDown = (kev: KeyboardEvent) => {
            if (kev.key === 'Enter' && !kev.shiftKey) {
                kev.preventDefault();
                finishEditing(el);
            } else if (kev.key === 'Escape') {
                kev.preventDefault();
                finishEditing(el); // treat same as commit for simplicity
            } else if (kev.ctrlKey || kev.metaKey) {
                // Keyboard shortcuts for formatting
                switch (kev.key.toLowerCase()) {
                    case 'b':
                        kev.preventDefault();
                        executeFormatCommand('bold');
                        break;
                    case 'i':
                        kev.preventDefault();
                        executeFormatCommand('italic');
                        break;
                    case 'u':
                        kev.preventDefault();
                        executeFormatCommand('underline');
                        break;
                    default:
                        break;
                }
            }
        };

        const handleBlur = () => {
            setTimeout(() => {
                if (currentEditingRef.current === el) finishEditing(el);
                el.removeEventListener('keydown', handleKeyDown);
                el.removeEventListener('blur', handleBlur);
            }, 40);
        };

        el.addEventListener('keydown', handleKeyDown);
        el.addEventListener('blur', handleBlur);
    };

    // Helper to (re)initialize dragula with provided containers
    const initDragula = (containers: HTMLElement[]) => {
        if (dragulaRef.current) {
            try { dragulaRef.current.destroy(); } catch { }
        }

        // Filter out invalid containers
        const validContainers = containers.filter(container =>
            container &&
            container instanceof HTMLElement &&
            document.contains(container) &&
            !container.classList.contains('insertion-gap-marker')
        );

        // eslint-disable-next-line no-console
        console.log('[Wireframe Drag] Initializing dragula. Container count:', validContainers.length, 'Simple mode:', simpleModeRef.current);

        dragulaRef.current = dragula(validContainers, {
            moves: function (el, source, handle, sibling) {
                // Only allow moves if drag mode is enabled (ref-based to avoid stale closures)
                if (!isDragEnabledRef.current) return false;
                // Disallow moving the insertion marker itself just in case
                if (el && el.classList && el.classList.contains('insertion-gap-marker')) return false;
                // Prevent dragging the root container's direct child if it is acting as a global wrapper containing all other elements
                if (containerRef.current) {
                    if (el === containerRef.current) return false; // never root itself
                }
                // In simple mode, only direct children of the root container are draggable
                if (simpleModeRef.current && containerRef.current) {
                    if (el && el.parentElement !== containerRef.current) return false;
                }

                // Ensure the element is actually draggable
                if (!(el instanceof HTMLElement)) return false;

                // Check if element has minimum size for dragging
                const rect = el.getBoundingClientRect();
                if (rect.width < 10 || rect.height < 10) return false;

                return true;
            },
            accepts: function (el, target, source, sibling) {
                if (!(target instanceof HTMLElement)) return false;
                if (simpleModeRef.current) {
                    // Only allow reordering inside the single root container in simple mode
                    return target === containerRef.current;
                }

                // Ensure target is in our valid containers list
                return validContainers.includes(target);
            },
            invalid: function (el, handle) {
                // Don't allow dragging of form inputs, buttons, links
                if (!(el instanceof HTMLElement)) return true;
                // Explicitly block the insertion marker
                if (el.classList && el.classList.contains('insertion-gap-marker')) return true;
                // Block root container itself (should never be draggable) or accidental wrapper remainders
                if (containerRef.current && el === containerRef.current) return true;

                // Block sticky/fixed positioned elements as they often cause issues
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.position === 'sticky' || computedStyle.position === 'fixed') return true;

                return (
                    el.tagName === 'INPUT' ||
                    el.tagName === 'BUTTON' ||
                    el.tagName === 'A' ||
                    el.contentEditable === 'true' ||
                    el.hasAttribute('contenteditable')
                );
            }
        });

        // Add drag state class toggles & insertion marker handling + verbose debug
        dragulaRef.current.on('drag', (el: Element) => {
            if (containerRef.current) containerRef.current.classList.add('dragging-active');
            activeDragElementRef.current = el as HTMLElement;
            // eslint-disable-next-line no-console
            console.log('[Wireframe Drag] drag start ->', (el as HTMLElement).tagName, el.className);
            const marker = getInsertionMarker();
            marker.style.display = 'block';
            // Attach mousemove handler once per drag
            if (!mouseMoveHandlerRef.current) {
                mouseMoveHandlerRef.current = (e: MouseEvent) => updateInsertionMarker(e);
                window.addEventListener('mousemove', mouseMoveHandlerRef.current, { passive: true });
            }
        });
        const cleanupMarker = () => {
            activeDragElementRef.current = null;
            const marker = insertionMarkerRef.current;
            if (marker && marker.parentElement) marker.parentElement.removeChild(marker);
            if (mouseMoveHandlerRef.current) {
                window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
                mouseMoveHandlerRef.current = null;
            }
        };
        // Store for external access (e.g., when toggling drag mode off mid-drag)
        cleanupMarkerRef.current = cleanupMarker;
        dragulaRef.current.on('cancel', () => {
            if (containerRef.current) containerRef.current.classList.remove('dragging-active');
            // eslint-disable-next-line no-console
            console.log('[Wireframe Drag] drag cancel');
            cleanupMarker();
        });
        dragulaRef.current.on('drop', () => {
            if (containerRef.current) containerRef.current.classList.remove('dragging-active');
            // eslint-disable-next-line no-console
            console.log('[Wireframe Drag] drop');
            cleanupMarker();
            if (containerRef.current && onUpdateContentRef.current) {
                try {
                    console.log('[DEBUG] drag-drop - calling onUpdateContent');
                    const newContent = containerRef.current.innerHTML;
                    onUpdateContentRef.current(newContent);
                    updateOrderingMetadata();
                    // Re-run augmentation in case structure changed
                    augmentedRef.current = false;
                    augmentDraggableBlocks();
                    markEditableElements();
                } catch (error) {
                    // Silent error handling
                }
            }
        });
        dragulaRef.current.on('shadow', (el: Element, container: Element) => {
            // eslint-disable-next-line no-console
            console.log('[Wireframe Drag] shadow placeholder in', container === containerRef.current ? 'ROOT' : (container as HTMLElement).className);
        });
        dragulaRef.current.on('over', (el: Element, container: Element) => {
            // eslint-disable-next-line no-console
            console.log('[Wireframe Drag] over container', container === containerRef.current ? 'ROOT' : (container as HTMLElement).className);
        });
        dragulaRef.current.on('out', (el: Element, container: Element) => {
            // eslint-disable-next-line no-console
            console.log('[Wireframe Drag] out container', container === containerRef.current ? 'ROOT' : (container as HTMLElement).className);
        });

        updateOrderingMetadata();
    };

    // Primary effect: parse HTML and build containers when content changes OR when reinit requested
    useEffect(() => {
        console.log('[DEBUG] DragWireframe useEffect triggered:', {
            hasContainer: !!containerRef.current,
            reinitRequested: reinitRequestedRef.current,
            htmlContentLength: htmlContent.length,
            previousContentLength: previousContentRef.current.length,
            contentChanged: htmlContent !== previousContentRef.current
        });

        if (!containerRef.current) return;

        // Content stability check - skip if content hasn't actually changed
        if (!reinitRequestedRef.current && htmlContent === previousContentRef.current) {
            console.log('[DEBUG] Skipping re-render - content unchanged');
            return;
        }
        console.log('[DEBUG] Content changed - proceeding with re-render');
        previousContentRef.current = htmlContent;

        // If a manual re-init (simple/normal toggle) requested, skip reparsing HTML
        if (reinitRequestedRef.current) {
            reinitRequestedRef.current = false;
            try {
                const containers = simpleModeRef.current
                    ? [containerRef.current] // only root container
                    : (() => {
                        const list = findDragContainers(containerRef.current);
                        const direct = Array.from(containerRef.current.children) as HTMLElement[];
                        if (direct.length === 1) {
                            const only = direct[0];
                            if (!list.includes(only)) list.push(only);
                        }

                        // Filter to ensure valid containers
                        return list.filter(container =>
                            container &&
                            container instanceof HTMLElement &&
                            document.contains(container) &&
                            container.getBoundingClientRect().width > 0 &&
                            container.getBoundingClientRect().height > 0
                        );
                    })();

                setDragContainers(containers);
                initDragula(containers);
            } catch (error) {
                console.warn('[Wireframe Drag] Reinit error, falling back to simple mode:', error);
                simpleModeRef.current = true;
                setDragContainers([containerRef.current]);
                initDragula([containerRef.current]);
            }
            return;
        }

        // Fresh parse path
        if (dragulaRef.current) {
            try { dragulaRef.current.destroy(); } catch { }
        }
        const sanitizedHTML = sanitizeHTML(htmlContent);
        try {
            containerRef.current.innerHTML = sanitizedHTML;
            const elementChildren = Array.from(containerRef.current.children).filter(c => !(c.tagName === 'STYLE' || c.tagName === 'SCRIPT')) as HTMLElement[];
            if (!simpleModeRef.current) {
                if (elementChildren.length === 1) {
                    const sole = elementChildren[0];
                    const wrapperClassMatch = /(wireframe|wrapper|content|inner|layout|root|canvas)/i.test(sole.className || '');
                    const wrapperTagMatch = /^(DIV|MAIN|SECTION)$/i.test(sole.tagName);
                    if (wrapperTagMatch && wrapperClassMatch) {
                        const fragment = document.createDocumentFragment();
                        Array.from(sole.childNodes).forEach(n => fragment.appendChild(n));
                        containerRef.current.replaceChild(fragment, sole);
                    } else {
                        Array.from(sole.children).forEach(ch => {
                            if (ch instanceof HTMLElement && !ch.classList.contains('draggable-block')) ch.classList.add('draggable-block');
                        });
                    }
                }
            }
            augmentedRef.current = false;
            Array.from(containerRef.current.querySelectorAll('*')).forEach(n => {
                (n as HTMLElement).style.outline = '1px solid transparent';
            });
            augmentDraggableBlocks();
            markEditableElements();
        } catch (e) {
            console.warn('[Wireframe Drag] HTML parsing error:', e);
            containerRef.current.innerHTML = '<div style="padding:20px;color:#dc3545;font-family:Segoe UI,sans-serif"><p><strong>❌ Render Error</strong></p><p>Failed to render wireframe. Switching to simple mode.</p></div>';
            // Force simple mode on parse errors
            simpleModeRef.current = true;
        }
        const containers = simpleModeRef.current
            ? [containerRef.current]
            : (() => {
                try {
                    const list = findDragContainers(containerRef.current!);
                    const direct = Array.from(containerRef.current!.children) as HTMLElement[];
                    if (direct.length === 1) {
                        const only = direct[0];
                        if (!list.includes(only)) list.push(only);
                    }

                    // Ensure all containers are valid and accessible
                    const validContainers = list.filter(container =>
                        container &&
                        container instanceof HTMLElement &&
                        document.contains(container) &&
                        container.getBoundingClientRect().width > 0 &&
                        container.getBoundingClientRect().height > 0
                    );

                    // If no valid containers found, fallback to simple mode
                    if (validContainers.length <= 1) {
                        console.warn('[Wireframe Drag] No valid containers found, falling back to simple mode');
                        simpleModeRef.current = true;
                        return [containerRef.current!];
                    }

                    return validContainers;
                } catch (error) {
                    console.warn('[Wireframe Drag] Container detection error, falling back to simple mode:', error);
                    simpleModeRef.current = true;
                    return [containerRef.current!];
                }
            })();
        setDragContainers(containers);
        initDragula(containers);
    }, [htmlContent]); // Removed onUpdateContent dependency - using ref instead

    // Hotkeys: Alt+1 simple mode, Alt+2 normal mode
    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (!containerRef.current) return;
            if (e.altKey && e.key === '1') {
                if (!simpleModeRef.current) {
                    simpleModeRef.current = true;
                    reinitRequestedRef.current = true;
                    // eslint-disable-next-line no-console
                    console.log('[Wireframe Drag] Switching to SIMPLE mode (root-only).');
                    // Trigger re-init via state noop change
                    setIsDragEnabled(v => v); // force effect cycle
                }
            } else if (e.altKey && e.key === '2') {
                if (simpleModeRef.current) {
                    simpleModeRef.current = false;
                    reinitRequestedRef.current = true;
                    // eslint-disable-next-line no-console
                    console.log('[Wireframe Drag] Switching to NORMAL mode (multi-container).');
                    setIsDragEnabled(v => v);
                }
            }
        };
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    }, []);

    // Debug instrumentation (press Alt+D to log containers & first-level items)
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.altKey && (e.key === 'd' || e.key === 'D')) {
                if (!containerRef.current) return;
                const firstLevel = Array.from(containerRef.current.children).map(el => (el as HTMLElement).tagName + '.' + (el as HTMLElement).className);
                // eslint-disable-next-line no-console
                console.log('[Wireframe Debug] Containers:', dragContainers.map(c => c.tagName + '.' + c.className));
                // eslint-disable-next-line no-console
                console.log('[Wireframe Debug] First-level children:', firstLevel);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []); // Removed dragContainers dependency to prevent circular re-renders

    // Update cursor styles and event listeners when drag mode changes
    useEffect(() => {
        if (!containerRef.current) return;
        // ref already set in toggle, still keep in sync in case state changed externally
        isDragEnabledRef.current = isDragEnabled;
        // When toggling drag mode on, finalize any editing and clear markers
        if (isDragEnabled) {
            if (currentEditingRef.current) finishEditing(currentEditingRef.current);
            clearEditableMarkers();
            clearInlineHoverStyles();
            // Reset augmentation and re-run it to mark elements as draggable
            augmentedRef.current = false;
            augmentDraggableBlocks();
        } else {
            // Switching back to edit mode -> re-tag eligible elements
            markEditableElements();
            // Clear all draggable-block classes when turning drag mode off
            containerRef.current.querySelectorAll('.draggable-block').forEach(el => {
                el.classList.remove('draggable-block');
            });
            // Ensure any stray insertion marker / listeners are removed on mode exit
            if (cleanupMarkerRef.current) {
                cleanupMarkerRef.current();
            }
        }
    }, [isDragEnabled]);

    // Install delegated listeners once
    useEffect(() => {
        if (!containerRef.current) return;
        const c = containerRef.current;
        c.addEventListener('click', handleContainerClick);
        applyHoverStyling(c);
        const handleDoc = (e: MouseEvent) => {
            if (!c) return;
            const t = e.target as Node;
            if (currentEditingRef.current && t && !c.contains(t)) {
                finishEditing(currentEditingRef.current);
            }
        };
        document.addEventListener('mousedown', handleDoc);

        // Initial tagging after listeners attach
        markEditableElements();
        return () => {
            c.removeEventListener('click', handleContainerClick);
            document.removeEventListener('mousedown', handleDoc);
        };
    }, []);

    // Separate useEffect for formatting toolbar event listener
    useEffect(() => {
        if (!showFormattingToolbar || !formattingToolbarRef.current) return;

        const toolbar = formattingToolbarRef.current;
        const handleToolbarClick = (e: MouseEvent) => {
            e.stopPropagation();
        };

        toolbar.addEventListener('mousedown', handleToolbarClick);

        return () => {
            toolbar.removeEventListener('mousedown', handleToolbarClick);
        };
    }, [showFormattingToolbar]);

    return (
        <div className="drag-wireframe">
            {/* Drag Mode Toggle */}
            <div className="drag-mode-controls">
                <button
                    className={`drag-toggle-btn ${isDragEnabled ? 'enabled' : 'disabled'}`}
                    onClick={toggleDragMode}
                    title={isDragEnabled ? "Click to disable drag mode" : "Click to enable drag mode"}
                >
                    {isDragEnabled ? (
                        <>
                            🔒 <span>Drag Mode: ON</span>
                        </>
                    ) : (
                        <>
                            🔓 <span>Drag Mode: OFF</span>
                        </>
                    )}
                </button>
            </div>

            {/* Main wireframe container */}
            <div
                ref={containerRef}
                className={`dragula-container ${isDragEnabled ? 'drag-enabled' : 'drag-disabled'} ${isTransitioning ? 'mode-transitioning' : ''}`}
            >
                {/* Formatting Toolbar */}
                {showFormattingToolbar && (
                    <div
                        ref={formattingToolbarRef}
                        className="formatting-toolbar"
                        style={{
                            top: toolbarPosition.top,
                            left: toolbarPosition.left
                        }}
                    >
                        <button
                            className="format-btn format-bold"
                            title="Bold"
                            onClick={() => executeFormatCommand('bold')}
                            onMouseEnter={(e) => (e.target as HTMLButtonElement).classList.add('hover')}
                            onMouseLeave={(e) => (e.target as HTMLButtonElement).classList.remove('hover')}
                        >
                            B
                        </button>
                        <button
                            className="format-btn format-italic"
                            title="Italic"
                            onClick={() => executeFormatCommand('italic')}
                            onMouseEnter={(e) => (e.target as HTMLButtonElement).classList.add('hover')}
                            onMouseLeave={(e) => (e.target as HTMLButtonElement).classList.remove('hover')}
                        >
                            I
                        </button>
                        <button
                            className="format-btn format-underline"
                            title="Underline"
                            onClick={() => executeFormatCommand('underline')}
                            onMouseEnter={(e) => (e.target as HTMLButtonElement).classList.add('hover')}
                            onMouseLeave={(e) => (e.target as HTMLButtonElement).classList.remove('hover')}
                        >
                            U
                        </button>
                        <div className="format-divider"></div>
                        <button
                            className="format-btn format-clear"
                            title="Remove Formatting"
                            onClick={() => executeFormatCommand('removeFormat')}
                            onMouseEnter={(e) => (e.target as HTMLButtonElement).classList.add('hover')}
                            onMouseLeave={(e) => (e.target as HTMLButtonElement).classList.remove('hover')}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* Cross-container info bar removed per user request */}
        </div>
    );
});

export default DragWireframe;
