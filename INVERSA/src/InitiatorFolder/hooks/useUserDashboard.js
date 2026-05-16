import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";

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
      // Load all projects and filter by user
      const projectsResponse = await apiClient.projects.getAll();
      const allProjects = projectsResponse.data || [];
      
      // My projects (where user is initiator)
      const myProj = allProjects.filter(p => p.initiator_id === user?.id);
      setMyProjects(myProj);

      // Load my teams
      const teamsResponse = await apiClient.teams.getUserTeams(user?.id);
      const allMyTeams = teamsResponse.data || [];
      setMyTeams(allMyTeams);

      // Team projects (projects from teams I'm in)
      const teamProj = [];
      for (const team of allMyTeams) {
        const teamProjectsResponse = await apiClient.teams.getProjects(team.id);
        if (teamProjectsResponse.data) {
          teamProj.push(...teamProjectsResponse.data);
        }
      }
      setTeamProjects(teamProj);

      // Load team join requests for teams I created
      const allTeamRequests = [];
      for (const team of allMyTeams) {
        if (team.created_by === user?.id) {
          const requestsResponse = await apiClient.teams.getPendingRequests(team.id);
          if (requestsResponse.data) {
            allTeamRequests.push(...requestsResponse.data);
          }
        }
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
      const response = await apiClient.projects.create({
        title: data.title,
        description: data.description,
        category_id: data.category_id || data.category,
        genre_id: data.genre_id || data.genre,
        background_image: data.backgroundImage,
        initiator_id: user.id,
        is_team_project: false,
      });
      
      if (response.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const removeProject = async (id) => {
    try {
      const response = await apiClient.projects.delete(id);
      if (response.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error removing project:', error);
      throw error;
    }
  };

  const approveTeamRequest = async (requestId, teamId, userId, role) => {
    try {
      const response = await apiClient.teams.approveMember(teamId, {
        user_id: userId,
        role: role,
      });
      
      if (response.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error approving team request:', error);
      throw error;
    }
  };

  const rejectTeamRequest = async (requestId) => {
    try {
      // Note: You may need to add a reject endpoint to the backend
      // For now, we'll just reload the data
      await loadData();
    } catch (error) {
      console.error('Error rejecting team request:', error);
      throw error;
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
