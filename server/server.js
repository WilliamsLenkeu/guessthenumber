const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/updateLeaderboard', (req, res) => {
  const { username, score, difficulty } = req.body;
  const leaderboardPath = path.join(__dirname, 'leaderBoard.json');

  fs.readFile(leaderboardPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading leaderboard file:', err);
      return res.status(500).json({ message: 'Error reading leaderboard file' });
    }

    let leaderboard;
    try {
      leaderboard = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing leaderboard file:', parseError);
      return res.status(500).json({ message: 'Error parsing leaderboard file' });
    }

    if (!leaderboard[username]) {
      leaderboard[username] = {};
    }

    if (!leaderboard[username][difficulty] || leaderboard[username][difficulty] > score) {
      leaderboard[username][difficulty] = score;
    }

    fs.writeFile(leaderboardPath, JSON.stringify(leaderboard, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing to leaderboard file:', writeErr);
        return res.status(500).json({ message: 'Error writing to leaderboard file' });
      }

      res.json({ message: 'Leaderboard updated successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
