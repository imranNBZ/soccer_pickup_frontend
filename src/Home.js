import { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://soccer-pickup-backend.onrender.com")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div>
      <h1>Welcome to Pickup Soccer Finder! ⚽</h1>
      <p>{message}</p>
    </div>
  );
}
