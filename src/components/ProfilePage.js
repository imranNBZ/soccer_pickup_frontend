import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      fetch(`https://soccer-pickup-backend.onrender.com/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Failed to fetch user info", err));
    }
  }, [token, userId]);

  if (!user) return <p className="text-center mt-4">Loading profile...</p>;
  console.log("Profile picture URL:", user.profile_pic);


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white text-center">
              <h3>👤 Your Profile</h3>
            </div>
            <div className="card-body text-center">
            <img
                src={user.profile_pic ? user.profile_pic : "https://placehold.co/150x150?text=No+Image"}
                alt="Profile"
                className="rounded-circle"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/150x150?text=No+Image";
                }}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />


              <h4 className="card-title">{user.username}</h4>
              <p className="card-text">
                <strong>Email:</strong> {user.email}<br />
                <strong>Location:</strong> {user.location}<br />
                <strong>Bio:</strong> {user.bio || "No bio added."}
              </p>

              <hr />

                <Link to="/profile/edit" className="btn btn-outline-secondary btn-sm mt-3">
                Edit Profile
                </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
