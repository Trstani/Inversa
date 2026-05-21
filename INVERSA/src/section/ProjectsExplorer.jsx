import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiBook } from "react-icons/fi";
import { genres } from "../data/mockData";
import { apiClient } from '../api/client';
import CardProject from "../components/CardProject";
import { useNavigate } from "react-router-dom";

const ProjectsExplorer = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔥 Fetch published projects dari API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.projects.getPublished();
        const data = response.data || [];
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    useMemo(() => {

      return projects.filter(
        (project) => {

          const matchesGenre =

            selectedGenre === "all" ||

            project.genre_id ===
            selectedGenre;

          const matchesSearch =

            project.title
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              )

            ||

            (
              project.description || ""
            )
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              );

          return (
            matchesGenre &&
            matchesSearch
          );
        }
      );

    }, [
      projects,
      selectedGenre,
      searchQuery,
    ]);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-light-background dark:bg-dark-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

        {/* TITLE SECTION */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-light-accent/10 dark:bg-dark-accent/10 shrink-0">
              <FiBook className="h-6 w-6 sm:h-7 sm:w-7 text-light-accent dark:text-dark-accent" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-light-primary dark:text-dark-primary">
                {selectedGenre === "all"
                  ? "Explore Projects"
                  : genres.find(
                    (g) => g.id === selectedGenre
                  )?.name}
              </h2>

              <p className="mt-2 text-sm sm:text-base text-light-secondary dark:text-dark-secondary">
                {filteredProjects.length} published {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-secondary dark:text-dark-secondary" />

            <input
              type="text"
              placeholder="Search projects, stories, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary outline-none transition-all focus:border-light-accent/50 dark:focus:border-dark-accent/50 focus:shadow-lg"
            />
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="mb-10 sm:mb-12 md:mb-14">
          <div className="flex flex-wrap gap-2 sm:gap-3">

            <button
              onClick={() => setSelectedGenre("all")}
              className={`rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium transition-all duration-300 ${
                selectedGenre === "all"
                  ? "border-light-accent/50 dark:border-dark-accent/50 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent"
                  : "border-light-border dark:border-dark-border text-light-secondary dark:text-dark-secondary hover:border-light-accent/30 dark:hover:border-dark-accent/30"
              }`}
            >
              All
            </button>

            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium transition-all duration-300 ${
                  selectedGenre === genre.id
                    ? "border-light-accent/50 dark:border-dark-accent/50 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent"
                    : "border-light-border dark:border-dark-border text-light-secondary dark:text-dark-secondary hover:border-light-accent/30 dark:hover:border-dark-accent/30"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT SECTION */}
        {loading ? (
          <div className="py-16 sm:py-20 md:py-24 text-center">
            <p className="text-light-secondary dark:text-dark-secondary">
              Loading projects...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (

          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {filteredProjects.map((project) => (
              <CardProject
                key={project.id}
                project={project}
              />
            ))}
          </div>

        ) : (
          <div className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-light-border dark:border-dark-border py-16 sm:py-20 md:py-24 text-center">
            <FiBook className="h-12 w-12 sm:h-14 sm:w-14 mx-auto mb-4 text-light-secondary dark:text-dark-secondary opacity-40" />
            <p className="text-light-secondary dark:text-dark-secondary text-base sm:text-lg">
              No projects found.
            </p>
            <p className="mt-2 text-sm text-light-secondary dark:text-dark-secondary opacity-75">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsExplorer;
