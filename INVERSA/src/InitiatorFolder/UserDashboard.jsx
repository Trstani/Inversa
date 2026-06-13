import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import DashboardTutorialSolo from "../components/tutorial/DashboardTutorialSolo";
import DashboardTutorialTeam from "../components/tutorial/DashboardTutorialTeam";
import useUserDashboard from "./hooks/useUserDashboard";
import { FiBook, FiUsers } from "react-icons/fi";
import { apiClient } from "../api/client";
import DashboardHeader from "./components/DashboardHeader";
import CreateProjectModal from "./components/CreateProjectModal";
import MyProjectsSection from "./sections/MyProjectsSection";
import MyTeamsSection from "./sections/MyTeamsSection";
import AvailableTeamsSection from "./sections/AvailableTeamsSection";
import CreateTeamModal from "./components/CreateTeamModal";
import { showError } from "../utils/toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectToDelete,setProjectToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'solo');
  const [activeTeamsSubTab, setActiveTeamsSubTab] = useState('teams-my');
  const [teamRequests, setTeamRequests] = useState([]);

  const {
    myProjects,
    teamProjects,
    myTeams,
    loading,
    createProject,
    removeProject,
    loadData: refreshDashboard,
  } = useUserDashboard(user);

  const [showSoloTutorial, setShowSoloTutorial] = useState(false);
  const [showTeamTutorial, setShowTeamTutorial] = useState(false);
  const [soloTutorialStep, setSoloTutorialStep] = useState(0);
  const [teamTutorialStep, setTeamTutorialStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fungsi async untuk membuka menu dan menunggu animasi selesai
  const handleOpenMobileMenu = () => {
    return new Promise((resolve) => {
      setMobileMenuOpen(true);
      // Sesuaikan timeout dengan durasi animasi buka menu (misal 350ms)
      setTimeout(resolve, 350);
    });
  };
  
  // Fungsi untuk menutup menu
  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };
   

  // SOLO TUTORIAL
  useEffect(() => {
    const done = localStorage.getItem('inversa_dashboard_solo_tutorial');
    if (!done) setShowSoloTutorial(true);
  }, []);

  const handleSoloTutorialNext = () => {
    if (soloTutorialStep >= 2) {
      localStorage.setItem('inversa_dashboard_solo_tutorial', 'done');
      setShowSoloTutorial(false);
      return;
    }
    setSoloTutorialStep(prev => prev + 1);
  };

  const handleSoloTutorialSkip = () => {
    localStorage.setItem('inversa_dashboard_solo_tutorial', 'done');
    setShowSoloTutorial(false);
  };

  const handleSoloTutorialPrevious = () => {
    if (soloTutorialStep > 0) setSoloTutorialStep(prev => prev - 1);
  };

  // TEAM TUTORIAL
  useEffect(() => {
    if (activeTab !== 'teams') return;
    const done = localStorage.getItem('inversa_dashboard_team_tutorial');
    if (!done) setShowTeamTutorial(true);
  }, [activeTab]);

  const handleTeamTutorialNext = () => {
    if (teamTutorialStep >= 4) {
      localStorage.setItem('inversa_dashboard_team_tutorial', 'done');
      setShowTeamTutorial(false);
      return;
    }
    setTeamTutorialStep(prev => prev + 1);
  };

  const handleTeamTutorialSkip = () => {
    localStorage.setItem('inversa_dashboard_team_tutorial', 'done');
    setShowTeamTutorial(false);
  };

  const handleTeamTutorialPrevious = () => {
    if (teamTutorialStep > 0) setTeamTutorialStep(prev => prev - 1);
  };

  // LOAD REQUESTS
  useEffect(() => {
    if (Array.isArray(myTeams) && user?.id) loadTeamRequests();
  }, [myTeams, user?.id]);

  const loadTeamRequests = async () => {
    try {
      let allRequests = [];
      for (const team of myTeams) {
        // Only owner can see requests
        if (team.initiator_id !== user?.id && team.initiatorId !== user?.id) continue;
        const response = await apiClient.teams.getRequests(team.id);
        const requests = response.data || [];
        allRequests.push(...requests);
      }
      setTeamRequests(allRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const approveRequest = async (requestId) => {
    try {
      await apiClient.teams.approveRequest(requestId);
      await loadTeamRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      showError('Failed to approve request');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await apiClient.teams.rejectRequest(requestId);
      await loadTeamRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      showError('Failed to reject request');
    }
  };

  // UPDATE URL
  useEffect(() => {
    if (activeTab.startsWith('teams')) setSearchParams({ tab: 'teams' });
    else setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-light-secondary dark:text-dark-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader />

        {/* TAB NAVIGATION */}
        <div className="mb-6 flex gap-1 sm:gap-2 border-b border-light-accent/20 dark:border-dark-accent/20 overflow-x-auto">
          {/* SOLO */}
          <button id="tutorial-tab-solo" onClick={() => setActiveTab('solo')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'solo'
                ? 'text-light-accent dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent'
                : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
            }`}>
            <FiBook className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Solo Projects</span>
            <span className="sm:hidden">Solo</span>
            ({myProjects.length})
          </button>

          {/* TEAMS */}
          <button id="tutorial-tab-Team" onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'teams'
                ? 'text-light-accent dark:text-dark-accent border-b-2 border-light-accent dark:border-dark-accent'
                : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
            }`}>
            <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
            Teams
          </button>
        </div>

        {/* SOLO TAB */}
        {activeTab === 'solo' && (
          <div>
            <div className="mb-6">
              <button id="tutorial-create-project" onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base">
                + Create New Project
              </button>
            </div>
            <div>
              <h2 id="tutorial-my-projects" className="text-xl sm:text-2xl font-bold text-light-primary dark:text-dark-primary mb-4">
                My Solo Projects
              </h2>
              <MyProjectsSection projects={myProjects}  onDelete={(projectId) => setProjectToDelete(projectId)} onCreateNew={() => setShowCreateModal(true)} />
            </div>
          </div>
        )}

        {/* TEAMS TAB */}
        {activeTab === 'teams' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-light-primary dark:text-dark-primary mb-2">Teams</h2>
              <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">Join teams and collaborate on projects</p>
            </div>

            <div className="mb-6">
              <button id="tutorial-create-team" onClick={() => setShowCreateTeamModal(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base">
                + Create New Team
              </button>
            </div>

            {/* SUBTABS */}
            <div className="mb-6 flex gap-2 sm:gap-4 border-b border-light-surface dark:border-dark-surface overflow-x-auto">
              <button id="tutorial-my-Teams" onClick={() => setActiveTeamsSubTab('teams-my')}
                className={`pb-2 sm:pb-3 px-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  activeTeamsSubTab === 'teams-my'
                    ? 'border-b-2 border-light-accent dark:border-dark-accent text-light-primary dark:text-dark-primary'
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                }`}>
                My Teams
              </button>
              <button id="tutorial-available-Teams" onClick={() => setActiveTeamsSubTab('teams-available')}
                className={`pb-2 sm:pb-3 px-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  activeTeamsSubTab === 'teams-available'
                    ? 'border-b-2 border-light-accent dark:border-dark-accent text-light-primary dark:text-dark-primary'
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                }`}>
                Available
              </button>
              <button id="tutorial-requests-Teams" onClick={() => setActiveTeamsSubTab('teams-requests')}
                className={`pb-2 sm:pb-3 px-2 font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  activeTeamsSubTab === 'teams-requests'
                    ? 'border-b-2 border-light-accent dark:border-dark-accent text-light-primary dark:text-dark-primary'
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary'
                }`}>
                Requests
                {teamRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                    {teamRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>

            {/* CONTENT */}
            {activeTeamsSubTab === 'teams-my' && <MyTeamsSection projects={teamProjects} />}
            {activeTeamsSubTab === 'teams-available' && <AvailableTeamsSection />}
            {activeTeamsSubTab === 'teams-requests' && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-5">Pending Requests</h3>
                {teamRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-light-secondary dark:text-dark-secondary">No pending requests</p>
                ) : (
                  <div className="space-y-4">
                    {teamRequests.filter(r => r.status === 'pending').map(request => (
                      <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-light-surface dark:bg-dark-surface p-4">
                        <div>
                          <p className="font-medium text-light-primary dark:text-dark-primary">
                            {request.name}
                            <span className="text-xs text-light-accent dark:text-dark-accent mt-1 block">
                              Team: {myTeams.find(t => t.id === request.team_id)?.title || 'Unknown Team'}
                            </span>
                          </p>
                          <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">{request.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveRequest(request.id)} className="rounded-xl bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                            Approve
                          </button>
                          <button onClick={() => rejectRequest(request.id)} className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showCreateModal && (
        <CreateProjectModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={(data) => { createProject(data); setShowCreateModal(false); }} />
      )}
      {showCreateTeamModal && (
        <CreateTeamModal isOpen={showCreateTeamModal} onClose={() => setShowCreateTeamModal(false)} onSuccess={() => { setShowCreateTeamModal(false); setActiveTab('teams-my'); }} />
      )}
      {
        projectToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className="bg-white dark:bg-dark-surface rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-3">
                Delete Project?
              </h3>

              <p className="text-sm text-light-secondary dark:text-dark-secondary mb-6">
                This action cannot be undone.
                Are you sure you want to delete this project?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setProjectToDelete(null)
                  }
                  className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {

                    try {

                      await removeProject(
                        projectToDelete
                      );

                    } finally {

                      setProjectToDelete(
                        null
                      );

                    }

                  }}
                  className="
              px-4 py-2
              rounded-lg

              bg-red-500
              text-white

              hover:bg-red-600
            "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* TUTORIALS */}
      {showSoloTutorial && (
        <DashboardTutorialSolo step={soloTutorialStep} onNext={handleSoloTutorialNext} onSkip={handleSoloTutorialSkip} onPrevious={handleSoloTutorialPrevious} openMobileMenu={handleOpenMobileMenu} closeMobileMenu={handleCloseMobileMenu} />
      )}
      {showTeamTutorial && (
        <DashboardTutorialTeam step={teamTutorialStep} onNext={handleTeamTutorialNext} onSkip={handleTeamTutorialSkip} onPrevious={handleTeamTutorialPrevious} openMobileMenu={handleOpenMobileMenu} closeMobileMenu={handleCloseMobileMenu} />
      )}
    </div>
  );
};

export default UserDashboard;