import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

import useUserDashboard
  from "./hooks/useUserDashboard";

import {
  FiBook,
  FiUsers,
} from "react-icons/fi";

import {
  apiClient,
} from "../api/client";

import DashboardHeader
  from "./components/DashboardHeader";

import CreateProjectModal
  from "./components/CreateProjectModal";

import MyProjectsSection
  from "./sections/MyProjectsSection";

import MyTeamsSection
  from "./sections/MyTeamsSection";

import AvailableTeamsSection
  from "./sections/AvailableTeamsSection";

import CreateTeamModal
  from "./components/CreateTeamModal";
import { showError } from "../utils/toast";

const UserDashboard = () => {

  /*
  =========================
  AUTH
  =========================
  */

  const { user } =
    useAuth();

  /*
  =========================
  URL PARAMS
  =========================
  */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  /*
  =========================
  STATES
  =========================
  */

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    showCreateTeamModal,
    setShowCreateTeamModal,
  ] = useState(false);

  const [
    activeTab,
    setActiveTab,
  ] = useState(
    searchParams.get('tab') || 'solo'
  );

  const [
    activeTeamsSubTab,
    setActiveTeamsSubTab,
  ] = useState('teams-my');

  /*
  =========================
  TEAM REQUESTS
  =========================
  */

  const [
    teamRequests,
    setTeamRequests,
  ] = useState([]);

  /*
  =========================
  DASHBOARD DATA
  =========================
  */

  const {

    myProjects,

    teamProjects,

    myTeams,

    loading,

    createProject,

    removeProject,

    loadData: refreshDashboard,

  } = useUserDashboard(user);

  /*
  =========================
  REFRESH ON FOCUS
  =========================
  */
 /*

  useEffect(() => {
    const handleFocus = () => {
      refreshDashboard();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshDashboard]);

  */

  /*
  =========================
  LOAD REQUESTS
  =========================
  */

  useEffect(() => {

    

    if (
      Array.isArray(myTeams) &&
      user?.id
    ) {

      loadTeamRequests();
    }

  }, [
    myTeams,
    user?.id,
  ]);

  const loadTeamRequests =
    async () => {

      try {

        let allRequests = [];

        for (
          const team of myTeams
        ) {
          

          /*
          =========================
          ONLY OWNER
          =========================
          */

          if (

            team.initiator_id !==
            user?.id

            &&

            team.initiatorId !==
            user?.id

          ) {
            continue;
          }

         

          const response =
            await apiClient.teams
              .getRequests(
                team.id
              );

          const requests =
            response.data || [];

          allRequests.push(
            ...requests
          );
        }

        setTeamRequests(
          allRequests
        );

      } catch (error) {

        console.error(
          'Error loading requests:',
          error
        );
      }
    };

  /*
  =========================
  APPROVE REQUEST
  =========================
  */

  const approveRequest =
    async (requestId) => {

      try {

        await apiClient.teams
          .approveRequest(
            requestId
          );

        await loadTeamRequests();

      } catch (error) {

        console.error(
          'Error approving request:',
          error
        );

        showError(
          'Failed to approve request'
        );
      }
    };

  /*
  =========================
  REJECT REQUEST
  =========================
  */

  const rejectRequest =
    async (requestId) => {

      try {

        await apiClient.teams
          .rejectRequest(
            requestId
          );

        await loadTeamRequests();

      } catch (error) {

        console.error(
          'Error rejecting request:',
          error
        );

        showError(
          'Failed to reject request'
        );
      }
    };

  /*
  =========================
  UPDATE URL
  =========================
  */

  useEffect(() => {

    if (
      activeTab.startsWith(
        'teams'
      )
    ) {

      setSearchParams({
        tab: 'teams',
      });

    } else {

      setSearchParams({
        tab: activeTab,
      });
    }

  }, [
    activeTab,
    setSearchParams,
  ]);

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (

      <div
        className="
          flex items-center
          justify-center

          min-h-screen
        "
      >

        <div className="text-center">

          <p
            className="
              text-light-secondary
              dark:text-dark-secondary
            "
          >
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  /*
  =========================
  RENDER
  =========================
  */

  return (

    <div
      className="
        min-h-screen

        bg-light-background
        dark:bg-dark-background

        py-6 sm:py-8
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto

          px-4 sm:px-6 lg:px-8
        "
      >

        {/* HEADER */}

        <DashboardHeader />

        {/* TAB NAVIGATION */}

        <div
          className="
            mb-6

            flex gap-1 sm:gap-2

            border-b

            border-light-accent/20
            dark:border-dark-accent/20

            overflow-x-auto
          "
        >

          {/* SOLO */}

          <button
            onClick={() =>
              setActiveTab('solo')
            }
            className={`
              flex items-center gap-1 sm:gap-2

              px-2 sm:px-4
              py-2 sm:py-3

              font-medium

              transition

              whitespace-nowrap

              text-xs sm:text-sm

              ${activeTab === 'solo'

                ? `
                    text-light-accent
                    dark:text-dark-accent

                    border-b-2

                    border-light-accent
                    dark:border-dark-accent
                  `

                : `
                    text-light-secondary
                    dark:text-dark-secondary

                    hover:text-light-primary
                    dark:hover:text-dark-primary
                  `
              }
            `}
          >

            <FiBook
              className="
                w-3 h-3
                sm:w-4 sm:h-4
              "
            />

            <span className="hidden sm:inline">
              Solo Projects
            </span>

            <span className="sm:hidden">
              Solo
            </span>

            ({myProjects.length})

          </button>

          {/* TEAMS */}

          <button
            onClick={() =>
              setActiveTab('teams')
            }
            className={`
              flex items-center gap-1 sm:gap-2

              px-2 sm:px-4
              py-2 sm:py-3

              font-medium

              transition

              whitespace-nowrap

              text-xs sm:text-sm

              ${activeTab === 'teams'

                ? `
                    text-light-accent
                    dark:text-dark-accent

                    border-b-2

                    border-light-accent
                    dark:border-dark-accent
                  `

                : `
                    text-light-secondary
                    dark:text-dark-secondary

                    hover:text-light-primary
                    dark:hover:text-dark-primary
                  `
              }
            `}
          >

            <FiUsers
              className="
                w-3 h-3
                sm:w-4 sm:h-4
              "
            />

            Teams

          </button>

        </div>

        {/* SOLO TAB */}

        {activeTab === 'solo' && (

          <div>

            <div className="mb-6">

              <button
                onClick={() =>
                  setShowCreateModal(
                    true
                  )
                }
                className="
                  w-full sm:w-auto

                  px-3 sm:px-4
                  py-2

                  bg-light-accent
                  dark:bg-dark-accent

                  text-white

                  rounded-lg

                  hover:opacity-90

                  transition

                  text-sm sm:text-base
                "
              >
                + Create New Project
              </button>

            </div>

            <div>

              <h2
                className="
                  text-xl sm:text-2xl
                  font-bold

                  text-light-primary
                  dark:text-dark-primary

                  mb-4
                "
              >
                My Solo Projects
              </h2>

              <MyProjectsSection
                projects={myProjects}
                onDelete={removeProject}
                onCreateNew={() =>
                  setShowCreateModal(
                    true
                  )
                }
              />

            </div>

          </div>

        )}

        {/* TEAMS TAB */}

        {activeTab === 'teams' && (

          <div>

            {/* HEADER */}

            <div className="mb-6 sm:mb-8">

              <h2
                className="
                  text-xl sm:text-2xl
                  font-bold

                  text-light-primary
                  dark:text-dark-primary

                  mb-2
                "
              >
                Teams
              </h2>

              <p
                className="
                  text-xs sm:text-sm

                  text-light-secondary
                  dark:text-dark-secondary
                "
              >
                Join teams and collaborate on projects
              </p>

            </div>

            {/* CREATE TEAM */}

            <div className="mb-6">

              <button
                onClick={() =>
                  setShowCreateTeamModal(
                    true
                  )
                }
                className="
                  w-full sm:w-auto

                  px-3 sm:px-4
                  py-2

                  bg-light-accent
                  dark:bg-dark-accent

                  text-white

                  rounded-lg

                  hover:opacity-90

                  transition

                  text-sm sm:text-base
                "
              >
                + Create New Team
              </button>

            </div>

            {/* SUBTABS */}

            <div
              className="
                mb-6

                flex gap-2 sm:gap-4

                border-b

                border-light-surface
                dark:border-dark-surface

                overflow-x-auto
              "
            >

              {/* MY TEAMS */}

              <button
                onClick={() =>
                  setActiveTeamsSubTab(
                    'teams-my'
                  )
                }
                className={`
                  pb-2 sm:pb-3
                  px-2

                  font-medium

                  transition

                  whitespace-nowrap

                  text-xs sm:text-sm

                  ${activeTeamsSubTab ===
                    'teams-my'

                    ? `
                        border-b-2

                        border-light-accent
                        dark:border-dark-accent

                        text-light-primary
                        dark:text-dark-primary
                      `

                    : `
                        text-light-secondary
                        dark:text-dark-secondary

                        hover:text-light-primary
                        dark:hover:text-dark-primary
                      `
                  }
                `}
              >
                My Teams
              </button>

              {/* AVAILABLE */}

              <button
                onClick={() =>
                  setActiveTeamsSubTab(
                    'teams-available'
                  )
                }
                className={`
                  pb-2 sm:pb-3
                  px-2

                  font-medium

                  transition

                  whitespace-nowrap

                  text-xs sm:text-sm

                  ${activeTeamsSubTab ===
                    'teams-available'

                    ? `
                        border-b-2

                        border-light-accent
                        dark:border-dark-accent

                        text-light-primary
                        dark:text-dark-primary
                      `

                    : `
                        text-light-secondary
                        dark:text-dark-secondary

                        hover:text-light-primary
                        dark:hover:text-dark-primary
                      `
                  }
                `}
              >
                Available
              </button>

              {/* REQUESTS */}

              <button
                onClick={() =>
                  setActiveTeamsSubTab(
                    'teams-requests'
                  )
                }
                className={`
                  pb-2 sm:pb-3
                  px-2

                  font-medium

                  transition

                  whitespace-nowrap

                  text-xs sm:text-sm

                  ${activeTeamsSubTab ===
                    'teams-requests'

                    ? `
                        border-b-2

                        border-light-accent
                        dark:border-dark-accent

                        text-light-primary
                        dark:text-dark-primary
                      `

                    : `
                        text-light-secondary
                        dark:text-dark-secondary

                        hover:text-light-primary
                        dark:hover:text-dark-primary
                      `
                  }
                `}
              >
                Requests

                {teamRequests.filter(
                  (r) =>
                    r.status ===
                    'pending'
                ).length > 0 && (

                    <span
                      className="
                      ml-2

                      inline-flex
                      items-center
                      justify-center

                      w-5 h-5

                      text-xs

                      bg-red-500
                      text-white

                      rounded-full
                    "
                    >

                      {teamRequests.filter(
                        (r) =>
                          r.status ===
                          'pending'
                      ).length}

                    </span>

                  )}

              </button>

            </div>

            {/* CONTENT */}

            {activeTeamsSubTab ===
              'teams-my' && (

                <MyTeamsSection
                  projects={teamProjects}
                />

              )}

            {activeTeamsSubTab ===
              'teams-available' && (

                <AvailableTeamsSection />

              )}

            {activeTeamsSubTab ===
              'teams-requests' && (

                <div className="card p-6">

                  <h3
                    className="
                    text-lg font-semibold

                    text-light-primary
                    dark:text-dark-primary

                    mb-5
                  "
                  >
                    Pending Requests
                  </h3>

                  {teamRequests.filter(
                    (r) =>
                      r.status ===
                      'pending'
                  ).length === 0 ? (

                    <p
                      className="
                      text-light-secondary
                      dark:text-dark-secondary
                    "
                    >
                      No pending requests
                    </p>

                  ) : (

                    <div className="space-y-4">

                      {teamRequests
                        .filter(
                          (r) =>
                            r.status ===
                            'pending'
                        )
                        .map(
                          (request) => (

                            <div
                              key={request.id}
                              className="
                              flex flex-col
                              sm:flex-row

                              sm:items-center
                              sm:justify-between

                              gap-4

                              rounded-2xl

                              bg-light-surface
                              dark:bg-dark-surface

                              p-4
                            "
                            >

                              <div>

                                <p
                                  className="
                                  font-medium

                                  text-light-primary
                                  dark:text-dark-primary
                                "
                                >
                                  {request.name}
                                  <p
                                    className="text-xs text-light-accent dark:text-dark-accent mt-1"
                                  >
                                    Team: {
                                      myTeams.find(
                                        (t) =>
                                          t.id ===
                                          request.team_id
                                      )?.title || 'Unknown Team'
                                    }
                                  </p>
                                </p>

                                <p
                                  className="
                                  text-sm

                                  text-light-secondary
                                  dark:text-dark-secondary

                                  mt-1
                                "
                                >
                                  {request.reason}
                                </p>

                              </div>

                              <div className="flex gap-2">

                                <button
                                  onClick={() =>
                                    approveRequest(
                                      request.id
                                    )
                                  }
                                  className="
                                  rounded-xl

                                  bg-green-500

                                  px-4 py-2

                                  text-white

                                  hover:bg-green-600
                                "
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    rejectRequest(
                                      request.id
                                    )
                                  }
                                  className="
                                  rounded-xl

                                  bg-red-500

                                  px-4 py-2

                                  text-white

                                  hover:bg-red-600
                                "
                                >
                                  Reject
                                </button>

                              </div>

                            </div>

                          )
                        )}

                    </div>

                  )}

                </div>

              )}

          </div>

        )}

      </div>

      {/* CREATE PROJECT MODAL */}

      {showCreateModal && (

        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreate={(data) => {

            createProject(data);

            setShowCreateModal(
              false
            );
          }}
        />

      )}

      {/* CREATE TEAM MODAL */}

      {showCreateTeamModal && (

        <CreateTeamModal
          isOpen={
            showCreateTeamModal
          }
          onClose={() =>
            setShowCreateTeamModal(
              false
            )
          }
          onSuccess={() => {

            setShowCreateTeamModal(
              false
            );

            setActiveTab(
              'teams-my'
            );
          }}
        />

      )}

    </div>
  );
};

export default UserDashboard;