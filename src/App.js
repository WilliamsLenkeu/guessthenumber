// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DifficultySelection from './views/selectDifficulty';
import GuessNumberGame from './views/GuessNumberGame';
import './css/App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<DifficultySelection />} />
          <Route path="/GuessTheNumber/:difficulty" element={<GuessNumberGame />} />
        </Routes>
      </div>
    </Router>
  );
}

function Header() {
  const navigate = useNavigate();
  const Home = () => {
    navigate(`/`);  
  };

  return (
    <center>
      <div className='row justify-content-center fs-3 fw-bold bg-body-tertiary p-4 mb-3 myContainer'>
        <a href='' onClick={Home}>Guess The Number 🔢</a>
      </div>
    </center>
  );
}

export default App;
