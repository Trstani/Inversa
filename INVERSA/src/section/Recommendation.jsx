import React, { useState, useEffect } from "react";
import CardProject from "../components/CardProject";
import { FiTrendingUp, FiHeart, FiChevronDown } from "react-icons/fi";

const Recommendation = ({ type, projects }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const totalProjects = projects?.length || 0;

  // Reset visible count when projects change (e.g., new filter)
  useEffect(() => {
    setVisibleCount(6);
  }, [projects]);

  if (!projects || totalProjects === 0) return null;

  const config = {
    trending: {
      icon: <FiTrendingUp className="w-7 h-7 text-white" />,
      title: "Trending Projects",
      description: "Proyek dengan views terbanyak minggu ini",
      gradient: "from-orange-500 to-pink-500",
    },
    likes: {
      icon: <FiHeart className="w-7 h-7 text-white" />,
      title: "Most Liked Projects",
      description: "Proyek favorit para pengguna",
      gradient: "from-pink-500 to-rose-500",
    },
  };

  const currentConfig = config[type] || {
    icon: null,
    title: "Rekomendasi",
    description: "",
    gradient: "from-indigo-600 to-purple-600",
  };

  const displayedProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < totalProjects;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, totalProjects));
  };

  const showAll = () => {
    setVisibleCount(totalProjects);
  };

  return (
    <section className="py-20 bg-light-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header dengan dekorasi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 bg-gradient-to-br ${currentConfig.gradient} rounded-2xl shadow-lg`}
            >
              <div className="text-white">{currentConfig.icon}</div>
            </div>
            <div>
              <h2 className="text-3xl font-bold">{currentConfig.title}</h2>
              {currentConfig.description && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {currentConfig.description}
                </p>
              )}
            </div>
          </div>

          {/* Tombol "Lihat semua" hanya muncul jika ada lebih banyak project */}
          {hasMore && (
            <button
              onClick={showAll}
              className="mt-4 md:mt-0 text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              Lihat semua
              <FiChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Grid Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardProject project={project} />
            </div>
          ))}
        </div>

        {/* Tombol "Muat lebih banyak" di bagian bawah (opsional) */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              View More
              <FiChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Recommendation;