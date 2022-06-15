const START_URL = 'https://restcountries.com/v3.1/'; // Début de l'URL de l'API
const URL_ATTRIBUTES = '?fields=name,capital,languages,region,population,flags'; // Paramètres de recherche
const URL_ALL = `${START_URL}all${URL_ATTRIBUTES}`; // URL pour récuperer tous les pays

// Fait une requête à une API et retourne les données au format JSON
async function requestAPI(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Vérifie si une valeur d'entrée c'est un mot
function isAWord(string) {
    return string.match(/^\D+$/);
}

// Retourne l'URL qui permet de demander à l'API par nom du pays dans n'importe quelle langue
function searchByTranslation(translation) {
    return `${START_URL}translation/${translation}${URL_ATTRIBUTES}`;
}

// Retourne l'URL qui permet de demander à l'API par nom du pays complet et en anglais
function searchByCountryFullName(name) {
    return `${START_URL}name/${name}${URL_ATTRIBUTES},?fullText=true`;
}