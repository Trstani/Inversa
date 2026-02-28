import React from "react";
import CardProject from "../components/CardProject";
import { FiTrendingUp, FiHeart } from "react-icons/fi";

const Recommendation = ({ type, projects }) => {
  if (!projects || projects.length === 0) return null;

  const config = {
    trending: {
      icon: <FiTrendingUp className="w-6 h-6 text-orange-500" />,
      title: "Trending Projects",
      description: "Proyek dengan views terbanyak minggu ini"
    },
    likes: {
      icon: <FiHeart className="w-6 h-6 text-pink-600" />,
      title: "Most Liked Projects",
      description: "Proyek favorit para pengguna"
    }
  };

  const currentConfig = config[type] || {
    icon: null,
    title: "Rekomendasi",
    description: ""
  };

  return (
    <section className="py-16 bg-light-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          {currentConfig.icon && (
            <div className="p-3 bg-indigo-100 rounded-xl">
              {currentConfig.icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold ">
              {currentConfig.title}
            </h2>
            {currentConfig.description && (
              <p className="text-gray-500 mt-1">{currentConfig.description}</p>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CardProject project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendation;