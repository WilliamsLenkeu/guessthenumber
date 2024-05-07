import React, { useState, useEffect } from 'react';
import './GuessNumberGame.css';

const GuessNumberGame = () => {
  const [answer, setAnswer] = useState(0);
  const [noOfGuesses, setNoOfGuesses] = useState(0);
  const [guessedNumsArr, setGuessedNumsArr] = useState([]);
  const [userGuess, setUserGuess] = useState('');
  const [hint, setHint] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const play = () => {
    const guess = parseInt(userGuess);
    if (guess < 1 || guess > 100 || isNaN(guess)) {
      alert("Entrez un nombre valide dans l'intervalle.");
      return;
    }
    const newGuessedNumsArr = [...guessedNumsArr, guess];
    setGuessedNumsArr(newGuessedNumsArr);
    setNoOfGuesses(noOfGuesses + 1);
    if (guess !== answer) {
      if (noOfGuesses === 6) {
        setHint(`Désolé, vous avez perdu ! Le nombre était ${answer}.`);
        setGameOver(true);
      } else {
        if (guess < answer) {
          setHint("Vous êtes en dessous de la réponse");
        } else {
          setHint("Vous êtes au-dessus de la réponse");
        }
        setTimeout(() => {
          setHintClass("error");
        }, 10);
      }
    } else {
      setHint(`Bravo ! Le nombre était ${answer}. Vous l'avez trouvé en ${noOfGuesses} essai(s).`);
      setGameOver(true);
      setHintClass("success");
    }
  };

  const restartGame = () => {
    setAnswer(Math.floor(Math.random() * 100) + 1);
    setNoOfGuesses(0);
    setGuessedNumsArr([]);
    setUserGuess('');
    setHint('');
    setGameOver(false);
  };

  useEffect(() => {
    restartGame();
  }, []);

  const setHintClass = (className) => {
    const hintElement = document.getElementById("hint");
    hintElement.classList.remove("error", "success");
    hintElement.classList.add(className);
  };

  return (
    <div class="custom-container">
  <div id="game">
    <h2>
      Bienvenue dans le jeu de devinette ! 👳<br />
      (Tu dois devinez le nombre au quel je pense 🧠. Ce nombre est situer entre 1 et 100)
    </h2>
    
    <div class="input-wrapper">
      <input type="number" placeholder="Entrez votre estimation" value={userGuess} onChange={(e) => setUserGuess(e.target.value)} />
      <br></br><button class="bouton" onClick={play}>Devinez</button>
    </div>
    <p id="no-of-guesses">Nombre d'essais : {noOfGuesses}</p>
    <p id="guessed-nums">Vos estimations : {guessedNumsArr.join(', ')}</p>
  </div>
  <button id="restart" onClick={restartGame} style={{ display: gameOver ? 'block' : 'none' }}>Recommencer</button>
  <div class="result">
    <div id="hint">{hint}</div>
  </div>
</div>

  );
};

export default GuessNumberGame;
