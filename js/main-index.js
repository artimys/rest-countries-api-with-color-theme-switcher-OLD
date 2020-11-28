const txtSearchCountry = document.getElementById("searchCountry");
const cboSearchRegion = document.getElementById("searchRegion");
const content = document.getElementById("content");

let countriesData = {};
let userStoppedTypingTimeout = null;


/*******************************************
 * EVENT LISTENERS
 * *****************************************/

// Desc: captures user input after a certain time
// to prevent consecutive API calls
txtSearchCountry.addEventListener("keyup", function() {
    // Clear previous setTimeouts if less than 900ms
    clearTimeout(userStoppedTypingTimeout);

    userStoppedTypingTimeout = setTimeout(function(){
        searchRegions();
    }, 900);
});


// Desc: detect when dropdown selection is changed and trigger search
cboSearchRegion.addEventListener("change", function() {
    searchRegions();
});


/*******************************************
 * REST COUNTRIES API
 * https://restcountries.eu
 * *****************************************/

// https://simonsmith.io/destructuring-objects-as-function-parameters-in-es6
// How to call api:
// Default to "all":
//      searchCountries();
// Search by region:
//      searchCountries("peru", {searchField: "americas"})
async function callAPI(value, {searchField: queryField = 'all'} = {}) {
    try {
        let validSearchMethods = ["all", "region"];
        let validRegions = ["africa", "americas", "asia", "europe", "oceania"];
        let queryString = "all";

        if ( !validSearchMethods.includes(queryField) ) {
            // Invalid search method, return no data
            countriesData = undefined;
            return false;
        }

        // if ( value != "all" && validRegions.includes(value) ) {
        if ( validRegions.includes(value) ) {// TODO The invalid check needs to go above statement
            console.log("search by region: ", value);
            queryString = "region/" + value;
        }

        // Call API from restcountries.eu returning a specific list of field names
        countriesData = await fetch("https://restcountries.eu/rest/v2/" + queryString + "?fields=name;flag;population;region;capital")
            .then(response => {
                if (!response.ok) {
                    throw response.statusText;
                }
                return response.json();
            })
            .catch(error => {
                alert("Something went wrong.\nPlease refresh page if error continues." + error);
            });
    } catch (error) {
        alert("callAPI: " + error);
    }
}


/*******************************************
 * RUN WHEN PAGE IS FULLY LOADED
 * *****************************************/

async function searchRegions() {
    try {
        // Get value from region dropdown
        let regionSelected = cboSearchRegion.value;
        // let regionSelected = "asdf"; // TODO - show no results when bad value

        // If value blank default to "all" regions
        if (regionSelected === "") {
            await callAPI();

        // otherwise search by selected region
        } else {
            await callAPI(regionSelected, "region");
        }

        console.log(countriesData);

        // Filter and print results to page
        displayCountryCards();
    } catch (error) {
        alert("searchRegions: " + error);
    }
}

function displayCountryCards() {
    if (countriesData === undefined) {
        console.log("show no results found"); // TODO - markup no results
        return;
    }

    // Clear currents results on screen,
    // otherwise new results will be added to bottom of container
    content.innerHTML = "";

    let countryUserInput = txtSearchCountry.value.trim().toLowerCase();

    // Filter all countries using user input to match beginning of country name
    countriesData.filter(country => {
        return country.name.toLowerCase().startsWith(countryUserInput);
    })

    // Loop through each filtered result to add card to DOM
    .forEach(country => {
        content.insertAdjacentHTML("beforeend", `
            <article class="card">
                <header class="card__flag">
                        <img src="${country.flag}" alt="${country.name} Flag">
                </header>

                <div class="card__content">
                    <h2 class="card__country">
                        <a href="detail.html?country=${country.name}" title="${country.name}">${country.name}</a>
                    </h2>

                    <ul class="card__list">
                        <li>
                            <strong class="card__term">Population:</strong>
                            <span class="card__value">${Number(country.population).toLocaleString()}</span>
                        </li>
                        <li>
                            <strong class="card__term">Region:</strong>
                            <span class="card__value">${country.region}</span>
                        </li>
                        <li>
                            <strong class="card__term">Capital:</strong>
                            <span class="card__value">${country.capital}</span>
                        </li>
                    </ul>
                </div>
            </article>
        `);
    });
}





/*******************************************
 * RUN WHEN PAGE IS FULLY LOADED
 * *****************************************/

window.addEventListener('load', (event) => {
    // Load countries on page load
    searchRegions();
});