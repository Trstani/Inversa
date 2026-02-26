import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiTrendingUp } from "react-icons/fi";
import { genres } from "../data/mockData";
import { loadProjects } from "../utils/dataManager";
import CardProject from "../components/CardProject";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const ProjectsExplorer = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 Fetch langsung pakai dataManager (seperti Home lama kamu)
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await loadProjects();
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // 🔥 Memo biar filter gak dihitung terus
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesGenre =
        selectedGenre === "all" || project.genre === selectedGenre;

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGenre && matchesSearch;
    });
  }, [projects, selectedGenre, searchQuery]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* SEARCH */}
        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-secondary dark:text-dark-secondary" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* GENRE FILTER */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-light-secondary dark:text-dark-secondary">
            Filter by Genre
          </h3>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre("all")}
              className={`px-4 py-2 rounded-full text-sm transition ${
                selectedGenre === "all"
                  ? "bg-light-accent text-white"
                  : "bg-light-surface dark:bg-dark-surface hover:bg-light-border dark:hover:bg-dark-border"
              }`}
            >
              All
            </button>

            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedGenre === genre.id
                    ? `${genre.color} text-white`
                    : "bg-light-surface dark:bg-dark-surface hover:bg-light-border dark:hover:bg-dark-border"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-6">
          <FiTrendingUp className="w-5 h-5 text-light-accent dark:text-dark-accent" />
          <h2 className="text-2xl font-bold">
            {selectedGenre === "all"
              ? "All Projects"
              : `${genres.find((g) => g.id === selectedGenre)?.name} Projects`}
          </h2>
          <span className="opacity-60">({filteredProjects.length})</span>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center py-16">
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <CardProject key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="mb-6 opacity-70">
              No projects found matching your criteria.
            </p>

            {projects.length === 0 && (
              <Button
                variant="primary"
                onClick={() => navigate("/login")}
              >
                Be the first to create one
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsExplorer;
