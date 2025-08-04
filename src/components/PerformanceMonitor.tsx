import React, { useState, useEffect } from 'react';

interface PerformanceStats {
    totalRequests: number;
    cacheHits: number;
    aiCalls: number;
    averageResponseTime: number;
    fastModeUsage: number;
    cacheHitRate: number;
    aiUsageRate: number;
    fastModeRate: number;
    cacheStats: {
        size: number;
        maxSize: number;
        ttl: number;
    };
}

interface Recommendation {
    type: string;
    message: string;
    impact: string;
}

interface PerformanceStatsResponse {
    success: boolean;
    performance: PerformanceStats;
    recommendations: Recommendation[];
    timestamp: string;
}

interface PerformanceMonitorProps {
    isVisible: boolean;
    onToggle: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
    isVisible,
    onToggle
}) => {
    const [stats, setStats] = useState<PerformanceStats | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/performance-stats');
            const data: PerformanceStatsResponse = await response.json();

            if (data.success) {
                setStats(data.performance);
                setRecommendations(data.recommendations);
            } else {
                setError('Failed to fetch stats');
            }
        } catch (err) {
            setError('Network error');
            console.error('Failed to fetch performance stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            fetchStats();
        }
    }, [isVisible]);

    if (!isVisible) {
        return null;
    }

    const formatTime = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'positive': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getImpactIcon = (impact: string) => {
        switch (impact) {
            case 'high': return '🔥';
            case 'medium': return '⚠️';
            case 'positive': return '✅';
            default: return 'ℹ️';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm w-full z-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center">
                    ⚡ Performance Monitor
                </h3>
                <button
                    onClick={onToggle}
                    className="text-gray-400 hover:text-gray-600 text-lg"
                >
                    ×
                </button>
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading stats...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                        onClick={fetchStats}
                        className="text-red-700 underline text-sm mt-1"
                    >
                        Retry
                    </button>
                </div>
            )}

            {stats && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 rounded p-2">
                            <div className="font-medium text-gray-600">Total Requests</div>
                            <div className="text-lg font-bold text-blue-600">{stats.totalRequests}</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                            <div className="font-medium text-gray-600">Avg Response</div>
                            <div className="text-lg font-bold text-blue-600">
                                {formatTime(stats.averageResponseTime)}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                            <div className="font-medium text-gray-600">Cache Hit Rate</div>
                            <div className="text-lg font-bold text-green-600">
                                {stats.cacheHitRate.toFixed(1)}%
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                            <div className="font-medium text-gray-600">Fast Mode Rate</div>
                            <div className="text-lg font-bold text-purple-600">
                                {stats.fastModeRate.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <div className="font-medium text-gray-700 mb-2">Recommendations</div>
                        <div className="space-y-2">
                            {recommendations.map((rec, index) => (
                                <div key={index} className="bg-gray-50 rounded p-2">
                                    <div className={`text-sm ${getImpactColor(rec.impact)} flex items-start`}>
                                        <span className="mr-2">{getImpactIcon(rec.impact)}</span>
                                        <span>{rec.message}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <button
                            onClick={fetchStats}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors"
                        >
                            Refresh Stats
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggle = () => setIsVisible(!isVisible);
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    return {
        isVisible,
        toggle,
        show,
        hide
    };
};
