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
    let countries = await getCountries(url);
    currentCountry = countries[Math.floor(Math.random() * countries.length)];
    // Changer le pays
    flagCountry.setAttribute('src', currentCountry.flags.png)
    nameCountry.innerText = currentCountry.name.common;
}

initGame();
