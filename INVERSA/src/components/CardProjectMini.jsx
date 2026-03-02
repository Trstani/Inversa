import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiUser } from "react-icons/fi";
import { findUserById } from "../utils/userManager";

const CardProjectMini = ({ project, rank }) => {
  if (!project) return null;

  const author = findUserById(project.initiatorId) || { name: "Unknown" };

  return (
    <Link to={`/project/${project.id}`}>
      <div
        className="relative p-4 rounded-2xl border 
                   border-light-border dark:border-dark-border
                   bg-light-surface dark:bg-dark-surface
                   hover:shadow-md hover:-translate-y-1
                   transition-all duration-300 group"
      >
        {/* Rank Badge */}
        {rank && (
          <div
            className="absolute -top-2 -left-2 w-7 h-7 
                       flex items-center justify-center 
                       rounded-full text-xs font-bold
                       bg-light-accent dark:bg-dark-accent
                       text-white shadow"
          >
            {rank}
          </div>
        )}

        {/* Title */}
        <h4
          className="text-sm font-semibold mb-1 truncate
                     text-light-primary dark:text-dark-primary
                     group-hover:text-light-accent dark:group-hover:text-dark-accent
                     transition-colors"
        >
          {project.title}
        </h4>

        {/* Description */}
        <p
          className="text-xs mb-3 line-clamp-1
                     text-light-secondary dark:text-dark-secondary"
        >
          {project.description}
        </p>

        {/* Creator */}
        <div className="flex items-center gap-2 text-xs mb-2
                        text-light-secondary dark:text-dark-secondary">
          <FiUser className="w-3 h-3" />
          <span className="truncate">{author.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs
                        text-light-secondary dark:text-dark-secondary">
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
    </Link>
  );
};

export default CardProjectMini;