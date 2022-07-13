var teamFormEl = document.querySelector(".button-submit");
// changed classname to .input-text to reference our HTML's input tag 
var nameInputEl = document.querySelector(".input-text");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var pageContentEl = document.querySelector(".page-content");

// When user submits team
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    // get value from input element
    var teamName = nameInputEl.value;
    console.log(teamName);
    if (teamName) {
        fetchTeam(teamName);
        // nameInputEl.value = "";
    } else {
        alert("Please enter a team name");
    }
};

// fetches team searched to get general data for the team that was searched
var fetchTeam = function(team) {

    fetch("https://v3.football.api-sports.io/teams?name=" + team, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "ef30dd863bb3a4a2e54972837f65102c"
        }
    })
    .then(response => {
        console.log(response);
        response.json().then(function(data) {
            fetchFixtures(data);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

var fetchFixtures = function(chosenTeam, season) {
    console.log("Chosen team ID: ", chosenTeam.response[0].team.name);
    var teamID = chosenTeam.response[0].team.id;

    Promise.all([
        fetch('https://v3.football.api-sports.io/fixtures?team=' + teamID + '&season=2021', {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "ef30dd863bb3a4a2e54972837f65102c"
            }
        }),
        fetch('https://v3.football.api-sports.io/fixtures?team=' + teamID + '&season=2022',{
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "ef30dd863bb3a4a2e54972837f65102c"
            }
        })
    ]).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function (data) {
        // Log the data to the console
        // You would do something with both sets of data here
        console.log(data);
        populateFixturesPage(data);
        
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
    
}

var populateFixturesPage = function(fixturesData){
    console.log("++++++++++++++");
    console.log(fixturesData[0].response);

    var prevFixturesArr = fixturesData[0].response;
    var nextFixturesArr = fixturesData[1].response;

    var prevFixturesList = [];
    var nextFixturesList = [];

    for(var i = 0; i < 5; i++){
        var prevMatchObj = {
            homeTeam : prevFixturesArr[i].teams.home.name,
            homeLogo : prevFixturesArr[i].teams.home.logo,
            awayTeam : prevFixturesArr[i].teams.away.name,
            awayLogo : prevFixturesArr[i].teams.away.logo,
            matchDate : prevFixturesArr[i].fixture.date,
            matchVenue : prevFixturesArr[i].fixture.venue.name,
            matchCity : prevFixturesArr[i].fixture.venue.city
        }
        var nextMatchObj = {
            homeTeam : prevFixturesArr[i].teams.home.name,
            homeLogo : prevFixturesArr[i].teams.home.logo,
            awayTeam : prevFixturesArr[i].teams.away.name,
            awayLogo : prevFixturesArr[i].teams.away.logo,
            matchDate : prevFixturesArr[i].fixture.date,
            matchVenue : prevFixturesArr[i].fixture.venue.name,
            matchCity : prevFixturesArr[i].fixture.venue.city
        }
        prevFixturesList.push(prevMatchObj);
        nextFixturesList.push(nextMatchObj);
    }
    displayMatches(prevFixturesList, nextFixturesList);
}

var displayMatches = function (prevMatchObjects, nextMatchObjects) {
    console.log("++++++++++++++++++++++-----++++++");
    console.log(prevMatchObjects);

    var prevFixturesDiv = document.createElement("div");
    prevFixturesDiv.className = "prev-fixtures-div";

    var nextFixturesDiv = document.createElement("div");
    nextFixturesDiv.className = "next-fixtures-div";

    var prevFixturesUl = document.createElement("ul");
    prevFixturesUl.className = "prev-ul";

    var nextFixturesUl = document.createElement("ul");
    nextFixturesUl.className = "next-ul";

    for(var i = 0; i < 5; i++){
        var prevListEl = document.createElement("li");
        prevListEl.className = "prev-li";

        var nextListEl = document.createElement("li");
        nextListEl.className = "next-li";

        var prevHomeLogo = document.createElement("img");
        prevHomeLogo.className = "prev-home-logo";
        prevHomeLogo.src = prevMatchObjects[i].homeLogo;
        var prevAwayLogo = document.createElement("img");
        prevAwayLogo.className = "prev-away-logo";
        prevAwayLogo.src = prevMatchObjects[i].awayLogo;

        var nextHomeLogo = document.createElement("img");
        nextHomeLogo.className = "next-home-logo";
        nextHomeLogo.src = nextMatchObjects[i].homeLogo;
        var nextAwayLogo = document.createElement("img");
        nextAwayLogo.className = "next-home-logo";
        nextAwayLogo.src = nextMatchObjects[i].awayLogo;

        prevListEl.appendChild(prevHomeLogo); 
        prevListEl.appendChild(prevAwayLogo);
        nextListEl.appendChild(nextHomeLogo);
        nextListEl.appendChild(nextAwayLogo);
        
        prevFixturesUl.appendChild(prevListEl);
        nextFixturesUl.appendChild(nextListEl);
    }

    prevFixturesDiv.appendChild(prevFixturesUl);
    nextFixturesDiv.appendChild(nextFixturesUl);

    pageContentEl.appendChild(prevFixturesDiv);
    pageContentEl.appendChild(nextFixturesDiv);
}

//changed teamFormEl query selector to our button on HTML 
teamFormEl.addEventListener("click", formSubmitHandler);