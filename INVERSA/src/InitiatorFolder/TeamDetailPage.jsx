import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiUsers, FiFolder, FiTrash2, FiPlus } from 'react-icons/fi';
import { apiClient } from '../api/client';
import DashboardProjectCard from '../components/DashboardProjectCard';
import CreateTeamProjectModal from './components/CreateTeamProjectModal';
import TeamJoinRequestModal from './components/TeamJoinRequestModal';

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => { loadTeamData(); }, [teamId]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const teamData = (await apiClient.teams.getById(teamId)).data;
      setTeam(teamData);
      const projRes = await apiClient.teams.getProjects(teamId);
      setProjects(projRes.data || []);
      const reqRes = await apiClient.teams.getRequests(teamId);
      setRequests(reqRes.data || []);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Delete this team permanently?')) return;
    try {
      await apiClient.teams.delete(teamId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await apiClient.projects.delete(projectId);
      await loadTeamData();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-light-background dark:bg-dark-background">
      <p className="text-light-secondary dark:text-dark-secondary">Loading team...</p>
    </div>
  );

  if (!team) return (
    <div className="flex items-center justify-center min-h-screen bg-light-background dark:bg-dark-background">
      <div className="text-center">
        <p className="text-light-secondary dark:text-dark-secondary mb-4">Team not found</p>
        <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl bg-light-accent dark:bg-dark-accent text-white font-medium hover:opacity-90 transition-all">Back</button>
      </div>
    </div>
  );

  const isOwner = team.initiator_id === user?.id;
  const isMember = team.members?.some(m => m.user_id === user?.id);
  const hasPendingRequest = requests.some(r => r.user_id === user?.id && r.status === 'pending');
  const memberCount = team.members?.length || 0;
  const hasBackground = team.background_image && team.background_image.trim() !== '';

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 mb-6 sm:mb-8 text-light-accent dark:text-dark-accent hover:opacity-80 transition-all font-medium"
        >
          <FiArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-light-border dark:border-dark-border bg-gradient-to-br from-light-surface via-light-background to-light-surface dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 md:mb-12">
          {hasBackground && (
            <div className="absolute inset-0">
              <img src={team.background_image} alt={team.title} className="w-full h-full object-cover opacity-[0.08] dark:opacity-[0.10]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white/95 dark:from-black/20 dark:via-slate-950/70 dark:to-slate-950/95" />
            </div>
          )}
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-light-accent/10 dark:bg-dark-accent/10 px-4 py-2 text-sm font-medium text-light-accent dark:text-dark-accent mb-5">
                  <FiUsers className="w-4 h-4" /> Team Workspace
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-light-primary dark:text-dark-primary mb-4">
                  {team.title}
                </h1>
                <p className="max-w-3xl text-sm sm:text-base text-light-secondary dark:text-dark-secondary leading-relaxed">
                  {team.description}
                </p>
              </div>
              
              <div className="flex gap-3 flex-shrink-0">
                {!isOwner && !isMember && (
                  <button 
                    onClick={() => setShowJoinModal(true)} 
                    disabled={hasPendingRequest}
                    className="rounded-xl bg-light-accent dark:bg-dark-accent px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {hasPendingRequest ? 'Request Pending' : 'Join Team'}
                  </button>
                )}
                {isOwner && (
                  <button 
                    onClick={handleDeleteTeam} 
                    className="flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-red-500 transition-all"
                    title="Delete team"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8 text-sm text-light-secondary dark:text-dark-secondary pt-6 sm:pt-8 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" /> 
                <span className="font-medium">{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFolder className="w-4 h-4" /> 
                <span className="font-medium">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
          
          {/* MEMBERS SECTION */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary mb-6">Team Members</h2>
              <div className="space-y-2">
                {team.members?.map(member => (
                  <Link key={member.user_id} to={`/profile/${member.user_id}`} className="block transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-center justify-between rounded-xl bg-light-background dark:bg-dark-background p-4 hover:bg-light-accent/5 dark:hover:bg-dark-accent/5 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 overflow-hidden rounded-full bg-light-accent/10 dark:bg-dark-accent/10 flex items-center justify-center shrink-0">
                          {member.profile_image ? (
                            <img src={member.profile_image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-light-accent dark:text-dark-accent">{member.name?.charAt(0)?.toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-light-primary dark:text-dark-primary truncate">{member.name}</p>
                          <p className="text-xs sm:text-sm capitalize text-light-secondary dark:text-dark-secondary">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* PROJECTS SECTION */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">Team Projects</h2>
                {isMember && (
                  <button 
                    onClick={() => setShowCreateProjectModal(true)} 
                    className="flex items-center gap-2 rounded-xl bg-light-accent dark:bg-dark-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-all whitespace-nowrap"
                  >
                    <FiPlus className="w-4 h-4" /> New Project
                  </button>
                )}
              </div>
              
              {projects.length === 0 ? (
                <div className="py-12 sm:py-16 text-center">
                  <FiFolder className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 text-light-secondary dark:text-dark-secondary opacity-40" />
                  <p className="text-light-secondary dark:text-dark-secondary">No projects yet.</p>
                  <p className="mt-2 text-sm text-light-secondary dark:text-dark-secondary opacity-75">Create your first team project to get started</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                  {projects.map(project => (
                    <DashboardProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showJoinModal && (
        <TeamJoinRequestModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          team={team}
          onSubmit={async (data) => {
            await apiClient.teams.createRequest({ team_id: parseInt(teamId), role: data.role, reason: data.reason });
            await loadTeamData();
            setShowJoinModal(false);
          }}
        />
      )}

      {showCreateProjectModal && (
        <CreateTeamProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
          onSuccess={() => { setShowCreateProjectModal(false); loadTeamData(); }}
          teamId={teamId}
        />
      )}
    </div>
  );
};

export default TeamDetailPage;