/**
 * AI Context Manager - Manages conversation history and design continuity
 * Provides intelligent context for enhanced AI wireframe generation
 */

class AIContextManager {
  constructor() {
    this.userSessions = new Map(); // sessionId -> userContext
    this.designPatterns = new Map(); // pattern -> usage statistics
    this.globalInsights = {
      popularPatterns: [],
      successfulCombinations: [],
      userPreferences: {},
      performanceData: {}
    };
    
    this.maxSessionHistory = 10; // Keep last 10 interactions per session
    this.maxGlobalSessions = 100; // Keep max 100 user sessions
  }

  /**
   * Initialize or get user session context
   */
  initializeSession(sessionId, userAgent = null, preferences = {}) {
    if (!this.userSessions.has(sessionId)) {
      this.userSessions.set(sessionId, {
        id: sessionId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        designHistory: [],
        preferences: {
          designStyle: preferences.designStyle || "modern",
          colorPreference: preferences.colorPreference || "primary",
          complexityLevel: preferences.complexityLevel || "moderate",
          deviceFocus: preferences.deviceFocus || "responsive",
          ...preferences
        },
        userAgent,
        insights: {
          mostUsedPatterns: [],
          successfulGeneration: [],
          iterationPatterns: [],
          designEvolution: []
        }
      });
    } else {
      // Update last activity
      this.userSessions.get(sessionId).lastActivity = Date.now();
    }

    return this.userSessions.get(sessionId);
  }

  /**
   * Add design interaction to session context
   */
  addDesignInteraction(sessionId, interaction) {
    const session = this.userSessions.get(sessionId);
    if (!session) return;

    const designRecord = {
      timestamp: Date.now(),
      description: interaction.description,
      generationMethod: interaction.generationMethod,
      success: interaction.success,
      userFeedback: interaction.userFeedback || null,
      designPatterns: interaction.detectedPatterns || [],
      qualityMetrics: interaction.qualityMetrics || {},
      responseTime: interaction.responseTime || 0,
      enhancementsApplied: interaction.enhancementsApplied || []
    };

    session.designHistory.push(designRecord);

    // Keep only recent history
    if (session.designHistory.length > this.maxSessionHistory) {
      session.designHistory.shift();
    }

    // Update session insights
    this.updateSessionInsights(sessionId, designRecord);

    // Update global insights
    this.updateGlobalInsights(designRecord);
  }

  /**
   * Get contextual information for next generation
   */
  getGenerationContext(sessionId, currentDescription) {
    const session = this.userSessions.get(sessionId);
    if (!session) return null;

    const recentHistory = session.designHistory.slice(-3); // Last 3 interactions
    const successfulPatterns = this.getSuccessfulPatterns(session);
    const userPreferences = this.inferCurrentPreferences(session);
    const relatedPastWork = this.findRelatedWork(session, currentDescription);

    return {
      sessionId,
      userPreferences,
      recentHistory,
      successfulPatterns,
      relatedPastWork,
      designEvolution: this.analyzeDesignEvolution(session),
      contextualSuggestions: this.generateContextualSuggestions(session, currentDescription),
      qualityBenchmarks: this.getQualityBenchmarks(session)
    };
  }

  /**
   * Update session-specific insights
   */
  updateSessionInsights(sessionId, designRecord) {
    const session = this.userSessions.get(sessionId);
    if (!session) return;

    // Track most used patterns
    designRecord.designPatterns.forEach(pattern => {
      const existing = session.insights.mostUsedPatterns.find(p => p.pattern === pattern);
      if (existing) {
        existing.count++;
        existing.lastUsed = Date.now();
      } else {
        session.insights.mostUsedPatterns.push({
          pattern,
          count: 1,
          firstUsed: Date.now(),
          lastUsed: Date.now()
        });
      }
    });

    // Track successful generations
    if (designRecord.success && designRecord.qualityMetrics) {
      session.insights.successfulGeneration.push({
        description: designRecord.description,
        patterns: designRecord.designPatterns,
        metrics: designRecord.qualityMetrics,
        timestamp: Date.now()
      });
    }

    // Sort most used patterns
    session.insights.mostUsedPatterns.sort((a, b) => b.count - a.count);
  }

  /**
   * Update global insights from all users
   */
  updateGlobalInsights(designRecord) {
    // Track popular patterns globally
    designRecord.designPatterns.forEach(pattern => {
      if (this.designPatterns.has(pattern)) {
        const stats = this.designPatterns.get(pattern);
        stats.totalUsage++;
        stats.lastUsed = Date.now();
        stats.successRate = designRecord.success ? 
          ((stats.successRate * (stats.totalUsage - 1)) + 1) / stats.totalUsage :
          stats.successRate * (stats.totalUsage - 1) / stats.totalUsage;
      } else {
        this.designPatterns.set(pattern, {
          pattern,
          totalUsage: 1,
          successRate: designRecord.success ? 1.0 : 0.0,
          firstSeen: Date.now(),
          lastUsed: Date.now(),
          avgQuality: designRecord.qualityMetrics?.overall || 0.8
        });
      }
    });

    // Update global popular patterns
    this.globalInsights.popularPatterns = Array.from(this.designPatterns.values())
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, 20);
  }

  /**
   * Get successful patterns from user session
   */
  getSuccessfulPatterns(session) {
    return session.insights.successfulGeneration
      .filter(gen => gen.metrics.overall > 0.8) // High quality threshold
      .slice(-5) // Last 5 successful patterns
      .map(gen => ({
        patterns: gen.patterns,
        context: gen.description,
        quality: gen.metrics.overall
      }));
  }

  /**
   * Infer current user preferences from history
   */
  inferCurrentPreferences(session) {
    const preferences = { ...session.preferences };
    
    // Analyze recent successful patterns
    const recentSuccessful = session.designHistory
      .filter(h => h.success && h.qualityMetrics?.overall > 0.7)
      .slice(-5);

    if (recentSuccessful.length > 0) {
      // Infer preferred complexity
      const avgComplexity = recentSuccessful
        .map(h => h.qualityMetrics?.complexityScore || 0.5)
        .reduce((a, b) => a + b, 0) / recentSuccessful.length;
      
      preferences.inferredComplexity = avgComplexity > 0.7 ? "high" : avgComplexity > 0.4 ? "moderate" : "simple";
      
      // Infer preferred patterns
      const allPatterns = recentSuccessful.flatMap(h => h.designPatterns);
      const patternCounts = {};
      allPatterns.forEach(p => {
        patternCounts[p] = (patternCounts[p] || 0) + 1;
      });
      
      preferences.preferredPatterns = Object.entries(patternCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([pattern]) => pattern);
    }

    return preferences;
  }

  /**
   * Find related previous work
   */
  findRelatedWork(session, currentDescription) {
    const currentWords = currentDescription.toLowerCase().split(/\s+/);
    
    return session.designHistory
      .filter(h => {
        const historyWords = h.description.toLowerCase().split(/\s+/);
        const commonWords = currentWords.filter(word => 
          historyWords.includes(word) && word.length > 3
        );
        return commonWords.length >= 2; // At least 2 common words
      })
      .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
      .slice(0, 3) // Top 3 related works
      .map(h => ({
        description: h.description,
        patterns: h.designPatterns,
        success: h.success,
        similarity: this.calculateSimilarity(currentDescription, h.description)
      }));
  }

  /**
   * Calculate similarity between descriptions
   */
  calculateSimilarity(desc1, desc2) {
    const words1 = desc1.toLowerCase().split(/\s+/);
    const words2 = desc2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  /**
   * Analyze design evolution patterns
   */
  analyzeDesignEvolution(session) {
    if (session.designHistory.length < 2) {
      return { trend: "new-user", direction: "exploring" };
    }

    const recent = session.designHistory.slice(-5);
    const complexityTrend = this.analyzeTrend(recent.map(h => h.qualityMetrics?.complexityScore || 0.5));
    const successTrend = this.analyzeTrend(recent.map(h => h.success ? 1 : 0));

    return {
      trend: complexityTrend > 0 ? "increasing-complexity" : "simplifying",
      direction: successTrend > 0 ? "improving" : "exploring",
      totalIterations: session.designHistory.length,
      avgQuality: recent.reduce((sum, h) => sum + (h.qualityMetrics?.overall || 0.5), 0) / recent.length,
      patternsEvolution: this.trackPatternEvolution(session)
    };
  }

  /**
   * Analyze trend in array of values
   */
  analyzeTrend(values) {
    if (values.length < 2) return 0;
    
    let increases = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i-1]) increases++;
    }
    
    return (increases / (values.length - 1)) - 0.5; // -0.5 to 0.5 range
  }

  /**
   * Track how user's pattern preferences evolve
   */
  trackPatternEvolution(session) {
    const timeSlices = this.groupHistoryByTime(session.designHistory, 3); // 3 time periods
    
    return timeSlices.map((slice, index) => ({
      period: index + 1,
      topPatterns: this.getTopPatterns(slice, 3),
      avgQuality: slice.reduce((sum, h) => sum + (h.qualityMetrics?.overall || 0.5), 0) / slice.length,
      successRate: slice.filter(h => h.success).length / slice.length
    }));
  }

  /**
   * Group history into time-based slices
   */
  groupHistoryByTime(history, slices) {
    if (history.length === 0) return [];
    
    const sliceSize = Math.ceil(history.length / slices);
    const groups = [];
    
    for (let i = 0; i < slices; i++) {
      const start = i * sliceSize;
      const end = Math.min(start + sliceSize, history.length);
      if (start < history.length) {
        groups.push(history.slice(start, end));
      }
    }
    
    return groups;
  }

  /**
   * Get top patterns from a slice of history
   */
  getTopPatterns(historySlice, count) {
    const patternCounts = {};
    
    historySlice.forEach(h => {
      h.designPatterns.forEach(pattern => {
        patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
      });
    });
    
    return Object.entries(patternCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([pattern, count]) => ({ pattern, count }));
  }

  /**
   * Generate contextual suggestions based on session
   */
  generateContextualSuggestions(session, currentDescription) {
    const suggestions = [];
    const preferences = this.inferCurrentPreferences(session);
    const evolution = this.analyzeDesignEvolution(session);

    // Based on user evolution
    if (evolution.trend === "increasing-complexity" && evolution.direction === "improving") {
      suggestions.push({
        type: "enhancement",
        suggestion: "Consider adding advanced interactions like drag-and-drop or real-time updates",
        confidence: 0.8
      });
    }

    // Based on successful patterns
    if (preferences.preferredPatterns?.length > 0) {
      suggestions.push({
        type: "pattern",
        suggestion: `Consider incorporating ${preferences.preferredPatterns[0]} pattern, which worked well in your previous designs`,
        confidence: 0.9
      });
    }

    // Based on global trends
    const popularGlobalPattern = this.globalInsights.popularPatterns[0];
    if (popularGlobalPattern && !preferences.preferredPatterns?.includes(popularGlobalPattern.pattern)) {
      suggestions.push({
        type: "trending",
        suggestion: `${popularGlobalPattern.pattern} is trending with high success rates (${Math.round(popularGlobalPattern.successRate * 100)}%)`,
        confidence: 0.7
      });
    }

    return suggestions;
  }

  /**
   * Get quality benchmarks based on user's history
   */
  getQualityBenchmarks(session) {
    const successful = session.designHistory
      .filter(h => h.success && h.qualityMetrics)
      .slice(-10); // Last 10 successful designs

    if (successful.length === 0) {
      return {
        targetAccessibility: 0.8,
        targetPerformance: 0.8,
        targetModernity: 0.8,
        targetResponsive: 0.9
      };
    }

    const metrics = successful.map(h => h.qualityMetrics);
    
    return {
      targetAccessibility: Math.max(0.8, this.average(metrics.map(m => m.accessibilityScore || 0.8))),
      targetPerformance: Math.max(0.8, this.average(metrics.map(m => m.performanceScore || 0.8))),
      targetModernity: Math.max(0.8, this.average(metrics.map(m => m.modernityScore || 0.8))),
      targetResponsive: Math.max(0.9, this.average(metrics.map(m => m.responsiveScore || 0.9)))
    };
  }

  /**
   * Calculate average of array
   */
  average(array) {
    return array.length > 0 ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }

  /**
   * Clean up old sessions
   */
  cleanup() {
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000); // 1 week

    // Remove sessions older than 1 week
    for (const [sessionId, session] of this.userSessions) {
      if (session.lastActivity < oneWeekAgo) {
        this.userSessions.delete(sessionId);
      }
    }

    // Keep only the most recent sessions if we exceed the limit
    if (this.userSessions.size > this.maxGlobalSessions) {
      const sessions = Array.from(this.userSessions.entries())
        .sort(([,a], [,b]) => b.lastActivity - a.lastActivity)
        .slice(0, this.maxGlobalSessions);
      
      this.userSessions.clear();
      sessions.forEach(([id, session]) => {
        this.userSessions.set(id, session);
      });
    }
  }

  /**
   * Get analytics and insights
   */
  getAnalytics() {
    return {
      totalSessions: this.userSessions.size,
      globalInsights: this.globalInsights,
      popularPatterns: this.globalInsights.popularPatterns.slice(0, 10),
      avgSessionLength: this.average(Array.from(this.userSessions.values()).map(s => s.designHistory.length)),
      totalDesigns: Array.from(this.userSessions.values()).reduce((sum, s) => sum + s.designHistory.length, 0)
    };
  }
}

module.exports = { AIContextManager };
