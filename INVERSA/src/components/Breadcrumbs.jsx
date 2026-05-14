import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";

const Breadcrumbs = ({ items = [] }) => {
  return (

    <nav
      className="
      inline-flex items-center
      gap-2
      overflow-x-auto

      rounded-full
      border border-light-border dark:border-dark-border

      bg-light-surface dark:bg-dark-surface

      px-4 py-3

      shadow-sm
      "
    >

      {/* HOME */}
      <Link
        to="/"
        className="
        flex items-center gap-2
        whitespace-nowrap

        text-sm font-medium

        text-light-secondary dark:text-dark-secondary

        transition-colors duration-300

        hover:text-light-primary
        dark:hover:text-dark-primary
        "
      >
        <FiHome className="w-4 h-4" />

        <span>Home</span>
      </Link>

      {/* ITEMS */}
      {items.map((item, index) => {

        const isLast = index === items.length - 1;

        return (

          <React.Fragment key={index}>

            {/* SEPARATOR */}
            <FiChevronRight
              className="
              w-4 h-4 flex-shrink-0
              text-light-secondary dark:text-dark-secondary
              "
            />

            {/* LINK */}
            {item.href && !isLast ? (

              <Link
                to={item.href}
                className="
                whitespace-nowrap

                text-sm font-medium

                text-light-secondary dark:text-dark-secondary

                transition-colors duration-300

                hover:text-light-primary
                dark:hover:text-dark-primary
                "
              >
                {item.label}
              </Link>

            ) : (

              /* ACTIVE */
              <div
                className="
                max-w-[220px] truncate

                rounded-full

                bg-light-accent/10 dark:bg-dark-accent/10

                px-3 py-1

                text-sm font-semibold

                text-light-accent dark:text-dark-accent
                "
              >
                {item.label}
              </div>

            )}

          </React.Fragment>

        );

      })}

    </nav>

  );
};

export default Breadcrumbs;