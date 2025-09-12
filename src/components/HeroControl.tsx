import React from 'react';
import './HeroControl.css';

interface HeroControlProps {
  title?: string;
  summary?: string;
  searchPlaceholder?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  showSearch?: boolean;
  showSecondaryButton?: boolean;
  showImage?: boolean;
  imageUrl?: string;
  backgroundColor?: string;
  className?: string;
}

const HeroControl: React.FC<HeroControlProps> = ({
  title = "Create amazing experiences with Microsoft Learn",
  summary = "Discover learning paths and modules designed to help you build skills in cloud computing, development, and more.",
  searchPlaceholder = "Search for topics...",
  ctaText = "Start Learning",
  secondaryCtaText = "Browse",
  showSearch = true,
  showSecondaryButton = false,
  showImage = true,
  imageUrl,
  backgroundColor = "#F8F9FA", // Neutral light gray instead of beige
  className = ""
}) => {
  const heroStyle = backgroundColor !== "#F8F9FA" ? { backgroundColor } : {};
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : {};

  return (
    <div className={`hero-control ${className}`} style={heroStyle}>
      {/* Left Section */}
      <div className="hero-left-section">
        <div className="hero-icon-text">
          <div className="hero-text-section">
            <div className="hero-top-section">
              {/* Title */}
              <h1 className="hero-title">{title}</h1>

              {/* Summary */}
              <p className="hero-summary">{summary}</p>

              {/* Search and CTA */}
              {showSearch ? (
                <div className="hero-search-container">
                  <div className="hero-textfield-container">
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      className="hero-textfield"
                    />
                  </div>
                  <button className="hero-primary-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.6464 17.3536L17.3536 16.6464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5C14 5.46243 11.5376 3 8.5 3ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z"
                        fill="white"
                      />
                    </svg>
                    <span>{ctaText}</span>
                  </button>
                </div>
              ) : (
                <div className="hero-buttons-container">
                  <button className="hero-primary-button">
                    {ctaText}
                  </button>
                  {showSecondaryButton && (
                    <button className="hero-secondary-button">
                      {secondaryCtaText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {showImage && (
        <div className="hero-image-container">
          <div className="hero-image" style={imageStyle} />
          <div className="hero-left-gradient" />
          <div className="hero-right-gradient" />
        </div>
      )}
    </div>
  );
};

export default HeroControl;
