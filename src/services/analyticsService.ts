/**
 * Analytics Service
 * Tracks and manages user analytics data
 */

export interface AnalyticsData {
  totalUsers: number;
  uniqueUsers: number;
  totalWireframes: number;
  totalSessions: number;
  averageWireframesPerUser: number;
  lastUpdated: string;
  userActivity: UserActivity[];
  wireframesByDate: WireframesByDate[];
  popularFeatures: FeatureUsage[];
}

export interface UserActivity {
  userId: string;
  firstVisit: string;
  lastVisit: string;
  wireframesCreated: number;
  sessionsCount: number;
}

export interface WireframesByDate {
  date: string;
  count: number;
}

export interface FeatureUsage {
  feature: string;
  count: number;
  percentage: number;
}

export interface AnalyticsEvent {
  type:
    | "wireframe_created"
    | "wireframe_saved"
    | "session_start"
    | "feature_used"
    | "user_action";
  timestamp: string;
  userId: string;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private storageKey = "designetica_analytics";
  private eventsKey = "designetica_analytics_events";
  private userIdKey = "designetica_user_id";

  /**
   * Get or create a unique user ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem(this.userIdKey);
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.userIdKey, userId);
    }
    return userId;
  }

  /**
   * Track an analytics event
   */
  trackEvent(
    type: AnalyticsEvent["type"],
    metadata?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      metadata,
    };

    const events = this.getEvents();
    events.push(event);
    localStorage.setItem(this.eventsKey, JSON.stringify(events));
  }

  /**
   * Get all events
   */
  private getEvents(): AnalyticsEvent[] {
    const eventsJson = localStorage.getItem(this.eventsKey);
    return eventsJson ? JSON.parse(eventsJson) : [];
  }

  /**
   * Track wireframe creation
   */
  trackWireframeCreated(description: string): void {
    this.trackEvent("wireframe_created", { description });
  }

  /**
   * Track wireframe save
   */
  trackWireframeSaved(name: string): void {
    this.trackEvent("wireframe_saved", { name });
  }

  /**
   * Track session start
   */
  trackSessionStart(): void {
    this.trackEvent("session_start");
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName: string, details?: Record<string, any>): void {
    this.trackEvent("feature_used", { feature: featureName, ...details });
  }

  /**
   * Get comprehensive analytics data
   */
  getAnalytics(): AnalyticsData {
    const events = this.getEvents();

    // Calculate unique users
    const uniqueUserIds = new Set(events.map((e) => e.userId));
    const uniqueUsers = uniqueUserIds.size;

    // Calculate total wireframes
    const wireframeEvents = events.filter(
      (e) => e.type === "wireframe_created"
    );
    const totalWireframes = wireframeEvents.length;

    // Calculate sessions
    const sessionEvents = events.filter((e) => e.type === "session_start");
    const totalSessions = sessionEvents.length;

    // Calculate user activity
    const userActivity: Map<string, UserActivity> = new Map();
    events.forEach((event) => {
      if (!userActivity.has(event.userId)) {
        userActivity.set(event.userId, {
          userId: event.userId,
          firstVisit: event.timestamp,
          lastVisit: event.timestamp,
          wireframesCreated: 0,
          sessionsCount: 0,
        });
      }

      const activity = userActivity.get(event.userId)!;
      if (event.timestamp < activity.firstVisit) {
        activity.firstVisit = event.timestamp;
      }
      if (event.timestamp > activity.lastVisit) {
        activity.lastVisit = event.timestamp;
      }
      if (event.type === "wireframe_created") {
        activity.wireframesCreated++;
      }
      if (event.type === "session_start") {
        activity.sessionsCount++;
      }
    });

    // Calculate wireframes by date
    const wireframesByDate: Map<string, number> = new Map();
    wireframeEvents.forEach((event) => {
      const date = new Date(event.timestamp).toLocaleDateString();
      wireframesByDate.set(date, (wireframesByDate.get(date) || 0) + 1);
    });

    const wireframesByDateArray: WireframesByDate[] = Array.from(
      wireframesByDate.entries()
    )
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate popular features
    const featureEvents = events.filter((e) => e.type === "feature_used");
    const featureUsageMap: Map<string, number> = new Map();
    featureEvents.forEach((event) => {
      const feature = event.metadata?.feature || "Unknown";
      featureUsageMap.set(feature, (featureUsageMap.get(feature) || 0) + 1);
    });

    const totalFeatureUsage = featureEvents.length;
    const popularFeatures: FeatureUsage[] = Array.from(
      featureUsageMap.entries()
    )
      .map(([feature, count]) => ({
        feature,
        count,
        percentage:
          totalFeatureUsage > 0 ? (count / totalFeatureUsage) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 features

    return {
      totalUsers: uniqueUsers,
      uniqueUsers,
      totalWireframes,
      totalSessions,
      averageWireframesPerUser:
        uniqueUsers > 0 ? totalWireframes / uniqueUsers : 0,
      lastUpdated: new Date().toISOString(),
      userActivity: Array.from(userActivity.values()),
      wireframesByDate: wireframesByDateArray,
      popularFeatures,
    };
  }

  /**
   * Get analytics for a specific date range
   */
  getAnalyticsForDateRange(startDate: Date, endDate: Date): AnalyticsData {
    const events = this.getEvents().filter((event) => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });

    // Temporarily replace events for calculation
    const originalEvents = localStorage.getItem(this.eventsKey);
    localStorage.setItem(this.eventsKey, JSON.stringify(events));

    const analytics = this.getAnalytics();

    // Restore original events
    if (originalEvents) {
      localStorage.setItem(this.eventsKey, originalEvents);
    }

    return analytics;
  }

  /**
   * Clear all analytics data (for testing or privacy)
   */
  clearAnalytics(): void {
    localStorage.removeItem(this.eventsKey);
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): string {
    const analytics = this.getAnalytics();
    return JSON.stringify(analytics, null, 2);
  }

  /**
   * Get saved wireframes count from localStorage
   */
  getSavedWireframesCount(): number {
    const saved = localStorage.getItem("designetica-saved-wireframes");
    return saved ? JSON.parse(saved).length : 0;
  }

  /**
   * Get recent wireframes count from localStorage
   */
  getRecentWireframesCount(): number {
    const recents = localStorage.getItem("designetica_recents");
    return recents ? JSON.parse(recents).length : 0;
  }
}

export const analyticsService = new AnalyticsService();
