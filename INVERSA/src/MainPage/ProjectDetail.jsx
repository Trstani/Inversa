import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { apiClient } from "../api/client";

import {
  FiFlag,
  FiClock,
  FiTrash2,
  FiHeart,
  FiEye,
  FiBook,
  FiPlay,
  FiEdit2
} from "react-icons/fi";

import Button from "../components/Button";
import Breadcrumbs from "../components/Breadcrumbs";
import CollaborationRequestModal from "../components/CollaborationRequestModal";
import ReportsModal from "../components/ReportsModal";
import ChapterList from "../components/ChapterList";

const ProjectDetail = () => {

  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("read");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [isLiked, setIsLiked] = useState(false);

  const [userRequest, setUserRequest] = useState(null);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    loadData();
  }, [projectId, user?.id]);

  useEffect(() => {
    if (user?.id && projectId) {
      checkLikeStatus();
    }
  }, [user?.id, projectId]);

  const checkLikeStatus = async () => {
    try {
      const response =
        await apiClient.projects.getById(projectId);

      const projectData = response.data;

      setIsLiked(projectData.user_liked || false);

    } catch (error) {
      console.error(
        "Error checking like status:",
        error
      );
    }
  };

  const handleLike = async () => {

    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {

      if (isLiked) {

        await apiClient.projects.decrementLikes(
          project.id
        );

        setIsLiked(false);

      } else {

        await apiClient.projects.incrementLikes(
          project.id
        );

        setIsLiked(true);
      }

      const response =
        await apiClient.projects.getById(
          project.id
        );

      if (response.success) {
        setProject(response.data);
      }

    } catch (error) {

      console.error(
        "Error updating likes:",
        error
      );
    }
  };

  const loadData = async () => {

    setLoading(true);

    try {

      // ================= PROJECT =================

      const projectResponse =
        await apiClient.projects.getById(
          projectId
        );

      if (
        !projectResponse.success ||
        !projectResponse.data
      ) {
        setLoading(false);
        return;
      }

      const projectData =
        projectResponse.data;

      setProject(projectData);
      console.log(projectData);

      // ================= CHAPTERS =================

      const chaptersResponse =
        await apiClient.chapters.getByProject(
          projectId
        );

      setChapters(
        chaptersResponse.data || []
      );

      // ================= COLLABORATORS =================

      const isDirectCollaborator =
        projectData.collaborators?.some(
          (c) =>
            c.user_id === user?.id &&
            c.status === "approved"
        );

      const isInitiator =
        projectData.initiator_id === user?.id;

      // ================= TEAM MEMBERS =================

      let userIsTeamMember = false;

      if (
        projectData.is_team_project &&
        projectData.team_id
      ) {

        const teamResponse =
          await apiClient.teams.getById(
            projectData.team_id
          );

        if (
          teamResponse.success &&
          teamResponse.data
        ) {

          const team =
            teamResponse.data;

          userIsTeamMember =
            team.members?.some(
              (member) =>
                member.user_id === user?.id &&
                member.status === "approved"
            );

          setTeamMembers(
            team.members?.filter(
              (member) =>
                member.status === "approved"
            ) || []
          );
        }
      }

      setIsTeamMember(
        userIsTeamMember
      );

      const canCollaborate =
        isDirectCollaborator ||
        userIsTeamMember ||
        isInitiator;

      setIsCollaborator(
        canCollaborate
      );

      // ================= REQUESTS =================

      const requestsResponse =
        await apiClient.collaboration.getRequests();

      const requests =
        requestsResponse.data || [];

      const currentRequest =
        requests.find(
          (r) =>
            r.project_id ===
            projectData.id &&
            r.user_id === user?.id
        );

      setUserRequest(
        currentRequest
      );

    } catch (error) {

      console.error(
        "Error loading project:",
        error
      );

    } finally {

      setLoading(false);
    }

    console.log("PROJECT ID:", projectId);

  };

  const handleRequestSubmit = async (
    role
  ) => {

    try {

      const response =
        await apiClient.collaboration.createRequest({
          project_id:
            parseInt(projectId),

          user_id: user.id,

          requested_role: role,
        });

      if (response.success) {

        setShowRequestModal(false);

        await loadData();
      }

    } catch (error) {

      console.error(
        "Error submitting request:",
        error
      );

      alert(
        "Failed to submit request"
      );
    }
  };

  const handleReportSubmit = async (
    data
  ) => {

    try {

      const response =
        await apiClient.reports.create(
          project.id,
          {
            reason: data.reason,
            note: data.note,
          }
        );

      if (response.success) {

        alert(
          "Report submitted successfully"
        );

        setShowReportModal(false);
      }

    } catch (error) {

      console.error(
        "Error submitting report:",
        error
      );

      alert(
        "Failed to submit report"
      );
    }
  };

  const handleDeleteProject =
    async () => {

      try {

        const response =
          await apiClient.projects.delete(
            project.id
          );

        if (response.success) {

          alert(
            "Project deleted successfully"
          );

          navigate("/dashboard");
        }

      } catch (error) {

        console.error(
          "Error deleting project:",
          error
        );

        alert(
          "Failed to delete project"
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Project not found
      </div>
    );
  }

  const approvedCollaborators =
    project.collaborators?.filter(
      (c) =>
        c.status === "approved"
    ) || [];

  const isInitiator =
    project.initiator_id === user?.id;

  const canEdit =
    isInitiator ||
    isCollaborator ||
    isTeamMember;

  const isCollaborative =
    approvedCollaborators.length > 0 ||
    (
      project.is_team_project &&
      teamMembers.length > 0
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-200">

      {/* HEADER */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          backgroundImage: `url(${project.background_image || "/default-cover.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
        }}
      >

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 p-8 flex flex-col justify-between min-h-[400px]">

          {/* TOP */}
          <div className="flex items-start justify-between">

            <div className="flex gap-2 flex-wrap">

              {project.category_id && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm">
                  {project.category_id}
                </span>
              )}

              {project.genre_id && (
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-sm">
                  {project.genre_id}
                </span>
              )}

            </div>

            {!isInitiator && (
              <button
                onClick={() =>
                  setShowReportModal(true)
                }
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <FiFlag />
              </button>
            )}

          </div>

          {/* CENTER */}
          <div>

            <h1 className="text-5xl font-bold text-white">
              {project.title}
            </h1>

            <p className="mt-4 max-w-2xl text-gray-200">
              {project.description}
            </p>

          </div>

          {/* BOTTOM */}
          <div className="flex justify-between items-end text-white">

            <div>
              <p className="text-sm text-gray-300">
                Created by
              </p>

              <p className="text-xl font-semibold">
                {project.initiator_name ||
                  "Unknown"}
              </p>
            </div>

            <div className="flex gap-6">

              <div className="flex items-center gap-2">
                <FiEye />
                {project.views || 0}
              </div>

              <button
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <FiHeart
                  className={
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />

                {project.likes || 0}
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto p-6">

        {isInitiator && (
          <div className="mb-6">
            <Breadcrumbs
              items={[
                {
                  label: "Dashboard",
                  href: "/dashboard",
                },
                {
                  label:
                    project.title,
                },
              ]}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR */}
          {isCollaborative && (
            <div className="lg:col-span-3 bg-gray-100 dark:bg-[#1e293b] p-4 rounded-lg">

              <h2 className="font-semibold mb-4">
                Members
              </h2>

              {project.is_team_project ? (

                teamMembers.map(
                  (member) => (
                    <div
                      key={member.user_id}
                      className="flex gap-2 mb-3"
                    >

                      <div className="w-8 h-8 bg-gray-400 rounded-full" />

                      <div>

                        <p className="text-sm">
                          {member.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {member.role}
                        </p>

                      </div>

                    </div>
                  )
                )

              ) : (

                approvedCollaborators.map(
                  (collab) => (
                    <div
                      key={collab.user_id}
                      className="flex gap-2 mb-3"
                    >

                      <div className="w-8 h-8 bg-gray-400 rounded-full" />

                      <div>

                        <p className="text-sm">
                          {collab.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {collab.role}
                        </p>

                      </div>

                    </div>
                  )
                )

              )}

            </div>
          )}

          {/* MAIN CONTENT */}
          <div className={`
    ${isCollaborative
              ? "lg:col-span-9"
              : "lg:col-span-12"
            }
  `}>

            {/* CHAPTER LIST */}
            <div className="bg-gray-100 dark:bg-[#1e293b] rounded-lg p-5">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-2xl font-bold">
                    Chapters
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {chapters.length} chapter
                    {chapters.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {canEdit && (
                  <Button
                    onClick={() =>
                      navigate(`/editor/${projectId}`)
                    }
                    className="flex items-center gap-2"
                  >
                    <FiEdit2 />
                    Manage Chapters
                  </Button>
                )}

              </div>

              <ChapterList
                chapters={chapters}
                currentChapterId={null}
                onSelectChapter={(chapterId) => {
                  navigate(`/read/${projectId}/${chapterId}`);
                }}
                onChaptersChange={loadData}
                projectId={projectId}
              />

            </div>

          </div>

        </div>
      </div>

      {/* MODALS */}

      {showRequestModal && (
        <CollaborationRequestModal
          projectTitle={project.title}
          onSubmit={handleRequestSubmit}
          onClose={() =>
            setShowRequestModal(false)
          }
        />
      )}

      {showReportModal && (
        <ReportsModal
          isOpen={showReportModal}
          onClose={() =>
            setShowReportModal(false)
          }
          onSubmit={handleReportSubmit}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-[#1e293b] rounded-lg p-6 max-w-md w-full">

            <h2 className="text-xl font-bold mb-4">
              Delete Project?
            </h2>

            <p className="mb-6">
              Are you sure you want to delete this project?
            </p>

            <div className="flex gap-3">

              <Button
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
                className="bg-gray-400"
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  handleDeleteProject();
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ProjectDetail;