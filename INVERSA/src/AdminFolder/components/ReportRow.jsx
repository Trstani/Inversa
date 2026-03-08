const ReportRow = ({ report, onAction }) => {

  const projects =
    JSON.parse(localStorage.getItem("inversa_projects"))?.projects || [];

  const users =
    JSON.parse(localStorage.getItem("inversa_users")) || [];

  const project = projects.find(p => p.id === report.projectId);

  const reporter = users.find(u => u.id === report.reportedBy);

  const handleDeleteProject = () => {

    const updated = projects.filter(
      p => p.id !== report.projectId
    );

    localStorage.setItem(
      "inversa_projects",
      JSON.stringify({ projects: updated })
    );

    alert("Project deleted");

    onAction();
  };

  const handleRestoreProject = () => {

    const updated = projects.map(p => {

      if (p.id === report.projectId) {
        return {
          ...p,
          hidden: false
        };
      }

      return p;
    });

    localStorage.setItem(
      "inversa_projects",
      JSON.stringify({ projects: updated })
    );

    alert("Project restored");

    onAction();
  };

  const handleSuspendUser = () => {

    const updated = users.map(u => {

      if (u.id === project?.initiatorId) {
        return {
          ...u,
          suspended: true
        };
      }

      return u;
    });

    localStorage.setItem(
      "inversa_users",
      JSON.stringify(updated)
    );

    alert("User suspended");

    onAction();
  };

  return (

    <tr className="text-center">

      <td className="p-3 border">
        {project?.title || "Unknown Project"}
      </td>

      <td className="p-3 border">
        {reporter?.name || "Unknown User"}
      </td>

      <td className="p-3 border">
        {report.reason}
      </td>

      <td className="p-3 border">
        {report.note || "-"}
      </td>

      <td className="p-3 border">
        {new Date(report.createdAt).toLocaleDateString()}
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