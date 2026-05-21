import React from "react";

import { Link }
  from "react-router-dom";

import {
  FiEye,
  FiHeart,
  FiArrowUpRight,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const CardProjectMini = ({
  project,
  rank,
}) => {

  if (!project) return null;

  /*
  =========================
  AUTHOR
  =========================
  */

  const displayName =
    project.is_team_project
      ? project.team_name
      : project.initiator_name;

  const DisplayIcon =
    project.is_team_project
      ? FiUsers
      : FiUser;

  /*
  =========================
  BACKGROUND IMAGE
  =========================
  */

  const hasBackground =
    project.background_image &&
    project.background_image.trim() !== "";

  return (

    <Link to={`/project/${project.id}`} className="block group h-full">

      <div className="relative overflow-hidden rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-dark-accent/10 hover:border-light-accent/50 dark:hover:border-dark-accent/50 flex flex-col h-full">

        {/* BACKGROUND IMAGE */}

        {hasBackground && (

          <div className="absolute inset-0 z-0">

            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.06] dark:opacity-[0.04] transition-all duration-500 scale-105 group-hover:scale-110"
              style={{ backgroundImage: `url(${project.background_image})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-light-surface/40 to-light-surface/95 dark:from-dark-surface/10 dark:to-dark-surface/95" />

          </div>

        )}

        {/* ACCENT OVERLAY */}

        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-light-accent/[0.02] via-transparent to-transparent dark:from-dark-accent/[0.02] z-0" />

        {/* CONTENT */}

        <div className="relative z-10 p-4 flex flex-col flex-1">

          {/* TOP */}

          <div className="flex items-start justify-between gap-3 mb-3">

            <div className="min-w-0 flex-1">

              {/* RANK */}

              {rank && (

                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background px-2.5 py-1 text-[10px] font-semibold text-light-secondary dark:text-dark-secondary">
                  🏆 #{rank}
                </div>

              )}

              {/* TITLE */}

              <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-light-primary dark:text-dark-primary transition-colors duration-300 group-hover:text-light-accent dark:group-hover:text-dark-accent">
                {project.title}
              </h3>

            </div>

            {/* OPEN ICON */}

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-secondary dark:text-dark-secondary transition-all duration-300 group-hover:border-light-accent/30 dark:group-hover:border-dark-accent/30 group-hover:text-light-accent dark:group-hover:text-dark-accent">
              <FiArrowUpRight className="w-3.5 h-3.5" />
            </div>

          </div>

          {/* DESCRIPTION */}

          <p className="text-xs leading-relaxed text-light-secondary dark:text-dark-secondary line-clamp-2 mb-3 flex-1">
            {project.description || "Collaborative storytelling project"}
          </p>

          {/* FOOTER */}

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-light-border dark:border-dark-border">

            {/* AUTHOR */}

            <div className="flex items-center gap-2 min-w-0">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-xs font-semibold">

                {project.is_team_project ? (

                  project.team_background_image ? (

                    <img
                      src={project.team_background_image}
                      alt={project.team_name}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <DisplayIcon className="w-3 h-3" />

                  )

                ) : (

                  project.initiator_profile_image ? (

                    <img
                      src={project.initiator_profile_image}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <DisplayIcon className="w-3 h-3" />

                  )

                )}

              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-medium text-light-primary dark:text-dark-primary">
                  {displayName || 'Unknown'}
                </p>

              </div>

            </div>

            {/* STATS */}

            <div className="flex items-center gap-2 text-xs text-light-secondary dark:text-dark-secondary shrink-0">

              <div className="flex items-center gap-0.5">
                <FiEye className="w-3 h-3" />
                <span>{project.views || 0}</span>
              </div>

              <div className="flex items-center gap-0.5">
                <FiHeart className="w-3 h-3" />
                <span>{project.likes || 0}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
};

export default CardProjectMini;