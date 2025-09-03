/**
 * Image preprocessing utilities for enhanced UI analysis
 * Provides quality enhancement and multi-pass analysis capabilities
 */

let sharp;
try {
  sharp = require("sharp");
} catch (error) {
  console.warn(
    "⚠️ Sharp library not available - image enhancement disabled:",
    error.message
  );
  sharp = null;
}

/**
 * Enhanced image preprocessing for better UI component detection
 */
class ImagePreprocessor {
  constructor() {
    this.preprocessingCache = new Map();
    this.maxCacheSize = 50;
    this.isAvailable = !!sharp;

    if (!this.isAvailable) {
      console.log(
        "📸 Image preprocessing unavailable - Sharp library not found"
      );
    }
  }

  /**
   * Enhance image quality for better AI analysis
   * @param {string} imageDataUrl - Base64 data URL of the image
   * @returns {Promise<{enhanced: string, metadata: object}>}
   */
  async enhanceImageQuality(imageDataUrl) {
    if (!this.isAvailable) {
      console.log("⚠️ Image enhancement skipped - Sharp library unavailable");
      return {
        enhanced: imageDataUrl,
        metadata: { error: "Sharp library unavailable", fallback: true },
      };
    }

    try {
      console.log("🔧 Starting image quality enhancement...");

      // Extract image data from data URL
      const base64Data = imageDataUrl.split(",")[1];
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      console.log("📊 Original image metadata:", {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        density: metadata.density,
      });

      let processedBuffer = imageBuffer;

      // Enhancement pipeline
      processedBuffer = await this.upscaleIfNeeded(processedBuffer, metadata);
      processedBuffer = await this.enhanceContrast(processedBuffer);
      processedBuffer = await this.sharpenImage(processedBuffer);
      processedBuffer = await this.normalizeColors(processedBuffer);
      processedBuffer = await this.optimizeForOCR(processedBuffer);

      // Convert back to data URL
      const enhancedBase64 = processedBuffer.toString("base64");
      const enhancedDataUrl = `data:image/png;base64,${enhancedBase64}`;

      const finalMetadata = await sharp(processedBuffer).metadata();

      console.log("✅ Image enhancement completed:", {
        originalSize: imageBuffer.length,
        enhancedSize: processedBuffer.length,
        finalDimensions: `${finalMetadata.width}x${finalMetadata.height}`,
        improvement: this.calculateImprovementScore(metadata, finalMetadata),
      });

      return {
        enhanced: enhancedDataUrl,
        metadata: {
          original: metadata,
          enhanced: finalMetadata,
          processingSteps: [
            "upscaling",
            "contrast_enhancement",
            "sharpening",
            "color_normalization",
            "ocr_optimization",
          ],
        },
      };
    } catch (error) {
      console.error("❌ Image enhancement failed:", error);
      // Return original image if enhancement fails
      return {
        enhanced: imageDataUrl,
        metadata: { error: error.message, fallback: true },
      };
    }
  }

  /**
   * Upscale image if it's too small for good analysis
   */
  async upscaleIfNeeded(imageBuffer, metadata) {
    const minWidth = 800;
    const minHeight = 600;

    if (metadata.width < minWidth || metadata.height < minHeight) {
      console.log("🔍 Upscaling small image for better analysis...");

      const scale = Math.max(
        minWidth / metadata.width,
        minHeight / metadata.height,
        1.5 // Minimum 1.5x scale for quality
      );

      return await sharp(imageBuffer)
        .resize({
          width: Math.round(metadata.width * scale),
          height: Math.round(metadata.height * scale),
          kernel: sharp.kernel.lanczos3,
          fit: "fill",
        })
        .png({ quality: 100, compressionLevel: 0 })
        .toBuffer();
    }

    return imageBuffer;
  }

  /**
   * Enhance contrast for better component detection
   */
  async enhanceContrast(imageBuffer) {
    return await sharp(imageBuffer)
      .modulate({
        brightness: 1.1, // Slight brightness boost
        saturation: 0.9, // Slight desaturation for better text reading
        hue: 0,
      })
      .linear(1.2, -(128 * 0.2)) // Increase contrast
      .toBuffer();
  }

  /**
   * Sharpen image for better edge detection
   */
  async sharpenImage(imageBuffer) {
    return await sharp(imageBuffer)
      .sharpen({
        sigma: 1.0,
        flat: 1.0,
        jagged: 2.0,
      })
      .toBuffer();
  }

  /**
   * Normalize colors for consistent analysis
   */
  async normalizeColors(imageBuffer) {
    return await sharp(imageBuffer)
      .normalize() // Stretch contrast to use full dynamic range
      .toBuffer();
  }

  /**
   * Optimize image specifically for OCR and text detection
   */
  async optimizeForOCR(imageBuffer) {
    return await sharp(imageBuffer)
      .gamma(1.2) // Slight gamma correction for better text clarity
      .png({ quality: 100, compressionLevel: 0 })
      .toBuffer();
  }

  /**
   * Calculate improvement score based on metadata
   */
  calculateImprovementScore(original, enhanced) {
    const resolutionImprovement =
      (enhanced.width * enhanced.height) / (original.width * original.height);
    const densityImprovement = enhanced.density
      ? enhanced.density / (original.density || 72)
      : 1;

    return {
      resolutionGain: `${((resolutionImprovement - 1) * 100).toFixed(1)}%`,
      densityGain: `${((densityImprovement - 1) * 100).toFixed(1)}%`,
      overallScore: Math.min(resolutionImprovement * densityImprovement, 3.0),
    };
  }

  /**
   * Create multiple processed versions for multi-pass analysis
   */
  async createAnalysisVariants(imageDataUrl) {
    if (!this.isAvailable) {
      console.log(
        "⚠️ Analysis variants creation skipped - Sharp library unavailable"
      );
      return { original: imageDataUrl };
    }

    console.log(
      "🎯 Creating multiple image variants for comprehensive analysis..."
    );

    const base64Data = imageDataUrl.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    const variants = {};

    try {
      // Variant 1: High contrast for component boundaries
      variants.highContrast = await this.createHighContrastVariant(imageBuffer);

      // Variant 2: Optimized for text detection
      variants.textOptimized = await this.createTextOptimizedVariant(
        imageBuffer
      );

      // Variant 3: Color-enhanced for design tokens
      variants.colorEnhanced = await this.createColorEnhancedVariant(
        imageBuffer
      );

      // Variant 4: Layout-focused (simplified)
      variants.layoutFocused = await this.createLayoutFocusedVariant(
        imageBuffer
      );

      console.log("✅ Created analysis variants:", Object.keys(variants));

      return variants;
    } catch (error) {
      console.error("❌ Failed to create analysis variants:", error);
      return { original: imageDataUrl };
    }
  }

  async createHighContrastVariant(imageBuffer) {
    const processed = await sharp(imageBuffer)
      .modulate({ brightness: 1.0, saturation: 0.3 }) // Desaturate
      .linear(2.0, -(128 * 1.0)) // High contrast
      .sharpen({ sigma: 2.0 })
      .png({ quality: 100 })
      .toBuffer();

    return `data:image/png;base64,${processed.toString("base64")}`;
  }

  async createTextOptimizedVariant(imageBuffer) {
    const processed = await sharp(imageBuffer)
      .greyscale() // Convert to grayscale for better text detection
      .normalize()
      .sharpen({ sigma: 1.5 })
      .threshold(128) // Binary threshold for clear text
      .png({ quality: 100 })
      .toBuffer();

    return `data:image/png;base64,${processed.toString("base64")}`;
  }

  async createColorEnhancedVariant(imageBuffer) {
    const processed = await sharp(imageBuffer)
      .modulate({ brightness: 1.0, saturation: 1.3 }) // Enhance colors
      .png({ quality: 100 })
      .toBuffer();

    return `data:image/png;base64,${processed.toString("base64")}`;
  }

  async createLayoutFocusedVariant(imageBuffer) {
    const processed = await sharp(imageBuffer)
      .blur(1) // Slight blur to focus on layout structure
      .modulate({ brightness: 1.1, saturation: 0.7 })
      .png({ quality: 100 })
      .toBuffer();

    return `data:image/png;base64,${processed.toString("base64")}`;
  }

  /**
   * Clear preprocessing cache
   */
  clearCache() {
    this.preprocessingCache.clear();
    console.log("🧹 Image preprocessing cache cleared");
  }
}

module.exports = ImagePreprocessor;
