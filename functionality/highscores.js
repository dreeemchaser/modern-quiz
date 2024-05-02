const highScoresBody = document.getElementById('highScoresBody');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresBody.innerHTML = highScores
                            .map(score => `<tr><td>${score.name}</td><td>${score.score}</td></tr>`)
                            .join("");

console.log(highScores);
