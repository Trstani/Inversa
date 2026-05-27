import React, { useEffect, useState, useMemo } from "react";
import { apiClient } from "../api/client";
import CardProject from "../components/CardProject";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProjectCarousel = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch data langsung
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.projects.getPublished();
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const newestProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [projects]);

  if (loading || newestProjects.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-light-surface dark:bg-dark-surface border-t border-b border-light-border dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-dark-primary">
              New Created Projects
            </h2>
            <p className="mt-2 text-sm sm:text-base text-light-secondary dark:text-dark-secondary">
              Discover the latest projects from our community
            </p>
          </div>
          
          <button
            onClick={() => navigate('/explore')}
            className="hidden sm:flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition-all duration-300 font-medium text-sm"
          >
            View All
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CAROUSEL */}
        <div className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-2">
          {newestProjects.map((project) => (
            <div key={project.id} className="basis-full sm:basis-[calc(50%-10px)] md:basis-[calc(33.333%-12px)] flex-shrink-0">
              <CardProject project={project} />
            </div>
          ))}
        </div>

        {/* MOBILE VIEW ALL BUTTON */}
        <button
          onClick={() => navigate('/explore')}
          className="sm:hidden w-full mt-6 px-4 py-3 rounded-xl bg-light-accent dark:bg-dark-accent text-white font-medium transition-all duration-300 hover:opacity-90"
        >
          View All Projects
        </button>
      </div>
    </section>
  );
};

export default ProjectCarousel;
