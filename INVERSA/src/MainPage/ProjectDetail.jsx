import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import {
  FiFlag, FiTrash2, FiHeart, FiEye, FiBook,
  FiEdit2, FiArrowLeft, FiUsers,
} from "react-icons/fi";
import Button from "../components/Button";
import CollaborationRequestModal from "../components/CollaborationRequestModal";
import ReportsModal from "../components/ReportsModal";
import ChapterList from "../components/ChapterList";
import BadgeGenre from "../components/BadgeGenre";
import BadgeCategories from "../components/BadgeCategories";
import { deleteStorageFile } from "../utils/storage";
import { cleanupProjectImages } from "../utils/projectCleanup";
import { supabase } from "../lib/supabase";
import { validateImage } from "../utils/imageValidation";
import { showError, showSuccess } from "../utils/toast";

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
  const [isFollowed, setIsFollowed] = useState(false);
  const [userRequest, setUserRequest] = useState(null);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBackground, setEditBackground] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => { loadData(); }, [projectId, user?.id]);

  useEffect(() => {
    const loadInteractions = async () => {
      if (!user?.id) return;
      try {
        const { data } = await apiClient.projects.getInteractions(projectId);
        setIsLiked(data.liked);
        setIsFollowed(data.followed);
      } catch (error) { console.error(error); }
    };
    loadInteractions();
  }, [user?.id, projectId]);

  const handleLike = async () => {
    if (!user?.id) { showError("Please login first"); return; }
    try {
      const { data } = await apiClient.projects.like(project.id);
      setIsLiked(data.liked);
      setProject((prev) => ({ ...prev, likes: data.likes }));
    } catch (error) { console.error("Error updating likes:", error); }
  };

  const handleFollow = async () => {
    if (!user?.id) { showError("Please login first"); return; }
    try {
      const { data } = await apiClient.projects.follow(project.id);
      setIsFollowed(data.followed);
    } catch (error) { console.error(error); }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const projectResponse = await apiClient.projects.getById(projectId);
      if (!projectResponse.success || !projectResponse.data) { setLoading(false); return; }
      const projectData = projectResponse.data;
      setProject(projectData);

      const { data: chaptersData } = await apiClient.chapters.getByProject(projectId);
      const allChapters = chaptersData || [];
      let canSeeAllChapters = user?.id === projectData?.initiator_id;

      if (user?.id && !canSeeAllChapters && projectData?.is_team_project && projectData?.team_id) {
        try {
          const { data: teamData } = await apiClient.teams.getById(projectData.team_id);
          if (teamData) {
            canSeeAllChapters = teamData.members?.some(
              (m) => m.user_id === user?.id && m.status === "approved"
            );
          }
        } catch (e) { console.error(e); }
      }

      setChapters(
        canSeeAllChapters
          ? allChapters
          : allChapters.filter((ch) => ch.status === "published")
      );

      const isDirectCollaborator = projectData.collaborators?.some(
        (c) => c.user_id === user?.id && c.status === "approved"
      );
      const isInitiator = projectData.initiator_id === user?.id;
      let userIsTeamMember = false;

      if (user?.id && projectData.is_team_project && projectData.team_id) {
        try {
          const { data: team } = await apiClient.teams.getById(projectData.team_id);
          if (team) {
            userIsTeamMember = team.members?.some(
              (m) => m.user_id === user?.id && m.status === "approved"
            );
            setTeamMembers(team.members?.filter((m) => m.status === "approved") || []);
          }
        } catch (error) { console.error("Team loading failed:", error); }
      }
      setIsTeamMember(userIsTeamMember);
      setIsCollaborator(isDirectCollaborator || userIsTeamMember || isInitiator);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally { setLoading(false); }
  };

  const handleRequestSubmit = async (role) => {
    try {
      const { success } = await apiClient.collaboration.createRequest({
        project_id: parseInt(projectId), user_id: user.id, requested_role: role,
      });
      if (success) { setShowRequestModal(false); await loadData(); }
    } catch (error) {
      console.error("Error submitting request:", error);
      showError("Failed to submit request");
    }
  };

  const handleReportSubmit = async (data) => {
    try {
      const { success } = await apiClient.reports.create({
        project_id: project.id, reason: data.reason, note: data.note,
      });
      if (success) { showSuccess("Report submitted successfully"); setShowReportModal(false); }
    } catch (error) {
      console.error("Error submitting report:", error);
      showError(error.message || "Failed to submit report");
    }
  };

  const handleDeleteProject = async () => {
    try {
      if (project.background_image) await deleteStorageFile(project.background_image);
      await cleanupProjectImages(project.id);
      const { success } = await apiClient.projects.delete(project.id);
      if (success) { showSuccess("Project deleted successfully"); navigate("/dashboard"); }
    } catch (error) {
      console.error("Error deleting project:", error);
      showError("Failed to delete project");
    }
  };

  const handleOpenEdit = () => {
    setEditTitle(project.title || "");
    setEditDescription(project.description || "");
    setEditBackground(project.background_image || "");
    setImagePreview(project.background_image || "");
    setShowEditModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) { showError(validation.message); return; }
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("images").upload(fileName, file);
      if (error) { console.error(error); showError("Upload failed"); return; }
      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      setEditBackground(data.publicUrl);
      setImagePreview(data.publicUrl);
    } catch (error) { console.error(error); showError("Upload failed"); }
  };

  const handleSaveProject = async () => {
    try {
      if (project.background_image && editBackground !== project.background_image) {
        await deleteStorageFile(project.background_image);
      }
      await apiClient.projects.update(project.id, {
        title: editTitle, description: editDescription, background_image: editBackground,
      });
      await loadData();
      setShowEditModal(false);
    } catch (error) { console.error(error); }
  };

  // ---------- RENDER ----------
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
      <p className="text-light-secondary dark:text-dark-secondary">Loading...</p>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
      <div className="text-center">
        <p className="text-light-secondary dark:text-dark-secondary mb-4">Project not found</p>
        <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl bg-light-accent dark:bg-dark-accent text-white font-medium hover:opacity-90">Back</button>
      </div>
    </div>
  );

  const approvedCollaborators = project.collaborators?.filter(c => c.status === "approved") || [];
  const isInitiator = project.initiator_id === user?.id;
  const canEdit = isInitiator || isCollaborator || isTeamMember;
  const isCollaborative = approvedCollaborators.length > 0 || (project.is_team_project && teamMembers.length > 0);
  const hasBackground = project.background_image && project.background_image.trim() !== '';

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 sm:mb-8 text-light-accent dark:text-dark-accent hover:opacity-80 transition-all font-medium">
          <FiArrowLeft className="w-5 h-5" /> Back
        </button>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-light-border dark:border-dark-border bg-gradient-to-br from-light-surface via-light-background to-light-surface dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 md:mb-12">
          {hasBackground && (
            <div className="absolute inset-0">
              <img src={project.background_image} alt={project.title} className="w-full h-full object-cover object-top opacity-30 dark:opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/15 to-white/15 dark:from-black/20 dark:via-slate-950/70 dark:to-slate-950/95" />
            </div>
          )}

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
              <div className="flex-1">
                <div className="flex gap-2 flex-wrap mb-5">
                  {project.category_id && <BadgeCategories categoryId={project.category_id} size="md" />}
                  {project.genre_id && <BadgeGenre genreId={project.genre_id} size="md" />}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-light-primary dark:text-dark-primary mb-4">{project.title}</h1>
                <p className="max-w-3xl text-sm sm:text-base text-light-secondary dark:text-dark-secondary leading-relaxed">{project.description}</p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                {user && !isInitiator && (
                  <button onClick={() => setShowReportModal(true)} className="flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-red-500 transition-all" title="Report project">
                    <FiFlag className="w-5 h-5" />
                  </button>
                )}
                {isInitiator && (
                  <>
                    <button onClick={handleOpenEdit} className="flex items-center justify-center rounded-xl bg-blue-500/10 hover:bg-blue-500/20 px-4 py-3 text-blue-500 transition-all" title="Edit project">
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-red-500 transition-all" title="Delete project">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                {user && !isInitiator && (
                  <>
                    <button onClick={handleFollow} className={`rounded-xl px-5 py-3 text-sm font-medium transition-all whitespace-nowrap ${isFollowed ? 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-dark-background dark:bg-dark-surface text-white hover:opacity-90'}`}>
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                    <button onClick={handleLike} className={`rounded-xl px-5 py-3 text-sm font-medium transition-all flex items-center gap-2 ${isLiked ? 'bg-red-500/20 text-red-500 dark:bg-red-500/20 dark:text-red-400' : 'bg-dark-background dark:bg-dark-surface text-white hover:opacity-90'}`}>
                      <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {project.likes || 0}
                    </button>
                  </>
                )}
                
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8 text-sm text-light-secondary dark:text-dark-secondary pt-6 sm:pt-8 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center gap-2"><FiBook className="w-4 h-4" /><span className="font-medium">{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</span></div>
              <div className="flex items-center gap-2"><FiEye className="w-4 h-4" /><span className="font-medium">{project.views || 0} views</span></div>
              <div className="flex items-center gap-2"><FiHeart className="w-4 h-4" /><span className="font-medium">{project.likes || 0} likes</span></div>
              {project.initiator_name && (
                <div className="flex items-center gap-2"><FiUsers className="w-4 h-4" /><span className="font-medium">by {project.initiator_name}</span></div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {isCollaborative && (
            <div className="lg:col-span-3 bg-light-surface dark:bg-dark-surface p-4 rounded-lg">
              <h2 className="font-semibold mb-4">Members</h2>
              {project.is_team_project
                ? teamMembers.map(member => (
                    <div key={member.user_id} className="flex gap-2 mb-3">
                      <div className="w-9 h-9 overflow-hidden rounded-full bg-gray-300 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        {member.profile_image ? <img src={member.profile_image} alt={member.name} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-white">{member.name?.charAt(0)?.toUpperCase()}</span>}
                      </div>
                      <div><p className="text-sm">{member.name}</p><p className="text-xs text-gray-500">{member.role}</p></div>
                    </div>
                  ))
                : approvedCollaborators.map(collab => (
                    <div key={collab.user_id} className="flex gap-2 mb-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full" />
                      <div><p className="text-sm">{collab.name}</p><p className="text-xs text-gray-500">{collab.role}</p></div>
                    </div>
                  ))
              }
            </div>
          )}

          <div className={`${isCollaborative ? "lg:col-span-9" : "lg:col-span-12"}`}>
            <div className="bg-light-surface dark:bg-dark-surface rounded-lg p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold">Chapters</h2>
                  <p className="text-sm text-gray-500 mt-1">{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</p>
                </div>
                {canEdit && (
                  <Button onClick={() => navigate(`/editor/${projectId}`)} className="flex items-center gap-2">
                    <FiEdit2 /> Manage Chapters
                  </Button>
                )}
              </div>
              <ChapterList
                chapters={chapters} currentChapterId={null}
                onSelectChapter={(chapterId) => navigate(`/read/${projectId}/${chapterId}`)}
                onChaptersChange={loadData} projectId={projectId} project={project}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <CollaborationRequestModal projectTitle={project.title} onSubmit={handleRequestSubmit} onClose={() => setShowRequestModal(false)} />
      )}
      {showReportModal && (
        <ReportsModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e293b] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Project?</h2>
            <p className="mb-6">Are you sure you want to delete this project?</p>
            <div className="flex gap-3">
              <Button onClick={() => setShowDeleteConfirm(false)} className="bg-gray-400">Cancel</Button>
              <Button onClick={() => { handleDeleteProject(); setShowDeleteConfirm(false); }} className="bg-red-500 hover:bg-red-600 text-white">Delete</Button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-background rounded-xl p-6 w-full max-w-xl">
            <h2 className="text-xl font-bold mb-5">Edit Project</h2>

            <div className="mb-4">
              <label className="block text-sm mb-2">Title</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2">Description</label>
              <textarea rows={5} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Background Image</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-light-accent/30 dark:border-dark-accent/30 rounded-xl cursor-pointer hover:border-light-accent dark:hover:border-dark-accent transition-colors bg-light-accent/5 dark:bg-dark-accent/5">
                <div className="flex flex-col items-center justify-center text-sm text-light-secondary dark:text-dark-secondary">
                  <span className="font-medium">Click to upload</span>
                  <span className="text-xs mt-1">PNG, JPG up to 2MB</span>
                </div>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {imagePreview && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Preview</label>
                <div className="w-full h-48 rounded-xl bg-cover bg-center border border-gray-300 dark:border-slate-700" style={{ backgroundImage: `url(${imagePreview})` }} />
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => setShowEditModal(false)} className="bg-gray-400">Cancel</Button>
              <Button onClick={handleSaveProject}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;