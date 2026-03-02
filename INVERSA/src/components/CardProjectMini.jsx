import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye } from "react-icons/fi";

const CardProjectMini = ({ project, rank }) => {
  if (!project) return null;

  return (
    <Link to={`/project/${project.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-xl 
                      bg-light-surface dark:bg-dark-surface
                      hover:bg-light-border dark:hover:bg-dark-border
                      transition-all duration-200 group">

        {/* Rank Number */}
        <div className="w-8 h-8 flex items-center justify-center 
                        rounded-lg bg-light-accent dark:bg-dark-accent 
                        text-white font-bold text-sm flex-shrink-0">
          {rank}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate 
                         text-light-primary dark:text-dark-primary 
                         group-hover:text-light-accent dark:group-hover:text-dark-accent">
            {project.title}
          </h4>

          <div className="flex items-center gap-3 text-xs 
                          text-light-secondary dark:text-dark-secondary mt-1">

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
    </Link>
  );
};

export default CardProjectMini;