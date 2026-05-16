import React from "react";
import { Link } from "react-router-dom";

import {
  FiEye,
  FiHeart,
  FiUser,
  FiArrowUpRight,
} from "react-icons/fi";

import { apiClient } from "../api/client";

const CardProjectMini = ({ project, rank }) => {

  if (!project) return null;

  const author =
    findUserById(project.initiatorId) || {
      name: "Unknown",
    };

  const hasBackground =
    project.backgroundImage &&
    project.backgroundImage.trim() !== "";

  return (

    <Link
      to={`/project/${project.id}`}
      className="block group"
    >

      <div
        className="
        relative overflow-hidden

        rounded-[1.75rem]

        border border-light-border dark:border-dark-border

        bg-light-surface dark:bg-dark-surface

        transition-all duration-500

        hover:-translate-y-1
        hover:shadow-2xl

        hover:border-light-accent/30
        dark:hover:border-dark-accent/30
        "
      >

        {/* BACKGROUND */}
        {hasBackground && (

          <div className="absolute inset-0">

            <div
              className="
              absolute inset-0
              bg-cover bg-center

              opacity-[0.08]
              dark:opacity-[0.06]

              transition-all duration-700

              scale-105
              group-hover:scale-110
              "
              style={{
                backgroundImage: `url(${project.backgroundImage})`,
              }}
            />

            {/* FADE */}
            <div
              className="
              absolute inset-0

              bg-gradient-to-b

              from-white/40
              to-white/95

              dark:from-slate-950/10
              dark:to-slate-950/95
              "
            />

          </div>

        )}

        {/* ACCENT GLOW */}
        <div
          className="
          absolute inset-0 opacity-0

          transition-opacity duration-500

          group-hover:opacity-100

          bg-gradient-to-br
          from-indigo-500/[0.03]
          via-purple-500/[0.02]
          to-pink-500/[0.03]
          "
        />

        {/* CONTENT */}
        <div
          className="
          relative z-10

          p-5
          "
        >

          {/* TOP */}
          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0 flex-1">

              {/* RANK */}
              {rank && (

                <div
                  className="
                  mb-4

                  inline-flex items-center gap-2

                  rounded-full

                  border border-light-border dark:border-dark-border

                  bg-light-background dark:bg-dark-background

                  px-3 py-1

                  text-[11px] font-semibold

                  text-light-secondary dark:text-dark-secondary
                  "
                >
                  Top #{rank}
                </div>

              )}

              {/* TITLE */}
              <h3
                className="
                line-clamp-1

                text-lg font-semibold tracking-tight

                text-light-primary dark:text-dark-primary

                transition-colors duration-300

                group-hover:text-light-accent
                dark:group-hover:text-dark-accent
                "
              >
                {project.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                className="
                mt-2

                line-clamp-2

                text-sm leading-relaxed

                text-light-secondary dark:text-dark-secondary
                "
              >
                {project.description ||
                  "Collaborative storytelling project on INVERSA."}
              </p>

            </div>

            {/* OPEN ICON */}
            <div
              className="
              flex h-10 w-10 shrink-0 items-center justify-center

              rounded-2xl

              border border-light-border dark:border-dark-border

              bg-light-background dark:bg-dark-background

              text-light-secondary dark:text-dark-secondary

              transition-all duration-300

              group-hover:border-light-accent/30
              dark:group-hover:border-dark-accent/30

              group-hover:text-light-accent
              dark:group-hover:text-dark-accent
              "
            >
              <FiArrowUpRight className="w-4 h-4" />
            </div>

          </div>

          {/* FOOTER */}
          <div
            className="
            mt-5

            flex items-center justify-between gap-4

            border-t border-light-border dark:border-dark-border

            pt-4
            "
          >

            {/* AUTHOR */}
            <div className="flex items-center gap-3 min-w-0">

              <div
                className="
                flex h-10 w-10 shrink-0 items-center justify-center

                rounded-full

                bg-light-accent/10 dark:bg-dark-accent/10

                text-light-accent dark:text-dark-accent
                "
              >
                <FiUser className="w-4 h-4" />
              </div>

              <div className="min-w-0">

                <p
                  className="
                  truncate

                  text-sm font-medium

                  text-light-primary dark:text-dark-primary
                  "
                >
                  {author.name}
                </p>

              </div>

            </div>

            {/* STATS */}
            <div
              className="
              flex items-center gap-4

              text-sm

              text-light-secondary dark:text-dark-secondary
              "
            >

              <div className="flex items-center gap-1.5">

                <FiEye className="w-4 h-4" />

                <span>{project.views || 0}</span>

              </div>

              <div className="flex items-center gap-1.5">

                <FiHeart className="w-4 h-4" />

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