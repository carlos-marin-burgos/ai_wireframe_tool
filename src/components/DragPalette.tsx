import React, { useState, useRef } from 'react';
import { FiGrid, FiType, FiSquare, FiImage, FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './DragPalette.css';

interface PaletteComponent {
    id: string;
    name: string;
    category: string;
    icon: React.ReactNode;
    htmlCode: string;
    preview: string;
    description: string;
}

interface DragPaletteProps {
    isVisible: boolean;
    onToggle: () => void;
    onDragStart: (component: PaletteComponent) => void;
}

const DragPalette: React.FC<DragPaletteProps> = ({ isVisible, onToggle, onDragStart }) => {
    const [activeCategory, setActiveCategory] = useState('buttons');
    const [isDragging, setIsDragging] = useState(false);
    const dragPreviewRef = useRef<HTMLDivElement>(null);

    const categories = [
        { id: 'buttons', name: 'Buttons', icon: <FiSquare /> },
        { id: 'navigation', name: 'Navigation', icon: <FiMenu /> },
        { id: 'text', name: 'Text', icon: <FiType /> },
        { id: 'layout', name: 'Layout', icon: <FiGrid /> },
        { id: 'media', name: 'Media', icon: <FiImage /> }
    ];

    const components: PaletteComponent[] = [
        // Buttons
        {
            id: 'primary-button',
            name: 'Primary Button',
            category: 'buttons',
            icon: <FiSquare />,
            description: 'Primary action button with Microsoft styling',
            preview: `<button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 500; cursor: pointer;">Primary Action</button>`,
            htmlCode: `<button class="button-primary" style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 500; cursor: pointer; font-family: 'Segoe UI', sans-serif;">Primary Action</button>`
        },
        {
            id: 'secondary-button',
            name: 'Secondary Button',
            category: 'buttons',
            icon: <FiSquare />,
            description: 'Secondary action button',
            preview: `<button style="background: white; color: #323130; border: 1px solid #8a8886; padding: 8px 16px; border-radius: 4px; font-weight: 500; cursor: pointer;">Secondary</button>`,
            htmlCode: `<button class="button-secondary" style="background: white; color: #323130; border: 1px solid #8a8886; padding: 8px 16px; border-radius: 4px; font-weight: 500; cursor: pointer; font-family: 'Segoe UI', sans-serif;">Secondary</button>`
        },
        // Navigation
        {
            id: 'nav-bar',
            name: 'Navigation Bar',
            category: 'navigation',
            icon: <FiMenu />,
            description: 'Horizontal navigation bar',
            preview: `<nav style="display: flex; gap: 24px; padding: 16px; background: #f8f9fa; border-radius: 4px;"><a href="#" style="color: #0078d4; text-decoration: none;">Home</a><a href="#" style="color: #323130; text-decoration: none;">About</a><a href="#" style="color: #323130; text-decoration: none;">Contact</a></nav>`,
            htmlCode: `<nav class="nav-bar" style="display: flex; gap: 24px; padding: 16px 24px; background: #f8f9fa; border-radius: 4px; font-family: 'Segoe UI', sans-serif;"><a href="#" style="color: #0078d4; text-decoration: none; font-weight: 500;">Home</a><a href="#" style="color: #323130; text-decoration: none;">About</a><a href="#" style="color: #323130; text-decoration: none;">Contact</a></nav>`
        },
        // Text
        {
            id: 'heading-h1',
            name: 'Main Heading',
            category: 'text',
            icon: <FiType />,
            description: 'Large heading text',
            preview: `<h1 style="margin: 0; font-size: 32px; font-weight: 600; color: #323130;">Main Heading</h1>`,
            htmlCode: `<h1 style="margin: 0; font-size: 32px; font-weight: 600; color: #323130; font-family: 'Segoe UI', sans-serif;">Main Heading</h1>`
        },
        {
            id: 'paragraph',
            name: 'Paragraph',
            category: 'text',
            icon: <FiType />,
            description: 'Body text paragraph',
            preview: `<p style="margin: 0; line-height: 1.5; color: #605e5c;">This is a paragraph of body text that provides information to users.</p>`,
            htmlCode: `<p style="margin: 0; line-height: 1.5; color: #605e5c; font-family: 'Segoe UI', sans-serif;">This is a paragraph of body text that provides information to users.</p>`
        },
        // Layout
        {
            id: 'card',
            name: 'Card',
            category: 'layout',
            icon: <FiGrid />,
            description: 'Content card container',
            preview: `<div style="padding: 16px; background: white; border: 1px solid #e1dfdd; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Card Title</h3><p style="margin: 0; color: #605e5c; font-size: 14px;">Card content goes here</p></div>`,
            htmlCode: `<div class="card" style="padding: 16px; background: white; border: 1px solid #e1dfdd; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-family: 'Segoe UI', sans-serif;"><h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #323130;">Card Title</h3><p style="margin: 0; color: #605e5c; font-size: 14px; line-height: 1.4;">Card content goes here with some description text that explains the card's purpose.</p></div>`
        }
    ];

    const filteredComponents = components.filter(comp => comp.category === activeCategory);

    const handleDragStart = (e: React.DragEvent, component: PaletteComponent) => {
        setIsDragging(true);
        e.dataTransfer.setData('text/html', component.htmlCode);
        e.dataTransfer.setData('text/plain', component.name);
        e.dataTransfer.effectAllowed = 'copy';

        // Create custom drag image
        const dragImage = document.createElement('div');
        dragImage.innerHTML = component.preview;
        dragImage.style.cssText = `
            position: absolute;
            top: -1000px;
            left: -1000px;
            padding: 8px;
            background: white;
            border: 2px solid #0078d4;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: none;
            transform: scale(0.8);
            opacity: 0.9;
        `;
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 50, 20);

        // Clean up drag image after a short delay
        setTimeout(() => {
            document.body.removeChild(dragImage);
        }, 0);

        onDragStart(component);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    if (!isVisible) {
        return (
            <button
                className="palette-toggle-btn"
                onClick={onToggle}
                title="Open Component Palette"
            >
                <FiGrid />
                <span>Components</span>
            </button>
        );
    }

    return (
        <div className={`drag-palette ${isDragging ? 'dragging' : ''}`}>
            <div className="palette-header">
                <div className="palette-title">
                    <FiGrid />
                    <span>Component Palette</span>
                </div>
                <button
                    className="palette-close-btn"
                    onClick={onToggle}
                    title="Close Palette"
                >
                    <FiX />
                </button>
            </div>

            <div className="palette-categories">
                <div className="category-scroll">
                    <button className="category-scroll-btn left">
                        <FiChevronLeft />
                    </button>
                    <div className="categories-container">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category.id)}
                                title={category.name}
                            >
                                {category.icon}
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                    <button className="category-scroll-btn right">
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            <div className="palette-components">
                {filteredComponents.map(component => (
                    <div
                        key={component.id}
                        className="component-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                        onDragEnd={handleDragEnd}
                        title={component.description}
                    >
                        <div className="component-preview" dangerouslySetInnerHTML={{ __html: component.preview }} />
                        <div className="component-info">
                            <div className="component-name">{component.name}</div>
                            <div className="component-description">{component.description}</div>
                        </div>
                        <div className="drag-handle">
                            <FiGrid />
                        </div>
                    </div>
                ))}
            </div>

            <div className="palette-footer">
                <div className="drag-instructions">
                    💡 Drag components to your wireframe
                </div>
            </div>
        </div>
    );
};

export default DragPalette;
