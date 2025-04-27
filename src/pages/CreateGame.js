import React, { useState } from "react";
import MapView from "../components/MapView";
import FlashMessage from "../components/FlashMessage";
import useFlash from "../hooks/useFlash";
import { useNavigate } from "react-router-dom";


function CreateGame() {
  const [flash, setFlash] = useFlash();
  const [formData, setFormData] = useState({
    title: "",
    datetime: "",
    location: "",
    skill_level: "",
    latitude: null,
    longitude: null
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // assume token is stored on login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      let message;
      try {
        const data = await res.json();
        message = data.message || "❌ Failed to create game";
      } catch {
        const text = await res.text();
        message = text || "❌ Failed to create game";
      }
  
      if (res.ok) {
        setFlash({ message: "✅ Game created!", type: "success" });
        setTimeout(() => navigate("/games"), 1500);
      } else {
        setFlash({ message, type: "danger" });
      }
    } catch (err) {
      setFlash({ message: "⚠️ Something went wrong.", type: "danger" });
    }
  };
  
  

  return (
    <div>
      <h2>Create a Pickup Game</h2>
      <form onSubmit={handleSubmit}>
      {flash.message && (
          <FlashMessage
            message={flash.message}
            type={flash.type}
            onClose={() => setFlash({ message: "", type: "" })}
          />
        )}

        <input type="text" name="title" placeholder="Game Title" value={formData.title} onChange={handleChange} required />
        <input type="datetime-local" name="datetime" value={formData.datetime} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <select name="skill_level" value={formData.skill_level} onChange={handleChange} required>
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button type="submit">Create Game</button>
      </form>

      <MapView
        games={[]} // no markers in creation view
        onMapClick={({ lng, lat }) => {
          setFormData((f) => ({ ...f, latitude: lat, longitude: lng }));
          console.log("Selected coordinates:", lat, lng);
        }}
      />
      {formData.latitude && formData.longitude && (
      <p>📍 Selected coordinates: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}</p>
        )}

    </div>

    
  );
}

export default CreateGame;
