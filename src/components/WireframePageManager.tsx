import { useState, useCallback } from 'react';
import './WireframePageManager.css';

export interface WireframePage {
    id: string;
    title: string;
    htmlContent: string;
    parentPageId?: string;
    clickedElement?: string;
    createdAt: Date;
}

export interface WireframeLink {
    fromPageId: string;
    toPageId: string;
    elementSelector: string;
    elementText: string;
}

export interface ElementInfo {
    selector: string;
    text: string;
    tagName: string;
    type?: string;
}

interface WireframePageManagerProps {
    initialHtml: string;
    onNavigate?: (pageId: string) => void;
    onGenerateNewPage?: (prompt: string, parentPageId: string, clickedElement: string) => Promise<string>;
}

export const useWireframePageManager = ({
    initialHtml,
    onNavigate,
    onGenerateNewPage
}: WireframePageManagerProps) => {
    const [pages, setPages] = useState<WireframePage[]>([
        {
            id: 'initial',
            title: 'Initial Wireframe',
            htmlContent: initialHtml,
            createdAt: new Date()
        }
    ]);

    const [currentPageId, setCurrentPageId] = useState<string>('initial');
    const [links, setLinks] = useState<WireframeLink[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const getCurrentPage = useCallback(() => {
        return pages.find(page => page.id === currentPageId);
    }, [pages, currentPageId]);

    const navigateToPage = useCallback((pageId: string) => {
        setCurrentPageId(pageId);
        onNavigate?.(pageId);
    }, [onNavigate]);

    const generatePagePrompt = useCallback((elementInfo: ElementInfo): string => {
        const basePrompt = `Based on the clicked element "${elementInfo.text}" (${elementInfo.tagName})`;

        if (elementInfo.tagName.toLowerCase() === 'button') {
            if (elementInfo.text.toLowerCase().includes('submit') ||
                elementInfo.text.toLowerCase().includes('send') ||
                elementInfo.type === 'submit') {
                return `${basePrompt}, create a success/confirmation page showing the form was submitted successfully. Include a success message and navigation options.`;
            }
            if (elementInfo.text.toLowerCase().includes('signup') ||
                elementInfo.text.toLowerCase().includes('register')) {
                return `${basePrompt}, create a registration/signup form page with fields for user registration.`;
            }
            if (elementInfo.text.toLowerCase().includes('login') ||
                elementInfo.text.toLowerCase().includes('sign in')) {
                return `${basePrompt}, create a login page with username/email and password fields.`;
            }
            if (elementInfo.text.toLowerCase().includes('learn') ||
                elementInfo.text.toLowerCase().includes('more')) {
                return `${basePrompt}, create an informational page with detailed content and resources.`;
            }
        }

        if (elementInfo.tagName.toLowerCase() === 'a') {
            return `${basePrompt}, create a detailed page for "${elementInfo.text}" with relevant content and navigation.`;
        }

        return `${basePrompt}, create a relevant next page that would logically follow from clicking this element. Consider the context and user flow.`;
    }, []);

    const generatePageTitle = useCallback((elementInfo: ElementInfo): string => {
        if (elementInfo.tagName.toLowerCase() === 'button') {
            if (elementInfo.text.toLowerCase().includes('submit')) return 'Submission Confirmation';
            if (elementInfo.text.toLowerCase().includes('signup')) return 'Sign Up';
            if (elementInfo.text.toLowerCase().includes('login')) return 'Login';
        }

        return elementInfo.text || 'New Page';
    }, []);

    const handleElementClick = useCallback(async (elementInfo: ElementInfo) => {
        const currentPage = getCurrentPage();
        if (!currentPage || !onGenerateNewPage) return;

        // Check if this element already has a link
        const existingLink = links.find(link =>
            link.fromPageId === currentPageId &&
            link.elementSelector === elementInfo.selector
        );

        if (existingLink) {
            // Navigate to existing page
            navigateToPage(existingLink.toPageId);
            return;
        }

        // Generate new page based on clicked element
        setIsGenerating(true);
        try {
            const prompt = generatePagePrompt(elementInfo);
            const newHtml = await onGenerateNewPage(prompt, currentPageId, elementInfo.selector);

            const newPageId = `page_${Date.now()}`;
            const newPage: WireframePage = {
                id: newPageId,
                title: generatePageTitle(elementInfo),
                htmlContent: newHtml,
                parentPageId: currentPageId,
                clickedElement: elementInfo.text,
                createdAt: new Date()
            };

            setPages(prev => [...prev, newPage]);

            const newLink: WireframeLink = {
                fromPageId: currentPageId,
                toPageId: newPageId,
                elementSelector: elementInfo.selector,
                elementText: elementInfo.text
            };

            setLinks(prev => [...prev, newLink]);
            navigateToPage(newPageId);
        } catch (error) {
            console.error('Failed to generate new page:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [currentPageId, links, onGenerateNewPage, getCurrentPage, navigateToPage, generatePagePrompt, generatePageTitle]);

    const navigateBack = useCallback(() => {
        const currentPage = getCurrentPage();
        if (currentPage?.parentPageId) {
            navigateToPage(currentPage.parentPageId);
        }
    }, [getCurrentPage, navigateToPage]);

    const getBreadcrumbs = useCallback(() => {
        const breadcrumbs = [];
        let currentPage = getCurrentPage();

        while (currentPage) {
            breadcrumbs.unshift(currentPage);
            currentPage = currentPage.parentPageId ?
                pages.find(p => p.id === currentPage!.parentPageId) :
                undefined;
        }

        return breadcrumbs;
    }, [pages, getCurrentPage]);

    return {
        currentPage: getCurrentPage(),
        pages,
        links,
        isGenerating,
        handleElementClick,
        navigateToPage,
        navigateBack,
        getBreadcrumbs
    };
};

export default useWireframePageManager;
