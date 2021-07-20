function validateRequestURL(job, city, filters) {
    let fullOrPartTime = "";
    let contractOrPermanent = "";
    if (filters.fullTime == true) {
        fullOrPartTime = '&full_time="1"';
    } else if (filters.partTime == true) {
        fullOrPartTime = '&part_time="1"';
    } 
    if (filters.permanent == true) {
        contractOrPermanent = '&permanent="1"';
    } else if (filters.contract == true) {
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
                window.FlashMessage.error('No results could be found! Try to refine your search!', {
                    progress: true,
                    interactive: true,
                    timeout: 8000,
                    appear_delay: 200,
                    container: '.flash-container',
                    theme: 'default',
                    classes: {
                        container: 'flash-container',
                        flash: 'flash-message',
                        visible: 'is-visible',
                        progress: 'flash-progress',
                        progress_hidden: 'is-hidden'
                    }
                  });
                return;
            }

            const searchParameters = {
                job: job,
                city: city,
                amount: data.results.length,
                filters: filters
            }
            addDescription(searchParameters);
            addPastSearch(searchParameters);
            displayPastSearches();
            parseJobListData(data);
        });  
}
