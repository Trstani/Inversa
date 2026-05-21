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
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className="
              flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center
              rounded-lg sm:rounded-xl
              bg-light-accent/10 dark:bg-dark-accent/10
              shrink-0
              "
            >
              <Icon
                className="
                h-5 w-5 sm:h-6 sm:w-6
                text-light-accent dark:text-dark-accent
                "
              />
            </div>

            <div>
              <h2
                className="
                text-2xl sm:text-3xl font-bold
                text-light-primary dark:text-dark-primary
                "
              >
                {current.title}
              </h2>

              <p
                className="
                mt-1 text-sm sm:text-base
                text-light-secondary dark:text-dark-secondary
                "
              >
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {displayedProjects.map((project) => (
            <CardProject
              key={project.id}
              project={project}
            />
          ))}
        </div>

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + 5)
              }
              className="
              inline-flex items-center justify-center gap-2
              rounded-lg
              border border-light-border dark:border-dark-border
              bg-light-surface dark:bg-dark-surface
              px-5 sm:px-6 py-2.5 sm:py-3
              text-sm font-medium
              text-light-primary dark:text-dark-primary
              transition-all duration-300
              hover:border-light-accent/50 dark:hover:border-dark-accent/50
              hover:shadow-md
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