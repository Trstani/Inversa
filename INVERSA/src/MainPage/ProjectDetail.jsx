import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getProjectById,
  loadChapters,
  saveCollaborationRequest,
  loadCollaborationRequests,
  reportProject
} from "../utils/dataManager/index";

import { findUserById } from "../utils/userManager/index";

import {
  FiFlag,
  FiClock
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

  const [userRequest, setUserRequest] = useState(null);
  const [isCollaborator, setIsCollaborator] = useState(false);

  useEffect(() => {
    loadData();
  }, [projectId, user?.id]);

  const loadData = async () => {
    setLoading(true);

    const projectData = await getProjectById(projectId);
    setProject(projectData);

    if (projectData) {
      const chaptersData = await loadChapters(projectData.id);
      setChapters(chaptersData);

      const isCollab = projectData.collaborators?.some(
        (c) => c.userId === user?.id && c.status === "approved"
      );

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
  const canEdit = isInitiator || isCollaborator;
  const isCollaborative = approvedCollaborators.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-200">

      {/* ================= HEADER ================= */}
      <div
        className="w-full h-[260px] relative"
        style={{
          backgroundImage: `url(${project.backgroundImage || "/default-cover.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative h-full flex justify-between p-8 text-white">

          {/* LEFT */}
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold">{project.title}</h1>

            <div className="w-20 h-[2px] bg-white/70 my-2"></div>

            <p className="text-sm text-gray-200">
              {project.description}
            </p>
          </div>

          {/* RIGHT */}
          <div className="text-right space-y-2">
            <p className="text-sm">{project.genre}</p>
            <p className="text-sm">{project.category}</p>

            <p className="text-xs text-gray-300">
              by {initiator?.name || "Unknown"}
            </p>

            {!isInitiator && (
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs text-red-300 hover:text-red-400 flex items-center gap-1 justify-end"
              >
                <FiFlag /> Report
              </button>
            )}
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

              {approvedCollaborators.map((c) => {
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
              })}

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

              {!isInitiator && !isCollaborator && isCollaborative && (
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

    </div>
  );
};

export default ProjectDetail;