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
  const [likeCount, setLikeCount] = useState(
    project.likes || 0
  );


  useEffect(() => {
    // Like status is now managed by the backend
    // We'll check if the user has liked this project via the API
    setIsLiked(false); // Default to not liked
  }, [project.id]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      if (isLiked) {
        await apiClient.projects.decrementLikes(project.id);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await apiClient.projects.incrementLikes(project.id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      // Revert state on error
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
    }
  };

  const displayName = project.is_team_project
    ? project.team_name
    : project.initiator_name;

  const DisplayIcon = project.is_team_project
    ? FiUsers
    : FiUser;

  const hasImage =
    project.background_image &&
    project.background_image.trim() !== "";

  return (
    <Link
      to={`/project/${project.id}`}
      className="group block"
    >
      <article
        className="
        flex gap-6
        rounded-3xl
        border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-950
        p-5 md:p-6
        transition-all duration-300
        hover:border-indigo-400/30
        hover:bg-slate-50/70
        dark:hover:bg-slate-900/60
        "
      >
        {/* TEXT */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          
          {/* TOP */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.category_id && (
                <BadgeCategories
                  categoryId={project.category_id}
                  size="sm"
                />
              )}

              {project.genre_id && (
                <BadgeGenre
                  genreId={project.genre_id}
                  size="sm"
                />
              )}
            </div>

            <h3
              className="
              text-xl font-semibold
              leading-snug
              text-slate-900 dark:text-white
              transition-colors
              group-hover:text-indigo-500
              line-clamp-2
              "
            >
              {project.title}
            </h3>

            <p
              className="
              mt-3
              text-sm leading-relaxed
              text-slate-500 dark:text-slate-400
              line-clamp-3
              max-w-3xl
              "
            >
              {project.description}
            </p>
          </div>

          {/* FOOTER */}
          <div
            className="
            mt-6
            flex flex-wrap items-center justify-between
            gap-4
            "
          >
            {/* author */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                flex h-9 w-9 items-center justify-center
                rounded-full
                bg-slate-100 dark:bg-slate-900
                "
              >
                <DisplayIcon
                  className="
                  h-4 w-4
                  text-slate-600 dark:text-slate-300
                  "
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                  truncate text-sm font-medium
                  text-slate-700 dark:text-slate-200
                  "
                >
                  {displayName || "Unknown"}
                </p>

              </div>
            </div>

            {/* stats */}
            <div
              className="
              flex items-center gap-5
              text-sm text-slate-400
              "
            >
              <span className="flex items-center gap-1.5">
                <FiEye className="h-4 w-4" />
                {project.views || 0}
              </span>

              <button
                onClick={handleLike}
                className="
                flex items-center gap-1.5
                transition-colors
                hover:text-red-500
                "
              >
                <FiHeart
                  className={`h-4 w-4 ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />

                {likeCount}
              </button>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <div
          className="
          relative hidden
          h-[180px] w-[260px]
          shrink-0 overflow-hidden
          rounded-2xl
          md:block
          "
        >
          {hasImage ? (
            <img
              src={project.background_image}
              alt={project.title}
              className="
              h-full w-full object-cover
              transition-transform duration-700
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
              <span className="text-5xl font-black text-white/10">
                {project.title?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div
            className="
            absolute inset-0
            bg-gradient-to-t
            from-black/10 to-transparent
            "
          />
        </div>
      </article>
    </Link>
  );
};

export default CardProject;