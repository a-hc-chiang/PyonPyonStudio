import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";
import LandingPage from './components/maker/LandingPage';
import VNCreationPage from './components/maker/VNCreationPage';
import GameLibrary from './components/maker/GameLibrary';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate-vn" element={<VNCreationPage/>} />
        <Route path="/library" element={<GameLibrary/>} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
