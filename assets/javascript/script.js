const searchBtn = document.getElementById("search")
const jobSearchBar = document.getElementById("search-bar")
const citySearchBar = document.getElementById("city-search-bar")
const searchForm = document.getElementById("searchForm")

const pastSearchesModal = document.getElementById("past-searches-container")
const pastSearchesBtn = document.getElementById("past-searches-btn")
const pastSearchesList = document.getElementById("past-searches-list")
const closeBtn = document.getElementById("close-btn")

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
    const title = document.createElement("p");
    title.innerHTML = jobData.title;
    const company = document.createElement("p");
    company.innerHTML = `Company: ${jobData.company}`;
    const salary = document.createElement("p");
    salary.innerHTML = `Salary: £${jobData.salary}`;
    const button = document.createElement("a");
    button.setAttribute("href", jobData.url);
    button.textContent = "Click for more info";
    card.append(title, company, salary, button);
    return card;
}

function displaySearchedJobs(jobListArray) {
    const searchResultsContainer = document.getElementById("search-results-container");
    searchResultsContainer.textContent = "";
    for (let i = 0; i < jobListArray.length; i++) {
        const jobCard = createJobCard(jobListArray[i]);
        searchResultsContainer.appendChild(jobCard);
    }
}

function submitForm(event) {
    event.preventDefault()
    let job = jobSearchBar.value
    let city = citySearchBar.value
    let filters = getFilters()
    
    const searchParameters = {
        job: job,
        city: city
    }
    fetchJobList(job, city, filters)
    addPastSearch(searchParameters);
    displayPastSearches();
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

displayPastSearches()

searchForm.addEventListener("submit", submitForm)

pastSearchesBtn.addEventListener("click", function() {
    pastSearchesModal.style.display = "block";
})

closeBtn.addEventListener("click", function() { 
    pastSearchesModal.style.display = "none"; 
})