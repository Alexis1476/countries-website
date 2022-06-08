let timerSpan = document.getElementById('timer');
let nameCountry = document.getElementById('game-country-name');
let flagCountry = document.getElementById('country-flag');
let inputCapital = document.getElementById('country-capital');
const TIMETOANSWER = 15; // Temps de réponse par question
let time = TIMETOANSWER;
let countriesToFind;
let currentCountry;
let nbCorrectAnswers;
let nbCurrentAnswer;

inputCapital.addEventListener('keydown', checkAnswer);

const decreaseTime = () => {
    // Changement de couleur et de secondes
    timerSpan.innerText = `${time} S`;
    timerSpan.style.color = changeColor(time);

    // Vérification du compteur
    if (time <= 0) {
        time = TIMETOANSWER;
        // TODO: Afficher réponse correcte si incorrect
        /*inputCapital.value = currentCountry.capital;*/
        updateCountry();
    } else {
        time--;
    }
}

function checkAnswer() {
    if (event.key === 'Enter' && isAWord(inputCapital.value)) {
        console.log(currentCountry.capital[0]);
        // Si réponse correcte
        if (inputCapital.value.localeCompare(currentCountry.capital[0], undefined, {sensitivity: 'base'}) === 0) {
            console.log('Ok');
        } else {
            console.log('Ko');
        }
    }
}

// TODO : Function repetée
function isAWord(string) {
    return string.match(/^\D+$/);
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
}

function updateCountry() {
    // Changer le pays
    currentCountry = countriesToFind[Math.floor(Math.random() * countriesToFind.length)];
    flagCountry.setAttribute('src', currentCountry.flags.png)
    nameCountry.innerText = currentCountry.name.common;
}

initGame();
