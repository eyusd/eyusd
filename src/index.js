import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import TitlePlayer from "./titleplayer";
import Navbar from "./Navbar";
import SitesLinks from "./siteslinks"
import Home from "./home"

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/titles" element={<TitlePlayer />} />
      <Route path="/links" element={<SitesLinks />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
