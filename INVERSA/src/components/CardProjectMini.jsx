import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiUser } from "react-icons/fi";
import { findUserById } from '../utils/userManager/index';

const CardProjectMini = ({ project, rank }) => {
  if (!project) return null;

  const author = findUserById(project.initiatorId) || { name: "Unknown" };
  const hasBackground =
    project.backgroundImage && project.backgroundImage.trim() !== "";

  return (
    <Link to={`/project/${project.id}`}>
      <div
        className="relative rounded-2xl overflow-hidden 
                   hover:shadow-lg hover:-translate-y-1
                   transition-all duration-300 group mb-2"
      >
        {hasBackground ? (
          <>
            {/* Background Image */}
            <div
              className="relative h-32 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.backgroundImage})` }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all" />

              {/* Content */}
              <div className="relative z-10 p-4 flex flex-col justify-between h-full text-white">
                
                {/* Top Section */}
                <div>
                  {rank && (
                    <div className="inline-block px-2 py-0.5 mb-2 text-xs font-bold rounded-full bg-white/20 backdrop-blur-sm">
                      #{rank}
                    </div>
                  )}

                  <h4 className="text-sm font-semibold truncate">
                    {project.title}
                  </h4>

                  <p className="text-xs text-gray-200 line-clamp-1 mt-1">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between text-xs mt-3">
                  <div className="flex items-center gap-1 truncate">
                    <FiUser className="w-3 h-3" />
                    <span className="truncate">{author.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FiEye className="w-3 h-3" />
                      {project.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiHeart className="w-3 h-3" />
                      {project.likes || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Fallback kalau tidak ada background
          <div
            className="p-4 rounded-2xl border 
                       border-light-border dark:border-dark-border
                       bg-light-surface dark:bg-dark-surface"
          >
            {rank && (
              <div className="text-xs font-bold mb-1 text-light-accent dark:text-dark-accent">
                #{rank}
              </div>
            )}

            <h4 className="text-sm font-semibold mb-1 text-light-primary dark:text-dark-primary">
              {project.title}
            </h4>

            <p className="text-xs mb-2 line-clamp-1 text-light-secondary dark:text-dark-secondary">
              {project.description}
            </p>

            <div className="flex items-center justify-between text-xs text-light-secondary dark:text-dark-secondary">
              <span className="flex items-center gap-1 truncate">
                <FiUser className="w-3 h-3" />
                {author.name}
              </span>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FiEye className="w-3 h-3" />
                  {project.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FiHeart className="w-3 h-3" />
                  {project.likes || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CardProjectMini;