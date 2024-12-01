import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";
import LandingPage from './components/maker/LandingPage';
import VNCreationPage from './components/maker/VNCreationPage';
import GameLogicPage from './components/game/Game.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate-vn" element={<VNCreationPage/>} />
        <Route path="/play-game" element={<GameLogicPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
