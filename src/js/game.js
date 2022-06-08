let timerSpan = document.getElementById('timer');
let correctAnswersSpan = document.getElementById('correct-answers');
let currentAnswerSpan = document.getElementById('current-answer');
let nameCountry = document.getElementById('game-country-name');
let flagCountry = document.getElementById('country-flag');
let inputCapital = document.getElementById('country-capital');
const TIMETOANSWER = 15; // Temps de réponse par question
const NBANSWERS = 15;
let time = TIMETOANSWER;
let countriesToFind;
let currentCountry;
let nbCorrectAnswers = 0;
let nbCurrentAnswer = 1;

inputCapital.addEventListener('keydown', submitAnswer);

const decreaseTime = () => {
    // Changement de couleur et de secondes
    timerSpan.innerText = `${time} S`;
    timerSpan.style.color = changeColor(time);

    // Vérification du compteur
    if (time <= 0) {
        time = TIMETOANSWER;
        // TODO: Afficher réponse correcte si incorrect
        checkAnswer();
    } else {
        time--;
    }
}

function submitAnswer() {
    if (event.key === 'Enter' && isAWord(inputCapital.value)) {
        checkAnswer();
    }
}

function checkAnswer() {
    console.log(currentCountry.capital[0]);
    // Si réponse correcte
    if (inputCapital.value.localeCompare(currentCountry.capital[0], undefined, {sensitivity: 'base'}) === 0) {
        nbCurrentAnswer++;
        nbCorrectAnswers++;
    } else {
        nbCurrentAnswer++;
    }
    updateUI();
}

function updateUI() {
    time = TIMETOANSWER;
    updateCountry();
    gameIsOver();
    updateCounters();
}

function gameIsOver() {
    if (nbCurrentAnswer === NBANSWERS) {
        nbCorrectAnswers = 0;
        nbCurrentAnswer = 1;
        time = TIMETOANSWER;
    }
}

// TODO : Function repetée
function isAWord(string) {
    return string.match(/^\D+$/);
}

function updateCounters() {
    currentAnswerSpan.innerText = `${nbCurrentAnswer} / ${NBANSWERS}`;
    correctAnswersSpan.innerText = `${nbCorrectAnswers} / ${NBANSWERS}`;
}

function changeColor(timer) {
    if (timer <= 5) {
        return 'red';
    } else {
        return 'white';
    }
}

setInterval(decreaseTime, 1000);

async function getCountries(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function initGame() {
    let url = 'https://restcountries.com/v3.1/all?fields=name,capital,flags';
    countriesToFind = await getCountries(url);
    updateCountry();
    updateCounters();
}

function updateCountry() {
    // Changer le pays
    currentCountry = countriesToFind[Math.floor(Math.random() * countriesToFind.length)];
    flagCountry.setAttribute('src', currentCountry.flags.png)
    nameCountry.innerText = currentCountry.name.common;
}

initGame();
