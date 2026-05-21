import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiFolder } from "react-icons/fi";

import CardProject from "../../components/CardProject";

const ProjectList = ({ projects, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-3 text-light-primary dark:text-dark-primary">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
          <FiFolder className="w-5 h-5 text-light-accent dark:text-dark-accent" />
        </div>
        My Projects ({projects.length})
      </h2>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface p-8 sm:p-12 text-center">
          <FiFolder className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 text-light-secondary dark:text-dark-secondary opacity-40" />
          <p className="text-light-secondary dark:text-dark-secondary text-base sm:text-lg">
            You haven't created any projects yet.
          </p>
          <p className="mt-2 text-sm text-light-secondary dark:text-dark-secondary opacity-75">
            Start creating your first project to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <CardProject project={project} />

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="p-2.5 bg-light-accent dark:bg-dark-accent hover:opacity-90 text-white rounded-lg transition-all duration-300 shadow-lg"
                  title="Edit project"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(project.id)}
                  className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 shadow-lg"
                  title="Delete project"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
