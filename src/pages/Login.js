import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import useFlash from "../hooks/useFlash"; // ✅ import your flash hook

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useFlash(); // ✅ use flash hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://soccer-pickup-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("isAdmin", data.user.isAdmin);

      setFlash({ message: "✅ Successfully logged in!", type: "success" });

      setTimeout(() => navigate("/games"), 1000); // delay to let flash show
    } catch (err) {
      console.error("Login error:", err);
      setFlash({ message: "❌ " + err.message, type: "danger" });
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

      <h2 className="mb-4">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
