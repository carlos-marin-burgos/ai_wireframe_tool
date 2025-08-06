import React, { useState, useEffect } from 'react';
import { githubService, GitHubRepository } from '../services/githubService';
import { FiFolder, FiLock, FiGlobe, FiDownload, FiEye } from 'react-icons/fi';

interface GitHubRepositoryBrowserProps {
    isOpen: boolean;
    onClose: () => void;
    onImportComponents?: (repoId: number, components: any[]) => void;
}

const GitHubRepositoryBrowser: React.FC<GitHubRepositoryBrowserProps> = ({
    isOpen,
    onClose,
    onImportComponents
}) => {
    const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);

    useEffect(() => {
        if (isOpen && githubService.isAuthenticated()) {
            fetchRepositories();
        }
    }, [isOpen]);

    const fetchRepositories = async () => {
        setLoading(true);
        setError(null);

        try {
            const repos = await githubService.fetchRepositories();
            setRepositories(repos);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
        } finally {
            setLoading(false);
        }
    };

    const handleRepositorySelect = (repo: GitHubRepository) => {
        setSelectedRepo(repo);
        console.log('Selected repository:', repo);
    };

    const handleImportComponents = async (repo: GitHubRepository) => {
        try {
            console.log('Importing components from:', repo.name);
            // This would scan the repository for component files
            const components = await githubService.importWireframes(repo.id);

            if (onImportComponents) {
                onImportComponents(repo.id, components);
            }

            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import components');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content github-repo-browser" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📁 Browse GitHub Repositories</h2>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {!githubService.isAuthenticated() ? (
                        <div className="not-connected">
                            <p>Please connect to GitHub first to browse repositories.</p>
                            <button className="btn-primary" onClick={onClose}>
                                Go Back to Connect
                            </button>
                        </div>
                    ) : (
                        <>
                            {loading && (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <p>Fetching your repositories...</p>
                                </div>
                            )}

                            {error && (
                                <div className="error-state">
                                    <p>Error: {error}</p>
                                    <button className="btn-secondary" onClick={fetchRepositories}>
                                        Retry
                                    </button>
                                </div>
                            )}

                            {repositories.length > 0 && (
                                <div className="repositories-grid">
                                    {repositories.map((repo) => (
                                        <div
                                            key={repo.id}
                                            className={`repository-card ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                                            onClick={() => handleRepositorySelect(repo)}
                                        >
                                            <div className="repo-header">
                                                <div className="repo-icon">
                                                    {repo.private ? <FiLock /> : <FiGlobe />}
                                                </div>
                                                <div className="repo-info">
                                                    <h3 className="repo-name">{repo.name}</h3>
                                                    <p className="repo-full-name">{repo.full_name}</p>
                                                </div>
                                            </div>

                                            {repo.description && (
                                                <p className="repo-description">{repo.description}</p>
                                            )}

                                            <div className="repo-actions">
                                                <button
                                                    className="btn-secondary btn-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(repo.html_url, '_blank');
                                                    }}
                                                >
                                                    <FiEye /> View
                                                </button>
                                                <button
                                                    className="btn-primary btn-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleImportComponents(repo);
                                                    }}
                                                >
                                                    <FiDownload /> Import
                                                </button>
                                            </div>

                                            <div className="repo-meta">
                                                <span className="branch-info">
                                                    Default: {repo.default_branch}
                                                </span>
                                                <span className={`visibility ${repo.private ? 'private' : 'public'}`}>
                                                    {repo.private ? 'Private' : 'Public'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {repositories.length === 0 && !loading && !error && (
                                <div className="empty-state">
                                    <FiFolder size={48} />
                                    <h3>No Repositories Found</h3>
                                    <p>You don't have any repositories yet, or they couldn't be loaded.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GitHubRepositoryBrowser;
