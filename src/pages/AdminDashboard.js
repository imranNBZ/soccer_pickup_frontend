import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import useFlash from "../hooks/useFlash";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [flash, setFlash] = useFlash();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/");
      return;
    }

    fetch("http://localhost:3001/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to load users:", err));
  }, [token, isAdmin, navigate]);

  const handleBlock = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/users/${userId}/block`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFlash({ message: `🚫 User ${userId} blocked`, type: "warning" });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: true } : u));
    } catch (err) {
      setFlash({ message: "Error blocking user: " + err.message, type: "danger" });
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/users/${userId}/unblock`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFlash({ message: `✅ User ${userId} unblocked`, type: "success" });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: false } : u));
    } catch (err) {
      setFlash({ message: "Error unblocking user: " + err.message, type: "danger" });
    }
  };

  return (
    <div className="container mt-4">
      {flash.message && (
        <FlashMessage
          message={flash.message}
          type={flash.type}
          onClose={() => setFlash({ message: "", type: "" })}
        />
      )}

      <h2 className="mb-4">👑 Admin Dashboard</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.is_admin ? "✅" : "❌"}</td>
                <td>{u.is_blocked ? "🚫" : "✅"}</td>
                <td>
                  {!u.is_admin && (
                    u.is_blocked ? (
                      <button className="btn btn-sm btn-success" onClick={() => handleUnblock(u.id)}>
                        Unblock
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-danger" onClick={() => handleBlock(u.id)}>
                        Block
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
