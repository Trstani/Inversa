import { apiClient } from "../../api/client";

const ReportRow = ({
  report,
  onAction,
}) => {

  const handleHideProject =
    async () => {

      if (
        !window.confirm(
          'Hide this project?'
        )
      ) {
        return;
      }

      try {

        await apiClient
          .projects
          .hide(
            report.project_id
          );

        alert(
          "Project hidden"
        );

        onAction();

      } catch (error) {

        console.error(
          'Error hiding project:',
          error
        );

        alert(
          'Failed to hide project'
        );
      }
    };

  const handleRestoreProject =
    async () => {

      try {

        await apiClient
          .projects
          .unhide(
            report.project_id
          );

        alert(
          "Project restored"
        );

        onAction();

      } catch (error) {

        console.error(
          'Error restoring project:',
          error
        );

        alert(
          'Failed to restore project'
        );
      }
    };

  const handleSuspendUser =
    async () => {

      alert(
        "User suspension feature coming soon"
      );
    };

  return (

    <tr className="text-center">

      <td className="p-3 border">
        {report.project_title ||
          "Unknown Project"}
      </td>

      <td className="p-3 border">
        {report.reporter_name ||
          "Unknown User"}
      </td>

      <td className="p-3 border">
        {report.reason}
      </td>

      <td className="p-3 border">
        {report.note || "-"}
      </td>

      <td className="p-3 border">

        {new Date(
          report.created_at
        ).toLocaleDateString()}

      </td>

      <td className="p-3 border">

        <div className="flex justify-center gap-2">

          <button
            onClick={
              handleHideProject
            }
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-3 py-1
              rounded
              transition
            "
          >
            Hide
          </button>

          <button
            onClick={
              handleRestoreProject
            }
            className="
              bg-green-500
              hover:bg-green-600
              text-white
              px-3 py-1
              rounded
              transition
            "
          >
            Restore
          </button>

          <button
            onClick={
              handleSuspendUser
            }
            className="
              bg-yellow-500
              hover:bg-yellow-600
              text-white
              px-3 py-1
              rounded
              transition
            "
          >
            Suspend
          </button>

        </div>

      </td>

    </tr>
  );
};

export default ReportRow;