function fetchJobList() {
    const city = "birmingham";
    const searchQuery = "javascript developer";
    const requestURL = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=ab60a19a&app_key=4c8dd93a9e19f2fc2876eb639e148ef6&results_per_page=10&what=${searchQuery}&where=${city}&content-type=application/json`;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            parseJobListData(data);
        });  
}