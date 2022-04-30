// Variable Declarations
var searchHistoryList = $('#search-history-list');
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");

// Get access to the OpenWeather API
var APIkey = "e80c86cddae3e0f811424e1f7df7c059"
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + APIkey;

// Easy access to data
var cityList = [];

// Check if search history is present when page loads
initalizeHistory();
showClear();

// Hitting enter while input is focused will trigger
// value added to search history
$(document).on("submit", function(event) {
        event.preventDefault();

        // grab value entered into search
        var searchValue = searchCityInput.val().trim();
        currentConditionsRequest(searchValue)
        searchHistory();
        searchCityInput.val("");
})

// Clicking the search button will trigger
// value added to search history
searchCityButton.on("click", function(event) {
        event.preventDefault();

        // grab value entered into search
        var searchValue = searchCityInput.val().trim();
        currentConditionsRequest(searchValue)
        searchHistory();
        searchCityInput.val("");
});

// Clear search history
clearHistoryButton.on("click", function() {
        // Empty list array
        cityList = [];
        // Update city list history in local storage
        listArray();

        $(this).addClass("hide");
});

// Clicking on a button in the search history
// will fill the dashboard with info about the city
$('.city-btn').on("click", function() {
        // console.log($(this).data("value"));
        var value = $(this).data("value");
        currentConditionsRequest(value);
});

// Request OpenWeather API
function currentConditionsRequest(searchValue) {
        // Formulate URL for AJAX api call
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;
        // AJAX call
        $.ajax({
                url: queryURL,
                method: "GET"
        }).then(function(response) {
                // console.log(response);
                currentCity.text(response.name);
                currentTemp.text(response.main.temp);
                currentTemp.append("&deg;F");
                currentHumidity.text(response.main.humidity + "%");
                currentWindSpeed.text(response.wind.speed + "MPH");

                var lat = response.coord.lat;
                var lon = response.coord.lon;

                var UVurl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;
                $.ajax({
                        url: UVurl,
                        method: "GET"
                }).then(function(response) {
                        console.log("UV call: ")
                        console.log(response);
                        UVindex.text(response.value);
                });
        });
}

// Display and save search history
function searchHistory(searchValue) {
        // Grab value entered in search bar
        // var searchValue = searchCityInput.val().trim();

        // If characters are entered into search bar then
        if (searchValue) {
                // Place value in the array of cities
                // If it is a new entry
                if (cityList.indexOf(searchValue) === -1) {
                        cityList.push(searchValue);

                        // List all cities entered in search history
                        listArray();
                        clearHistoryButton.removeClass("hide");
                } else {
                        // Remove the existing value from the array
                        var removeIndex = cityList.indexOf(searchValue);
                        cityList.splice(removeIndex, 1);

                        // Push value again to array
                        cityList.push(searchValue);

                        // List all cities in search history so old entry appears at the top of history
                        listArray();
                        clearHistoryButton.removeClass("hide");
                }
        }
        // console.log(cityList);
}

// list array into search history 
function listArray () {
        // empty elements 
        searchHistoryList.empty();
        cityList.forEach(function(city) {
                var searchHistoryItem = $('<li class="list-group-item city-btn">');
                searchHistoryItem.attr("data-value", city);
                searchHistoryItem.text(city);
                searchHistoryList.prepend(searchHistoryItem);
        });
        // Update city list history in local storage
        localStorage.setItem("cities", JSON.stringify(cityList));
}

// Grab city list string from local storage and update list array
function initalizeHistory() {
        if (localStorage.getItem("cities")) {
                cityList = JSON.parse(localStorage.getItem("cities"));
                console.log(cityList);
                listArray();
        }
}

// Check to see if there are elements in
// search history sidebar in order to show clear history btn
function showClear() {
                if (searchHistoryList.text() !== "") {
                        clearHistoryButton.removeClass("hide");
                }
        }
        // console.log(searchHistoryList.text());

// console.log(cityList);