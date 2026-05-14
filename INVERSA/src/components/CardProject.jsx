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

import { findUserById } from "../utils/userManager/index";
import {
  incrementLikes,
  decrementLikes,
} from "../utils/dataManager/index";

import { getTeamById } from "../utils/dataManager/teamManager";

const CardProject = ({
  project,
  showCollabStatus = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    project.likes || 0
  );

  const [teamName, setTeamName] = useState(null);

  useEffect(() => {
    if (project.isTeamProject && project.teamId) {
      loadTeamName();
    }
  }, [project.id, project.teamId]);

  const loadTeamName = async () => {
    try {
      const team = await getTeamById(project.teamId);
      setTeamName(team?.title);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const guestLikes = JSON.parse(
      localStorage.getItem("guestLikes") || "[]"
    );

    setIsLiked(guestLikes.includes(project.id));
  }, [project.id]);

  const handleLike = async (e) => {
    e.preventDefault();

    const guestLikes = JSON.parse(
      localStorage.getItem("guestLikes") || "[]"
    );

    if (isLiked) {
      const newLikes = guestLikes.filter(
        (id) => id !== project.id
      );

      localStorage.setItem(
        "guestLikes",
        JSON.stringify(newLikes)
      );

      setIsLiked(false);
      setLikeCount((prev) => prev - 1);

      await decrementLikes(project.id);
    } else {
      guestLikes.push(project.id);

      localStorage.setItem(
        "guestLikes",
        JSON.stringify(guestLikes)
      );

      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      await incrementLikes(project.id);
    }
  };

  const author =
    findUserById(project.initiatorId) || {
      name: "Unknown",
    };

  const displayName = project.isTeamProject
    ? teamName
    : author.name;

  const DisplayIcon = project.isTeamProject
    ? FiUsers
    : FiUser;

  const hasImage =
    project.backgroundImage &&
    project.backgroundImage.trim() !== "";

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
              {project.category && (
                <BadgeCategories
                  categoryId={project.category}
                  size="sm"
                />
              )}

              {project.genre && (
                <BadgeGenre
                  genreId={project.genre}
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
              src={project.backgroundImage}
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