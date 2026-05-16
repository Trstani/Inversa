import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

import AdminSidebar from "../AdminFolder/components/AdminSidebar";
import AdminStats from "../AdminFolder/components/AdminStats";
import ReportsTable from "../AdminFolder/components/ReportsTable";
import ProjectsTable from "../AdminFolder/components/ProjectsTable";
import UsersTable from "../AdminFolder/components/UsersTable";

const AdminDashboard = () => {

  const [section, setSection] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await apiClient.reports.getAll();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const renderSection = () => {

    switch (section) {

      case "reports":
        return (
          <ReportsTable
            reports={reports}
            reloadReports={loadReports}
          />
        );

      case "projects":
        return <ProjectsTable />;

      case "users":
        return <UsersTable />;

      default:
        return (
          <>
            <AdminStats />

            <h2 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-3">
              Recent Reports
            </h2>

            <ReportsTable
              reports={reports}
              reloadReports={loadReports}
            />
          </>
        );

    }

  };

  return (

    <div className="flex">

      <AdminSidebar
        current={section}
        setCurrent={setSection}
      />

      <div className="flex-1 bg-light-background dark:bg-dark-background min-h-screen p-8">

        <h1 className="text-2xl font-bold mb-6 text-light-primary dark:text-dark-primary">
          Admin Moderation Dashboard
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-light-secondary dark:text-dark-secondary">Loading...</p>
          </div>
        ) : (
          renderSection()
        )}

      </div>

    </div>

  );

};

export default AdminDashboard;