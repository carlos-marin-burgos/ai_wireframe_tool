import React from 'react';
import './MicrosoftLearnHero.css';

interface MicrosoftLearnHeroProps {
    title?: string;
    subtitle?: string;
    description?: string;
    primaryAction?: {
        label: string;
        href: string;
    };
    secondaryAction?: {
        label: string;
        href: string;
    };
    backgroundImage?: string;
    className?: string;
}

const MicrosoftLearnHero: React.FC<MicrosoftLearnHeroProps> = ({
    title = "Microsoft Learn. Spark possibility.",
    subtitle = "Build skills that open doors. See all you can do with documentation, hands-on training, and certifications to help you get the most from Microsoft products.",
    description,
    primaryAction = { label: "Get started", href: "/training" },
    secondaryAction = { label: "View documentation", href: "/docs" },
    backgroundImage,
    className = ''
}) => {
    return (
        <section
            className={`ms-learn-hero ${className}`}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            <div className="ms-learn-hero-container">
                <div className="ms-learn-hero-content">
                    <div className="ms-learn-hero-text">
                        <h1 className="ms-learn-hero-title">{title}</h1>
                        <p className="ms-learn-hero-subtitle">{subtitle}</p>
                        {description && (
                            <p className="ms-learn-hero-description">{description}</p>
                        )}

                        <div className="ms-learn-hero-actions">
                            <a href={primaryAction.href} className="ms-learn-hero-btn ms-learn-hero-btn-primary">
                                {primaryAction.label}
                            </a>
                            {secondaryAction && (
                                <a href={secondaryAction.href} className="ms-learn-hero-btn ms-learn-hero-btn-secondary">
                                    {secondaryAction.label}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="ms-learn-hero-visual">
                        <div className="ms-learn-hero-illustration">
                            {/* Microsoft Learn Visual Elements */}
                            <div className="ms-learn-visual-grid">
                                <div className="ms-learn-visual-card ms-learn-visual-azure">
                                    <div className="ms-learn-visual-icon">☁️</div>
                                    <span>Azure</span>
                                </div>
                                <div className="ms-learn-visual-card ms-learn-visual-microsoft365">
                                    <div className="ms-learn-visual-icon">📊</div>
                                    <span>Microsoft 365</span>
                                </div>
                                <div className="ms-learn-visual-card ms-learn-visual-power">
                                    <div className="ms-learn-visual-icon">⚡</div>
                                    <span>Power Platform</span>
                                </div>
                                <div className="ms-learn-visual-card ms-learn-visual-dev">
                                    <div className="ms-learn-visual-icon">💻</div>
                                    <span>Developer Tools</span>
                                </div>
                                <div className="ms-learn-visual-card ms-learn-visual-ai">
                                    <div className="ms-learn-visual-icon">🤖</div>
                                    <span>AI & Machine Learning</span>
                                </div>
                                <div className="ms-learn-visual-card ms-learn-visual-security">
                                    <div className="ms-learn-visual-icon">🔒</div>
                                    <span>Security</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Stats */}
                <div className="ms-learn-hero-stats">
                    <div className="ms-learn-hero-stat">
                        <div className="ms-learn-hero-stat-number">15%</div>
                        <div className="ms-learn-hero-stat-text">
                            On average, certified employees earn 15 percent more than those without certification.
                        </div>
                    </div>
                    <div className="ms-learn-hero-stat">
                        <div className="ms-learn-hero-stat-number">61%</div>
                        <div className="ms-learn-hero-stat-text">
                            Upon earning a certification, 61 percent of tech professionals say they earned a promotion.
                        </div>
                    </div>
                    <div className="ms-learn-hero-stat">
                        <div className="ms-learn-hero-stat-number">90%</div>
                        <div className="ms-learn-hero-stat-text">
                            Microsoft-certified developers are 90 percent more productive and nearly 60 percent more efficient.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MicrosoftLearnHero;
