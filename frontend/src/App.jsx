import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MarsGallery from "./pages/MarsGallery";
import Apod from './pages/Apod';
import Epic from "./pages/Epic";
import "./styles/app.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <nav className="navbar">
          <Link to="/apod" className="nav-link">🪐 APOD</Link>
          <Link to="/mars" className="nav-link">🚗 Mars Gallery</Link>
          <Link to="/epic" className="nav-link">🌍 EPIC</Link> {/* ✅ New */}
        </nav>

        <div className="app-content">
          <Routes>
            <Route path="/apod" element={<Apod />} />
            <Route path="/mars" element={<MarsGallery />} />
            <Route path="/epic" element={<Epic />} /> {/* ✅ New */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
