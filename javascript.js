$(document).ready(function () {
    var apiKey = "60d91f6ae9c2966f1e8401f2dc588b85";
    $('.date').html(moment().format('MMMM Do YYYY, h:mm:ss a'))

    $('#search-button').on("click", function () {
        let searchValue = $('#searchBar').val();
        console.log(searchValue);

        getCurrentWeather(searchValue)
        getfiveDay(searchValue)
    })

    $(".history").on('click', 'li', function () {

        getCurrentWeather($(this).text())
    })

    function buttonRows(searchValue) {
        var li = $('<li>').addClass("list-group-item list-group-item-action").text(searchValue)
        $(".history").append(li);
    }



    function getCurrentWeather(searchValue) {
        console.log("GET CURRENT WEATHER SEARCH VALUE", searchValue)

        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey + "&units=imperial";

        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "JSON",
            success: function (data) {
                console.log("GET CURRENT WEATHER DATA", data)

                if(history.indexOf(searchValue) === -1){
                    history.push(searchValue)
                    window.localStorage.setItem("history", JSON.stringify(history))
                buttonRows(searchValue)
                }

                var coord = {
                    lat: data.coord.lat,
                    lon: data.coord.lon
                }

                getUVIndex(coord)

                $("#currentWeather").empty();
                var cityTitle = $("<h3>").addClass("card-title").text(data.name);
                var card = $("<div>").addClass("card");
                var icon = $("<img>").addClass("card-text").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " F");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");

                var cardBody = $("<div>").addClass("card-body");

                cardBody.append(cityTitle, icon, temp, humid, wind);
                card.append(cardBody);

                $("#currentWeather").append(card);
            }
        })
    }

    function getUVIndex(coord) {
        console.log("COORDINATES INSIDE UV FUNCTION", coord)

        var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=" + apiKey + "&units=imperial";
        $.ajax({
            type: "GET",
            url: queryURL
        }).then(function (response) {
            console.log("UV INDEX DATA", response)
            var uvIndex = $("<p>").addClass("card-text btn btn-sm").text("UV Index: " + response.value);
            $("#currentWeather .card-body").append(uvIndex);

            if (response.value < 3) {
                uvIndex.addClass("btn-success")
            }
            else if (response.value < 7) {
                uvIndex.addClass("btn-warning")
            }
            else {
                uvIndex.addClass("btn-danger")
            }

        })

    }

    function getfiveDay(searchValue) {
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey + "&units=imperial";

        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "JSON"
        }).then(function (data) {
            console.log("GET FIVE DAY FORCAST", data)
            $("#fiveDay").empty();
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {

                    var column = $("<div>").addClass("col-md-2");
                    var card = $("<div>").addClass("card");
                    var cardBody = $("<div>").addClass("card-body");

                    var title = $("<h4>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString())
                    var temp = $("<p>").addClass("card-text").text(data.list[i].main.temp_max + " F")
                    var humid = $("<p>").addClass("card-text").text(data.list[i].main.humidity + "%")
                    console.log("DATA TITLE", title);
                    column.append(card);
                    card.append(cardBody);
                    cardBody.append(title, temp, humid);
                    $("#fiveDay").append(column)

                }

            }
        })

    }

    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0){
        console.log(history[history.length-1])
        getCurrentWeather(history[history.length-1])
    }

    for(var i =0; i < history.length; i++){
        console.log("for loop history", history[i])
        buttonRows(history[i])
    }
})

