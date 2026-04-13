import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Button from '../../components/Button';

const MyProjectsSection = ({ projects, onDelete, onCreateNew }) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-light-secondary dark:text-dark-secondary mb-4">
          You haven't created any projects yet
        </p>
        <Button onClick={onCreateNew}>
          <FiPlus className="mr-2" />
          Create Your First Project
        </Button>
      </div>
    );
  }

  return (
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
            <span className="capitalize">{project.status}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/project/${project.id}`)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition text-sm"
            >
              <FiEdit2 className="w-4 h-4" />
              View
            </button>

            <button
              onClick={() => onDelete(project.id)}
              className="px-3 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProjectsSection;
