import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import useFlash from "../hooks/useFlash";


function ProfileEdit() {
    const [flash, setFlash] = useFlash();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profile_pic: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`http://localhost:3001/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFormData((f) => ({
          ...f,
          username: data.username || "",
          bio: data.bio || "",
          profile_pic: data.profile_pic || "",
        }));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }

    if (token && userId) fetchUser();
  }, [token, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let message;
      try {
        const data = await res.json();
        message = data.message || "❌ Failed to update profile";
      } catch {
        const text = await res.text();
        message = text || "❌ Failed to update profile";
      }

      if (res.ok) {
        setFlash({ message: "✅ Profile updated!", type: "success" });
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        setFlash({ message, type: "danger" });
      }
    } catch (err) {
      setFlash({ message: "⚠️ Error updating profile", type: "danger" });
    }
  };

  
  

  if (loading) return <p>Loading form...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">✏️ Edit Your Profile</h2>
      <div className="card shadow-sm p-4">
      {flash.message && (
            <FlashMessage
                message={flash.message}
                type={flash.type}
                onClose={() => setFlash({ message: "", type: "" })}
            />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="profile_pic">Profile Picture URL</label>
            <input
              id="profile_pic"
              name="profile_pic"
              className="form-control"
              value={formData.profile_pic}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <button className="btn btn-success w-100">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
