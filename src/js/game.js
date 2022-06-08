let timerSpan = document.getElementById('timer');
let time = 15; // Temps de réponse par question
let countriesToFind;
let currentCountry;
let nameCountry = document.getElementById('game-country-name');
let flagCountry = document.getElementById('country-flag');

const decreaseTime = () => {
    timerSpan.innerText = `${time} S`;
    if (time < 5) {
        timerSpan.style.color = 'red';
    }
    time = time <= 0 ? 0 : time - 1;
}

setInterval(decreaseTime, 1000);
