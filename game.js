// DOM elements
const questionElement = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const progressbBarFull = document.getElementById('progress-bar-full');

// Game variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0; 
let questionCounter = 0;
let availableQuestions = [];

// Sample questions
let questions = [];
fetch("questions.json").then(res => {
    console.log(res);
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

// Start the game
startGame();
