import React, { useEffect, useState, useMemo } from "react";
import { loadProjects } from "../utils/dataManager";
import CardProject from "../components/CardProject";

const ProjectCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || newestProjects.length === 0) return null;

  return (
    <section className="py-12 bg-light-surface dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">
          New Created Projects
        </h2>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {newestProjects.map((project) => (
            <div key={project.id} className="min-w-[380px]">
              <CardProject project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
