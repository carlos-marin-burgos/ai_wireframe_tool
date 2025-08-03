import React from 'react';
import MicrosoftNavbar from './MicrosoftNavbar';
import './WireframeWithNavbar.css';

interface WireframeWithNavbarProps {
    children: React.ReactNode;
    showNavbar?: boolean;
    navbarProps?: {
        showSearch?: boolean;
        showProfile?: boolean;
        className?: string;
    };
}

const WireframeWithNavbar: React.FC<WireframeWithNavbarProps> = ({
    children,
    showNavbar = true,
    navbarProps = {}
}) => {
    return (
        <div className="wireframe-with-navbar">
            {showNavbar && <MicrosoftNavbar {...navbarProps} />}
            <div className="wireframe-content">
                {children}
            </div>
        </div>
    );
};

export default WireframeWithNavbar;
