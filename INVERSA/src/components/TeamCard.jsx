import React, {
  useState,
  useEffect,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  FiUsers,
  FiFolder,
  FiArrowRight,
  FiTrash2,
} from 'react-icons/fi';

import {
  apiClient,
} from '../api/client';

const TeamCard = ({
  team,
  onDelete,
  isOwner = false,
}) => {

  const navigate =
    useNavigate();

  /*
  =========================
  STATES
  =========================
  */

  const [
    projectCount,
    setProjectCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  =========================
  LOAD PROJECT COUNT
  =========================
  */

  useEffect(() => {

    loadProjectCount();

  }, [team.id]);

  const loadProjectCount =
    async () => {

      try {

        const response =
          await apiClient.teams.getProjects(
            team.id
          );

        setProjectCount(
          response.data?.length || 0
        );

      } catch (error) {

        console.error(
          'Error loading project count:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  MEMBER COUNT
  =========================
  */

  const memberCount =
    team.member_count || 0;

  /*
  =========================
  BACKGROUND IMAGE
  =========================
  */

  const hasBackground =
    team.background_image &&
    team.background_image.trim() !== '';

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface transition-all duration-300 hover:border-light-accent/50 dark:hover:border-dark-accent/50 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-dark-accent/10">

      {/* BACKGROUND IMAGE */}

      {hasBackground && (

        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] dark:opacity-[0.04] transition-all duration-500 scale-105 group-hover:scale-110"
          style={{
            backgroundImage:
              `url(${team.background_image})`,
          }}
        />

      )}

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-b from-light-surface/40 to-light-surface/95 dark:from-dark-surface/10 dark:to-dark-surface/95" />

      {/* CONTENT */}

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full">

        {/* TOP */}

        <div className="mb-4 flex items-start justify-between gap-3">

          <div className="min-w-0 flex-1">

            <h3
              className="
                font-semibold text-lg

                text-light-primary
                dark:text-dark-primary

                truncate

                transition-colors duration-300
                group-hover:text-light-accent
                dark:group-hover:text-dark-accent
              "
            >
              {team.title}
            </h3>

            <p
              className="
                text-sm mt-1

                text-light-secondary
                dark:text-dark-secondary

                line-clamp-2
              "
            >
              {team.description}
            </p>

          </div>

        </div>

        {/* STATS */}

        <div
          className="
            flex gap-4 sm:gap-6

            text-xs sm:text-sm

            text-light-secondary
            dark:text-dark-secondary

            mb-5 pb-5

            border-b border-light-border
            dark:border-dark-border
          "
        >

          {/* MEMBERS */}

          <div className="flex items-center gap-1.5">

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">

              <FiUsers className="w-3 h-3" />

            </div>

            <span>
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>

          </div>

          {/* PROJECTS */}

          <div className="flex items-center gap-1.5">

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent">

              <FiFolder className="w-3 h-3" />

            </div>

            <span>

              {loading
                ? '-'
                : projectCount}

              {' '}{projectCount === 1 ? 'project' : 'projects'}

            </span>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex gap-2 mt-auto">

          {/* VIEW TEAM */}

          <button
            onClick={() =>
              navigate(`/team/${team.id}`)
            }
            className="
              flex-1

              flex items-center
              justify-center
              gap-2

              px-4 py-2.5 sm:py-3

              bg-light-accent/10
              dark:bg-dark-accent/10

              text-light-accent
              dark:text-dark-accent

              rounded-lg

              hover:bg-light-accent/20
              dark:hover:bg-dark-accent/20

              transition-all duration-300

              text-sm
              font-medium
            "
          >

            <FiArrowRight className="w-4 h-4" />

            <span className="hidden sm:inline">View Team</span>
            <span className="sm:hidden">Open</span>

          </button>

          {/* DELETE */}

          {isOwner && (

            <button
              onClick={() =>
                onDelete?.(team.id)
              }
              className="
                flex items-center
                justify-center

                px-3 sm:px-4 py-2.5 sm:py-3

                bg-red-500/10
                text-red-500

                rounded-lg

                hover:bg-red-500/20

                transition-all duration-300
              "
              title="Delete team"
            >

              <FiTrash2 className="w-4 h-4" />

            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default TeamCard;