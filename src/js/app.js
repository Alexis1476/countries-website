let continentSelect = document.getElementById('continent');
let languageSelect = document.getElementById('language');
let nameInput = document.getElementById('country-name');

nameInput.addEventListener('keydown', search);

/*Evénement pour le champ de recherche*/
async function getCountries(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function search() {
    if (event.key === 'Enter' && isAWord(nameInput.value)) {
        let countries = await updateResults();
        displayCountries(countries);
    }
}

function isAWord(string) {
    return string.match(/^\D+$/);
}

async function updateResults() {
    let countries;
    let url;

    // S'il y a quelque chose écrite dans le champ du Nom du pays
    if (isAWord(nameInput.value)) {
        url = `https://restcountries.com/v3.1/translation/${nameInput.value}?fields=name,capital,languages,region,population,flags`;
    } else {
        url = 'https://restcountries.com/v3.1/all?fields=name,capital,languages,region,population,flags';
    }

    countries = await getCountries(url);
    if (continentSelect.value !== '0') {
        countries = countries.filter(country => country.region === continentSelect.value);
    }
    if (languageSelect.value !== '0') {
        countries = countries.filter(country => JSON.stringify(country.languages).includes(languageSelect.value));
    }
    displayCountries(countries);
}

async function getAllCountries() {
    await updateResults();
}

async function changeContinent() {
    if (continentSelect.value !== '0') {
        await updateResults();
    }
}

async function changeLanguage() {
    if (languageSelect.value !== '0') {
        await updateResults();
    }
}

function displayCountries(countries) {
    let html = '';

    // Trie les pays par ordre alphabétique
    countries.sort(function (a, b) {
        return a.name.common.localeCompare(b.name.common);
    });

    countries.forEach(country => {
        // Met les languages dans un string
        let languages = '';
        for (let key in country.languages) {
            languages += '-' + country.languages[key] + ' ';
        }

        let htmlSegment =
            `<div class="country-card">
            <img src="${country.flags.png}" alt="Drapeau">
            <p class="card-title">${country.name.common}</p>
            <div class="card-body">
                <p><strong>Continent : </strong>${country.region}</p>
                <p><strong>Capitale : </strong>${country.capital}</p>
                <p><strong>Langues : </strong>${languages}</p>
                <p><strong>Population : </strong>${country.population.toLocaleString()}</p>
            </div>
        </div>`;

        html += htmlSegment;
    });

    let container = document.querySelector('#countries-section');
    container.innerHTML = html;
}

getAllCountries();