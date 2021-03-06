const TIMER_SPAN = document.getElementById('timer'); // Span qui contient le minuteur
const OK_ANSWERS_SPAN = document.getElementById('correct-answers'); // Span qui affiche les réponses correctes
const CURRENT_QUESTION_SPAN = document.getElementById('current-answer'); // Span qui affiche la question COURANTE
const COUNTRY_NAME = document.getElementById('game-country-name'); // Balise contentant le nom du pays
const COUNTRY_FLAG = document.getElementById('country-flag'); // Img contenant le drapeau du pays
const MODAL = document.getElementById('container-modal'); // Modal qui affiche la réponse correcte
const MODAL_P = MODAL.getElementsByTagName('p'); // Paragraphe du modal contenant le message à afficher
const QUESTION_TIME = 15; // Temps de réponse
const NB_QUESTIONS = 15; // Nombre de questions
const BTNS_ANSWER = document.getElementsByClassName('btn-game'); // Boutons de réponse

let countries; // Liste des pays
let timer = QUESTION_TIME; // Minuteur
let currentCountry; // Pays courant
let nbOkAnswers = 0; // Nombre de réponses correctes
let nbCurrentQuestion = 0; // Nombre de la réponse courante
let interval = setInterval(decreaseTime, 1000); // Interval qui gère le minuteur

// Décrémente le temps de chaque réponse
function decreaseTime() {
    // Changer la couleur du minuteur
    TIMER_SPAN.innerText = `${timer} S`;
    TIMER_SPAN.style.color = timer <= 5 ? 'red' : 'white';

    // Si le timer arrive au bout
    if (timer <= 0) {
        timer = QUESTION_TIME; // Reinitialise le timer
        checkAnswer(null);
    } else timer--;
}

// Vérifie la réponse de l'utilisateur
function checkAnswer(chosenButton) {
    nbCurrentQuestion++;
    if (chosenButton === null) return displayModal(`Oups! La réponse c'était : ${currentCountry.capital}`);

    // Si la réponse est correcte sans avoir en compte les caractères accentués
    if (chosenButton.innerText === currentCountry.capital[0]) {
        nbOkAnswers++;
        updateUI();
    } else {
        displayModal(`Oups! La réponse c'était : ${currentCountry.capital}`);
    }

    // Si c'était la dernière question
    if (nbCurrentQuestion === NB_QUESTIONS) gameIsOver();
}

// Affiche le modal avec un message donné
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
    //CAPITAL_INPUT.value = '';
    timer = QUESTION_TIME;
    updateCountries();
    updateCountersUI();
}

// Affiche un modal à la fin du jeu et reinitialise les compteurs
function gameIsOver() {
    if (nbOkAnswers === NB_QUESTIONS) displayModal('Felicitations! Vous avez répondu tout juste! Vous êtes très fort!');
    else displayModal(`Vous avez répondu ${nbOkAnswers} réponses correctes sur ${NB_QUESTIONS}`);

    clearInterval(interval);
    nbCurrentQuestion = 0;
    nbOkAnswers = 0;
    timer = QUESTION_TIME;
}

// Met à jour les compteurs de réponses de l'interface
function updateCountersUI() {
    CURRENT_QUESTION_SPAN.innerText = `${nbCurrentQuestion + 1} / ${NB_QUESTIONS}`;
    OK_ANSWERS_SPAN.innerText = `${nbOkAnswers} / ${NB_QUESTIONS}`;
}

// Met à jour les pays du QCM
function updateCountries() {
    // Générer les 4 chiffres random des pays
    let indexCountries = generateListOfUniqueRandom(countries.length, 4);

    // Random entre 1 et 4 pour sélectionner le bouton de la réponse correcte
    let posCorrectAnswer = Math.floor(Math.random() * 4);

    // Change le pays correct
    currentCountry = countries[indexCountries[posCorrectAnswer]];
    BTNS_ANSWER[posCorrectAnswer].innerText = currentCountry.capital[0];

    // Mettre à jour le texte des réponses
    for (let i = 0; i < indexCountries.length; i++) {
        if (posCorrectAnswer === i) continue; // Si l'index est égal à la position de la réponse correcte
        BTNS_ANSWER[i].innerText = countries[indexCountries[i]].capital[0];
    }

    COUNTRY_FLAG.setAttribute('src', currentCountry.flags.png)
    COUNTRY_NAME.innerText = currentCountry.name.common;
}

// Génère une liste de nombres aléatoires uniques
function generateListOfUniqueRandom(maxNb, totalNb) {
    let listOfRandoms = [];

    for (let i = 0; i < totalNb;) {
        let random = Math.floor(Math.random() * maxNb);
        if (!listOfRandoms.includes(random)) {
            listOfRandoms.push(random);
            i++;
        }
    }
    return listOfRandoms;
}

// Initialise le jeu
async function initGame() {
    countries = await requestAPI(URL_GAME);
    updateUI();
}

initGame().then();