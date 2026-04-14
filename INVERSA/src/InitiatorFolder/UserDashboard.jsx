import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import useUserDashboard from "./hooks/useUserDashboard";
import { FiBook, FiUsers } from "react-icons/fi";

import DashboardHeader from "./components/DashboardHeader";
import CreateProjectModal from "./components/CreateProjectModal";
import MyProjectsSection from "./sections/MyProjectsSection";
import MyTeamsSection from "./sections/MyTeamsSection";
import AvailableTeamsSection from "./sections/AvailableTeamsSection";
import CreateTeamModal from "./components/CreateTeamModal";

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'solo');
  const [activeTeamsSubTab, setActiveTeamsSubTab] = useState('teams-my');

  const {
    myProjects,
    teamProjects,
    myTeams,
    teamRequests,
    loading,
    createProject,
    removeProject,
    approveTeamRequest,
    rejectTeamRequest,
  } = useUserDashboard(user);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab.startsWith('teams')) {
      setSearchParams({ tab: 'teams' });
    } else {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, setSearchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-light-secondary dark:text-dark-secondary">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <DashboardHeader />

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-1 sm:gap-2 border-b border-light-accent/20 dark:border-dark-accent/20 overflow-x-auto">
          <button
            onClick={() => setActiveTab('solo')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'solo'
                ? 'text-light-accent dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent'
                : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
            }`}
          >
            <FiBook className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Solo Projects</span>
            <span className="sm:hidden">Solo</span> ({myProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'team'
                ? 'text-light-accent dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent'
                : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
            }`}
          >
            <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Team Projects</span>
            <span className="sm:hidden">Team</span> ({teamProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'teams'
                ? 'text-light-accent dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent'
                : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
            }`}
          >
            <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
            Teams
          </button>
        </div>

        {/* Solo Projects Tab */}
        {activeTab === 'solo' && (
          <div>
            {/* Create Project Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base"
              >
                + Create New Project
              </button>
            </div>

            {/* My Solo Projects */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-light-primary dark:text-dark-primary mb-4">
                My Solo Projects
              </h2>
              <MyProjectsSection
                projects={myProjects}
                onDelete={removeProject}
                onCreateNew={() => setShowCreateModal(true)}
              />
            </div>
          </div>
        )}

        {/* Team Projects Tab */}
        {activeTab === 'team' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-light-primary dark:text-dark-primary mb-4">
              Team Projects
            </h2>
            <MyProjectsSection
              projects={teamProjects}
              onDelete={removeProject}
              onCreateNew={() => setShowCreateModal(true)}
            />
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-light-primary dark:text-dark-primary mb-2">
                Teams
              </h2>
              <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">
                Join teams and collaborate on projects
              </p>
            </div>

            {/* Create Team Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base"
              >
                + Create New Team
              </button>
            </div>

            {/* Teams Sub-tabs */}
            <div className="mb-6 flex gap-2 sm:gap-4 border-b border-light-surface dark:border-dark-surface overflow-x-auto">
              <button
                onClick={() => setActiveTeamsSubTab('teams-my')}
                className={`pb-2 sm:pb-3 px-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  activeTeamsSubTab === 'teams-my'
                    ? 'border-b-2 border-light-accent dark:border-dark-accent text-light-primary dark:text-dark-primary'
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                }`}
              >
                My Teams
              </button>

              <button
                onClick={() => setActiveTeamsSubTab('teams-available')}
                className={`pb-2 sm:pb-3 px-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  activeTeamsSubTab === 'teams-available'
                    ? 'border-b-2 border-light-accent dark:border-dark-accent text-light-primary dark:text-dark-primary'
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                }`}
              >
                Available
              </button>

              <button
                onClick={() => setActiveTeamsSubTab('teams-requests')}
                className={`pb-2 sm:pb-3 px-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  activeTeamsSubTab === 'teams-requests'
                    ? 'border-b-2 border-light-accent dark:border-dark-accent text-light-primary dark:text-dark-primary'
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                }`}
              >
                Requests
                {teamRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-1 sm:ml-2 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs bg-red-500 text-white rounded-full">
                    {teamRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>

            {/* Teams Content */}
            <div>
              {activeTeamsSubTab === 'teams-my' && (
                <MyTeamsSection projects={teamProjects} />
              )}

              {activeTeamsSubTab === 'teams-available' && (
                <AvailableTeamsSection />
              )}

              {activeTeamsSubTab === 'teams-requests' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Team Join Requests */}
                  <div className="card p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-light-primary dark:text-dark-primary mb-4">
                      Team Join Requests ({teamRequests.filter(r => r.status === 'pending').length})
                    </h3>

                    {teamRequests.filter(r => r.status === 'pending').length === 0 ? (
                      <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">
                        No pending team join requests
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {teamRequests.filter(r => r.status === 'pending').map(request => (
                          <div
                            key={request.id}
                            className="p-3 sm:p-4 bg-light-surface dark:bg-dark-surface rounded-lg"
                          >
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                              <div className="flex-1 w-full">
                                <p className="font-medium text-xs sm:text-sm text-light-primary dark:text-dark-primary">
                                  {request.userName}
                                </p>
                                <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary mt-1">
                                  Requested Role: <span className="capitalize font-medium">{request.role}</span>
                                </p>
                                <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary mt-2">
                                  Reason:
                                </p>
                                <p className="text-xs sm:text-sm text-light-primary dark:text-dark-primary mt-1 p-2 bg-light-background dark:bg-dark-background rounded">
                                  {request.reason}
                                </p>
                              </div>

                              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                                <button
                                  onClick={() => approveTeamRequest(request.id, request.teamId, request.userId, request.role)}
                                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded hover:bg-green-500/30 transition text-xs sm:text-sm font-medium whitespace-nowrap"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => rejectTeamRequest(request.id)}
                                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500/20 text-red-600 dark:text-red-400 rounded hover:bg-red-500/30 transition text-xs sm:text-sm font-medium whitespace-nowrap"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => {
            createProject(data);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <CreateTeamModal
          isOpen={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          onSuccess={() => {
            setShowCreateTeamModal(false);
            setActiveTab('teams-my');
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
