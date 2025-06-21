const express = require("express");
const router = express.Router();
const axios = require("axios");

// Load NASA API key from environment variables
const NASA_API_KEY = process.env.NASA_API_KEY;

/**
 * @route   GET /api/nasa/mars
 * @desc    Fetch Mars rover photos for a given rover, Earth date, and optional camera
 * @params  rover (default: curiosity), date (required), camera (optional)
 * @example /api/nasa/mars?rover=spirit&date=2024-01-01&camera=FHAZ
 */
router.get("/", async (req, res) => {
  const { rover = "curiosity", date = "2020-01-01", camera } = req.query;

  // Validate required params
  if (!rover || !date) {
    return res.status(400).json({ error: "Missing required parameters: rover or date" });
  }

  try {
    // Build query parameters for NASA API
    const params = {
      earth_date: date,
      api_key: NASA_API_KEY,
    };

    if (camera) params.camera = camera;

    // Make request to NASA Mars Photos API
    const nasaURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`;
    const response = await axios.get(nasaURL, { params });

    // Return the list of photos
    res.json(response.data.photos);
  } catch (error) {
    console.error("🔴 Mars Rover API error:", error.message);

    // Log NASA error response if available
    if (error.response) {
      console.error("🔎 NASA Response Error:", error.response.data);
    }

    // Return a server error response
    res.status(500).json({ error: "Failed to fetch Mars rover photos" });
  }
});

/**
 * @route   GET /api/nasa/mars/manifest/:rover
 * @desc    Fetch photo manifest metadata (total sols, photos, etc.) for a given rover
 * @params  rover (required as route param)
 * @example /api/nasa/mars/manifest/opportunity
 */
router.get("/manifest/:rover", async (req, res) => {
  const { rover } = req.params;

  try {
    const manifestURL = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}`;
    const response = await axios.get(manifestURL, {
      params: { api_key: NASA_API_KEY },
    });

    // Return manifest information
    res.json(response.data.photo_manifest);
  } catch (error) {
    console.error("🔴 Manifest fetch error:", error.message);

    // Log detailed NASA response if available
    if (error.response) {
      console.error("🔎 NASA Response Error:", error.response.data);
    }

    // Return a server error
    res.status(500).json({ error: "Failed to fetch manifest" });
  }
});

// Export router so it can be used in main server file
module.exports = router;
