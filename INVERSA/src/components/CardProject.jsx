import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiUser, FiUsers, FiClock } from 'react-icons/fi';
import BadgeGenre from './BadgeGenre';
import BadgeCategories from './BadgeCategories';
import { findUserById } from '../utils/userManager';
import { incrementLikes, decrementLikes } from '../utils/dataManager';

const CardProject = ({ project, showCollabStatus = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(project.likes || 0);

    // Check localStorage for guest likes
    useEffect(() => {
        const guestLikes = JSON.parse(localStorage.getItem('guestLikes') || '[]');
        setIsLiked(guestLikes.includes(project.id));
    }, [project.id]);

    const handleLike = async (e) => {
        e.preventDefault(); // Prevent navigation when clicking like button

        const guestLikes = JSON.parse(localStorage.getItem('guestLikes') || '[]');

        if (isLiked) {
            // Unlike
            const newLikes = guestLikes.filter(id => id !== project.id);
            localStorage.setItem('guestLikes', JSON.stringify(newLikes));
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
            await decrementLikes(project.id);
        } else {
            // Like
            guestLikes.push(project.id);
            localStorage.setItem('guestLikes', JSON.stringify(guestLikes));
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            await incrementLikes(project.id);
        }
    };

    const author = findUserById(project.initiatorId) || { name: 'Unknown' };
    const collaboratorCount = project.collaborators?.filter(c => c.status === 'approved').length || 0;
    const pendingCount = project.collaborators?.filter(c => c.status === 'pending').length || 0;

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Check if project has background image
    const hasBackground = project.backgroundImage && project.backgroundImage.trim() !== '';

    return (
        <Link to={`/project/${project.id}`}>
            <div
                className={`card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${hasBackground ? 'p-0' : 'p-6'
                    }`}
            >
                {hasBackground ? (
                    <>
                        {/* Background Image with Overlay */}
                        <div
                            className="relative h-48 bg-cover bg-center"
                            style={{ backgroundImage: `url(${project.backgroundImage})` }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                            {/* Content Over Background */}
                            <div className="relative h-full p-6 flex flex-col justify-between">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-2 flex-wrap">
                                        {project.category && (
                                            <BadgeCategories categoryId={project.category} size="sm" />
                                        )}
                                        {project.genre && (
                                            <BadgeGenre genreId={project.genre} size="sm" />
                                        )}
                                    </div>
                                    <button
                                        onClick={handleLike}
                                        className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors flex-shrink-0"
                                        aria-label={isLiked ? 'Unlike' : 'Like'}
                                    >
                                        <FiHeart
                                            className={`w-5 h-5 transition-colors ${isLiked
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-white'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-200 text-sm line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="p-4 bg-white dark:bg-dark-surface">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center">
                                        <FiUser className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-light-secondary dark:text-dark-secondary font-medium">
                                        {author.name}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-3 text-light-secondary dark:text-dark-secondary">
                                    <div className="flex items-center space-x-1">
                                        <FiHeart className="w-4 h-4" />
                                        <span>{likeCount}</span>
                                    </div>
                                    {collaboratorCount > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <FiUsers className="w-4 h-4" />
                                            <span>{collaboratorCount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Collaboration Status (for Dashboard view) */}
                            {showCollabStatus && (
                                <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-1 text-light-secondary dark:text-dark-secondary">
                                            <FiClock className="w-3 h-3" />
                                            <span>Updated {formatDate(project.updatedAt)}</span>
                                        </div>
                                        {pendingCount > 0 && (
                                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                                                {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {project.status === 'open' && (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                                Open
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Original Card Design (No Background) */}
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-2 flex-wrap">
                                {project.category && (
                                    <BadgeCategories categoryId={project.category} size="sm" />
                                )}
                                {project.genre && (
                                    <BadgeGenre genreId={project.genre} size="sm" />
                                )}
                            </div>
                            <button
                                onClick={handleLike}
                                className="p-2 rounded-full hover:bg-light-surface dark:hover:bg-dark-surface transition-colors flex-shrink-0"
                                aria-label={isLiked ? 'Unlike' : 'Like'}
                            >
                                <FiHeart
                                    className={`w-5 h-5 transition-colors ${isLiked
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-light-secondary dark:text-dark-secondary'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-2 group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors">
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-light-secondary dark:text-dark-secondary text-sm mb-4 line-clamp-2">
                            {project.description}
                        </p>

                        {/* Author & Stats */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center">
                                    <FiUser className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-light-secondary dark:text-dark-secondary font-medium">
                                    {author.name}
                                </span>
                            </div>

                            <div className="flex items-center space-x-3 text-light-secondary dark:text-dark-secondary">
                                <div className="flex items-center space-x-1">
                                    <FiHeart className="w-4 h-4" />
                                    <span>{likeCount}</span>
                                </div>
                                {collaboratorCount > 0 && (
                                    <div className="flex items-center space-x-1">
                                        <FiUsers className="w-4 h-4" />
                                        <span>{collaboratorCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Collaboration Status (for Dashboard view) */}
                        {showCollabStatus && (
                            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-1 text-light-secondary dark:text-dark-secondary">
                                        <FiClock className="w-3 h-3" />
                                        <span>Updated {formatDate(project.updatedAt)}</span>
                                    </div>
                                    {pendingCount > 0 && (
                                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                                            {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {project.status === 'open' && (
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                            Open
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Link>
    );
};

export default CardProject;
