import { Link } from "react-router-dom";
import { FiFlag, FiUsers, FiFolder, FiHome } from "react-icons/fi";

const AdminSidebar = () => {

  return (

    <div className="w-64 bg-inherit text-indigo-300 min-h-screen p-6">

      <h2 className="text-xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="flex flex-col gap-4">

        <Link
          to="/admin"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiHome />
          Dashboard
        </Link>

        <Link
          to="/admin/reports"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiFlag />
          Reports
        </Link>

        <Link
          to="/admin/projects"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiFolder />
          Projects
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-2 hover:text-gray-300"
        >
          <FiUsers />
          Users
        </Link>

      </nav>

    </div>

  );

};

export default AdminSidebar;