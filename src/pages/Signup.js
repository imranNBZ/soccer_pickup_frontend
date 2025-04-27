import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import useFlash from "../hooks/useFlash";

function Signup() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    location: "",
    profile_pic: ""
  });

  const [flash, setFlash] = useFlash(); // ✅ Custom flash hook
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("https://soccer-pickup-backend.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setFlash({ message: "✅ User created! You can now log in.", type: "success" });

      setTimeout(() => navigate("/login"), 1500); // Give time to show the message
    } catch (err) {
      console.error("Signup error:", err);
      setFlash({ message: "❌ " + err.message, type: "danger" });
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      {flash.message && (
        <FlashMessage
          message={flash.message}
          type={flash.type}
          onClose={() => setFlash({ message: "", type: "" })}
        />
      )}

      <h2 className="mb-4">Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="username"
            className="form-control"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="bio"
            className="form-control"
            placeholder="Short bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <input
            name="location"
            className="form-control"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            name="profile_pic"
            type="url"
            className="form-control"
            placeholder="Profile picture URL (optional)"
            value={formData.profile_pic}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

      </form>
    </div>
  );
}

export default Signup;
