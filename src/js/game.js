const TIMER_SPAN = document.getElementById('timer'); // Span qui contient le minuteur
const OK_ANSWERS_SPAN = document.getElementById('correct-answers'); // Span qui affiche les réponses correctes
const CURRENT_QUESTION_SPAN = document.getElementById('current-answer'); // Span qui affiche la question COURANTE
const COUNTRY_NAME = document.getElementById('game-country-name'); // Balise contentant le nom du pays
const COUNTRY_FLAG = document.getElementById('country-flag'); // Img contenant le drapeau du pays
const CAPITAL_INPUT = document.getElementById('country-capital'); // Champ pour écrire la réponse
const MODAL = document.getElementById('container-modal'); // Modal qui affiche la réponse correcte
const MODAL_P = MODAL.getElementsByTagName('p'); // Paragraphe du modal contenant le message à afficher
const QUESTION_TIME = 15; // Temps de réponse
const NB_QUESTIONS = 15; // Nombre de questions

let countries; // Liste des pays
let timer = QUESTION_TIME; // Minuteur
let currentCountry; // Pays courant
let nbOkAnswers = 0; // Nombre de réponses correctes
let nbCurrentQuestion = 1; // Nombbre de la réponse courante
let interval = setInterval(decreaseTime, 1000); // Interval qui gère le minuteur

// Décrémente le temps de chaque réponse
function decreaseTime() {
    // Changer la couleur du minuteur
    TIMER_SPAN.innerText = `${timer} S`;
    TIMER_SPAN.style.color = timer <= 5 ? 'red' : 'white';

    // Si le timer arrive au bout
    if (timer <= 0) {
        timer = QUESTION_TIME; // Reinitialise le timer
        checkAnswer();
    } else timer--;
}

// Vérifie la réponse de l'utilisateur
function checkAnswer() {
    nbCurrentQuestion++;

    // Si la réponse est correcte sans avoir en compte les caractères accentués
    if (CAPITAL_INPUT.value.localeCompare(currentCountry.capital[0], undefined, {sensitivity: 'base'}) === 0) {
        nbOkAnswers++;
        updateUI();
    } else {
        displayModal(`Oups! La réponse c'était : ${currentCountry.capital}`);
    }

    // Si c'était la dernière question
    if (nbCurrentQuestion === NB_QUESTIONS) gameIsOver();
}

// Vérifie la réponse de l'utilisateur quand la touche Enter est tapée
function submitAnswer() {
    if (event.key === 'Enter' && isAWord(CAPITAL_INPUT.value)) checkAnswer();
}

// Affiche le modal avec un mesage donné
function displayModal(message) {
    MODAL_P[0].innerText = message;
    MODAL.style.display = 'block';
    clearInterval(interval);
}

// Ferme le modal
function closeModal() {
    MODAL.style.display = 'none';
    interval = setInterval(decreaseTime, 1000);
    updateUI();
}

// Met à jour les éléments de l'interface
function updateUI() {
    CAPITAL_INPUT.value = '';
    timer = QUESTION_TIME;
    updateCountry();
    updateCountersUI();
}

// Affiche un modal à la fin du jeu et reinitialise les compteurs
function gameIsOver() {
    displayModal(`Vous avez répondu ${nbOkAnswers} réponses correctes sur ${NB_QUESTIONS}`);
    clearInterval(interval);
    nbCurrentQuestion = 1;
    nbOkAnswers = 0;
    timer = QUESTION_TIME;
}

// Met à jour les compteurs de réponses de l'interface
function updateCountersUI() {
    CURRENT_QUESTION_SPAN.innerText = `${nbCurrentQuestion} / ${NB_QUESTIONS}`;
    OK_ANSWERS_SPAN.innerText = `${nbOkAnswers} / ${NB_QUESTIONS}`;
}

// Met à jour le pays courant
function updateCountry() {
    currentCountry = countries[Math.floor(Math.random() * countries.length)];
    COUNTRY_FLAG.setAttribute('src', currentCountry.flags.png)
    COUNTRY_NAME.innerText = currentCountry.name.common;
}

// Initialise le jeu
async function initGame() {
    countries = await requestAPI(URL_ALL);
    updateUI();
}

initGame().then();