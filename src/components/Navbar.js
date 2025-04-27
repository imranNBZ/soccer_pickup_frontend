import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useFlash from "../hooks/useFlash"; // ✅ import
import FlashMessage from "../components/FlashMessage"; // ✅ import

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [flash, setFlash] = useFlash(); // ✅ hook

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUsername(localStorage.getItem("username"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setFlash({ message: "✅ Logged out successfully", type: "info" }); // ✅ flash message
    navigate("/login");
  };

  return (
    <>
      {flash.message && (
        <div className="container-fluid mt-2 px-4">
          <FlashMessage
            message={flash.message}
            type={flash.type}
            onClose={() => setFlash({ message: "", type: "" })}
          />
        </div>
      )}

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold" to="/">⚽ Pickup Soccer</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/games" ? "active" : ""}`} to="/games">Games</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/create" ? "active" : ""}`} to="/create">Create Game</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/profile/edit" ? "active" : ""}`} to="/profile/edit">
                  Edit Profile
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin">Admin</Link>
                </li>
              )}
            </ul>

            <ul className="navbar-nav ms-auto">
              {token ? (
                <>
                {token && (
                      <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">
                        {username}
                        </Link>
                      </li>
                    )}
                  <li className="nav-item">
                    <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === "/login" ? "active" : ""}`} to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`} to="/signup">Signup</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
