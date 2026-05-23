import React from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  FiBook,
  FiEye,
  FiHeart,
  FiArrowRight,
  FiTrash2,
} from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';

const DashboardProjectCard = ({
  project,
  onDelete,
}) => {

  const navigate =
    useNavigate();

  const { user } = useAuth();

  /*
  =========================
  IMAGE
  =========================
  */

  const hasBackground =
    project.background_image &&
    project.background_image.trim() !== '';

  /*
  =========================
  PERMISSIONS
  =========================
  */

  const isInitiator = project.initiator_id === user?.id;
  const isTeamMember = project.is_team_project && project.team_members?.some(m => m.user_id === user?.id);
  const canDelete = isInitiator || isTeamMember;

  /*
  =========================
  CHAPTER COUNT
  =========================
  */

  const chapterCount = project.chapters?.length || project.total_chapters || 0;

  /*
  =========================
  STATUS
  =========================
  */

  const isPublished =
    project.has_published_chapters;

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div
      className="
        group relative overflow-hidden

        rounded-2xl

        border border-light-border
        dark:border-dark-border

        bg-light-surface
        dark:bg-dark-surface

        transition-all duration-300

        hover:-translate-y-1
        hover:shadow-lg
        dark:hover:shadow-lg
        dark:hover:shadow-dark-accent/10

        hover:border-light-accent/50
        dark:hover:border-dark-accent/50
      "
    >

      {/* BACKGROUND IMAGE */}

      {hasBackground && (

        <div className="absolute inset-0 z-0">

          <img
            src={project.background_image}
            alt={project.title}
            className="
              w-full
              h-full
              object-cover

              opacity-[0.05]
              dark:opacity-[0.03]

              scale-105
            "
          />

          {/* OVERLAY */}

          <div
            className="
              absolute inset-0

              bg-gradient-to-b

              from-light-surface/70
              via-light-surface/85
              to-light-surface/95

              dark:from-dark-surface/20
              dark:via-dark-surface/70
              dark:to-dark-surface/95
            "
          />

        </div>

      )}

      {/* ACCENT OVERLAY */}

      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-light-accent/[0.02] via-transparent to-transparent dark:from-dark-accent/[0.02] z-0" />

      {/* CONTENT */}

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full">

        {/* TOP */}

        <div className="flex items-start justify-between gap-4 mb-4">

          <div className="min-w-0 flex-1">

            {/* STATUS */}

            <div
              className={`
                inline-flex items-center

                rounded-full

                px-3 py-1

                text-xs font-semibold

                mb-3

                ${
                  isPublished

                    ? `
                      bg-emerald-500/10
                      text-emerald-600
                      dark:text-emerald-400
                    `

                    : `
                      bg-amber-500/10
                      text-amber-600
                      dark:text-amber-400
                    `
                }
              `}
            >

              {isPublished
                ? '✓ Published'
                : '◯ Draft'}

            </div>

            {/* TITLE */}

            <h3
              className="
                text-lg sm:text-xl font-semibold

                text-light-primary
                dark:text-dark-primary

                line-clamp-2

                transition-colors duration-300
                group-hover:text-light-accent
                dark:group-hover:text-dark-accent
              "
            >
              {project.title}
            </h3>

          </div>

          {/* ICON */}

          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center

              rounded-lg

              bg-light-accent/10
              dark:bg-dark-accent/10

              text-light-accent
              dark:text-dark-accent

              transition-all duration-300
              group-hover:bg-light-accent/20
              dark:group-hover:bg-dark-accent/20
            "
          >

            <FiBook className="w-5 h-5" />

          </div>

        </div>

        {/* DESCRIPTION */}

        <p
          className="
            text-sm leading-relaxed

            text-light-secondary
            dark:text-dark-secondary

            line-clamp-2

            mb-4
          "
        >
          {project.description ||

            'Creative writing project on INVERSA'
          }
        </p>

        {/* STATS */}

        <div
          className="
            flex flex-wrap gap-3 sm:gap-4

            text-xs sm:text-sm

            text-light-secondary
            dark:text-dark-secondary

            mb-5 pb-5

            border-b border-light-border
            dark:border-dark-border
          "
        >

          {/* CHAPTERS */}

          <div className="flex items-center gap-1.5">

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">

              <FiBook className="w-3 h-3" />

            </div>

            <span>
              {chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}
            </span>

          </div>

          {/* VIEWS */}

          <div className="flex items-center gap-1.5">

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">

              <FiEye className="w-3 h-3" />

            </div>

            <span>
              {project.views || 0} {project.views === 1 ? 'view' : 'views'}
            </span>

          </div>

          {/* LIKES */}

          <div className="flex items-center gap-1.5">

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-red-500">

              <FiHeart className="w-3 h-3" />

            </div>

            <span>
              {project.likes || 0}
            </span>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex gap-2 mt-auto">

          {/* OPEN */}

          <button
            onClick={() =>
              navigate(`/project/${project.id}`)
            }
            className="
              flex-1

              flex items-center
              justify-center
              gap-2

              rounded-lg

              bg-light-accent
              dark:bg-dark-accent

              px-4 py-2.5 sm:py-3

              text-sm font-medium
              text-white

              transition-all duration-300

              hover:opacity-90
            "
          >

            <FiArrowRight className="w-4 h-4" />

            <span className="hidden sm:inline">Open Project</span>
            <span className="sm:hidden">Open</span>

          </button>

          {/* DELETE */}

          {canDelete && (
            <button
              onClick={() =>
                onDelete?.(project.id)
              }
              className="
                flex items-center
                justify-center

                rounded-lg

                bg-red-500/10

                px-3 sm:px-4 py-2.5 sm:py-3

                text-red-500

                transition-all duration-300

                hover:bg-red-500/20
              "
              title="Delete project"
            >

              <FiTrash2 className="w-4 h-4" />

            </button>
          )}

        </div>

      </div>

    </div>
    
  );
};

export default DashboardProjectCard;

