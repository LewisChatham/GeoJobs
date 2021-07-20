const searchBtn = document.getElementById("search")
const jobSearchBar = document.getElementById("search-bar")
const citySearchBar = document.getElementById("city-search-bar")
const searchForm = document.getElementById("searchForm")
const searchResultsContainer = document.getElementById("search-results-container")
const pastSearchesList = document.getElementById("past-searches-list")
const toggleMapBtn = document.getElementById("toggle-map-btn");
const mapContainer = document.getElementById("map-container");

const sortBySelector = document.getElementById("sort-by");
const distanceSelector = document.getElementById("distance");
const fullTimeSelector = document.getElementById("full-time");
const partTimeSelector = document.getElementById("part-time");
const fpSelector = document.getElementById("fp-either");
const permanentSelector = document.getElementById("permanent");
const contractSelector = document.getElementById("contract");
const pcSelector = document.getElementById("pc-either");
const filtersSubmitBtn = document.getElementById("filters-submit");

let mapVisible = false;
let filtersObj = {
    sortBy: "relevance",
    distance: "5",
    fullTime: false,
    partTime: false,
    eitherFP: true,
    permanent: false,
    contract: false, 
    eitherPC: true
};

function parseJobListData(data) {
    let jobListArray = [];
    for (let i = 0; i < data.results.length; i++) {
        const listing = data.results[i];

        const title = listing.title;
        const company = listing.company.display_name;
        const salary = listing.salary_max;
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
    const filters = filtersObj;
    const {lat, lng} = await getGeoCode(city)
    moveMap(map, lat, lng)
    fetchJobList(job, city, filters)
    jobSearchBar.value = "";
    citySearchBar.value = "";
}

function getFilters() {
    event.preventDefault();
    const sortBy = sortBySelector.value;
    const distance = distanceSelector.value;
    let fullTime = fullTimeSelector.checked;
    let partTime = partTimeSelector.checked;
    let eitherFP = fpSelector.checked;
    let permanent = permanentSelector.checked;
    let contract = contractSelector.checked;
    let eitherPC = pcSelector.checked;
    
    filtersObj = {
        sortBy: sortBy,
        distance: distance,
        fullTime: fullTime,
        partTime: partTime,
        eitherFP: eitherFP,
        permanent: permanent,
        contract: contract,
        eitherPC: eitherPC
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
    if(searches.some(search => search.job === query.job && search.city === query.city && JSON.stringify(search.filters) == JSON.stringify(query.filters))){
        return;
    } else {
        searches.unshift(query);
    }
    localStorage.setItem("searches", JSON.stringify(searches));
}

// Creates tooltip for search button
function createDropdown(query, index) {
    const dropdown = document.createElement("div");
    dropdown.setAttribute("uk-dropdown", "")
    dropdown.setAttribute("data-index", index);

    const distance = document.createElement("p");
    const sortBy = document.createElement("p");
    distance.textContent = `Distance: ${query.filters.distance}km`;
    sortBy.textContent = `Sort by: ${query.filters.sortBy}`;

    const fullOrPartTime = document.createElement("p");
    if (query.filters.fullTime) {
        fullOrPartTime.textContent = "Full-time";
    } else if (query.filters.partTime) {
        fullOrPartTime.textContent = "Part-time";
    } else if (query.filters.eitherFP) {
        fullOrPartTime.textContent = "Full or part-time";
    }

    const permanentOrContract = document.createElement("p");;
    if (query.filters.permanent) {
        permanentOrContract.textContent = "Permanent";
    } else if (query.filters.contract) {
        permanentOrContract.textContent = "Contract";
    } else if (query.filters.eitherPC) {
        permanentOrContract.textContent = "Permanent or contract";
    }
    
    dropdown.append(distance, sortBy, fullOrPartTime, permanentOrContract)
    return dropdown;
}

// Creates past search button
function createButton(query, index) {
    const button = document.createElement("button");
    button.setAttribute("data-index", index);
    button.setAttribute("class", "uk-button uk-button-secondary uk-width-1-1");
    button.textContent = `${query.job}, ${query.city}`;
    button.addEventListener('click', getPastJobSearch);
    return button;
} 

// Display past searches in modal
function displayPastSearches() {
    const searches = getPastSearches();
    pastSearchesList.textContent = "";
    for (let i = 0; i < searches.length; i++) {
        const pastSearch = createButton(searches[i], i);
        const pastSearchHover = createDropdown(searches[i], i);
        pastSearchesList.append(pastSearch, pastSearchHover);
    }
}

// Get past job search when clicking past search in modal
function getPastJobSearch(event) {
    event.preventDefault();
    const searches = getPastSearches();
    const index = this.getAttribute("data-index");
    const job = searches[index].job;
    const city = searches[index].city;
    const filters = searches[index].filters;
    fetchJobList(job, city, filters);
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
filtersSubmitBtn.addEventListener("click", getFilters)
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

