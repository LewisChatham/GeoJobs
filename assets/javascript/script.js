const searchBtn = document.getElementById("search")
const jobSearchBar = document.getElementById("search-bar")
const citySearchBar = document.getElementById("city-search-bar")
const searchForm = document.getElementById("searchForm")


function fetchJobList(job, city, filters) {
    const requestURL = `http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=ab60a19a&app_key=4c8dd93a9e19f2fc2876eb639e148ef6&results_per_page=10&what=${job}&where=${city}&content-type=application/json`;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            parseJobListData(data);
        });  
}

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
    
    fetchJobList(job, city, filters)
}

function getFilters() {
    return {

    }
}




searchForm.addEventListener("submit", submitForm)