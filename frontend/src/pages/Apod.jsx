import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Apod.css";

const Apod = () => {
  const [apod, setApod] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApod = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/nasa/apod", {
        params: { date },
      });
      setApod(res.data);
    } catch (err) {
      console.error("Failed to fetch APOD:", err.message);
      setApod(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApod();
  }, []);

  return (
    <div className="apod-container">
      <h1 className="apod-title">🌌 Astronomy Picture of the Day</h1>

      {/* Date input + Load button */}
      <div className="apod-form">
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchApod} disabled={loading}>
          {loading ? "Loading..." : "Load APOD"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="apod-loading-spinner"></div>
      )}

      {/* Show the result if data is available and not loading */}
      {!loading && apod && (
        <div className="apod-card">
          <h2>{apod.title}</h2>

          {apod.media_type === "image" ? (
            <img src={apod.url} alt={apod.title} />
          ) : (
            <iframe
              src={apod.url}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="APOD Video"
            ></iframe>
          )}

          <div className="apod-details">
            <p>{apod.explanation}</p>
            <p>
              <strong>Date:</strong> {apod.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apod;
