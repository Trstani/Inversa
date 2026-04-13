import { useState, useEffect } from "react";
import {
  loadProjects,
  saveProject,
  deleteProject,
  getTeamRequestsByTeam,
  updateTeamRequest,
  addTeamCollaborator,
} from "../../utils/dataManager/index";
import {
  getMyProjects,
  getTeamProjects,
} from "../../utils/dataManager/teamProjectManager";
import {
  loadTeams,
  getMyCreatedTeams,
  getMyJoinedTeams,
} from "../../utils/dataManager/teamManager";

const useUserDashboard = (user) => {
  const [myProjects, setMyProjects] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);

    try {
      // Load my projects (where user is initiator)
      const myProj = await getMyProjects(user?.id);
      setMyProjects(myProj);

      // Load team projects (where user is team member)
      const teamProj = await getTeamProjects(user?.id);
      setTeamProjects(teamProj);

      // Load my teams (created or joined)
      const createdTeams = await getMyCreatedTeams(user?.id);
      const joinedTeams = await getMyJoinedTeams(user?.id);
      const allMyTeams = [...createdTeams, ...joinedTeams];
      setMyTeams(allMyTeams);

      // Load team join requests for teams I created
      const allTeamRequests = [];
      for (const team of createdTeams) {
        const teamReqs = await getTeamRequestsByTeam(team.id);
        allTeamRequests.push(...teamReqs);
      }
      setTeamRequests(allTeamRequests);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data) => {
    try {
      await saveProject({
        ...data,
        initiatorId: user.id,
        collaborators: [],
        likes: 0,
        totalChapters: 0,
        status: "draft",
        isTeamProject: false,
      });
      await loadData();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const removeProject = async (id) => {
    try {
      await deleteProject(id);
      await loadData();
    } catch (error) {
      console.error('Error removing project:', error);
    }
  };

  const approveTeamRequest = async (requestId, teamId, userId, role) => {
    try {
      await updateTeamRequest(requestId, "approved", role);
      await addTeamCollaborator(teamId, userId, role);
      await loadData();
    } catch (error) {
      console.error('Error approving team request:', error);
    }
  };

  const rejectTeamRequest = async (requestId) => {
    try {
      await updateTeamRequest(requestId, "rejected");
      await loadData();
    } catch (error) {
      console.error('Error rejecting team request:', error);
    }
  };

  return {
    myProjects,
    teamProjects,
    myTeams,
    teamRequests,
    loading,
    createProject,
    removeProject,
    approveTeamRequest,
    rejectTeamRequest,
  };
};

export default useUserDashboard;
