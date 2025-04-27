import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlashMessage from "../components/FlashMessage";
import useFlash from "../hooks/useFlash"; 

function Home() {
  const [games, setGames] = useState([]);
  const [flash, setFlash] = useFlash(); 
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      fetch(`http://localhost:3001/users/${userId}/rsvps`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch games.");
          return res.json();
        })
        .then((data) => setGames(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Failed to load RSVP games", err);
          setFlash({ message: "⚠️ Failed to load your games. Please try again.", type: "danger" });
        });
    }
  }, [token, userId, setFlash]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">⚽ Welcome to Pickup Soccer</h1>

      {flash.message && (
        <FlashMessage
          message={flash.message}
          type={flash.type}
          onClose={() => setFlash({ message: "", type: "" })}
        />
      )}

      {token ? (
        <>
          <h2 className="mb-3">📝 Your RSVP’d Games</h2>
          {games.length === 0 ? (
            <div className="alert alert-info">You haven’t joined any games yet.</div>
          ) : (
            <div className="row">
              {games.map((game) => (
                <div className="col-md-6 col-lg-4 mb-4" key={game.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{game.title}</h5>
                      <p className="card-text">
                        <strong>Date:</strong> {new Date(game.datetime).toLocaleDateString()}<br />
                        <strong>Time:</strong> {new Date(game.datetime).toLocaleTimeString()}<br />
                        <strong>Location:</strong> {game.location}<br />
                        <span className="badge bg-primary mt-2">{game.skill_level}</span>
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-top-0">
                      <Link to="/games" className="btn btn-sm btn-outline-primary">
                        Explore More Games
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-warning text-center">
          Please <Link to="/login" className="alert-link">log in</Link> to view your upcoming games.
        </div>
      )}
    </div>
  );
}

export default Home;
