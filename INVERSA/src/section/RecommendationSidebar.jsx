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
        <div className="space-y-8 sm:space-y-10">

            {/* Trending */}
            <div>
                <div className="flex items-center gap-2 mb-5 sm:mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">
                        <FiTrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-lg text-light-primary dark:text-dark-primary">
                        Trending
                    </h3>
                </div>

                <div className="space-y-3">
                    {trending.length > 0 ? (
                        trending.map((project) => (
                            <CardProjectMini key={project.id} project={project} />
                        ))
                    ) : (
                        <p className="text-sm text-light-secondary dark:text-dark-secondary">
                            No trending projects yet.
                        </p>
                    )}
                </div>
            </div>

            {/* Most Liked */}
            <div>
                <div className="flex items-center gap-2 mb-5 sm:mb-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <FiHeart className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-lg text-light-primary dark:text-dark-primary">
                        Most Liked
                    </h3>
                </div>

                <div className="space-y-3">
                    {mostLiked.length > 0 ? (
                        mostLiked.map((project) => (
                            <CardProjectMini key={project.id} project={project} />
                        ))
                    ) : (
                        <p className="text-sm text-light-secondary dark:text-dark-secondary">
                            No liked projects yet.
                        </p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default RecommendationSidebar;