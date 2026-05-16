import { apiClient } from "../../api/client";

const ReportRow = ({ report, onAction }) => {

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiClient.projects.delete(report.project_id);
        alert("Project deleted");
        onAction();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleRestoreProject = async () => {
    try {
      await apiClient.projects.unhide(report.project_id);
      alert("Project restored");
      onAction();
    } catch (error) {
      console.error('Error restoring project:', error);
      alert('Failed to restore project');
    }
  };

  const handleSuspendUser = async () => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        // This would need a backend endpoint for suspending users
        // For now, we'll just show an alert
        alert("User suspension feature coming soon");
        onAction();
      } catch (error) {
        console.error('Error suspending user:', error);
        alert('Failed to suspend user');
      }
    }
  };

  return (

    <tr className="text-center">

      <td className="p-3 border">
        {report.project_title || "Unknown Project"}
      </td>

      <td className="p-3 border">
        {report.reporter_name || "Unknown User"}
      </td>

      <td className="p-3 border">
        {report.reason}
      </td>

      <td className="p-3 border">
        {report.note || "-"}
      </td>

      <td className="p-3 border">
        {new Date(report.created_at).toLocaleDateString()}
      </td>

      <td className="p-3 border">

        <div className="flex gap-2">

          <button
            onClick={handleDeleteProject}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>

          <button
            onClick={handleRestoreProject}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Restore
          </button>

          <button
            onClick={handleSuspendUser}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Suspend
          </button>

        </div>

      </td>

    </tr>

  );

};

export default ReportRow;