function fetchJobList(job, city, filters) {
    const requestURL = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=ab60a19a&app_key=4c8dd93a9e19f2fc2876eb639e148ef6&results_per_page=10&what=${job}&where=${city}&distance=${filters.distance}&sort_by=${filters.sortBy}&content-type=application/json`;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if (data.results.length == 0) {
                searchResultsContainer.textContent = "Sorry: no results were found";
                return;
            }

            const searchParameters = {
                job: job,
                city: city
            }
            addPastSearch(searchParameters);
            displayPastSearches();
            parseJobListData(data);
        });  
}
