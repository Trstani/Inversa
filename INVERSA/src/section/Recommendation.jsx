import React, { useState, useEffect } from "react";

import CardProject from "../components/CardProject";

import {
  FiTrendingUp,
  FiHeart,
  FiChevronDown,
} from "react-icons/fi";

const Recommendation = ({ type, projects }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setVisibleCount(5);
  }, [projects]);

  if (!projects || projects.length === 0)
    return null;

  const config = {
    trending: {
      icon: FiTrendingUp,
      title: "Trending Projects",
      description:
        "Projects gaining attention this week",
    },

    likes: {
      icon: FiHeart,
      title: "Most Liked",
      description:
        "Community favorite collaborative works",
    },
  };

  const current = config[type];

  const Icon = current.icon;

  const displayedProjects = projects.slice(
    0,
    visibleCount
  );

  const hasMore = visibleCount < projects.length;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div
              className="
              flex h-11 w-11 items-center justify-center
              rounded-2xl
              bg-slate-100 dark:bg-slate-900
              "
            >
              <Icon
                className="
                h-5 w-5
                text-slate-700 dark:text-slate-300
                "
              />
            </div>

            <div>
              <h2
                className="
                text-2xl font-semibold
                text-slate-900 dark:text-white
                "
              >
                {current.title}
              </h2>

              <p
                className="
                mt-1 text-sm
                text-slate-500 dark:text-slate-400
                "
              >
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-5">
          {displayedProjects.map((project) => (
            <CardProject
              key={project.id}
              project={project}
            />
          ))}
        </div>

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + 5)
              }
              className="
              inline-flex items-center gap-2
              rounded-2xl
              border border-slate-200 dark:border-slate-800
              bg-white dark:bg-slate-950
              px-5 py-3
              text-sm font-medium
              text-slate-700 dark:text-slate-200
              transition-all
              hover:border-indigo-400/30
              "
            >
              Load More
              <FiChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
export default Recommendation;