# 🚀 NASA Data Explorer

This is my full-stack NASA Data Explorer project built with **React**, **Node.js**, and **Express**. It allows users to explore:

- 🪐 Astronomy Picture of the Day (APOD)
- 🚗 Mars Rover Image Gallery
- 🌍 Earth Polychromatic Imaging Camera (EPIC) Viewer

## 🧠 Features

- ⚛️ Frontend in React
- 🔧 Backend in Express.js
- 📡 Data via NASA Open APIs
- 🎛️ Filters for rover, date, and camera
- 💡 Modal viewer for Mars & EPIC photos
- 📱 Fully responsive and clean UI

## 🌐 Live Project

- **Frontend:** [https://nasa-data-explorer-ten.vercel.app](https://nasa-data-explorer-ten.vercel.app/)
- **Backend:** [https://nasa-api-yf3n.onrender.com](https://nasa-api-yf3n.onrender.com)
- **GitHub Repo:** [github.com/shyam39/nasa-data-explorer](https://github.com/shyam39/nasa-data-explorer)

## 🧪 Sample API Endpoints

- `GET /api/nasa/apod`  
  → Astronomy Picture of the Day  
- `GET /api/nasa/mars?rover=curiosity&date=2020-01-01`  
  → Mars rover photos for specific date  
- `GET /api/nasa/epic?date=2024-06-01`  
  → EPIC Earth images from specific date  

## 🗂️ Project Structure

```
nasa-data-explorer/
├── frontend/       # React App
├── backend/        # Express Server
├── routes/         # NASA API Routes (APOD, Mars, EPIC)
├── components/     # Modal, Cards, Stats
└── .env            # API keys (not committed)
```

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm (Node Package Manager)
- A NASA API key from [api.nasa.gov](https://api.nasa.gov/)

### Local Setup

```bash
git clone https://github.com/shyam39/nasa-data-explorer.git
cd nasa-data-explorer

# Backend setup
cd backend
npm install
# Create a .env file with:
# NASA_API_KEY=your_api_key
npm start

# Frontend setup
cd ../frontend
npm install
# Create a .env file with:
# VITE_API_BASE_URL=https://nasa-api-yf3n.onrender.com/api
# VITE_NASA_API_KEY=your_api_key
npm run dev
```

## 📦 Technologies Used

- React + Vite
- Express.js
- Axios
- NASA Open APIs
- Render (backend deployment)
- Vercel (frontend deployment)

---

### 👨‍💻 Author

**Shyam NSG**  
GitHub: [@shyam39](https://github.com/shyam39)

---