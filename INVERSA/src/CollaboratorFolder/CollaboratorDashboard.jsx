import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  loadProjects,
  loadCollaborations,
  updateCollaborationStatus
} from '../utils/dataManager/index';

import { FiSearch, FiClock, FiBook, FiStar } from "react-icons/fi";
import Button from "../components/Button";
import CardProject from "../components/CardProject";

const CollaboratorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [suggestedProjects, setSuggestedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);

    const projectsData = await loadProjects();
    const collaborations = await loadCollaborations();

    setProjects(projectsData);

    // =============================
    // USER COLLABORATIONS
    // =============================

    const userCollaborations = collaborations.filter(
      (c) => c.userId === user.id
    );

    const approvedCollaborations = userCollaborations.filter(
      (c) => c.status === "approved"
    );

    const pendingCollaborations = userCollaborations.filter(
      (c) => c.status === "pending"
    );

    // =============================
    // JOINED PROJECTS
    // =============================

    const joined = projectsData.filter((p) =>
      approvedCollaborations.some((c) => c.projectId === p.id)
    );

    setJoinedProjects(joined);

    // =============================
    // PENDING REQUESTS
    // =============================

    setPendingRequests(pendingCollaborations);

    // =============================
    // DISCOVER PROJECTS
    // =============================

    const available = projectsData.filter((p) => {
      const alreadyRequested = userCollaborations.some(
        (c) => c.projectId === p.id
      );

      return p.status === "open" && !alreadyRequested;
    });

    setAllProjects(available);

    // =============================
    // SUGGESTED PROJECTS
    // =============================

    const joinedGenres = joined.map((p) => p.genre);

    const scoredProjects = available.map((project) => {
      let score = 0;

      if (joinedGenres.includes(project.genre)) {
        score += 3;
      }

      if (project.popular) {
        score += 1;
      }

      return {
        ...project,
        score
      };
    });

    const suggested = scoredProjects
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setSuggestedProjects(suggested);

    setLoading(false);
  };

  // =============================
  // CANCEL REQUEST
  // =============================

  const handleCancelRequest = async (collabId) => {
    if (window.confirm("Cancel this collaboration request?")) {
      await updateCollaborationStatus(collabId, "cancelled");
      await loadData();
    }
  };

  // =============================
  // FILTER PROJECTS
  // =============================

  const filteredProjects = allProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      filterGenre === "all" || p.genre === filterGenre;

    return matchesSearch && matchesGenre;
  });

  // =============================
  // LOADING STATE
  // =============================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
            Collaborator Dashboard
          </h1>
          <p className="text-light-secondary dark:text-dark-secondary">
            Discover and join collaborative writing projects
          </p>
        </div>

        {/* ============================= */}
        {/* PENDING REQUESTS */}
        {/* ============================= */}

        {pendingRequests.length > 0 && (
          <div className="card p-6 mb-8">

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiClock /> Pending Requests ({pendingRequests.length})
            </h2>

            <div className="space-y-4">
              {pendingRequests.map((request) => {

                const project = projects.find(
                  (p) => p.id === request.projectId
                );

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-light-surface dark:bg-dark-surface rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        {project?.title || "Project"}
                      </p>

                      <p className="text-sm text-light-secondary dark:text-dark-secondary">
                        Requested role:{" "}
                        <span className="font-medium">
                          {request.role}
                        </span>
                      </p>

                      <p className="text-xs text-light-secondary dark:text-dark-secondary">
                        Waiting for initiator approval...
                      </p>
                    </div>

                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      Cancel Request
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================= */}
        {/* JOINED PROJECTS */}
        {/* ============================= */}

        {joinedProjects.length > 0 && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiBook /> My Projects ({joinedProjects.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {joinedProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="cursor-pointer"
                >
                  <CardProject project={project} />
                </div>
              ))}

            </div>
          </div>
        )}

        {/* ============================= */}
        {/* SUGGESTED PROJECTS */}
        {/* ============================= */}

        {suggestedProjects.length > 0 && (
          <div className="mb-8">

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FiStar /> Suggested For You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {suggestedProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="cursor-pointer"
                >
                  <CardProject project={project} />
                </div>
              ))}

            </div>
          </div>
        )}

        {/* ============================= */}
        {/* DISCOVER PROJECTS */}
        {/* ============================= */}

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Discover Projects
          </h2>

          {/* SEARCH + FILTER */}

          <div className="card p-4 mb-6">

            <div className="flex flex-col md:flex-row gap-4">

              <div className="flex-1 relative">

                <FiSearch className="absolute left-3 top-3 text-light-secondary dark:text-dark-secondary" />

                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
                />

              </div>

              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="px-4 py-2 border border-light-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface"
              >
                <option value="all">All Genres</option>
                <option value="adventure">Adventure</option>
                <option value="comedy">Comedy</option>
                <option value="horror">Horror</option>
                <option value="romance">Romance</option>
                <option value="scifi">Sci-Fi</option>
              </select>

            </div>
          </div>

          {/* PROJECT GRID */}

          {filteredProjects.length === 0 ? (
            <div className="card p-8 text-center">

              <p className="text-light-secondary dark:text-dark-secondary mb-4">
                {allProjects.length === 0
                  ? "No projects available to join right now."
                  : "No projects match your search."}
              </p>

              {allProjects.length === 0 && (
                <Button onClick={() => navigate("/explore")}>
                  Explore More Projects
                </Button>
              )}

            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="cursor-pointer"
                >
                  <CardProject project={project} />
                </div>
              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default CollaboratorDashboard;