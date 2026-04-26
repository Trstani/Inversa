import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiUsers, FiFolder, FiUserPlus, FiTrash2, FiPlus } from 'react-icons/fi';
import { getTeamById, getTeamProjects, removeTeamCollaborator, deleteTeam } from '../utils/dataManager/teamManager';
import { findUserById } from '../utils/userManager/index';
import CreateTeamProjectModal from './components/CreateTeamProjectModal';
import CardProject from '../components/CardProject';

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [team, setTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, [teamId]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const teamData = await getTeamById(teamId);
      setTeam(teamData);

      if (teamData) {
        const teamProjects = await getTeamProjects(teamId);
        setProjects(teamProjects);
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the team?')) {
      try {
        await removeTeamCollaborator(teamId, memberId);
        await loadTeamData();
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member');
      }
    }
  };

  const handleDeleteTeam = async () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await deleteTeam(teamId);
        navigate('/dashboard/teams');
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  const isTeamOwner = team?.initiatorId === user?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-light-secondary dark:text-dark-secondary">Loading team...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-light-secondary dark:text-dark-secondary mb-4">Team not found</p>
          <button
            onClick={() => navigate('/dashboard/teams')}
            className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/teams')}
          className="flex items-center gap-2 text-light-accent dark:text-dark-accent hover:opacity-80 mb-6"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Teams
        </button>

        {/* Team Header */}
        <div className="card p-4 sm:p-6 mb-6">
          {team.backgroundImage && (
            <div
              className="w-full h-48 rounded-lg mb-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${team.backgroundImage})` }}
            />
          )}

          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                {team.title}
              </h1>
              <p className="text-sm sm:text-base text-light-secondary dark:text-dark-secondary mb-4">
                {team.description}
              </p>
            </div>

            {isTeamOwner && (
              <button
                onClick={handleDeleteTeam}
                className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Team Members */}
          <div className="lg:col-span-1">
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-light-primary dark:text-dark-primary flex items-center gap-2">
                  <FiUsers className="w-5 h-5" />
                  Members
                </h2>
                {isTeamOwner && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="p-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
                  >
                    <FiUserPlus className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {/* Show all team members from collaborators list (includes owner) */}
                {team.collaborators?.map(collaborator => {
                  const memberUser = findUserById(collaborator.userId);
                  const isCurrentUser = collaborator.userId === user?.id;
                  const isOwner = collaborator.userId === team.initiatorId;

                  return (
                    <div
                      key={collaborator.userId}
                      className="p-3 bg-light-surface dark:bg-dark-surface rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-light-primary dark:text-dark-primary">
                          {isCurrentUser ? 'You' : memberUser?.name || `User ${collaborator.userId}`}
                        </p>
                        <p className="text-xs text-light-secondary dark:text-dark-secondary capitalize">
                          {isOwner ? 'Team Owner' : collaborator.role || 'Member'}
                        </p>
                      </div>

                      {isTeamOwner && !isOwner && (
                        <button
                          onClick={() => handleRemoveMember(collaborator.userId)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Team Projects */}
          <div className="lg:col-span-2">
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-light-primary dark:text-dark-primary flex items-center gap-2">
                  <FiFolder className="w-5 h-5" />
                  Projects ({projects.length})
                </h2>
                <button
                  onClick={() => setShowCreateProjectModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition text-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  New Project
                </button>
              </div>

              {projects.length === 0 ? (
                <p className="text-light-secondary dark:text-dark-secondary text-center py-8">
                  No projects yet. Create one to get started!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map(project => (
                    <CardProject key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <CreateTeamProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
          onSuccess={() => {
            setShowCreateProjectModal(false);
            loadTeamData();
          }}
          teamId={teamId}
        />
      )}

      {/* Invite Modal - Placeholder */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-4">
              Invite Members
            </h2>
            <p className="text-light-secondary dark:text-dark-secondary mb-4">
              Invite feature coming soon
            </p>
            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetailPage;
