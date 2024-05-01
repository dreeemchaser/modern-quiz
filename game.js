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
const questions = [
    {
        question: "Who holds the record for the highest individual score in Test cricket?",
        choice1: "Sachin Tendulkar",
        choice2: "Brian Lara",
        choice3: "Ricky Ponting",
        choice4: "Don Bradman",
        answer: 2
    },
    {
        question: "Which country won the ICC Cricket World Cup in 2019?",
        choice1: "India",
        choice2: "Australia",
        choice3: "England",
        choice4: "New Zealand",
        answer: 3
    },
    {
        question: "Who is known as the 'King of Spin' in cricket?",
        choice1: "Shane Warne",
        choice2: "Muttiah Muralitharan",
        choice3: "Anil Kumble",
        choice4: "Saqlain Mushtaq",
        answer: 1
    },
    {
        question: "Which player has scored the most runs in One Day Internationals (ODIs)?",
        choice1: "Virat Kohli",
        choice2: "Sachin Tendulkar",
        choice3: "Ricky Ponting",
        choice4: "Kumar Sangakkara",
        answer: 2
    },
    {
        question: "What is the highest team total in a Test match innings?",
        choice1: "890",
        choice2: "952/6",
        choice3: "876",
        choice4: "871/7",
        answer: 2
    }
];

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
