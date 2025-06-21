const express = require("express");
const axios = require("axios");
const router = express.Router();

/**
 * 🔁 Image Proxy
 * This route fetches an image from any given URL and returns it back to the browser.
 * Helps bypass CORS issues or broken image links (especially old rover links).
 */
router.get("/image-proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL");
  }

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream", // Return as a stream (to pipe image directly)
      maxRedirects: 5, // Follow redirects (important for old NASA links)
      headers: {
        "User-Agent": "Mozilla/5.0", // Some servers reject unknown clients
        "Accept": "image/*",
      },
    });

    // Set correct content type and pipe image stream to the browser
    res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
    response.data.pipe(res);
  } catch (err) {
    console.error("Image Proxy Error:", err.message);
    res.status(500).send("Failed to fetch image");
  }
});

/**
 * 🌌 APOD Route
 * Fetches the Astronomy Picture of the Day for a given date (or today).
 * Source: https://api.nasa.gov/planetary/apod
 */
router.get("/apod", async (req, res) => {
  const { date } = req.query;
  const apiKey = process.env.NASA_API_KEY;

  try {
    const response = await axios.get("https://api.nasa.gov/planetary/apod", {
      params: {
        api_key: apiKey,
        date,             // Optional date (YYYY-MM-DD)
        thumbs: true,     // If it's a video, show a thumbnail
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("APOD fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch APOD" });
  }
});

/**
 * 🌍 EPIC Route
 * Fetches Earth images from the EPIC camera for a given date.
 * Source: https://api.nasa.gov/EPIC/api/natural/date/{date}
 */
router.get("/epic", async (req, res) => {
  const { date } = req.query;
  const apiKey = process.env.NASA_API_KEY;

  try {
    const response = await axios.get(
      `https://api.nasa.gov/EPIC/api/natural/date/${date}`,
      {
        params: { api_key: apiKey },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("EPIC fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch EPIC data" });
  }
});

module.exports = router;
