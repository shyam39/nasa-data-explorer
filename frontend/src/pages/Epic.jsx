import { useState } from "react";
import axios from "axios";
import "../styles/Epic.css";
import earthRotating from "../assets/epic/earth-rotating.gif";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Epic = () => {
  // State variables
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch EPIC images for the selected date
  const fetchEpic = async () => {
    const today = new Date().toISOString().split("T")[0];

    // Prevent future dates
    if (date > today) {
      setError("Cannot fetch images from the future.");
      setImages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/nasa/epic`, {
        params: { date },
      });

      setImages(res.data);
      setError(res.data.length === 0 ? "No EPIC images found for this date." : null);
    } catch (err) {
      console.error("EPIC fetch error:", err.message);
      setImages([]);
      setError("Failed to fetch EPIC images. Try a different date.");
    } finally {
      setLoading(false);
    }
  };

  // Format image URL from EPIC metadata
  const formatImageUrl = (img) => {
    const [yyyy, mm, dd] = img.date.split(" ")[0].split("-");
    return `https://epic.gsfc.nasa.gov/archive/natural/${yyyy}/${mm}/${dd}/jpg/${img.image}.jpg`;
  };

  return (
    <div className="epic-container">
      <h1>🌍 EPIC Earth Imagery</h1>

      {/* Date Input & Load Button */}
      <div className="epic-form">
        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchEpic} disabled={loading}>
          {loading ? <span className="loading-spinner" /> : "Load Images"}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="epic-error">{error}</p>}

      {/* EPIC Gallery */}
      <div className="epic-gallery">
        {images.map((img) => {
          const imgUrl = formatImageUrl(img);
          const proxyUrl = `${API_BASE_URL}/nasa/image-proxy?url=${encodeURIComponent(imgUrl)}`;

          return (
            <div key={img.identifier} className="epic-card">
              <img
                src={proxyUrl}
                alt={img.caption}
                loading="lazy"
                className="epic-thumbnail"
                onClick={() =>
                  setSelectedImage({
                    url: proxyUrl,
                    caption: img.caption,
                    date: img.date,
                  })
                }
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.insertAdjacentHTML(
                    "afterend",
                    `<div style="color:#aaa;">🛑 Image unavailable</div>`
                  );
                }}
              />
              <p>{img.caption}</p>
              <small>{img.date}</small>
            </div>
          );
        })}
      </div>

      {/*  Modal Viewer */}
      {selectedImage && (
        <div className="epic-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="epic-modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt="Full Earth"
              className="epic-modal-image"
            />
            <p><strong>Caption:</strong> {selectedImage.caption}</p>
            <p><strong>Date:</strong> {selectedImage.date}</p>
            <button onClick={() => setSelectedImage(null)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}

      {/*  Landing Info */}
      {!images.length && !error && (
        <div className="epic-landing">
          <img
            src={earthRotating}
            alt="Rotating Earth"
            className="epic-earth-gif"
          />
          <div className="epic-intro">
            <h2>What is EPIC?</h2>
            <p>
              The Earth Polychromatic Imaging Camera (EPIC) is a NASA instrument
              onboard the NOAA DSCOVR spacecraft. It captures stunning images of
              Earth from the L1 point, enabling real-time observations of clouds,
              ozone, aerosols, and vegetation.
            </p>
            <p>
              Use the date picker above to explore breathtaking Earth imagery
              from space.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Epic;
