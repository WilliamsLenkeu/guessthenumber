import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/GuessNumberGame.css';

const GuessNumberGame = () => {
  const { difficulty } = useParams();
  const location = useLocation();
  const { interval, username } = location.state || {};
  const [a, b] = interval || [1, 100];
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');
  const [numberToGuess, setNumberToGuess] = useState(Math.floor(Math.random() * (b - a + 1)) + a);
  const [guesses, setGuesses] = useState([]);

  const calculateAttempts = (a, b, difficulty) => {
    switch (difficulty) {
      case 'facile':
        return Math.ceil(Math.log2(b - a) + 1);
      case 'normal':
        return Math.ceil(Math.log2(b - a));
      case 'tres_difficile':
        return Math.ceil((Math.log2(b - a) + 1) / 2);
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
      await updateLeaderboard(username, attempts); // Utilise le pseudo de l'utilisateur
    }
    setGuess('');
  };

  const updateLeaderboard = async (username, score) => {
    try {
      const response = await fetch('/updateLeaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, score, difficulty: selectedDifficulty }),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  return (
    <div>
      <div className='custom-container-min justify-content-center my-3'>
        <h2 className='m-auto'>Mode {difficulty}</h2>
      </div>
      <div className="custom-container">
        <h2>Devinez le nombre entre {a} et {b}</h2>
        <form onSubmit={handleGuess} id="game">
          <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} required />
          <button type="submit" disabled={attempts <= 0 || guess === ''}>Soumettre</button>
        </form>
        <p className={`result ${messageClass}`}>{message}</p>
        <p id="no-of-guesses">Nombre d'essais restants : {attempts}</p>
        <p id="guessed-nums">Estimations précédentes : {guesses.join(', ')}</p>
      </div>
    </div>
  );
};

export default GuessNumberGame;
