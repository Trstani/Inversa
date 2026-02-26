import { useState, useEffect } from "react";
import {
  loadProjects,
  saveProject,
  deleteProject,
  loadCollaborationRequests,
  updateCollaborationRequest,
} from "../../utils/dataManager";

const useInitiatorDashboard = (user) => {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const loadData = async () => {
    setLoading(true);

    const allProjects = await loadProjects();
    const userProjects = allProjects.filter(
      (p) => p.initiatorId === user?.id
    );
    setProjects(userProjects);

    const allRequests = await loadCollaborationRequests();
    const userRequests = allRequests.filter((r) => {
      const project = allProjects.find(p => p.id === r.projectId);
      return project?.initiatorId === user?.id;
    });

    setRequests(userRequests);
    setLoading(false);
  };

  const createProject = async (data) => {
    await saveProject({
      ...data,
      initiatorId: user.id,
      collaborators: [],
      likes: 0,
      totalChapters: 0,
    });
    await loadData();
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    await loadData();
  };

  const approve = async (id, role) => {
    await updateCollaborationRequest(id, "approved", role);
    await loadData();
  };

  const reject = async (id) => {
    await updateCollaborationRequest(id, "rejected");
    await loadData();
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
