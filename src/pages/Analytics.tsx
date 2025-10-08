import React, { useState, useEffect } from 'react';
import { analyticsService, AnalyticsData } from '../services/analyticsService';
import { FiUsers, FiFileText, FiActivity, FiTrendingUp, FiDownload, FiRefreshCw } from 'react-icons/fi';
import './Analytics.css';

const Analytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'custom'>('all');

    const loadAnalytics = () => {
        setLoading(true);
        try {
            let data: AnalyticsData;

            if (dateRange === '7days') {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                data = analyticsService.getAnalyticsForDateRange(startDate, endDate);
            } else if (dateRange === '30days') {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                data = analyticsService.getAnalyticsForDateRange(startDate, endDate);
            } else {
                data = analyticsService.getAnalytics();
            }

            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [dateRange]);

    const handleExport = () => {
        const data = analyticsService.exportAnalytics();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `designetica-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="analytics-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="analytics-container">
                <div className="analytics-error">
                    <p>Unable to load analytics data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <div className="analytics-title-section">
                    <h1 className="analytics-title">Analytics Dashboard</h1>
                    <p className="analytics-subtitle">Track usage and performance metrics</p>
                </div>
                <div className="analytics-actions">
                    <button className="analytics-btn-secondary" onClick={loadAnalytics}>
                        <FiRefreshCw />
                        <span>Refresh</span>
                    </button>
                    <button className="analytics-btn-primary" onClick={handleExport}>
                        <FiDownload />
                        <span>Export Data</span>
                    </button>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="analytics-filters">
                <div className="filter-group">
                    <label>Time Period:</label>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${dateRange === 'all' ? 'active' : ''}`}
                            onClick={() => setDateRange('all')}
                        >
                            All Time
                        </button>
                        <button
                            className={`filter-btn ${dateRange === '7days' ? 'active' : ''}`}
                            onClick={() => setDateRange('7days')}
                        >
                            Last 7 Days
                        </button>
                        <button
                            className={`filter-btn ${dateRange === '30days' ? 'active' : ''}`}
                            onClick={() => setDateRange('30days')}
                        >
                            Last 30 Days
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="analytics-metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon users">
                        <FiUsers />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Unique Users</div>
                        <div className="metric-value">{analytics.uniqueUsers}</div>
                        <div className="metric-description">Total users tracked</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon wireframes">
                        <FiFileText />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Wireframes Created</div>
                        <div className="metric-value">{analytics.totalWireframes}</div>
                        <div className="metric-description">Total wireframes generated</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon sessions">
                        <FiActivity />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Sessions</div>
                        <div className="metric-value">{analytics.totalSessions}</div>
                        <div className="metric-description">Total user sessions</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon average">
                        <FiTrendingUp />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Avg per User</div>
                        <div className="metric-value">{analytics.averageWireframesPerUser.toFixed(1)}</div>
                        <div className="metric-description">Wireframes per user</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="analytics-charts">
                {/* Wireframes Over Time */}
                {analytics.wireframesByDate.length > 0 && (
                    <div className="chart-card">
                        <h3 className="chart-title">Wireframes Created Over Time</h3>
                        <div className="chart-content">
                            <div className="bar-chart">
                                {analytics.wireframesByDate.map((item, index) => {
                                    const maxCount = Math.max(...analytics.wireframesByDate.map(d => d.count));
                                    const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                                    return (
                                        <div key={index} className="bar-item">
                                            <div className="bar-wrapper">
                                                <div
                                                    className="bar"
                                                    style={{ height: `${height}%` }}
                                                    title={`${item.date}: ${item.count} wireframes`}
                                                >
                                                    <span className="bar-value">{item.count}</span>
                                                </div>
                                            </div>
                                            <div className="bar-label">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Popular Features */}
                {analytics.popularFeatures.length > 0 && (
                    <div className="chart-card">
                        <h3 className="chart-title">Most Used Features</h3>
                        <div className="chart-content">
                            <div className="feature-list">
                                {analytics.popularFeatures.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <div className="feature-info">
                                            <span className="feature-rank">#{index + 1}</span>
                                            <span className="feature-name">{feature.feature}</span>
                                        </div>
                                        <div className="feature-stats">
                                            <div className="feature-bar-container">
                                                <div
                                                    className="feature-bar"
                                                    style={{ width: `${feature.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="feature-count">{feature.count} uses</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* User Activity Table */}
            {analytics.userActivity.length > 0 && (
                <div className="analytics-table-section">
                    <h3 className="section-title">User Activity</h3>
                    <div className="table-container">
                        <table className="analytics-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>First Visit</th>
                                    <th>Last Visit</th>
                                    <th>Wireframes</th>
                                    <th>Sessions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.userActivity
                                    .sort((a, b) => b.wireframesCreated - a.wireframesCreated)
                                    .slice(0, 20)
                                    .map((user, index) => (
                                        <tr key={index}>
                                            <td className="user-id-cell">{user.userId.substring(0, 20)}...</td>
                                            <td>{new Date(user.firstVisit).toLocaleDateString()}</td>
                                            <td>{new Date(user.lastVisit).toLocaleDateString()}</td>
                                            <td className="number-cell">{user.wireframesCreated}</td>
                                            <td className="number-cell">{user.sessionsCount}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="analytics-footer">
                <p className="analytics-note">
                    Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
                </p>
                <p className="analytics-note">
                    Data is stored locally in your browser and never sent to external servers.
                </p>
            </div>
        </div>
    );
};

export default Analytics;
