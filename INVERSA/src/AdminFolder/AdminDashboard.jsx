import { useEffect, useState } from "react";

import AdminSidebar from "../AdminFolder/components/AdminSidebar";
import AdminStats from "../AdminFolder/components/AdminStats";
import ReportsTable from "../AdminFolder/components/ReportsTable";

const AdminDashboard = () => {

  const [reports, setReports] = useState([]);

  const loadReports = () => {

    const storedReports =
      JSON.parse(localStorage.getItem("reports")) || [];

    setReports(storedReports);

  };

  useEffect(() => {

    loadReports();

  }, []);

  return (

    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 bg-gray-50 min-h-screen p-8">

        <h1 className="text-2xl font-bold mb-6 text-sky-600">
          Admin Moderation Dashboard
        </h1>

        <AdminStats />

        <ReportsTable
          reports={reports}
          reloadReports={loadReports}
        />

      </div>

    </div>

  );

};

export default AdminDashboard;