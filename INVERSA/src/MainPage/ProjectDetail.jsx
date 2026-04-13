import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getProjectById,
  loadChapters,
  saveCollaborationRequest,
  loadCollaborationRequests,
  reportProject,
  deleteProject,
  incrementLikes,
  decrementLikes
} from "../utils/dataManager/index";

import { findUserById } from "../utils/userManager/index";

import {
  FiFlag,
  FiClock,
  FiTrash2,
  FiHeart,
  FiEye
} from "react-icons/fi";

import Button from "../components/Button";
import CollaborationRequestModal from "../components/CollaborationRequestModal";
import ReportsModal from "../components/ReportsModal";

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

  // Check if user has liked this project
  useEffect(() => {
    if (user?.id && projectId) {
      const likedProjects = JSON.parse(localStorage.getItem(`liked_projects_${user.id}`) || '[]');
      setIsLiked(likedProjects.includes(parseInt(projectId)));
    }
  }, [user?.id, projectId]);

  const handleLike = async () => {
    if (!user?.id) {
      alert("Please log in to like projects");
      return;
    }

    const projectIdNum = parseInt(projectId);
    const likedProjects = JSON.parse(localStorage.getItem(`liked_projects_${user.id}`) || '[]');

    if (isLiked) {
      // Unlike
      const filtered = likedProjects.filter(id => id !== projectIdNum);
      localStorage.setItem(`liked_projects_${user.id}`, JSON.stringify(filtered));
      await decrementLikes(projectIdNum);
      setIsLiked(false);
    } else {
      // Like
      if (!likedProjects.includes(projectIdNum)) {
        likedProjects.push(projectIdNum);
      }
      localStorage.setItem(`liked_projects_${user.id}`, JSON.stringify(likedProjects));
      await incrementLikes(projectIdNum);
      setIsLiked(true);
    }

    // Reload project to get updated like count
    const updatedProject = await getProjectById(projectIdNum);
    setProject(updatedProject);
  };

  const loadData = async () => {
    setLoading(true);

    const projectData = await getProjectById(projectId);
    setProject(projectData);

    if (projectData) {
      const chaptersData = await loadChapters(projectData.id);
      setChapters(chaptersData);

      // Check if user is a direct collaborator on the project
      const isDirectCollab = projectData.collaborators?.some(
        (c) => c.userId === user?.id && c.status === "approved"
      );

      // Check if user is the initiator
      const isUserInitiator = projectData.initiatorId === user?.id;

      // For team projects, check if user is a team member
      let userIsTeamMember = false;
      if (projectData.isTeamProject && projectData.teamId) {
        const { getTeamById } = await import("../utils/dataManager/teamManager");
        const team = await getTeamById(projectData.teamId);
        userIsTeamMember = team?.collaborators?.some(
          c => c.userId === user?.id && c.status === 'approved'
        );
        // Set team members for display
        setTeamMembers(team?.collaborators?.filter(c => c.status === 'approved') || []);
      } else {
        // ✅ FALLBACK: Check if project belongs to any team that user is in
        const { loadTeams } = await import("../utils/dataManager/teamManager");
        const userTeams = await loadTeams(user?.id);
        
        for (const team of userTeams) {
          if (team.projects?.includes(parseInt(projectData.id))) {
            userIsTeamMember = true;
            setTeamMembers(team?.collaborators?.filter(c => c.status === 'approved') || []);
            break;
          }
        }
      }

      setIsTeamMember(userIsTeamMember);

      // User can collaborate if: direct collab OR team member OR initiator
      const isCollab = isDirectCollab || userIsTeamMember || isUserInitiator;
      setIsCollaborator(isCollab);

      const requests = await loadCollaborationRequests();

      const userReq = requests.find(
        (r) => r.projectId === projectData.id && r.userId === user?.id
      );

      setUserRequest(userReq);
    }

    setLoading(false);
  };

  const handleRequestSubmit = async (role) => {
    const request = {
      projectId: parseInt(projectId),
      userId: user.id,
      userName: user.name,
      requestedRole: role
    };

    await saveCollaborationRequest(request);
    setShowRequestModal(false);
    await loadData();
  };

  // ✅ REPORT FLOW TIDAK DIUBAH
  const handleReportSubmit = async (data) => {
    const reportData = {
      projectId: project.id,
      projectTitle: project.title,
      reportedBy: user?.id || "guest",
      reason: data.reason,
      note: data.note,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    await reportProject(reportData);
    alert("Report submitted. Thank you.");
    setShowReportModal(false);
  };

  // ✅ NEW: Delete project handler
  const handleDeleteProject = async () => {
    if (!project) return;

    try {
      await deleteProject(project.id);
      alert("Project deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
  }

  const initiator = findUserById(project.initiatorId);

  const approvedCollaborators =
    project.collaborators?.filter((c) => c.status === "approved") || [];

  const isInitiator = project.initiatorId === user?.id;
  // For team projects, team members have full edit access like initiators
  const canEdit = isInitiator || isCollaborator || isTeamMember;
  const isCollaborative = approvedCollaborators.length > 0 || (project.isTeamProject && isTeamMember);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-200">

      {/* ================= HEADER ================= */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          backgroundImage: `url(${project.backgroundImage || "/default-cover.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px"
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-8 md:p-12 text-white">
          
          {/* Top section - Genre and Category */}
          <div className="flex items-start justify-between">
            <div className="flex gap-2 flex-wrap">
              {project.category && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-white/30 transition">
                  {project.category}
                </span>
              )}
              {project.genre && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium hover:bg-white/30 transition">
                  {project.genre}
                </span>
              )}
            </div>
            
            {!isInitiator && (
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
                title="Report project"
              >
                <FiFlag className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Middle section - Title and Description */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                {project.title}
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
            </div>
            
            <p className="text-lg text-gray-100 max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Bottom section - Author and Stats */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Created by</p>
              <p className="text-xl font-semibold">{initiator?.name || "Unknown"}</p>
            </div>

            {/* Stats - Bottom Right */}
            <div className="flex gap-6">
              {/* Views */}
              <div className="flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                <div>
                  <p className="text-xs text-gray-300">Views</p>
                  <p className="text-lg font-bold">{project.views || 0}</p>
                </div>
              </div>

              {/* Likes */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                <div>
                  <p className="text-xs text-gray-300">Likes</p>
                  <p className="text-lg font-bold">{project.likes || 0}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto p-6">

        <div className="grid grid-cols-12 gap-6">

          {/* SIDEBAR */}
          {isCollaborative && (
            <div className="col-span-3 bg-gray-100 dark:bg-[#1e293b] p-4 rounded-lg">

              <h2 className="font-semibold mb-4">Members</h2>

              {/* For team projects, show only team members (no project collaborators) */}
              {project.isTeamProject ? (
                teamMembers.map((c) => {
                  const u = findUserById(c.userId);

                  return (
                    <div key={c.userId} className="flex gap-2 mb-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="text-sm">{u?.name}</p>
                        <p className="text-xs text-gray-500">{c.role}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* For solo projects, show project collaborators */
                approvedCollaborators.map((c) => {
                  const u = findUserById(c.userId);

                  return (
                    <div key={c.userId} className="flex gap-2 mb-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="text-sm">{u?.name}</p>
                        <p className="text-xs text-gray-500">{c.role}</p>
                      </div>
                    </div>
                  );
                })
              )}

            </div>
          )}

          {/* CONTENT */}
          <div className={isCollaborative ? "col-span-9" : "col-span-12"}>

            {/* ACTION */}
            <div className="mb-4 flex gap-3">

              {canEdit && (
                <Button onClick={() => navigate(`/editor/${project.id}`)}>
                  Go to Editor
                </Button>
              )}

              {/* Only show collaboration request for solo projects, not team projects */}
              {!isInitiator && !isCollaborator && !project.isTeamProject && isCollaborative && (
                <>
                  {userRequest?.status === "pending" ? (
                    <Button disabled className="bg-gray-400">
                      <FiClock className="mr-2" />
                      Pending
                    </Button>
                  ) : (
                    <Button onClick={() => setShowRequestModal(true)}>
                      Request to Join
                    </Button>
                  )}
                </>
              )}

              {/* ✅ NEW: Delete button for project creator */}
              {isInitiator && (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <FiTrash2 className="mr-2" />
                  Delete Project
                </Button>
              )}

            </div>

            {/* TABS */}
            <div className="flex gap-6 border-b mb-4 border-gray-300 dark:border-gray-700">

              <button
                onClick={() => setActiveTab("read")}
                className={`pb-2 ${
                  activeTab === "read"
                    ? "border-b-2 border-blue-500 font-semibold"
                    : "text-gray-400"
                }`}
              >
                Read Chapters
              </button>

              {canEdit && (
                <button
                  onClick={() => setActiveTab("create")}
                  className={`pb-2 ${
                    activeTab === "create"
                      ? "border-b-2 border-blue-500 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  Create Chapter
                </button>
              )}

            </div>

            {/* READ */}
            {activeTab === "read" && (
              <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-lg">

                {chapters.length === 0 ? (
                  <p>No chapters yet</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {chapters.map(ch => (
                      <div key={ch.id} className="bg-white dark:bg-[#334155] p-4 rounded">

                        <p className="font-semibold">
                          Chapter {ch.chapterNumber}
                        </p>

                        <p className="text-sm text-gray-500">
                          {ch.title}
                        </p>

                        <button
                          onClick={() =>
                            navigate(`/read/${project.id}/${ch.id}`)
                          }
                          className="text-blue-500 text-xs mt-2"
                        >
                          Read
                        </button>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* CREATE */}
            {activeTab === "create" && canEdit && (
              <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-lg">

                {chapters.map(ch => (
                  <div key={ch.id} className="flex justify-between mb-2">

                    <span>
                      Chapter {ch.chapterNumber} - {ch.title}
                    </span>

                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/editor/${project.id}/${ch.id}`)
                      }
                    >
                      Edit
                    </Button>

                  </div>
                ))}

                <Button
                  className="mt-4"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  Create New Chapter
                </Button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODALS */}
      {showRequestModal && (
        <CollaborationRequestModal
          projectTitle={project.title}
          onSubmit={handleRequestSubmit}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      {showReportModal && (
        <ReportsModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}

      {/* ✅ NEW: Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Delete Project?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{project?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleDeleteProject();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
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