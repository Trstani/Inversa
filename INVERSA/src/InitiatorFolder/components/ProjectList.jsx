import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import CardProject from "../../components/CardProject";

const ProjectList = ({ projects, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        My Projects ({projects.length})
      </h2>

      {projects.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-light-secondary dark:text-dark-secondary mb-4">
            You haven't created any projects yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              <CardProject project={project} />

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <FiEdit2 />
                </button>

                <button
                  onClick={() => onDelete(project.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  <FiTrash2 />
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
