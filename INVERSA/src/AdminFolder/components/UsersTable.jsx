import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

const UsersTable = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.users.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const suspendUser = async (id) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        // This would need a backend endpoint for suspending users
        // For now, we'll just show an alert
        alert("User suspension feature coming soon");
        await loadUsers();
      } catch (error) {
        console.error('Error suspending user:', error);
        alert('Failed to suspend user');
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (

    <table className="w-full border">

      <thead>

        <tr>
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Email</th>
          <th className="p-3 border">Role</th>
          <th className="p-3 border">Status</th>
          <th className="p-3 border">Action</th>
        </tr>

      </thead>

      <tbody>

        {users.map(user => (

          <tr key={user.id}>

            <td className="p-3 border">
              {user.name}
            </td>

            <td className="p-3 border">
              {user.email}
            </td>

            <td className="p-3 border">
              {user.role || "user"}
            </td>

            <td className="p-3 border">
              {user.is_suspended ? "Suspended" : "Active"}
            </td>

            <td className="p-3 border">

              <button
                onClick={() => suspendUser(user.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Suspend
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  );

};

export default UsersTable;