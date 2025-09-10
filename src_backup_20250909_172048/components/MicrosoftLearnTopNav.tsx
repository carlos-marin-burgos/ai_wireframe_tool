import React, { useState } from 'react';
import { FiChevronDown, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import './MicrosoftLearnTopNav.css';

interface MicrosoftLearnTopNavProps {
    className?: string;
}

interface NavItem {
    label: string;
    href?: string;
    children?: NavItem[];
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
    {
        label: 'Documentation',
        href: '/docs',
        children: [
            { label: 'Azure', href: '/azure' },
            { label: 'Microsoft 365', href: '/microsoft-365' },
            { label: 'Power Platform', href: '/power-platform' },
            { label: 'Visual Studio', href: '/visual-studio' },
            { label: 'Windows', href: '/windows' },
            { label: 'All products', href: '/docs' }
        ]
    },
    {
        label: 'Training',
        href: '/training',
        children: [
            { label: 'Browse all training', href: '/training' },
            { label: 'Learning paths', href: '/training/paths' },
            { label: 'Modules', href: '/training/modules' },
            { label: 'Instructor-led training', href: '/training/instructor-led' }
        ]
    },
    {
        label: 'Certifications',
        href: '/certifications',
        children: [
            { label: 'Browse all certifications', href: '/certifications' },
            { label: 'Certification exams', href: '/certifications/exams' },
            { label: 'Azure certifications', href: '/certifications/azure' },
            { label: 'Microsoft 365 certifications', href: '/certifications/microsoft-365' },
            { label: 'Power Platform certifications', href: '/certifications/power-platform' }
        ]
    },
    {
        label: 'Q&A',
        href: '/answers'
    },
    {
        label: 'Code Samples',
        href: '/samples'
    },
    {
        label: 'Assessments',
        href: '/assessments'
    },
    {
        label: 'Shows',
        href: '/shows'
    }
];

const MicrosoftLearnTopNav: React.FC<MicrosoftLearnTopNavProps> = ({ className = '' }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDropdownToggle = (label: string) => {
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActiveDropdown(null);
    };

    return (
        <header className={`ms-learn-topnav ${className}`}>
            {/* Microsoft Ignite Banner */}
            <div className="ms-learn-banner">
                <div className="ms-learn-banner-content">
                    <div className="ms-learn-banner-info">
                        <strong>Microsoft Ignite</strong>
                        <span className="ms-learn-banner-date">November 17–21, 2025</span>
                    </div>
                    <div className="ms-learn-banner-actions">
                        <a href="#" className="ms-learn-banner-link">Register now</a>
                        <button className="ms-learn-banner-dismiss" aria-label="Dismiss banner">
                            <FiX size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="ms-learn-nav">
                <div className="ms-learn-nav-container">
                    {/* Logo and Brand */}
                    <div className="ms-learn-brand">
                        <a href="/" className="ms-learn-logo">
                            <img
                                src="/windowsLogo.png"
                                alt="Windows logo consisting of four blue squares arranged in a grid, representing the Microsoft Windows operating system. The logo appears on a plain background and conveys a professional and modern tone."
                            />
                            <span className="ms-learn-wordmark">Microsoft Learn</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="ms-learn-nav-items">
                        {PRIMARY_NAV_ITEMS.map((item) => (
                            <div
                                key={item.label}
                                className={`ms-learn-nav-item ${item.children ? 'has-dropdown' : ''}`}
                                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                                onMouseLeave={() => item.children && setActiveDropdown(null)}
                            >
                                <a
                                    href={item.href}
                                    className="ms-learn-nav-link"
                                    onClick={(e) => {
                                        if (item.children) {
                                            e.preventDefault();
                                            handleDropdownToggle(item.label);
                                        }
                                    }}
                                >
                                    {item.label}
                                    {item.children && <FiChevronDown className="ms-learn-nav-arrow" />}
                                </a>

                                {/* Dropdown Menu */}
                                {item.children && activeDropdown === item.label && (
                                    <div className="ms-learn-dropdown">
                                        <div className="ms-learn-dropdown-content">
                                            {item.children.map((child) => (
                                                <a
                                                    key={child.label}
                                                    href={child.href}
                                                    className="ms-learn-dropdown-link"
                                                >
                                                    {child.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Search and Actions */}
                    <div className="ms-learn-nav-actions">
                        <div className="ms-learn-search">
                            <div className="ms-learn-search-container">
                                <FiSearch className="ms-learn-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ms-learn-search-input"
                                />
                            </div>
                        </div>

                        <button className="ms-learn-profile-btn">
                            <div className="ms-learn-profile-avatar">
                                <span>A</span>
                            </div>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="ms-learn-mobile-toggle"
                            onClick={handleMobileMenuToggle}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="ms-learn-mobile-menu">
                        <div className="ms-learn-mobile-search">
                            <div className="ms-learn-search-container">
                                <FiSearch className="ms-learn-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="ms-learn-search-input"
                                />
                            </div>
                        </div>

                        <div className="ms-learn-mobile-nav">
                            {PRIMARY_NAV_ITEMS.map((item) => (
                                <div key={item.label} className="ms-learn-mobile-nav-item">
                                    <a
                                        href={item.href}
                                        className="ms-learn-mobile-nav-link"
                                        onClick={(e) => {
                                            if (item.children) {
                                                e.preventDefault();
                                                handleDropdownToggle(item.label);
                                            }
                                        }}
                                    >
                                        {item.label}
                                        {item.children && (
                                            <FiChevronDown
                                                className={`ms-learn-mobile-nav-arrow ${activeDropdown === item.label ? 'active' : ''
                                                    }`}
                                            />
                                        )}
                                    </a>

                                    {/* Mobile Dropdown */}
                                    {item.children && activeDropdown === item.label && (
                                        <div className="ms-learn-mobile-dropdown">
                                            {item.children.map((child) => (
                                                <a
                                                    key={child.label}
                                                    href={child.href}
                                                    className="ms-learn-mobile-dropdown-link"
                                                >
                                                    {child.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default MicrosoftLearnTopNav;
