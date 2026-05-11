import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-4 sm:mb-6 overflow-x-auto pb-2">
      {/* Home */}
      <Link
        to="/"
        className="flex items-center gap-1 text-light-accent dark:text-dark-accent hover:opacity-80 transition whitespace-nowrap"
      >
        <FiHome className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-light-secondary dark:text-dark-secondary flex-shrink-0" />
          
          {item.href ? (
            <Link
              to={item.href}
              className="text-light-accent dark:text-dark-accent hover:opacity-80 transition truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-light-primary dark:text-dark-primary truncate">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
