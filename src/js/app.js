let urlApi = "https://restcountries.com/v3.1/translation/suisse?fullText=true";

/*Evénement pour le champ de recherche*/
function search(object) {
    if (event.key === 'Enter') {
        urlApi = `https://restcountries.com/v3.1/translation/${object.value}?fullText=true`;
        getCountries();
    }
}

function getCountries() {
    try {
        fetch(urlApi).then(res => {
            if (res.ok) {
                res.json().then(
                    countries => countries.forEach(
                        country => renderCountry(country)
                    )
                );
            } else {
                console.log("Error")
            }
        })
    } catch (error) {
        console.log("Error")
    }
}

function renderCountry(country) {
    let html = '';

    console.log(country);
    let htmlSegment = `<p>${country.capital} ${country.continents}</p>`;
    html += htmlSegment;

    let countriesSection = document.querySelector('#countries-section');
    countriesSection.innerHTML = html;
}
