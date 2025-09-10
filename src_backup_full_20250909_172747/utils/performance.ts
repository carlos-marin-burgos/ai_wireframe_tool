/**
 * Simple utility for tracking application performance metrics
 */

// Storage for metrics
interface PerformanceMetric {
  count: number;
  totalTime: number;
  minTime: number;
  maxTime: number;
  lastTime: number;
  avgTime: number;
}

const metrics: Record<string, PerformanceMetric> = {};

/**
 * Records a performance metric for an operation
 * @param name Name of the operation
 * @param time Time taken in milliseconds
 */
export function recordMetric(name: string, time: number) {
  if (!metrics[name]) {
    metrics[name] = {
      count: 0,
      totalTime: 0,
      minTime: time,
      maxTime: time,
      lastTime: time,
      avgTime: time
    };
  }
  
  const metric = metrics[name];
  metric.count++;
  metric.totalTime += time;
  metric.minTime = Math.min(metric.minTime, time);
  metric.maxTime = Math.max(metric.maxTime, time);
  metric.lastTime = time;
  metric.avgTime = metric.totalTime / metric.count;
}

/**
 * Gets a performance metric
 * @param name Name of the metric
 */
export function getMetric(name: string): PerformanceMetric | undefined {
  return metrics[name];
}

/**
 * Gets all performance metrics
 */
export function getAllMetrics(): Record<string, PerformanceMetric> {
  return { ...metrics };
}

/**
 * Resets all performance metrics
 */
export function resetMetrics() {
  Object.keys(metrics).forEach(key => delete metrics[key]);
}

/**
 * Performance tracker for measuring operation times
 */
export class PerformanceTracker {
  private startTime: number;
  private name: string;
  
  /**
   * Creates a new performance tracker
   * @param name Name of the operation to track
   */
  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }
  
  /**
   * Stops the tracker and records the metric
   */
  stop() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    recordMetric(this.name, duration);
    return duration;
  }
}
