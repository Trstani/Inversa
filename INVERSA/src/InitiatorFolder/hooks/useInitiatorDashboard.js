import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";

const useInitiatorDashboard = (user) => {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);

    try {
      // Get all projects
      const projectsResponse = await apiClient.projects.getAll();
      const allProjects = projectsResponse.data || [];
      
      // Filter projects where user is the initiator
      const userProjects = allProjects.filter(
        (p) => p.initiator_id === user?.id
      );
      setProjects(userProjects);

      // Get collaboration requests for user's projects
      const requestsResponse = await apiClient.collaboration.getRequests();
      const allRequests = requestsResponse.data || [];
      
      const userRequests = allRequests.filter((r) => {
        const project = allProjects.find(p => p.id === r.project_id);
        return project?.initiator_id === user?.id;
      });

      setRequests(userRequests);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data) => {
    try {
      await apiClient.projects.create({
        ...data,
        initiator_id: user.id,
        is_team_project: false,
        status: "draft"
      });
      await loadData();
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const removeProject = async (id) => {
    try {
      await apiClient.projects.delete(id);
      await loadData();
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  const approve = async (id, role) => {
    try {
      await apiClient.collaboration.updateRequest(id, {
        status: "approved",
        role: role
      });
      await loadData();
    } catch (error) {
      console.error("Error approving request:", error);
      throw error;
    }
  };

  const reject = async (id) => {
    try {
      await apiClient.collaboration.updateRequest(id, {
        status: "rejected"
      });
      await loadData();
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  };

  return {
    projects,
    requests,
    loading,
    createProject,
    removeProject,
    approve,
    reject,
  };
};

export default useInitiatorDashboard;
