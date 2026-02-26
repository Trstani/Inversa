import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjectById, loadChapters, saveCollaborationRequest, loadCollaborationRequests } from '../utils/dataManager';
import { findUserById } from '../utils/userManager';
import { FiArrowLeft, FiUsers, FiBook, FiHeart, FiCheck, FiClock } from 'react-icons/fi';
import Button from '../components/Button';
import CollaborationRequestModal from '../components/CollaborationRequestModal';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
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

      // Check if user is collaborator
      const isCollab = projectData.collaborators?.some(c => c.userId === user?.id && c.status === 'approved');
      setIsCollaborator(isCollab);

      // Check if user has pending request
      const requests = await loadCollaborationRequests();
      const userReq = requests.find(r => r.projectId === projectData.id && r.userId === user?.id);
      setUserRequest(userReq);
    }
    setLoading(false);
  };

  const handleRequestSubmit = async (role) => {
    const request = {
      projectId: parseInt(projectId),
      userId: user.id,
      userName: user.name,
      requestedRole: role,
    };

    await saveCollaborationRequest(request);
    setShowRequestModal(false);
    await loadData();
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-light-background dark:bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-light-secondary dark:text-dark-secondary mb-4">Project not found</p>
          <Button onClick={() => navigate('/explore')}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  const initiator = findUserById(project.initiatorId);
  const approvedCollaborators = project.collaborators?.filter(c => c.status === 'approved') || [];
  const isInitiator = project.initiatorId === user?.id;

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-light-accent dark:text-dark-accent hover:opacity-80 mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Project Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                {project.title}
              </h1>
              <p className="text-light-secondary dark:text-dark-secondary">
                by <span className="font-semibold">{initiator?.name || 'Unknown'}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary">
              <FiHeart className="w-5 h-5" />
              <span className="font-semibold">{project.likes || 0}</span>
            </div>
          </div>

          <p className="text-light-secondary dark:text-dark-secondary mb-6">
            {project.description}
          </p>

          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg">
              <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-2">
                <FiBook className="w-4 h-4" />
                <span className="text-sm">Chapters</span>
              </div>
              <p className="text-2xl font-bold">{chapters.length}</p>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg">
              <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-2">
                <FiUsers className="w-4 h-4" />
                <span className="text-sm">Collaborators</span>
              </div>
              <p className="text-2xl font-bold">{approvedCollaborators.length}</p>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-lg">
              <div className="flex items-center gap-2 text-light-secondary dark:text-dark-secondary mb-2">
                <span className="text-sm">Status</span>
              </div>
              <p className="text-2xl font-bold capitalize">{project.status}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isInitiator && (
              <>
                <Button onClick={() => navigate(`/editor/${project.id}`)}>
                  Go to Editor
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/project/${project.id}/edit`)}
                >
                  Edit Project
                </Button>
              </>
            )}

            {isCollaborator && !isInitiator && (
              <Button onClick={() => navigate(`/editor/${project.id}`)}>
                Go to Editor
              </Button>
            )}

            {!isCollaborator && !isInitiator && (
              <>
                {userRequest?.status === 'pending' ? (
                  <Button disabled className="bg-gray-400">
                    <FiClock className="mr-2" /> Request Pending
                  </Button>
                ) : (
                  <Button onClick={() => setShowRequestModal(true)}>
                    Request to Join
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chapters Section */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiBook /> Chapters ({chapters.length})
          </h2>

          {chapters.length === 0 ? (
            <p className="text-light-secondary dark:text-dark-secondary">
              No chapters yet. {isInitiator && 'Create your first chapter!'}
            </p>
          ) : (
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="p-4 bg-light-surface dark:bg-dark-surface rounded-lg hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Chapter {chapter.chapterNumber}: {chapter.title}</p>
                      <p className="text-sm text-light-secondary dark:text-dark-secondary">
                        {chapter.status === 'published' ? (
                          <span className="flex items-center gap-1">
                            <FiCheck className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span>Draft</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* Read Button - for published chapters */}
                      {chapter.status === 'published' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/read/${project.id}/${chapter.id}`)}
                        >
                          Read
                        </Button>
                      )}
                      
                      {/* Edit Button - for initiator and collaborator */}
                      {(isCollaborator || isInitiator) && (
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/editor/${project.id}/${chapter.id}`)}
                        >
                          {isInitiator ? 'Edit' : 'Edit'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collaborators Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiUsers /> Collaborators ({approvedCollaborators.length})
          </h2>

          {approvedCollaborators.length === 0 ? (
            <p className="text-light-secondary dark:text-dark-secondary">
              No collaborators yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedCollaborators.map((collab) => {
                const collabUser = findUserById(collab.userId);
                return (
                  <div key={collab.userId} className="p-4 bg-light-surface dark:bg-dark-surface rounded-lg">
                    <p className="font-semibold">{collabUser?.name || 'Unknown'}</p>
                    <p className="text-sm text-light-secondary dark:text-dark-secondary capitalize">
                      {collab.role}
                    </p>
                    {collab.assignedChapters?.length > 0 && (
                      <p className="text-xs text-light-secondary dark:text-dark-secondary mt-2">
                        Assigned to {collab.assignedChapters.length} chapter(s)
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Request Modal */}
      {showRequestModal && (
        <CollaborationRequestModal
          projectTitle={project.title}
          onSubmit={handleRequestSubmit}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
