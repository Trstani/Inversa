const ReportRow = ({ report, onAction }) => {

  const handleDeleteProject = () => {

    const projects =
      JSON.parse(localStorage.getItem("projects")) || [];

    const updated = projects.filter(
      p => p.id !== report.projectId
    );

    localStorage.setItem(
      "projects",
      JSON.stringify(updated)
    );

    alert("Project deleted");

    onAction();
  };

  const handleRestoreProject = () => {

    const projects =
      JSON.parse(localStorage.getItem("projects")) || [];

    const updated = projects.map(p => {

      if (p.id === report.projectId) {
        return {
          ...p,
          hidden: false,
          hiddenReason: null
        };
      }

      return p;
    });

    localStorage.setItem(
      "projects",
      JSON.stringify(updated)
    );

    alert("Project restored");

    onAction();
  };

  const handleSuspendUser = () => {

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const updated = users.map(u => {

      if (u.username === report.initiator) {
        return {
          ...u,
          suspended: true
        };
      }

      return u;
    });

    localStorage.setItem(
      "users",
      JSON.stringify(updated)
    );

    alert("User suspended");

    onAction();
  };

  return (

    <tr>

      <td className="p-3 border">
        {report.projectTitle}
      </td>

      <td className="p-3 border">
        {report.reporter}
      </td>

      <td className="p-3 border">
        {report.reason}
      </td>

      <td className="p-3 border">
        {report.note || "-"}
      </td>

      <td className="p-3 border">
        {new Date(report.date).toLocaleDateString()}
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