import { useEffect, useState } from "react";

const UsersTable = () => {

  const [users, setUsers] = useState([]);

  const loadUsers = () => {

    const stored =
      JSON.parse(localStorage.getItem("inversa_users")) || [];

    setUsers(stored);

  };

  useEffect(() => {

    loadUsers();

  }, []);

  const suspendUser = (id) => {

    const updated = users.map(user => {

      if (user.id === id) {
        return { ...user, suspended: true };
      }

      return user;

    });

    localStorage.setItem(
      "inversa_users",
      JSON.stringify(updated)
    );

    loadUsers();

  };

  return (

    <table className="w-full border">

      <thead className="bg-gray-100">

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
              {user.role}
            </td>

            <td className="p-3 border">
              {user.suspended ? "Suspended" : "Active"}
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