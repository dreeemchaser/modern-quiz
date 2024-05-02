// DOM elements
const questionElement = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const progressbBarFull = document.getElementById('progress-bar-full');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
// Game variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0; 
let questionCounter = 0;
let availableQuestions = [];

// Sample questions
let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        game.classList.remove("hidden");
        loader.classList.add("hidden");
        startGame();
    })
    .catch(error => {
        console.log(error);
    });

// Game constants 
const CORRECT_BONUS = 100;
const MAX_QUESTIONS = 5;

// Function to start the game
function startGame() {
    questionCounter = 0; 
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
};
    
// Function to get a new question
function getNewQuestion() {

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        //Locate to the end page. 
        return window.location.assign("end.html");
    }

    questionCounter++;
    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    // Updating the progress bar ! 
    progressbBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionElement.innerText = currentQuestion.question;
    
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];  
    });

    availableQuestions.splice(questionIndex, 1); //get rid of the quiestion we used. 
    acceptingAnswers = true;
};

choices.forEach( choice => {
    choice.addEventListener( "click" , e => {
        if(!acceptingAnswers) return; 

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
    
        const classToApply = (selectedAnswer == currentQuestion.answer ? "correct" : "incorrect"); // must use double == !
        
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        //setTimeout - delay after answering each question. 
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500) 
    })
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
