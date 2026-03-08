import { FiFlag, FiUsers, FiFolder, FiHome } from "react-icons/fi";

const AdminSidebar = ({ current, setCurrent }) => {

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "reports", label: "Reports", icon: <FiFlag /> },
    { id: "projects", label: "Projects", icon: <FiFolder /> },
    { id: "users", label: "Users", icon: <FiUsers /> }
  ];

  return (

    <div className="w-64 bg-light-background dark:bg-dark-background border-r min-h-screen p-6">

      <h2 className="text-xl font-bold mb-8 text-light-primary dark:text-dark-primary">
        Admin Panel
      </h2>

      <nav className="flex flex-col gap-4">

        {menu.map(item => (

          <button
            key={item.id}
            onClick={() => setCurrent(item.id)}
            className={`flex items-center gap-2 text-left p-2 rounded hover:bg-gradient-to-r from-purple-600 via-purple-600 to-purple-700 :bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800
            ${current === item.id ? "bg-gradient-to-r from-purple-600 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-semibold" : ""}`}
          >
            {item.icon}
            {item.label}
          </button>

        ))}

      </nav>

    </div>

  );

};

export default AdminSidebar;