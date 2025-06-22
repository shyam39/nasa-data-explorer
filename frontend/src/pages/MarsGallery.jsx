import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/marsgallery.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import CuriosityImg from "../assets/rovers/curiosity.jpg";
import OpportunityImg from "../assets/rovers/opportunity.jpg";
import SpiritImg from "../assets/rovers/spirit.jpg";
import { NASA_API_KEY } from "../config/api";
import RoverStats from "../components/RoverStats";

const MarsGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [rover, setRover] = useState("curiosity");
  const [date, setDate] = useState("");
  const [camera, setCamera] = useState("");
  const [validDates, setValidDates] = useState([]);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [lastFetchedRover, setLastFetchedRover] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (rover === lastFetchedRover) return;

    const fetchManifest = async () => {
      try {
       const res = await axios.get(`${API_BASE_URL}/nasa/mars/manifest/${rover}`);
       
         const manifest = res.data;
        const dates = manifest.photos.map((p) => p.earth_date);
        const cameraSet = new Set();

        manifest.photos.forEach((photo) => {
          photo.cameras.forEach((cam) => cameraSet.add(cam));
        });

        setValidDates(dates);
        setAvailableCameras([...cameraSet]);
        setLastFetchedRover(rover);
        setError(null);
        setDate("");
        setCamera("");
        setPhotos([]);
      } catch (err) {
        console.error("Failed to fetch rover manifest:", err.message);
        setError("Failed to fetch rover manifest");
        setValidDates([]);
        setAvailableCameras([]);
      }
    };

    fetchManifest();
  }, [rover, lastFetchedRover]);

  const fetchPhotos = async () => {
    if (!date) return;
    setLoading(true);
    setError(null);

    try {
      const params = { rover, date };
      if (camera) params.camera = camera;

      const res = await axios.get(`${API_BASE_URL}/nasa/mars`, { params });


      const rawPhotos = res.data;
      const filteredPhotos = rawPhotos.filter(
        (photo) =>
          photo.img_src.startsWith("http") && !photo.img_src.includes("invalid")
      );

      setPhotos(
        camera ? filteredPhotos.filter((p) => p.camera.name === camera) : filteredPhotos
      );
    } catch (err) {
      console.error("Fetch error:", err.message);
      setPhotos([]);
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (photo) => {
   return `${API_BASE_URL}/nasa/image-proxy?url=${encodeURIComponent(photo.img_src)}`;
  };

  return (
    <div className="mars-container">
      <h1 className="mars-title">🚀 Mars Rover Photo Gallery</h1>

      {/* Filter Controls */}
      <div className="mars-form">
        <select value={rover} onChange={(e) => setRover(e.target.value)}>
          <option value="curiosity">Curiosity</option>
          <option value="opportunity">Opportunity</option>
          <option value="spirit">Spirit</option>
        </select>

        <select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={validDates.length === 0}
        >
          <option value="">Select Date</option>
          {validDates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={camera}
          onChange={(e) => setCamera(e.target.value)}
          disabled={availableCameras.length === 0}
        >
          <option value="">All Cameras</option>
          {availableCameras.map((cam) => (
            <option key={cam} value={cam}>
              {cam}
            </option>
          ))}
        </select>

        <button onClick={fetchPhotos} disabled={!date || loading}>
          {loading ? "Loading..." : "Load Photos"}
        </button>
      </div>

      {/* Error Message */}
      {error && photos.length === 0 && <p className="mars-error">{error}</p>}

      {/* Rover Cards */}
      <div className="mars-intro">
        <h2 className="intro-heading">Explore Mars with NASA's Rovers</h2>
        <p className="intro-subtext">
          NASA has sent several robotic rovers to explore the Martian surface.
          Each has contributed unique insights into the red planet's past,
          geology, and potential for life.
        </p>

        <div className="rover-cards">
          <div className="rover-card">
            <img src={CuriosityImg} alt="Curiosity Rover" />
            <h3>Curiosity</h3>
            <p>
              Launched in 2011, Curiosity studies Mars' climate and geology,
              preparing for human exploration.
            </p>
          </div>

          <div className="rover-card">
            <img src={OpportunityImg} alt="Opportunity Rover" />
            <h3>Opportunity</h3>
            <p>
              Operated for nearly 15 years, this rover helped find strong
              evidence of ancient water flows on Mars.
            </p>
          </div>

          <div className="rover-card">
            <img src={SpiritImg} alt="Spirit Rover" />
            <h3>Spirit</h3>
            <p>
              Active from 2004 to 2010, Spirit made discoveries about past
              volcanic activity and water.
            </p>
          </div>
        </div>
      </div>

      {/* Rover Stats */}
      <RoverStats rover={rover} />

      {/* Photo Gallery */}
      <div className="mars-gallery">
        {loading && <div className="mars-loading-spinner"></div>}

        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="mars-photo-card">
              <img
                src={getImageSrc(photo)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  e.target.insertAdjacentHTML(
                    "afterend",
                    `<div class="mars-photo-fallback">🔴 Image not available</div>`
                  );
                }}
                alt={`Mars - ${photo.id}`}
                onClick={() => setSelectedPhoto(photo)}
                style={{ cursor: "pointer" }}
              />
              <div className="mars-photo-info">
                <p>
                  <strong>Camera:</strong> {photo.camera.full_name}
                </p>
                <p>
                  <strong>Date:</strong> {photo.earth_date}
                </p>
              </div>
            </div>
          ))
        ) : (
          !loading &&
          date &&
          error === null && <p className="mars-none">No photos found for this date.</p>
        )}
      </div>

      {/* Modal View */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageSrc(selectedPhoto)} alt="Expanded Mars" />
            <p>
              <strong>Camera:</strong> {selectedPhoto.camera.full_name}
            </p>
            <p>
              <strong>Date:</strong> {selectedPhoto.earth_date}
            </p>
            <button onClick={() => setSelectedPhoto(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarsGallery;
