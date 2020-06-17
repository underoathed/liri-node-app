require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var bandsintown = require("bandsintown");
var omdb = require("omdb");
var moment = require('moment');
moment().format();

var action = process.argv[2];
var functionDataRaw = process.argv.splice(3, process.argv.length-1);
var functionData = functionDataRaw.join(' ');



var pick = function(action, functionData){
    switch (action) {
    case "movie-this":
        movie(functionData);
        break;

    case "concert-this":
        artist(functionData);
        break;

    case "spotify-this-song":
        song(functionData);
        break;

    case "do-what-it-says":
        says();
        break;

    default: 
    case "spotify-this-song":
    defaultSearch = 'The Sign';
    song(defaultSearch);
    
         
}
}




function song(functionData) {
        var spotify = new Spotify(keys.spotify);
                   spotify.search({ type: 'track', query: functionData, limit: 1}, function(err, data) {
                    if (err) {
                      return console.log('Error occurred: ' + err);
                    }
                    for (var key in data.tracks.items){
                        console.log(data.tracks.items[key].artists[0].name);
                        console.log(data.tracks.items[key].preview_url);
                        console.log(data.tracks.items[key].name);
                        console.log(data.tracks.items[key].album.name);
                        
                    }  
                    
                  });
                }


function artist() {
    var item = functionData;
    
    axios.get("https://rest.bandsintown.com/artists/" + item + "/events?app_id=trilogy").then(
        function (response) {


            console.log(item + " is playing at: " + response.data[0].venue.name);
            console.log("This is located in: " + response.data[0].venue.city);

            var date = response.data[0].datetime;
            var momentTime = moment(date).format('MM/DD/YYYY')

            console.log("The date of the show is: " + momentTime);
        }

    )

    .catch(function(err){
        console.log(`Sorry, I don't know that one.`)

    })
}




function movie() {
    var movieChoice = functionData;
        
    axios.get("http://www.omdbapi.com/?t=" + movieChoice + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

            
        }
    )
}

function says(){

fs.readFile("random.txt", "utf8", function(error, data) {

  if (error) {
    return console.log(error);
  }

  var dataArr = data.split(",");
  action1 = dataArr[0];
  functionData1 = dataArr[1];
  
  pick(action1, functionData1);
 })
}

pick(action, functionData);