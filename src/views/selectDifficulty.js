// DifficultySelection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/selectDifficulty.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function DifficultySelection() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null);

  const handleDifficultyClick = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  const handleIntervalSubmit = (event) => {
    event.preventDefault();
    let a = parseInt(event.target.elements.a.value);
    let b = parseInt(event.target.elements.b.value);

    // Assurez-vous que a est toujours inférieur à b
    if (a > b) {
      [a, b] = [b, a];
    }

    navigate(`/GuessTheNumber/${difficulty}`, { state: { interval: [a, b] } });
  };

  if (difficulty === null) {
    return (
      <div className="container difficulty-selection-container p-5">
        <div className="row justify-content-center">
            <div className="col-12 text-center">
                <h2>Choisissez la difficulté :</h2>
            </div>
            <div className="col-12 d-flex justify-content-around">
                <div className="col-4 p-2">
                  <button className="btn btn-outline-success w-100 h-100" onClick={() => handleDifficultyClick('facile')}>
                    Facile
                  </button>
                </div>
                <div className="col-4 p-2">
                  <button className="btn btn-outline-success w-100 h-100" onClick={() => handleDifficultyClick('normal')}>
                    Normal
                  </button>
                </div>
                <div className="col-4 p-2">
                  <button className="btn btn-outline-success w-100 h-100" onClick={() => handleDifficultyClick('tres_difficile')}>
                    Très difficile
                  </button>
                </div>
            </div>
        </div>
    </div>
    );
  } else {
    return (
      <div className="container difficulty-selection-container p-5">
          <div className="row justify-content-center">
              <div className="col-12 text-center">
                  <h2>Mode: {difficulty}</h2>
                  <h2>Entrez les valeurs à utiliser comme intervalle :</h2>
              </div>
              <form onSubmit={handleIntervalSubmit}>
                  <div className="col-12 d-flex justify-content-around">
                      <div className="col-4 p-2">
                        <input type="number" name="a" min="0" required className="form-control" placeholder="Valeur a" />
                      </div>
                      <div className="col-4 p-2">
                        <input type="number" name="b" min="0" required className="form-control" placeholder="Valeur b" />
                      </div>
                  </div>
                  <div className="col-12 text-center">
                      <button type="submit" className="btn btn-outline-success">
                        Soumettre
                      </button>
                  </div>
              </form>
          </div>
      </div>
    );
  }
}

export default DifficultySelection;
