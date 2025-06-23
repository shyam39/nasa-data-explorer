import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RoverStats.css";

// Import chart components from Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RoverStats = ({ rover }) => {
  const [manifestData, setManifestData] = useState([]);
  const [cameraData, setCameraData] = useState([]);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const res = await axios.get(
          `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}`,
          { params: { api_key: import.meta.env.VITE_NASA_API_KEY } }
        );

        const photos = res.data.photo_manifest.photos;

        // Bar Chart Data: Take the first 15 Sols with photo counts
        const solCounts = photos.slice(0, 15).map((p) => ({
          sol: p.sol,
          photos: p.total_photos,
        }));

        // Camera frequency count across all photos
        const freq = {};
        photos.forEach((p) =>
          p.cameras.forEach((cam) => {
            freq[cam] = (freq[cam] || 0) + 1;
          })
        );

        // Convert to array format
        const rawCameraArray = Object.entries(freq).map(([name, value]) => ({
          name,
          value,
        }));

        // Group all minor cameras into a single "Other" category
        const threshold = 500;
        const grouped = [];
        let otherCount = 0;

        rawCameraArray.forEach((cam) => {
          if (cam.value < threshold) {
            otherCount += cam.value;
          } else {
            grouped.push(cam);
          }
        });

        if (otherCount > 0) {
          grouped.push({ name: "Other", value: otherCount });
        }

        // Set state
        setManifestData(solCounts);
        setCameraData(grouped);
      } catch (err) {
        console.error("Stats fetch error:", err.message);
      }
    };

    fetchManifest();
  }, [rover]);

  // Chart colors (cycled if more items than colors)
  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042",
    "#a4de6c", "#d0ed57", "#ffbb28", "#0088FE", "#00C49F", "#FF6666"
  ];

  return (
    <div className="rover-stats-container">
      <h2>📊 {rover.charAt(0).toUpperCase() + rover.slice(1)} Rover Stats</h2>

      <div className="rover-charts">
        {/* Bar Chart: Photos taken per Sol */}
        <div className="chart-block bar-chart">
          <h3>Photo Count by Sol</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={manifestData}>
              <XAxis dataKey="sol" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="photos" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Camera usage */}
        <div className="chart-block pie-chart">
          <h3 style={{ marginBottom: "1.2rem" }}>Camera Usage</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={cameraData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {cameraData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RoverStats;