import React from 'react';
import MicrosoftLearnTopNav from './MicrosoftLearnTopNav';
import MicrosoftLearnHero from './MicrosoftLearnHero';
import MicrosoftLearnFooter from './MicrosoftLearnFooter';
import './MicrosoftLearnLayout.css';

interface MicrosoftLearnLayoutProps {
    children?: React.ReactNode;
    heroProps?: {
        title?: string;
        subtitle?: string;
        description?: string;
        primaryAction?: { label: string; href: string };
        secondaryAction?: { label: string; href: string };
    };
    showHero?: boolean;
    className?: string;
}

const MicrosoftLearnLayout: React.FC<MicrosoftLearnLayoutProps> = ({
    children,
    heroProps,
    showHero = true,
    className = ''
}) => {
    return (
        <div className={`ms-learn-layout ${className}`}>
            {/* Top Navigation */}
            <MicrosoftLearnTopNav />

            {/* Hero Section (optional) */}
            {showHero && (
                <MicrosoftLearnHero {...heroProps} />
            )}

            {/* Main Content */}
            <main className="ms-learn-main-content">
                {children || (
                    <div className="ms-learn-placeholder-content">
                        <div className="ms-learn-content-container">
                            <section className="ms-learn-content-section">
                                <h2>Learn by doing</h2>
                                <p>
                                    Gain the skills you can apply to everyday situations through hands-on training
                                    personalized to your needs, at your own pace or with our global network of
                                    learning partners.
                                </p>
                                <a href="/training" className="ms-learn-content-link">Take training →</a>
                            </section>

                            <section className="ms-learn-content-section">
                                <h2>Find technical documentation</h2>
                                <p>
                                    Get tools and step-by-step guidance to help you get the most from Microsoft
                                    products such as Azure, Windows, Office, Dynamics, Power Apps, Teams, and more.
                                </p>
                                <a href="/docs" className="ms-learn-content-link">View documentation →</a>
                            </section>

                            <section className="ms-learn-content-section">
                                <h2>Showcase your skills</h2>
                                <p>
                                    Advance in your career by completing challenges that demonstrate your expertise.
                                    Earn globally recognized and industry-endorsed certifications, and showcase
                                    them to your network.
                                </p>
                                <a href="/certifications" className="ms-learn-content-link">Get certified →</a>
                            </section>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <MicrosoftLearnFooter />
        </div>
    );
};

export default MicrosoftLearnLayout;
