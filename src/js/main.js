const CONTINENT_SELECT = document.getElementById('continent'); // Liste déroulante des continents
const LANGUAGE_SELECT = document.getElementById('language'); // Liste déroulante des langues
const NAME_INPUT = document.getElementById('country-name'); // Champ du nom du pays
const COUNTRIES_CONTAINER = document.getElementById('countries-section'); // Section contenant les pays

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

// Met à jour les pays affichés
function updateUI(countries) {
    let html = '';

    // Trie les résultats par ordre alphabétique
    countries.sort(function (a, b) {
        return a.name.common.localeCompare(b.name.common);
    });

    countries.forEach(country => {
        let languages = '';
        // Concatenation des langues
        for (let key in country.languages) {
            languages += `-${country.languages[key]} `;
        }
        let htmlSegment = `<div class="country-card">
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

    COUNTRIES_CONTAINER.innerHTML = html;
}

// Affichage de tous les pays
searchAndFilter().then();