import React, { useEffect, useState, useMemo, useRef } from "react";
import { loadProjects } from "../utils/dataManager";
import CardProject from "../components/CardProject";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const ProjectCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // 🔥 Fetch data langsung
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await loadProjects();
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // 🔥 Ambil 6 project terbaru
  const newestProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [projects]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading || newestProjects.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-light-surface to-light-surface/50 dark:from-dark-surface dark:to-dark-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header dengan navigasi */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              New Created Projects
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Proyek terbaru dari komunitas
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full dark:bg-dark-card shadow-md hover:shadow-lg transition-shadow"
              aria-label="Scroll left"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full dark:bg-dark-card shadow-md hover:shadow-lg transition-shadow"
              aria-label="Scroll right"
            >
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x"
        >
          {newestProjects.map((project) => (
            <div
              key={project.id}
              className="min-w-[320px] md:min-w-[360px] snap-start transform transition-transform duration-300 hover:-translate-y-2"
            >
              <CardProject project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;