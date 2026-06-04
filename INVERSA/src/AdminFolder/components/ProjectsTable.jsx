import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import {showSuccess, showError} from '../../utils/toast';

const ProjectsTable = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await apiClient.projects.getAll();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiClient.projects.delete(id);
        showSuccess('Succesfully deleted project');
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        showError('Failed to delete project');
      }
    }
  };

  const toggleHidden = async (id) => {
    try {
      const project = projects.find(p => p.id === id);
      if (project?.hidden) {
        await apiClient.projects.unhide(id);
      } else {
        await apiClient.projects.hide(id);
      }
      await loadProjects();
    } catch (error) {
      console.error('Error toggling project visibility:', error);
      showError('Failed to update project');
    }
  };

  if (loading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (

    <table className="w-full border">

      <thead>

        <tr>
          <th className="p-3 border">Title</th>
          <th className="p-3 border">Category</th>
          <th className="p-3 border">Status</th>
          <th className="p-3 border">Action</th>
        </tr>

      </thead>

      <tbody>

        {projects.map(project => (

          <tr key={project.id}>

            <td className="p-3 border">
              {project.title}
            </td>

            <td className="p-3 border">
              {project.category}
            </td>

            <td className="p-3 border">
              {project.hidden ? "Hidden" : "Active"}
            </td>

            <td className="p-3 border">

              <div className="flex gap-2">

                <button
                  onClick={() => toggleHidden(project.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  {project.hidden ? "Show" : "Hide"}
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  );

};

export default ProjectsTable;