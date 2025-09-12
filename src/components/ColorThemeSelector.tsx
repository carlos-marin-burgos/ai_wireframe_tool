import React, { useState, useEffect, useRef } from 'react';
import { COLOR_THEMES, applyColorTheme, getCurrentTheme } from '../utils/colorThemeManager';
import './ColorThemeSelector.css';

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    medium: string;
}

interface ColorTheme {
    name: string;
    description: string;
    colors: ThemeColors;
}

const ColorThemeSelector: React.FC = () => {
    // Color theme selector is hidden - Microsoft Blue theme is applied automatically
    // Component returns null to hide the theme selector UI
    return null;
};

export default ColorThemeSelector;