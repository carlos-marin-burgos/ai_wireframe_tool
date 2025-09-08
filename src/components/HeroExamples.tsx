import React from 'react';
import HeroControl from './HeroControl';

// Example usage of the HeroControl component
const HeroExamples: React.FC = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <h2>Hero Control Component Examples</h2>
      
      {/* Default Hero with Search */}
      <div>
        <h3>1. Default Hero with Search</h3>
        <HeroControl />
      </div>

      {/* Custom Hero with Buttons */}
      <div>
        <h3>2. Custom Hero with Buttons</h3>
        <HeroControl
          title="Build your next app with Azure"
          summary="Deploy and scale your applications with confidence using Microsoft Azure cloud services."
          showSearch={false}
          showSecondaryButton={true}
          ctaText="Get Started"
          secondaryCtaText="Learn More"
          backgroundColor="#f3f2f1"
        />
      </div>

      {/* Hero without Image */}
      <div>
        <h3>3. Hero without Image</h3>
        <HeroControl
          title="Welcome to Microsoft Learn"
          summary="Master new skills and advance your career with our comprehensive learning paths."
          showImage={false}
          ctaText="Browse Courses"
          backgroundColor="#e1dfdd"
        />
      </div>

      {/* Hero with Custom Image */}
      <div>
        <h3>4. Hero with Custom Image</h3>
        <HeroControl
          title="Accelerate innovation with AI"
          summary="Transform your business with artificial intelligence and machine learning solutions."
          imageUrl="https://via.placeholder.com/600x400/4a90e2/ffffff?text=AI+Innovation"
          searchPlaceholder="Search AI solutions..."
          ctaText="Explore AI"
          backgroundColor="#ddeaf7"
        />
      </div>
    </div>
  );
};

export default HeroExamples;
