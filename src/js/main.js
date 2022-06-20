const CONTINENT_SELECT = document.getElementById('continent'); // Liste déroulante des continents
const LANGUAGE_SELECT = document.getElementById('language'); // Liste déroulante des langues
const NAME_INPUT = document.getElementById('country-name'); // Champ du nom du pays
const COUNTRIES_CONTAINER = document.getElementById('countries-section'); // Section contenant les pays
const COUNTRY_MODAL = document.getElementById('country-modal'); // Modal détails du pas

// Affiche le modal avec les données du pays
async function showCountryDetails(countryName) {
    let countries = await requestAPI(searchByCountryFullName(countryName.innerText));
    updateCountryModal(countries[0]).then();
}

// Recherche un pays par son code
async function getCountryNameByCode(code) {
    return await requestAPI(`${START_URL}alpha/${code}`)
}

// Met à jour les informations du modal et l'affiche
async function updateCountryModal(country) {
    let countryCurrency = Object.keys(country.currencies)[0];
    let borders = '';

    // Si le pays a des frontières
    if (country.borders !== undefined) {
        for (let index in country.borders) {
            let border = await getCountryNameByCode(country.borders[index]);
            borders += `-${border[0].name.common} `;
        }
    }

    COUNTRY_MODAL.innerHTML = `<div class="modal-body">
        <div class="card-left">
            <img class="flag" src="${country.flags.png}" alt="Flag">
            <p class="card-title">${country.name.common}</p>
        </div>
        <div class="country-info">
            <p><strong>Continent : </strong>${country.region}</p>
            <p><strong>Capital : </strong>${country.capital[0]}</p>
            <p><strong>Langue : </strong>${languagesToString(country.languages)}</p>
            <p><strong>Population : </strong>${country.population.toLocaleString()}</p>
            <p><strong>Monnaie : </strong>${countryCurrency + ' : ' + country.currencies[countryCurrency].name}</p>
            <p><strong>Frontières : </strong>${borders}</p>
        </div>
    </div>`;
    COUNTRY_MODAL.style.display = 'block';
    COUNTRY_MODAL.addEventListener('click', function (e) {
        if (e.target === COUNTRY_MODAL) COUNTRY_MODAL.style.display = 'none';
    });
}

// Appel la méthode searchAndFilter quand l'utilisateur met un nom dans le champ de recherche et appui 'Entrer'
async function search() {
    if (event.key === 'Enter') await searchAndFilter();
}

// Recherche et filtre les pays en fonctions des valeurs choisies dans les listes déroulantes
async function searchAndFilter() {
    let countries; // Liste de pays

    // Validation du champ
    if (isAWord(NAME_INPUT.value)) countries = await requestAPI(searchByTranslation(NAME_INPUT.value));
    else countries = await requestAPI(URL_ALL);

    // Vérification des listes déroulantes
    if (CONTINENT_SELECT.value !== '0') countries = countries.filter(country => country.region === CONTINENT_SELECT.value);
    if (LANGUAGE_SELECT.value !== '0') countries = countries.filter(country => JSON.stringify(country.languages).includes(LANGUAGE_SELECT.value));

    // Si l'API trouve des résultats
    if (countries.status !== 404) {
        updateUI(countries);
    }
}

// Retourne la liste de langues sous forme de chaine de caractères
function languagesToString(countryLanguages) {
    let languages = '';
    // Concatenation des langues
    for (let key in countryLanguages) {
        languages += `-${countryLanguages[key]} `;
    }
    return languages;
}

// Met à jour les pays affichés
function updateUI(countries) {
    let html = '';

    // Trie les résultats par ordre alphabétique
    countries.sort(function (a, b) {
        return a.name.common.localeCompare(b.name.common);
    });

    countries.forEach(country => {
        let htmlSegment = `<div class="country-card">
            <img src="${country.flags.png}" alt="Drapeau">
            <button onclick="showCountryDetails(this)" class="card-title btn-title">${country.name.common}</button>
            <div class="card-body">
                <p><strong>Continent : </strong>${country.region}</p>
                <p><strong>Capitale : </strong>${country.capital}</p>
                <p><strong>Langues : </strong>${languagesToString(country.languages)}</p>
                <p><strong>Population : </strong>${country.population.toLocaleString()}</p>
            </div>
        </div>`;

        html += htmlSegment;
    });

    COUNTRIES_CONTAINER.innerHTML = html;
}

// Affichage de tous les pays
searchAndFilter().then();