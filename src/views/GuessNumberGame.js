// GuessNumberGame.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/GuessNumberGame.css';

const GuessNumberGame = () => {
  const { difficulty } = useParams();
  const location = useLocation();
  const { interval } = location.state || {};
  const [a, b] = interval || [1, 100];
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState('');
  const [numberToGuess, setNumberToGuess] = useState(Math.floor(Math.random() * (b - a + 1)) + a);
  const [guesses, setGuesses] = useState([]);
  const [leaderboard, setLeaderboard] = useState(JSON.parse(localStorage.getItem('leaderboard')) || {});

  // Fonction pour calculer le nombre d'essais en fonction de la difficulté
  const calculateAttempts = (a, b) => {
    switch (selectedDifficulty) {
      case 'facile':
        return Math.ceil(Math.log2(b - a) + 1);
      case 'normal':
        return Math.ceil(Math.log2(b - a));
      case 'tres_difficile':
        return Math.ceil((Math.log2(b - a) + 1) / 2);
      default:
        return;
    }
  };

  const [attempts, setAttempts] = useState(calculateAttempts(a, b));

  useEffect(() => {
    setSelectedDifficulty(difficulty);
    setAttempts(calculateAttempts(a, b));
  }, [difficulty, attempts]);

  const handleGuess = (e) => {
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
      // Mettre à jour le leaderboard
      updateLeaderboard('username', attempts); // Remplacez 'username' par le nom d'utilisateur réel
    }
  };

  // Fonction pour mettre à jour le leaderboard
  const updateLeaderboard = (username, score) => {
    if (!leaderboard[username] || (leaderboard[username] && leaderboard[username][selectedDifficulty] < score)) {
      setLeaderboard({
        ...leaderboard,
        [username]: {
          ...leaderboard[username],
          [selectedDifficulty]: score
        }
      });
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
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