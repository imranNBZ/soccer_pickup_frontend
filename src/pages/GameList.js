import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";

function GameList() {
  const [games, setGames] = useState([]);
  const [rsvpUserMap, setRsvpUserMap] = useState({});
  const [joinedGameIds, setJoinedGameIds] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        return Promise.all(
          data.map((game) =>
            fetch(`http://localhost:3001/games/${game.id}/rsvps`)
              .then((res) => res.json())
              .then((users) => ({ gameId: game.id, users }))
          )
        );
      })
      .then((rsvpData) => {
        const rsvpMap = {};
        rsvpData.forEach(({ gameId, users }) => {
          rsvpMap[gameId] = users;
        });
        setRsvpUserMap(rsvpMap);
      });

    if (token && userId) {
      fetch(`http://localhost:3001/users/${userId}/rsvps`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const ids = data.map((game) => game.id);
          setJoinedGameIds(ids);
        });
    }

    const shouldRefresh = localStorage.getItem("gameUpdated") === "true";
    if (shouldRefresh) {
      localStorage.removeItem("gameUpdated");
    }
  }, []);

  const handleRSVP = async (gameId) => {
    try {
      const res = await fetch(`http://localhost:3001/games/${gameId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setJoinedGameIds((prev) => [...prev, gameId]);
    } catch (err) {
      alert("RSVP failed: " + err.message);
    }
  };

  const handleOptOut = async (gameId) => {
    try {
      const res = await fetch(`http://localhost:3001/games/${gameId}/rsvp`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setJoinedGameIds((prev) => prev.filter((id) => id !== gameId));
      setRsvpUserMap((prev) => {
        const updated = { ...prev };
        updated[gameId] = updated[gameId]?.filter((u) => u.id !== +userId);
        return updated;
      });
    } catch (err) {
      alert("Opt-out failed: " + err.message);
    }
  };

  const handleDelete = async (gameId) => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      const res = await fetch(`http://localhost:3001/games/${gameId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📍 Upcoming Pickup Games</h2>
      <MapView games={games} />

      <div className="row">
        {games.map((game) => (
          <div className="col-md-6 mb-4" key={game.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(game.datetime).toLocaleDateString()}
                </p>
                <p className="card-text mb-1">
                  <strong>Time:</strong>{" "}
                  {new Date(game.datetime).toLocaleTimeString()}
                </p>
                <p className="card-text mb-1">
                  <strong>Location:</strong> {game.location}
                </p>
                <p className="card-text">
                  <strong>Skill:</strong>{" "}
                  <span className="badge bg-primary">{game.skill_level}</span>
                </p>
                <p className="card-text text-muted">
                  Created by: {game.username}
                </p>

                <h6>Players Attending:</h6>
                {rsvpUserMap[game.id]?.length > 0 ? (
                  <ul className="mb-2">
                    {rsvpUserMap[game.id].map((user) => (
                      <li key={user.id}>
                        {user.username}
                        {user.id.toString() === userId && " (You)"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No RSVPs yet.</p>
                )}

                <div className="d-flex gap-2 flex-wrap">
                  {token &&
                    (joinedGameIds.includes(game.id) ? (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleOptOut(game.id)}
                      >
                        Opt Out
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleRSVP(game.id)}
                      >
                        RSVP
                      </button>
                    ))}

                  {(isAdmin || userId === `${game.created_by}`) && (
                    <>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => navigate(`/games/${game.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(game.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameList;
