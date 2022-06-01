/*Evénement pour le champ de recherche*/
async function getCountries(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function search(object) {
    if (event.key === 'Enter') {
        let url = `https://restcountries.com/v3.1/name/${object.value}?fields=name,capital,languages,continents,population,flags`;
        let countries = await getCountries(url);
        displayCountries(countries);
    }
}

async function getAllCountries() {
    let url = 'https://restcountries.com/v3.1/all?fields=name,capital,languages,continents,population,flags';
    let countries = await getCountries(url);
    displayCountries(countries);
}

function displayCountries(countries) {
    let html = '';

    // Trie les pays par ordre alphabétique
    countries.sort(function (a,b){
        return a.name.common.localeCompare(b.name.common);
    });

    countries.forEach(country => {
        // Met les languages dans un string
        let languages = '';
        for (let key in country.languages) {
            languages += '- ' + country.languages[key] + ' ';
        }

        let htmlSegment =
            `<div class="country-card">
            <img src="${country.flags.png}" alt="Drapeau">
            <p class="card-title">${country.name.common}</p>
            <div class="card-body">
                <p><strong>Continent : </strong>${country.continents}</p>
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