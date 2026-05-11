import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiUser, FiUsers, FiEye } from 'react-icons/fi';
import BadgeGenre from './BadgeGenre';
import BadgeCategories from './BadgeCategories';
import { findUserById } from '../utils/userManager/index';
import { incrementLikes, decrementLikes } from '../utils/dataManager/index';
import { getTeamById } from '../utils/dataManager/teamManager';

const CardProject = ({ project, showCollabStatus = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(project.likes || 0);
    const [teamName, setTeamName] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (project.isTeamProject && project.teamId) {
            loadTeamName();
        }
    }, [project.id, project.teamId]);

    const loadTeamName = async () => {
        try {
            setLoading(true);
            const team = await getTeamById(project.teamId);
            setTeamName(team?.title);
        } catch (error) {
            console.error('Error loading team name:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const guestLikes = JSON.parse(localStorage.getItem('guestLikes') || '[]');
        setIsLiked(guestLikes.includes(project.id));
    }, [project.id]);

    const handleLike = async (e) => {
        e.preventDefault();
        const guestLikes = JSON.parse(localStorage.getItem('guestLikes') || '[]');

        if (isLiked) {
            const newLikes = guestLikes.filter(id => id !== project.id);
            localStorage.setItem('guestLikes', JSON.stringify(newLikes));
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
            await decrementLikes(project.id);
        } else {
            guestLikes.push(project.id);
            localStorage.setItem('guestLikes', JSON.stringify(guestLikes));
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            await incrementLikes(project.id);
        }
    };

    const author = findUserById(project.initiatorId) || { name: 'Unknown' };
    const displayName = project.isTeamProject ? teamName : author.name;
    const displayIcon = project.isTeamProject ? FiUsers : FiUser;
    const DisplayIcon = displayIcon;

    const hasImage = project.backgroundImage && project.backgroundImage.trim() !== '';

    return (
        <Link to={`/project/${project.id}`} className="block group">
            <div className="flex flex-col sm:flex-row bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
                
                {/* === GAMBAR (kiri, full height di desktop) === */}
                <div className="relative sm:w-2/5 sm:min-h-[200px] h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {hasImage ? (
                        <img
                            src={project.backgroundImage}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-5xl font-black text-white/30">
                                {project.title?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    {/* Tombol like di atas gambar, pojok kanan */}
                    <button
                        onClick={handleLike}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors z-10 border border-white/30"
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                    >
                        <FiHeart
                            className={`w-5 h-5 drop-shadow ${
                                isLiked
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-white'
                            }`}
                        />
                    </button>
                </div>

                {/* === KONTEN TEKS (kanan) === */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    {/* Badge category & genre di atas judul */}
                    <div className="flex items-center gap-2 mb-3">
                        {project.category && (
                            <BadgeCategories categoryId={project.category} size="sm" />
                        )}
                        {project.genre && (
                            <BadgeGenre genreId={project.genre} size="sm" />
                        )}
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                            {project.description}
                        </p>
                    </div>

                    {/* Footer: author/team + stats */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                                <DisplayIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                {displayName || (loading ? '...' : 'Unknown')}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <FiEye className="w-4 h-4" />
                                <span>{project.views || 0}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FiHeart className="w-4 h-4" />
                                <span>{likeCount}</span>
                            </span>
                            {project.collaborators?.filter(c => c.status === 'approved').length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <FiUsers className="w-4 h-4" />
                                    <span>{project.collaborators.filter(c => c.status === 'approved').length}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Status kolaborasi (opsional, dari props) */}
                    {showCollabStatus && project.collaborators?.some(c => c.status === 'pending') && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                                {project.collaborators.filter(c => c.status === 'pending').length} pending request
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CardProject;