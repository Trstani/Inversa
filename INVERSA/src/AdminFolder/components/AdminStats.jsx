import { useEffect, useState } from "react";

const AdminStats = () => {

  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    reports: 0,
    hiddenProjects: 0
  });

  useEffect(() => {

    const projectsData =
      JSON.parse(localStorage.getItem("inversa_projects")) || { projects: [] };

    const users =
      JSON.parse(localStorage.getItem("inversa_users")) || [];

    const reportsData =
      JSON.parse(localStorage.getItem("inversa_reports")) || { reports: [] };

    const projects = projectsData.projects || [];
    const reports = reportsData.reports || [];

    const hiddenProjects =
      projects.filter(p => p.hidden).length;

    setStats({
      projects: projects.length,
      users: users.length,
      reports: reports.length,
      hiddenProjects
    });

  }, []);

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

      {/* Projects */}

      <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-lg p-6 rounded-xl">

        <p className="text-sm opacity-80">
          Projects
        </p>

        <p className="text-3xl font-bold mt-2">
          {stats.projects}
        </p>

      </div>

      {/* Users */}

      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-lg p-6 rounded-xl">

        <p className="text-sm opacity-80">
          Users
        </p>

        <p className="text-3xl font-bold mt-2">
          {stats.users}
        </p>

      </div>

      {/* Reports */}

      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 text-white shadow-lg p-6 rounded-xl">

        <p className="text-sm opacity-80">
          Reports
        </p>

        <p className="text-3xl font-bold mt-2">
          {stats.reports}
        </p>

      </div>

      {/* Hidden Projects */}

      <div className="
        bg-light-surface
        dark:bg-dark-surface
        border border-light-border
        dark:border-dark-border
        shadow p-6 rounded-xl
      ">

        <p className="text-light-secondary dark:text-dark-secondary text-sm">
          Hidden Projects
        </p>

        <p className="text-3xl font-bold text-light-primary dark:text-dark-primary mt-2">
          {stats.hiddenProjects}
        </p>

      </div>

    </div>

  );

};

export default AdminStats;