import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FiHeart,
  FiEye,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import BadgeGenre from "./BadgeGenre";
import BadgeCategories from "./BadgeCategories";

import { apiClient } from "../api/client";

const CardProject = ({
  project,
  showCollabStatus = false,
}) => {

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || 0);

  useEffect(() => { setIsLiked(false); }, [project.id]);

  const handleLike = async (e) => {

    e.preventDefault();

    try {

      if (isLiked) {

        await apiClient.projects.decrementLikes(project.id);

        setIsLiked(false);

        setLikeCount(prev => Math.max(0, prev - 1));

      } else {

        await apiClient.projects.incrementLikes(project.id);

        setIsLiked(true);

        setLikeCount(prev => prev + 1);
      }

    } catch (error) {

      console.error('Error updating likes:', error);

      setIsLiked(!isLiked);

      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
    }
  };

  const displayName =
    project.is_team_project
      ? project.team_name
      : project.initiator_name;

  const DisplayIcon =
    project.is_team_project
      ? FiUsers
      : FiUser;

  const hasImage =
    project.background_image &&
    project.background_image.trim() !== "";

  return (

    <Link to={`/project/${project.id}`} className="group block h-full">

      <article className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full rounded-2xl sm:rounded-3xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-4 sm:p-6 transition-all duration-300 hover:border-light-accent/50 dark:hover:border-dark-accent/50 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-dark-accent/10">

        {/* IMAGE - Mobile Top, Desktop Right */}

        <div className="relative w-full sm:w-48 sm:h-40 h-32 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl order-first sm:order-last">

          {hasImage ? (

            <img
              src={project.background_image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

          ) : (

            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-light-accent/20 to-light-accent/5 dark:from-dark-accent/20 dark:to-dark-accent/5">

              <span className="text-4xl sm:text-5xl font-black text-light-accent/20 dark:text-dark-accent/20">
                {project.title?.charAt(0).toUpperCase()}
              </span>

            </div>

          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

        </div>

        {/* CONTENT */}

        <div className="flex min-w-0 flex-1 flex-col justify-between">

          {/* TOP */}

          <div>

            <div className="mb-3 flex flex-wrap gap-2">

              {project.category_id && <BadgeCategories categoryId={project.category_id} size="sm" />}

              {project.genre_id && <BadgeGenre genreId={project.genre_id} size="sm" />}

            </div>

            <h3 className="text-lg sm:text-xl font-semibold leading-snug text-light-primary dark:text-dark-primary transition-colors group-hover:text-light-accent dark:group-hover:text-dark-accent line-clamp-2">
              {project.title}
            </h3>

            <p className="mt-2 sm:mt-3 text-sm leading-relaxed text-light-secondary dark:text-dark-secondary line-clamp-2 sm:line-clamp-3">
              {project.description}
            </p>

          </div>

          {/* FOOTER */}

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-light-border dark:border-dark-border">

            {/* AUTHOR */}

            <div className="flex items-center gap-3 min-w-0">

              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 shrink-0">

                {project.is_team_project ? (

                  project.team_background_image ? (

                    <img
                      src={project.team_background_image}
                      alt={project.team_name}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <DisplayIcon className="h-4 w-4 text-light-accent dark:text-dark-accent" />

                  )

                ) : (

                  project.initiator_profile_image ? (

                    <img
                      src={project.initiator_profile_image}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <DisplayIcon className="h-4 w-4 text-light-accent dark:text-dark-accent" />

                  )

                )}

              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-medium text-light-primary dark:text-dark-primary">
                  {displayName || "Unknown"}
                </p>

              </div>

            </div>

            {/* STATS */}

            <div className="flex items-center gap-4 sm:gap-5 text-sm text-light-secondary dark:text-dark-secondary">

              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <FiEye className="h-4 w-4 shrink-0" />
                <span className="text-xs sm:text-sm">{project.views || 0}</span>
              </span>

              <button className="flex items-center gap-1.5 transition-colors whitespace-nowrap">

                <FiHeart className={`h-4 w-4 shrink-0 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />

                <span className="text-xs sm:text-sm">{likeCount}</span>

              </button>

            </div>

          </div>

        </div>

      </article>

    </Link>
  );
};

export default CardProject;