import { useState, useEffect } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { useAuth }
from "../context/AuthContext";

import { apiClient }
from "../api/client";

import {
  FiFlag,
  FiClock,
  FiTrash2,
  FiHeart,
  FiEye,
  FiBook,
  FiPlay,
  FiEdit2,
  FiStar,
} from "react-icons/fi";

import Button
from "../components/Button";

import Breadcrumbs
from "../components/Breadcrumbs";

import CollaborationRequestModal
from "../components/CollaborationRequestModal";

import ReportsModal
from "../components/ReportsModal";

import ChapterList
from "../components/ChapterList";

import BadgeGenre from "../components/BadgeGenre";
import BadgeCategories from "../components/BadgeCategories";
import {deleteStorageFile} from "../utils/storage";
import { cleanupProjectImages } from "../utils/projectCleanup";

const ProjectDetail = () => {

  const { projectId } =
    useParams();

  const { user } =
    useAuth();

  const navigate =
    useNavigate();

  const [project, setProject] =
    useState(null);

  const [chapters, setChapters] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("read");

  const [
    showRequestModal,
    setShowRequestModal
  ] = useState(false);

  const [
    showReportModal,
    setShowReportModal
  ] = useState(false);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm
  ] = useState(false);

  const [isLiked, setIsLiked] =
    useState(false);

  const [
    isFollowed,
    setIsFollowed
  ] = useState(false);

  const [
    userRequest,
    setUserRequest
  ] = useState(null);

  const [
    isCollaborator,
    setIsCollaborator
  ] = useState(false);

  const [
    isTeamMember,
    setIsTeamMember
  ] = useState(false);

  const [
    teamMembers,
    setTeamMembers
  ] = useState([]);

  /*
  =========================
  LOAD PROJECT
  =========================
  */

  useEffect(() => {

    loadData();

  }, [
    projectId,
    user?.id
  ]);

  /*
  =========================
  LOAD INTERACTIONS
  =========================
  */

  useEffect(() => {

    const loadInteractions =
      async () => {

        if (!user?.id)
          return;

        try {

          const response =
            await apiClient.projects
              .getInteractions(
                projectId
              );

          setIsLiked(
            response.data.liked
          );

          setIsFollowed(
            response.data.followed
          );

        } catch (error) {

          console.error(error);
        }
      };

    loadInteractions();

  }, [
    user?.id,
    projectId
  ]);

  /*
  =========================
  HANDLE LIKE
  =========================
  */

  const handleLike =
    async () => {

      if (!user?.id) {

        alert(
          "Please login first"
        );

        return;
      }

      try {

        const response =
          await apiClient.projects
            .like(project.id);

        setIsLiked(
          response.data.liked
        );

        setProject(
          (prev) => ({
            ...prev,
            likes:
              response.data.likes,
          })
        );

      } catch (error) {

        console.error(
          "Error updating likes:",
          error
        );
      }
    };

  /*
  =========================
  HANDLE FOLLOW
  =========================
  */

  const handleFollow =
    async () => {

      if (!user?.id) {

        alert(
          "Please login first"
        );

        return;
      }

      try {

        const response =
          await apiClient.projects
            .follow(project.id);

        setIsFollowed(
          response.data.followed
        );

      } catch (error) {

        console.error(error);
      }
    };

  /*
  =========================
  LOAD DATA
  =========================
  */

  const loadData =
    async () => {

      setLoading(true);

      try {

        /*
        =========================
        PROJECT
        =========================
        */

        const projectResponse =
          await apiClient.projects
            .getById(projectId);

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

        /*
        =========================
        CHAPTERS
        =========================
        */

        const chaptersResponse =
          await apiClient.chapters
            .getByProject(projectId);

        const allChapters =
          chaptersResponse.data || [];

        let canSeeAllChapters =
          user?.id ===
          projectData?.initiator_id;

        if (
          user?.id &&
          !canSeeAllChapters &&
          projectData?.is_team_project &&
          projectData?.team_id
        ) {

          try {

            const teamResponse =
              await apiClient
                .teams
                .getById(
                  projectData.team_id
                );

            if (
              teamResponse.success &&
              teamResponse.data
            ) {

              canSeeAllChapters =
                teamResponse.data
                  ?.members?.some(
                    member =>
                      member.user_id === user?.id &&
                      member.status === "approved"
                  );

            }

          } catch (e) {

            console.error(e);

          }

        }

        const visibleChapters =
          canSeeAllChapters
            ? allChapters
            : allChapters.filter(
              chapter =>
                chapter.status === "published"
            );

        setChapters(
          visibleChapters
        );

        /*
        =========================
        COLLABORATORS
        =========================
        */

        const isDirectCollaborator =
          projectData.collaborators
            ?.some(
              (c) =>
                c.user_id ===
                  user?.id &&
                c.status ===
                  "approved"
            );

        const isInitiator =
          projectData.initiator_id ===
          user?.id;

                  /*
          =========================
          TEAM MEMBERS
          =========================
          */

        let userIsTeamMember =
          false;

        if (
          user?.id &&
          projectData.is_team_project &&
          projectData.team_id
        ) {

          try {

            const teamResponse =
              await apiClient.teams
                .getById(
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
                    member.user_id ===
                    user?.id &&
                    member.status ===
                    "approved"
                );

              setTeamMembers(
                team.members?.filter(
                  (member) =>
                    member.status ===
                    "approved"
                ) || []
              );

            }

          } catch (error) {

            console.error(
              "Team loading failed:",
              error
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

      } catch (error) {

        console.error(
          "Error loading project:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  /*
  =========================
  REQUEST SUBMIT
  =========================
  */

  const handleRequestSubmit =
    async (role) => {

      try {

        const response =
          await apiClient
            .collaboration
            .createRequest({

              project_id:
                parseInt(projectId),

              user_id:
                user.id,

              requested_role:
                role,
            });

        if (response.success) {

          setShowRequestModal(
            false
          );

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

  /*
  =========================
  REPORT
  =========================
  */

  const handleReportSubmit =
    async (data) => {

      try {

        const response =
          await apiClient
            .reports
            .create({

              project_id:
                project.id,

              reason:
                data.reason,

              note:
                data.note,
            });

        if (response.success) {

          alert(
            "Report submitted successfully"
          );

          setShowReportModal(
            false
          );
        }

      } catch (error) {

        console.error(
          "Error submitting report:",
          error
        );

        alert(
          error.message ||
          "Failed to submit report"
        );
      }
    };

  /*
  =========================
  DELETE PROJECT
  =========================
  */

  const handleDeleteProject =
    async () => {

      try {

        if (project.background_image) {

          await deleteStorageFile(
            project.background_image
          );

        }

        await cleanupProjectImages(
          project.id
        );

        const response =
          await apiClient
            .projects
            .delete(
              project.id
            );

        if (
          response.success
        ) {

          alert(
            "Project deleted successfully"
          );

          navigate(
            "/dashboard"
          );

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

  /*
  =========================
  LOADING
  =========================
  */

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

  /*
  =========================
  COMPUTED
  =========================
  */

  const approvedCollaborators =
    project.collaborators?.filter(
      (c) =>
        c.status === "approved"
    ) || [];

  const isInitiator =
    project.initiator_id ===
    user?.id;

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

      <div className="relative w-full min-h-[400px] overflow-hidden">

        <img
          src={
            project.background_image ||
            "/default-cover.jpg"
          }
          alt="project cover"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col justify-between min-h-[400px] p-8">

          {/* TOP */}

          <div className="flex items-start justify-between">

            <div className="flex gap-2 flex-wrap">

              {project.category_id && <BadgeCategories categoryId={project.category_id} size="md" />}

              {project.genre_id && <BadgeGenre genreId={project.genre_id} size="md" />}

            </div>

            {user && !isInitiator && (
              <button
                onClick={() =>
                  setShowReportModal(true)
                }
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-red-200"
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

              <button
                onClick={handleFollow}
                className="flex items-center gap-2"
              >

                <FiStar
                  className={
                    isFollowed
                      ? "fill-yellow-500 text-yellow-500"
                      : ""
                  }
                />

                <span>
                  {isFollowed
                    ? "Followed"
                    : "Follow"}
                </span>

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

                      <div className="w-9 h-9 overflow-hidden rounded-full bg-gray-300 dark:bg-slate-700 flex items-center justify-center shrink-0">

                        {member.profile_image ? (

                          <img
                            src={member.profile_image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <span className="text-xs font-bold text-white">
                            {member.name?.charAt(0)?.toUpperCase()}
                          </span>

                        )}

                      </div>

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
            ${
              isCollaborative
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
                project={project}
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