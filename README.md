# 🚀 NASA Data Explorer

This is my NASA data explorer project built with React, Node.js, and Express. It shows:

- 🪐 Astronomy Picture of the Day (APOD)
- 🚗 Mars Rover Gallery
- 🌍 Earth (EPIC) Image Viewer

## 🧠 Features

- Frontend in **React**
- Backend in **Express.js**
- Data fetched using **NASA Open APIs**
- Clean and responsive UI using plain CSS
- Date and camera filters for Mars Rover
- Modal photo viewer, loading states, and error handling

## 📁 Folder Structure

- `frontend/` → React app
- `backend/` → Express API proxy and routing
- `routes/` → Handles APOD, Mars Rover, EPIC
- `components/` → Stats cards, gallery, modal

## 🌐 Live Demo

- Frontend: [https://nasa-explorer.vercel.app](#)
- Backend: [https://nasa-api.onrender.com](#)

## 🛠 Prerequisites

Before running the project locally, make sure you have:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

## 📦 Installation

```bash
git clone https://github.com/shyam39/nasa-data-explorer.git
cd nasa-data-explorer

## For frontend
cd frontend
npm install
npm run dev

## For backend
cd backend
npm install
npm start

Make sure to create a .env file in the backend folder with: NASA_API_KEY=your_key

🛰️ APIs Used
NASA APOD
NASA Mars Rover Photos
NASA EPIC Earth 

🙌 Credits
Thanks to NASA Open APIs.

---
