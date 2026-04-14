import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiUsers, FiFolder, FiUserPlus, FiTrash2, FiPlus, FiCheckSquare, FiX } from 'react-icons/fi';
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
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

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

        // Load tasks for this team
        const storedTasks = JSON.parse(localStorage.getItem(`team_tasks_${teamId}`) || '[]');
        setTasks(storedTasks);
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

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      assignedTo: newTaskAssignee || user?.id,
      createdBy: user?.id,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem(`team_tasks_${teamId}`, JSON.stringify(updatedTasks));
    setNewTaskText('');
    setNewTaskAssignee('');
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem(`team_tasks_${teamId}`, JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`team_tasks_${teamId}`, JSON.stringify(updatedTasks));
  };

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

        {/* Task Manager - Outside main grid */}
        <div className="mt-6">
          <div className="card p-4 sm:p-6 bg-light-surface dark:bg-dark-surface">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-light-primary dark:text-dark-primary mb-4">Task Manager</h2>

              {/* Add Task Form */}
              <div className="mb-6 p-4 sm:p-6 bg-light-background dark:bg-dark-background rounded-lg">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="w-full px-3 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-primary dark:text-dark-primary placeholder-light-secondary dark:placeholder-dark-secondary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
                  />
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded text-light-primary dark:text-dark-primary focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent text-sm"
                  >
                    <option value="">Assign to...</option>
                    {team?.collaborators?.map(collaborator => {
                      const memberUser = findUserById(collaborator.userId);
                      const isCurrentUser = collaborator.userId === user?.id;
                      return (
                        <option key={collaborator.userId} value={collaborator.userId}>
                          {isCurrentUser ? 'Me' : memberUser?.name || `User ${collaborator.userId}`}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    onClick={handleAddTask}
                    className="w-full px-3 py-2 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 transition font-medium text-sm"
                  >
                    <FiPlus className="inline mr-2 w-4 h-4" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-light-secondary dark:text-dark-secondary">
                    No tasks yet. Create one to get started!
                  </div>
                ) : (
                  tasks.map(task => {
                    const taskAssignee = findUserById(task.assignedTo);
                    const taskCreator = findUserById(task.createdBy);
                    const isCurrentUserAssignee = task.assignedTo === user?.id;

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border ${
                          task.completed
                            ? 'bg-light-surface/50 dark:bg-dark-surface/50 opacity-60 border-light-border/50 dark:border-dark-border/50'
                            : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-1 text-light-accent dark:text-dark-accent hover:opacity-80 transition flex-shrink-0"
                          >
                            <FiCheckSquare className={`w-5 h-5 ${task.completed ? 'fill-current' : ''}`} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${task.completed ? 'line-through text-light-secondary dark:text-dark-secondary' : 'text-light-primary dark:text-dark-primary'}`}>
                              {task.text}
                            </p>
                            <p className="text-xs text-light-secondary dark:text-dark-secondary mt-2">
                              {isCurrentUserAssignee ? 'Assigned to you' : `Assigned to ${taskAssignee?.name || 'Unknown'}`}
                              {' • '}
                              {`by ${taskCreator?.name || 'Unknown'}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition flex-shrink-0"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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
