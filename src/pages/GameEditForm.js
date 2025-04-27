import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function GameEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

  mapboxgl.accessToken = MAPBOX_TOKEN;
  const mapContainer = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    datetime: "",
    location: "",
    skill_level: "",
    latitude: null,
    longitude: null
  });
  const [originalLocation, setOriginalLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title,
          datetime: data.datetime.slice(0, 16),
          location: data.location,
          skill_level: data.skill_level,
          latitude: data.latitude,
          longitude: data.longitude
        });
        setOriginalLocation(data.location);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load game", err);
        alert("Error loading game data");
        navigate("/games");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && formData.latitude && formData.longitude) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [formData.longitude, formData.latitude],
        zoom: 14
      });

      new mapboxgl.Marker().setLngLat([formData.longitude, formData.latitude]).addTo(map);

      return () => map.remove();
    }
  }, [formData.latitude, formData.longitude, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location.trim()) {
      alert("Location cannot be empty");
      return;
    }

    let latitude = formData.latitude;
    let longitude = formData.longitude;

    try {
      if (formData.location !== originalLocation) {
        const geoRes = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            formData.location
          )}.json?access_token=${MAPBOX_TOKEN}`
        );

        const geoData = await geoRes.json();
        if (!geoData.features || geoData.features.length === 0) {
          alert("Invalid location. Please enter a valid address.");
          return;
        }

        [longitude, latitude] = geoData.features[0].center;
      }

      const res = await fetch(`http://localhost:3001/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, latitude, longitude })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("gameUpdated", "true");
      navigate("/games");
    } catch (err) {
      alert("Failed to update game: " + err.message);
    }
  };

  if (loading) return <p>Loading game info...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">✏️ Edit Game</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Game Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Game Title"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Date & Time</label>
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-8">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
            placeholder="Address"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Skill Level</label>
          <select
            name="skill_level"
            value={formData.skill_level}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Choose...</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="col-12 text-end">
          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h5>📍 Map Preview</h5>
        <div
          ref={mapContainer}
          className="border rounded"
          style={{ height: "300px", width: "100%" }}
        />
      </div>
    </div>
  );
}

export default GameEditForm;
