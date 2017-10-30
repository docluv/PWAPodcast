(function () {

    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function renderResults(results) {

        var template = document.getElementById("search-results-template"),
            searchResults = document.querySelector('.search-results');

            searchResults.innerHTML = Mustache.render(template.innerHTML, results);

    }

    function fetchSearch(term) {

        fetch("api/search.json?term=" + term)
            .then(function (response) {

                return response.json();

            }).then(function (results) {

                renderResults(results);

            })
            .catch(function (err) {
                console.log('No CORS Fetch Error :-S', err);
            });


    }

    fetchSearch(getParameterByName("term"));

})();