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
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="
        flex h-11 w-11 items-center justify-center
        rounded-2xl
        bg-slate-100 dark:bg-slate-900
        "
          >
            <FiBook
              className="
          h-8 w-8
          text-slate-700 dark:text-slate-300
          "
            />
          </div>

          <div>
            <h2
              className="
          text-2xl font-semibold
          text-slate-900 dark:text-white
          "
            >
              {selectedGenre === "all"
                ? "Explore Projects"
                : genres.find(
                  (g) => g.id === selectedGenre
                )?.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProjects.length} published projects
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-10">
          <div className="relative">
            <FiSearch
              className="
          absolute left-4 top-1/2
          -translate-y-1/2
          w-5 h-5
          text-slate-400
          "
            />

            <input
              type="text"
              placeholder="Search projects, stories, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
          w-full rounded-2xl
          border border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-950
          px-12 py-4
          text-sm
          outline-none
          transition-all
          focus:border-indigo-400/40
          "
            />
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => setSelectedGenre("all")}
              className={`
          rounded-full border px-4 py-2
          text-sm transition-all
          ${selectedGenre === "all"
                  ? "border-indigo-400/40 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                }
          `}
            >
              All
            </button>

            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`
            rounded-full border px-4 py-2
            text-sm transition-all
            ${selectedGenre === genre.id
                    ? "border-indigo-400/40 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                  }
            `}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-slate-500">
              Loading projects...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (

          <div className="space-y-5">
            {filteredProjects.map((project) => (
              <CardProject
                key={project.id}
                project={project}
              />
            ))}
          </div>

        ) : (
          <div
            className="
        rounded-3xl
        border border-dashed
        border-slate-200 dark:border-slate-800
        py-20 text-center
        "
          >
            <p className="text-slate-500">
              No projects found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsExplorer;
