import { useEffect, useState } from "react";

const ProjectsTable = () => {

  const [projects, setProjects] = useState([]);

  const loadProjects = () => {

    const stored =
      JSON.parse(localStorage.getItem("inversa_projects")) || { projects: [] };

    setProjects(stored.projects || []);

  };

  useEffect(() => {

    loadProjects();

  }, []);

  const deleteProject = (id) => {

    const updated = projects.filter(p => p.id !== id);

    localStorage.setItem(
      "inversa_projects",
      JSON.stringify({ projects: updated })
    );

    loadProjects();

  };

  const toggleHidden = (id) => {

    const updated = projects.map(p => {

      if (p.id === id) {
        return { ...p, hidden: !p.hidden };
      }

      return p;

    });

    localStorage.setItem(
      "inversa_projects",
      JSON.stringify({ projects: updated })
    );

    loadProjects();

  };

  return (

    <table className="w-full border">

      <thead className="bg-gray-100">

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
                  Hide
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