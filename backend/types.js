/**
 * @typedef {Object} WireframeRequest
 * @property {string} description - The wireframe description
 * @property {string} [theme] - Design theme (always 'microsoftlearn')
 * @property {string} [colorScheme] - Color scheme ('primary', 'blue', etc.)
 * @property {string} [style] - Style variant ('default', etc.)
 * @property {string} [complexity] - Complexity level ('simple', 'medium', 'detailed')
 */

/**
 * @typedef {Object} WireframeResponse
 * @property {string} html - The generated HTML wireframe
 * @property {boolean} [fallback] - Whether this is a fallback response
 * @property {string} [error] - Error message if applicable
 * @property {string} [errorMessage] - Detailed error message
 * @property {boolean} [cached] - Whether response came from cache
 * @property {string} correlationId - Request correlation ID
 * @property {number} [processingTimeMs] - Processing time in milliseconds
 */

/**
 * Type definitions and validation for wireframe generation
 */

/**
 * Validates wireframe parameters and ensures Microsoft Learn theme
 * @param {string} description - Wireframe description
 * @param {string} [theme] - Design theme
 * @param {string} [colorScheme] - Color scheme
 * @returns {{isValid: boolean, errors: string[], description: string, theme: string, colorScheme: string}}
 */
function validateWireframeParams(description, theme = 'microsoftlearn', colorScheme = 'primary') {
  const errors = [];
  const warnings = [];
  
  // Check for critical errors
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }

  // Always enforce Microsoft Learn theme (warning, not error)
  const validatedTheme = 'microsoftlearn';
  
  if (theme && theme !== 'microsoftlearn') {
    warnings.push(`Theme '${theme}' is not supported. Using Microsoft Learn theme.`);
  }
  
  // Validate color scheme (warning, not error)
  const validColorSchemes = ['primary', 'blue', 'green', 'purple', 'red'];
  const validatedColorScheme = validColorSchemes.includes(colorScheme) ? colorScheme : 'primary';
  
  if (!validColorSchemes.includes(colorScheme)) {
    warnings.push(`Color scheme '${colorScheme}' is not valid. Using 'primary'.`);
  }

  return {
    isValid: errors.length === 0, // Only fail on critical errors
    errors,
    warnings,
    description: description || '',
    theme: validatedTheme,
    colorScheme: validatedColorScheme
  };
}

/**
 * Validates and sanitizes wireframe input for safe processing
 * @param {string} description - Wireframe description
 * @returns {string} - Sanitized description
 */
function sanitizeDescription(description) {
  if (!description || typeof description !== 'string') {
    return '';
  }
  
  return description
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500);   // Limit length
}

module.exports = {
  validateWireframeParams,
  sanitizeDescription
};
