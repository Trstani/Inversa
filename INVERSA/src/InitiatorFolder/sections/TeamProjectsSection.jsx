import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiUsers } from 'react-icons/fi';
import Button from '../../components/Button';

const TeamProjectsSection = ({ projects, requests, onApprove, onReject }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Collaboration Requests */}
      {requests.length > 0 && (
        <div className="card p-4 border-l-4 border-light-accent dark:border-dark-accent">
          <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-3">
            Collaboration Requests
          </h3>

          <div className="space-y-2">
            {requests.map(request => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded"
              >
                <div>
                  <p className="font-medium text-sm text-light-primary dark:text-dark-primary">
                    {request.userName}
                  </p>
                  <p className="text-xs text-light-secondary dark:text-dark-secondary">
                    Requested: <span className="capitalize">{request.requestedRole}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(request.id, request.requestedRole)}
                    className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs hover:bg-green-500/30 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => onReject(request.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded text-xs hover:bg-red-500/30 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Projects */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FiUsers className="w-12 h-12 mx-auto text-light-secondary dark:text-dark-secondary mb-3 opacity-50" />
          <p className="text-light-secondary dark:text-dark-secondary">
            You're not part of any team projects yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="card p-4 hover:shadow-lg transition-shadow"
            >
              {project.backgroundImage && (
                <div
                  className="w-full h-32 rounded-lg mb-3 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.backgroundImage})` }}
                />
              )}

              <h3 className="font-semibold text-light-primary dark:text-dark-primary mb-1 truncate">
                {project.title}
              </h3>

              <p className="text-sm text-light-secondary dark:text-dark-secondary mb-2 line-clamp-2">
                {project.description}
              </p>

              <div className="flex gap-2 text-xs text-light-secondary dark:text-dark-secondary mb-3">
                <span>{project.totalChapters || 0} chapters</span>
                <span>•</span>
                <span>{project.collaborators?.length || 0} members</span>
              </div>

              <button
                onClick={() => navigate(`/project/${project.id}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition text-sm"
              >
                <FiEdit2 className="w-4 h-4" />
                View Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamProjectsSection;
