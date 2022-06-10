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
const interval = setInterval(decreaseTime, 1000);

inputCapital.addEventListener('keydown', submitAnswer);

function decreaseTime() {
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
    // Si réponse correcte
    if (inputCapital.value.localeCompare(currentCountry.capital[0], undefined, {sensitivity: 'base'}) === 0) {
        nbCurrentAnswer++;
        nbCorrectAnswers++;
    } else {
        nbCurrentAnswer++;
        // TODO: Optimiser
        //document.body.innerHTML += showAnswer(currentCountry.capital);
    }
    updateUI();
}

function check() {
    // Vérifier si c'est un mot
    // Si c'est correct
    // Popup réponse correcte + btn continuer
    // Sinon
    // Popup affichant la réponse correcte + btn continuer
    // Arreter minuteur
    // Si utilisateur appui continuer
    // Reinitialiser minuteur
    // Mettre à jour l'interface
}

function showAnswer(answer) {
    return `<div id="container-modal">
    <div class="modal">
        <p>Oups! La réponse c'était : ${answer}</p>
        <button onclick="closeModal()">Continuer</button>
    </div>
</div>`;
}

function closeModal() {
    const modal = document.getElementById('container-modal');
    modal.remove();
}

function updateUI() {
    inputCapital.value = '';
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
    console.log(currentCountry.capital);
}

initGame();
