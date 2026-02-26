import { FiCheck, FiX } from "react-icons/fi";

const CollaborationRequest = ({
 requests,
  projects,
  onApprove,
  onReject,
}) => {

  const pendingRequests = requests.filter(
    (r) => r.status === "pending"
  );

  if (pendingRequests.length === 0) return null;

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FiUsers /> Collaboration Requests ({pendingRequests.length})
      </h2>

      <div className="space-y-4">
        {pendingRequests.map((request) => {
          const project = projects.find(
            (p) => p.id === request.projectId
          );

          return (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-light-surface dark:bg-dark-surface rounded-lg"
            >
              <div>
                <p className="font-semibold">
                  {request.userName || "User"}
                </p>

                <p className="text-sm text-light-secondary dark:text-dark-secondary">
                  Requested to join as{" "}
                  <span className="font-medium">
                    {request.requestedRole}
                  </span>
                </p>

                {project && (
                  <p className="text-sm text-light-secondary dark:text-dark-secondary">
                    Project: {project.title}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onApprove(request.id, request.requestedRole)
                  }
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                  title="Approve"
                >
                  <FiCheck />
                </button>

                <button
                  onClick={() => onReject(request.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  title="Reject"
                >
                  <FiX />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default CollaborationRequest;
