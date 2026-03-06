import { useEffect, useState } from "react";

const AdminStats = () => {

  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
    reports: 0,
    hiddenProjects: 0
  });

  useEffect(() => {

    const projects =
      JSON.parse(localStorage.getItem("projects")) || [];

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const reports =
      JSON.parse(localStorage.getItem("reports")) || [];

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

    <div className="grid grid-cols-4 gap-4 mb-8">

      <div className="bg-white shadow p-4 rounded">
        <p className="text-gray-500 text-sm">Projects</p>
        <p className="text-2xl font-bold">{stats.projects}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <p className="text-gray-500 text-sm">Users</p>
        <p className="text-2xl font-bold">{stats.users}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <p className="text-gray-500 text-sm">Reports</p>
        <p className="text-2xl font-bold">{stats.reports}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <p className="text-gray-500 text-sm">Hidden Projects</p>
        <p className="text-2xl font-bold">{stats.hiddenProjects}</p>
      </div>

    </div>

  );

};

export default AdminStats;