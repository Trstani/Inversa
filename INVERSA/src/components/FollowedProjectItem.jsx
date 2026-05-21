import React from "react";

import { Link }
from "react-router-dom";

import {
  FiStar,
  FiUsers,
} from "react-icons/fi";

const FollowedProjectItem = ({
  project
}) => {

  if (!project)
    return null;

  const hasImage =
    project.background_image &&
    project.background_image.trim() !== "";

  return (

    <Link
      to={`/project/${project.id}`}
      className="group block"
    >

      <div
        className="
          flex items-center gap-3
          rounded-2xl
          border border-slate-200
          dark:border-slate-800
          bg-white dark:bg-slate-950
          p-3
          transition-all duration-200
          hover:border-yellow-400/30
          hover:bg-slate-50
          dark:hover:bg-slate-900
        "
      >

        {/* COVER */}

        <div
          className="
            h-14 w-14 shrink-0
            overflow-hidden rounded-xl
            bg-slate-100
            dark:bg-slate-900
          "
        >

          {hasImage ? (

            <img
              src={
                project.background_image
              }
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
                flex h-full w-full
                items-center justify-center
                bg-slate-900
              "
            >

              <span
                className="
                  text-lg font-bold
                  text-white/10
                "
              >
                {project.title
                  ?.charAt(0)}
              </span>

            </div>

          )}

        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <h4
            className="
              truncate
              text-sm font-medium
              text-slate-800
              dark:text-slate-100
              transition-colors
              group-hover:text-yellow-500
            "
          >

            {project.title}

          </h4>

          <p
            className="
              mt-1 truncate
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >

            Followed project

          </p>

          <div
            className="
              mt-2
              flex items-center gap-3
              text-xs text-slate-400
            "
          >

            <div className="flex items-center gap-1">

              <FiStar className="h-3 w-3" />

              Following

            </div>

            <div className="flex items-center gap-1">

              <FiUsers className="h-3 w-3" />

              {project.likes || 0}

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
};

export default FollowedProjectItem;