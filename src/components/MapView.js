import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

function MapView({ games, onMapClick }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.935242, 40.73061], // default NYC
      zoom: 11
    });

    mapRef.current = map;

    // Add pins for games
    if (Array.isArray(games)) {
      games.forEach(game => {
        if (game.latitude && game.longitude) {
          new mapboxgl.Marker()
            .setLngLat([game.longitude, game.latitude])
            .setPopup(new mapboxgl.Popup().setText(game.title))
            .addTo(map);
        }
      });
    }

    // Optional: allow selecting a point
    if (onMapClick) {
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        onMapClick({ lng, lat });
      });
    }

    return () => map.remove();
  }, [games, onMapClick]);

  return <div ref={mapContainer} style={{ height: "400px", width: "100%", marginTop: "1rem" }} />;
}

export default MapView;
