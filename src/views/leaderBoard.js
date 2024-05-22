import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LeaderboardPage = () => {
    const location = useLocation();
    const { result } = location.state || {};
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Récupération du leaderboard depuis localStorage
        let storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        
        // Assurez-vous que storedLeaderboard est un tableau
        if (!Array.isArray(storedLeaderboard)) {
            storedLeaderboard = [];
        }

        // Récupération des données de jeu depuis localStorage
        const gameData = JSON.parse(localStorage.getItem('guessNumberGame')) || {};

        // Ajout des données de jeu au leaderboard si elles existent
        if (gameData.username && gameData.score !== undefined && gameData.difficulty) {
            storedLeaderboard.push(gameData);
        }

        setLeaderboard(storedLeaderboard);
    }, []);

    const clearLeaderboard = () => {
        localStorage.removeItem('leaderboard');
        setLeaderboard([]);
    };

    return (
        <div>
            <h1>Leaderboard</h1>
            {result && (
                <p>{result === 'win' ? 'Félicitations ! Vous avez gagné !' : 'Dommage, vous avez perdu. Réessayez !'}</p>
            )}
            {leaderboard.length > 0 ? (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Score</th>
                                <th>Difficulté</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.username}</td>
                                    <td>{entry.score}</td>
                                    <td>{entry.difficulty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={clearLeaderboard}>Effacer tous les scores</button>
                </>
            ) : (
                <p>Aucun score enregistré pour le moment.</p>
            )}
        </div>
    );
};

export default LeaderboardPage;
