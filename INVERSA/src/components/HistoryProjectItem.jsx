import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";

const HistoryProjectItem = ({ project }) => {

  if (!project) return null;

  const hasImage =
    project.backgroundImage &&
    project.backgroundImage.trim() !== "";

  return (
    <Link
      to={`/project/${project.id}`}
      className="group block"
    >
      <div
        className="
        flex items-center gap-3
        rounded-2xl
        border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-950
        p-3
        transition-all duration-200
        hover:border-indigo-400/30
        hover:bg-slate-50 dark:hover:bg-slate-900
        "
      >
        <div
          className="
          h-14 w-14 shrink-0
          overflow-hidden rounded-xl
          bg-slate-100 dark:bg-slate-900
          "
        >
          {hasImage ? (
            <img
              src={project.backgroundImage}
              alt={project.title}
              className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-105
              "
            />
          ) : (
            <div
              className="
              flex h-full w-full items-center justify-center
              bg-slate-900
              "
            >
              <span className="text-lg font-bold text-white/10">
                {project.title?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">

          <h4
            className="
            truncate
            text-sm font-medium
            text-slate-800 dark:text-slate-100
            transition-colors
            group-hover:text-indigo-500
            "
          >
            {project.title}
          </h4>

          <p
            className="
            mt-1 truncate
            text-xs
            text-slate-500 dark:text-slate-400
            "
          >
            Continue reading...
          </p>

          <div
            className="
            mt-2 flex items-center gap-1
            text-xs text-slate-400
            "
          >
            <FiClock className="h-3 w-3" />
            Recent activity
          </div>

        </div>
      </div>
    </Link>
  );
};

export default HistoryProjectItem;