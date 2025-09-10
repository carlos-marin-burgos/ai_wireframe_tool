import React from 'react';
import './MicrosoftLearnFooter.css';

interface MicrosoftLearnFooterProps {
    className?: string;
}

interface FooterColumn {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
}

const FOOTER_COLUMNS: FooterColumn[] = [
    {
        title: 'Explore',
        links: [
            { label: 'Azure', href: 'https://learn.microsoft.com/azure' },
            { label: 'Dynamics 365', href: 'https://learn.microsoft.com/dynamics365' },
            { label: 'Microsoft 365', href: 'https://learn.microsoft.com/microsoft-365' },
            { label: 'Microsoft Industry', href: 'https://learn.microsoft.com/industry' },
            { label: 'Microsoft Teams', href: 'https://learn.microsoft.com/microsoftteams' },
            { label: 'Windows', href: 'https://learn.microsoft.com/windows' }
        ]
    },
    {
        title: 'Microsoft Learn',
        links: [
            { label: 'Training', href: 'https://learn.microsoft.com/training' },
            { label: 'Certifications', href: 'https://learn.microsoft.com/certifications' },
            { label: 'Documentation', href: 'https://learn.microsoft.com/docs' },
            { label: 'Shows', href: 'https://learn.microsoft.com/shows' },
            { label: 'Q&A', href: 'https://learn.microsoft.com/answers' },
            { label: 'Code Samples', href: 'https://learn.microsoft.com/samples' }
        ]
    },
    {
        title: 'Community',
        links: [
            { label: 'Blog', href: 'https://techcommunity.microsoft.com/t5/microsoft-learn-blog/bg-p/MicrosoftLearnBlog' },
            { label: 'Contribute', href: 'https://learn.microsoft.com/contribute' },
            { label: 'Events', href: 'https://learn.microsoft.com/events' },
            { label: 'Student Hub', href: 'https://learn.microsoft.com/training/student-hub' },
            { label: 'Educator Center', href: 'https://learn.microsoft.com/training/educator-center' },
            { label: 'Microsoft Reactor', href: 'https://developer.microsoft.com/en-us/reactor/' }
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'Contact Us', href: 'https://learn.microsoft.com/support/contact' },
            { label: 'Help & Support', href: 'https://learn.microsoft.com/support' },
            { label: 'Microsoft Tech Community', href: 'https://techcommunity.microsoft.com/' },
            { label: 'Microsoft Developer Community', href: 'https://developer.microsoft.com/community' },
            { label: 'Azure Community Support', href: 'https://azure.microsoft.com/support/community/' },
            { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/microsoft' }
        ]
    }
];

const FOOTER_UTILITIES = [
    { label: 'Previous Versions', href: 'https://learn.microsoft.com/previous-versions' },
    { label: 'Blog', href: 'https://techcommunity.microsoft.com/t5/microsoft-learn-blog/bg-p/MicrosoftLearnBlog' },
    { label: 'Contribute', href: 'https://learn.microsoft.com/contribute' },
    { label: 'Privacy', href: 'https://go.microsoft.com/fwlink/?LinkId=521839' },
    { label: 'Terms of Use', href: 'https://go.microsoft.com/fwlink/?LinkID=206977' },
    { label: 'Trademarks', href: 'https://www.microsoft.com/legal/intellectualproperty/Trademarks/' },
    { label: 'Your Privacy Choices', href: 'https://aka.ms/yourcaliforniaprivacychoices' }
];

const MicrosoftLearnFooter: React.FC<MicrosoftLearnFooterProps> = ({ className = '' }) => {
    return (
        <footer className={`ms-learn-footer ${className}`}>
            {/* Main Footer Content */}
            <div className="ms-learn-footer-main">
                <div className="ms-learn-footer-container">
                    {/* Footer Columns */}
                    <div className="ms-learn-footer-columns">
                        {FOOTER_COLUMNS.map((column) => (
                            <div key={column.title} className="ms-learn-footer-column">
                                <h3 className="ms-learn-footer-title">{column.title}</h3>
                                <ul className="ms-learn-footer-links">
                                    {column.links.map((link) => (
                                        <li key={link.label} className="ms-learn-footer-link-item">
                                            <a
                                                href={link.href}
                                                className="ms-learn-footer-link"
                                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Additional Resources */}
                    <div className="ms-learn-footer-resources">
                        <h3 className="ms-learn-footer-title">Additional Resources</h3>
                        <div className="ms-learn-footer-resource-cards">
                            <div className="ms-learn-footer-card">
                                <h4>Microsoft AI & Machine Learning</h4>
                                <p>Explore AI solutions and machine learning capabilities with Azure AI services.</p>
                                <a href="/ai" className="ms-learn-footer-card-link">Learn more →</a>
                            </div>
                            <div className="ms-learn-footer-card">
                                <h4>Cloud Development</h4>
                                <p>Build and deploy modern cloud applications with Azure and .NET.</p>
                                <a href="/azure/developer" className="ms-learn-footer-card-link">Get started →</a>
                            </div>
                            <div className="ms-learn-footer-card">
                                <h4>Power Platform</h4>
                                <p>Create business solutions with low-code/no-code development.</p>
                                <a href="/power-platform" className="ms-learn-footer-card-link">Explore →</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="ms-learn-footer-bottom">
                <div className="ms-learn-footer-container">
                    <div className="ms-learn-footer-bottom-content">
                        {/* Language Selector */}
                        <div className="ms-learn-footer-language">
                            <button className="ms-learn-language-selector">
                                🌐 English (United States)
                            </button>
                        </div>

                        {/* Utility Links */}
                        <div className="ms-learn-footer-utilities">
                            {FOOTER_UTILITIES.map((link, index) => (
                                <React.Fragment key={link.label}>
                                    <a
                                        href={link.href}
                                        className="ms-learn-footer-utility-link"
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    >
                                        {link.label}
                                    </a>
                                    {index < FOOTER_UTILITIES.length - 1 && (
                                        <span className="ms-learn-footer-separator">•</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="ms-learn-footer-copyright">
                            <span>© Microsoft 2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default MicrosoftLearnFooter;
