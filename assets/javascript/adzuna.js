function validateRequestURL(job, city, filters) {
    let fullOrPartTime = "";
    let contractOrPermanent = "";
    if (filters.fullTime == "1") {
        fullOrPartTime = '&full_time="1"';
    } else if (filters.partTime == "1") {
        fullOrPartTime = '&part_time="1"';
    } 
    if (filters.permanent == "1") {
        contractOrPermanent = '&permanent="1"';
    } else if (filters.contract == "1") {
        contractOrPermanent = '&contract="1"';
    }
    
    const requestURL = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=ab60a19a&app_key=4c8dd93a9e19f2fc2876eb639e148ef6&results_per_page=10&what=${job}&where=${city}&distance=${filters.distance}&sort_by=${filters.sortBy}${fullOrPartTime}${contractOrPermanent}&content-type=application/json`;
    return requestURL;
}

function fetchJobList(job, city, filters) {
    requestURL = validateRequestURL(job, city, filters);
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.results.length == 0) {
                searchResultsContainer.textContent = "Sorry: no results were found";
                return;
            }

            const searchParameters = {
                job: job,
                city: city,
                filters: filters
            }
            addPastSearch(searchParameters);
            displayPastSearches();
            parseJobListData(data);
        });  
}
