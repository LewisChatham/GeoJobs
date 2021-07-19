const searchBtn = document.getElementById("search")
const jobSearchBar = document.getElementById("search-bar")
const citySearchBar = document.getElementById("city-search-bar")
const searchForm = document.getElementById("searchForm")
const searchResultsContainer = document.getElementById("search-results-container")
const pastSearchesList = document.getElementById("past-searches-list")
const toggleMapBtn = document.getElementById("toggle-map-btn");
const mapContainer = document.getElementById("map-container");

let mapVisible = false;

function parseJobListData(data) {
    let jobListArray = [];
    for (let i = 0; i < 10; i++) {
        const listing = data.results[i];

        const title = listing.title;
        const company = listing.company.display_name;
        const salary = listing.salary_min;
        const url = listing.redirect_url;

        const jobData = {title: title, company: company, salary: salary, url: url};
        jobListArray.push(jobData);
    }
    
    displaySearchedJobs(jobListArray);
    return jobListArray;
}

// Creates a job card to display on page
function createJobCard(jobData) {
    const card = document.createElement("div");
    card.setAttribute("class", "uk-card uk-card-default uk-card-body")
    const title = document.createElement("p");
    title.setAttribute("class", "uk-card-title");
    title.innerHTML = jobData.title;
    const company = document.createElement("p");
    company.innerHTML = `Company: ${jobData.company}`;
    const salary = document.createElement("p");
    salary.innerHTML = `Salary: £${jobData.salary}`;
    const button = document.createElement("a");
    button.setAttribute("href", jobData.url);
    button.setAttribute("class", "uk-button uk-button-primary")
    button.textContent = "Click for more info";
    card.append(title, company, salary, button);
    return card;
}

function displaySearchedJobs(jobListArray) {
    searchResultsContainer.textContent = "";
    for (let i = 0; i < jobListArray.length; i++) {
        const jobCard = createJobCard(jobListArray[i]);
        searchResultsContainer.appendChild(jobCard);
    }
}

async function submitForm(event) {

    event.preventDefault()
    const job = jobSearchBar.value
    const city = citySearchBar.value
    const filters = getFilters()
    const {lat, lng} = await getGeoCode(city)
    moveMap(map, lat, lng)
    fetchJobList(job, city, filters)
    jobSearchBar.value = "";
    citySearchBar.value = "";
}

function getFilters() {
    return {

    }
}

// Get past searches from local storage
function getPastSearches() {
    const searches = localStorage.getItem("searches");
    if(!searches) {
        return [];
    }
    const searchesParsed = JSON.parse(searches);
    return searchesParsed;
}

// Add location to local storage
function addPastSearch(query) {
    const searches = getPastSearches();
    if(searches.some(search => search.job === query.job && search.city === query.city)){
        return;
    } else {
        searches.push(query);
    }
    localStorage.setItem("searches", JSON.stringify(searches));
}

// Creates past search button
function createButton(job, index) {
    const button = document.createElement("button");
    button.setAttribute("data-index", index);
    button.setAttribute("class", "uk-button uk-button-secondary uk-width-1-1");
    button.textContent = job;
    button.addEventListener('click', getPastJobSearch);
    return button;
} 

// Display past searches in modal
function displayPastSearches() {
    const searches = getPastSearches();
    pastSearchesList.textContent = "";
    for (let i = 0; i < searches.length; i++) {
        const pastSearch = createButton(searches[i].job, i);
        pastSearchesList.appendChild(pastSearch);
    }
}

// Get past job search when clicking past search in modal
function getPastJobSearch(event) {
    event.preventDefault();
    const searches = getPastSearches();
    const index = this.getAttribute("data-index");
    const job = searches[index].job;
    const city = searches[index].city;
    fetchJobList(job, city);
}

function moveMap(map, lat, lng) {
    map.setCenter({lat:lat, lng:lng});
    map.setZoom(13);
}

function getGeoCode (city) {
  const requestUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${city}&apiKey=qvZeWsdAQvGnl_hbLJ0ttHuzIMdUifdobJGAWgi51ig`
  return fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const {lat, lng} = data.items[0].position;
        return {
            lat,
            lng
        }
    })
}

displayPastSearches()

searchForm.addEventListener("submit", submitForm)
toggleMapBtn.addEventListener("click", function() {
    if (mapVisible) {
        mapContainer.classList.add("hidden");
        searchResultsContainer.classList.remove("hidden");
        mapVisible = false;
    } else {
        mapContainer.classList.remove("hidden");
        searchResultsContainer.classList.add("hidden");
        mapVisible = true;
    }
})
