function fetchJobList(job, city, filters) {
    const requestURL = `http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=ab60a19a&app_key=4c8dd93a9e19f2fc2876eb639e148ef6&results_per_page=10&what=${job}&where=${city}&content-type=application/json`;
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
                amount: data.results.length
            }
            addDescription(searchParameters);
            addPastSearch(searchParameters);
            displayPastSearches();
            parseJobListData(data);
        });  
}
