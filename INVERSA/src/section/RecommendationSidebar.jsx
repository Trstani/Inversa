import React from "react";
import { FiTrendingUp, FiHeart } from "react-icons/fi";
import CardProjectMini from "../components/CardProjectMini";

const RecommendationSidebar = ({ projects = [] }) => {
    const safeProjects = Array.isArray(projects) ? projects : [];

    const trending = [...safeProjects]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 3);

    const mostLiked = [...safeProjects]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 3);

    return (
        <div className="space-y-10">

            {/* Trending */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <FiTrendingUp className="text-orange-500" />
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        Trending
                    </h3>
                </div>

                <div className="space-y-4">
                    {trending.length > 0 ? (
                        trending.map((project) => (
                            <CardProjectMini key={project.id} project={project} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Belum ada project trending.
                        </p>
                    )}
                </div>
            </div>

            {/* Most Liked */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <FiHeart className="text-pink-500" />
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        Most Liked
                    </h3>
                </div>

                <div className="space-y-4">
                    {mostLiked.length > 0 ? (
                        mostLiked.map((project) => (
                            <CardProjectMini key={project.id} project={project} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Belum ada project populer.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default RecommendationSidebar;