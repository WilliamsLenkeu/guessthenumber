import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/GuessNumberGame.css';

const GuessNumberGame = () => {
  const { difficulty } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { interval, username } = location.state || {};
  const [a, b] = interval || [1, 100];
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');
  const [numberToGuess] = useState(Math.floor(Math.random() * (b - a + 1)) + a);
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const calculateAttempts = (a, b, difficulty) => {
    const easyAttempts = Math.ceil(Math.log2(b - a) + 1);
    const hardAttempts = Math.ceil((Math.log2(b - a) + 1) / 2);
  
    switch (difficulty) {
      case 'facile':
        return easyAttempts;
      case 'normal':
        return Math.ceil((easyAttempts + hardAttempts) / 2);
      case 'tres_difficile':
        return hardAttempts;
      default:
        return Math.ceil(Math.log2(b - a));
    }
  };

  const [attempts, setAttempts] = useState(calculateAttempts(a, b, difficulty));

  useEffect(() => {
    setSelectedDifficulty(difficulty);
    setAttempts(calculateAttempts(a, b, difficulty));
  }, [difficulty, a, b]);

  const handleGuess = async (e) => {
    e.preventDefault();
    if (guess === '') {
      return;
    }
    const userGuess = parseInt(guess);
    setGuesses([...guesses, userGuess]);
    setAttempts(attempts - 1);

    if (userGuess < numberToGuess) {
      setMessage('Votre estimation est trop basse !');
      setMessageClass('low-guess');
    } else if (userGuess > numberToGuess) {
      setMessage('Votre estimation est trop élevée !');
      setMessageClass('high-guess');
    } else {
      setMessage('Félicitations ! Vous avez trouvé le nombre !');
      setMessageClass('correct-guess');
      await updateLeaderboard(username, attempts);
      saveToLocalStorage(username, attempts, selectedDifficulty);
      navigate('/leaderboard', { state: { result: 'win' } });
      return;
    }

    if (attempts - 1 <= 0 && userGuess !== numberToGuess) {
      setGameOver(true);
      setMessage('Jeu terminé ! Vous avez épuisé tous vos essais.');
      setMessageClass('game-over');
      saveToLocalStorage(username, 0, selectedDifficulty); // Ajouté pour stocker le score avant la redirection
      navigate('/leaderboard', { state: { result: 'lose' } });
    }
    setGuess('');
  };

  const updateLeaderboard = async (username, score) => {
    try {
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
      leaderboard.push({ username, score, difficulty: selectedDifficulty });
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  const saveToLocalStorage = (username, score, difficulty) => {
    const gameData = {
      username,
      score,
      difficulty,
    };
    localStorage.setItem('guessNumberGame', JSON.stringify(gameData));
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('guessNumberGame');
    if (savedData) {
      const { username, score, difficulty } = JSON.parse(savedData);
      console.log('Loaded from localStorage:', username, score, difficulty);
    }
  };

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <div>
      <div className='custom-container-min justify-content-center my-3'>
        <h2 className='m-auto'>Mode {difficulty}</h2>
      </div>
      <div className="custom-container">
        <h2>Devinez le nombre entre {a} et {b}</h2>
        <form onSubmit={handleGuess} id="game">
          <input 
            type="number" 
            value={guess} 
            onChange={(e) => setGuess(e.target.value)} 
            required 
            disabled={gameOver}
          />
          <button 
            type="submit" 
            disabled={attempts <= 0 || guess === '' || gameOver}
          >
            Soumettre
          </button>
        </form>
        <p className={`result ${messageClass}`}>{message}</p>
        <p id="no-of-guesses">Nombre d'essais restants : {attempts}</p>
        <p id="guessed-nums">Estimations précédentes : {guesses.join(', ')}</p>
      </div>
    </div>
  );
};

export default GuessNumberGame;
