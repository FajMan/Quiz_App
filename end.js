const username = document.getElementById("username");
const saveScoreButton = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScore = JSON.parse(localStorage.getItem("highScore")) || [];

username.addEventListener("keyup", () => {
    saveScoreButton.disabled = !username.value;
});

const saveHighScore = () => {
    const score = {
        name: username.value,
        score: mostRecentScore,
    };

    highScore.push(score);
    highScore.sort((a, b) => b.score - a.score);
    highScore.splice(5);

    localStorage.setItem("highScore", JSON.stringify(score));
    window.location.assign("./index.html");
};

saveScoreButton.addEventListener("click", (event) => {
    event.preventDefault();

    saveHighScore();
});