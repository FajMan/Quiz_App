// Getting element from game.html

const question = document.getElementById("question");
const progressText = document.getElementById("progress-text");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const game = document.getElementById("game");
const choices = Array.from(document.getElementsByClassName("choice-text"));


let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];
let questions = [];


// "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    ).then((response) => {  // receive data from the api
    return response.json(); // convert to json
}).then((loadingQuestions) => { // receives the json data, which returns an object
 console.log(loadingQuestions);
 questions = loadingQuestions.results.map((loadingQuestion) => {
    // accessing results from the object and then map through them.

    const formattedQuestion = {
        question: loadingQuestion.question,
    }

    const answerChoices = [...loadingQuestion.incorrect_answers];
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

    answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadingQuestion.correct_answer 
    );

    answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
    });

    return formattedQuestion;
 });

 startGame()
}).catch( (error) => {
    console.log(error);
});


const CORRECT_BONUS = 10;
const MAX_QUESTION = 7;

startGame = () => {
    questionCounter = 0;
    score = 0;

    availableQuestion = [...questions];

    getNewQuestion()
};

getNewQuestion = () => {
    // check if there's no more questions in the available question array or if questionCounter(0) is equal to 7
    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTION) {
        // If there's no more question, save the score to local storage. 
        localStorage.setItem("mostRecentScore", score);

        // Take us to the end page.
        return window.location.assign("./end.html");
    }

    questionCounter++;
    progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTION}`;

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestion.length);

    currentQuestion = availableQuestion[questionIndex];

    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestion.splice(questionIndex, 1);
    acceptingAnswer = true;
}; 

choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        if(!acceptingAnswer) return;

        acceptingAnswer = false;

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect"

        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS)
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};