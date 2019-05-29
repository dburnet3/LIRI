//invoking a require function to include the dotenv module in my program
require("dotenv").config();

//declaring my global variables
const keys = require("./keys") //invoking a require function to include my keys file.  Also making it a constant since this won't change.
const request = require("request")// invoking a require function to include the request module in my program.
const Spotify = require("node-spotify-api") //invoking a require function to include the spotify api
const dateFormat = require("dateFormat")// invoking a require function to include the dateFormat module in my program.
const fs = require("fs")// invoking a require function to include the file system module in my program

//Created a function that takes in the name of the artist, which is then evaluated agains the 'bandsintown' api
let concertThis = function(artist){
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist.replace(" ", "+") + "/events?app_id=codingbootcamp"
    
    //used 'request' to make an http call
    request(queryUrl, function(err, response, body){
        if (!err && response.statusCode === 200) {
            let concertInfo = JSON.parse(body)
            
            outputData(artist + " concert information:")

            for (i=0; i < concertInfo.length; i++) {
                
                region = concertInfo[i].venue.region
               

                // This will return the venue, location, and date
                outputData("Venue: " + concertInfo[i].venue.name)
                outputData("Location: " + concertInfo[i].venue.city + ", " + region);
                outputData("Date: " + dateFormat(concertInfo[i].datetime, "mm/dd/yyyy"))
            }
        }
    })
}

// The following function will take a song as an input and search spotify to return information to the user
let spotifyThisSong = function(song){
    //added a condition to account for the case that the user doesn't enter in a song.  The defaulted song would be Shot Clock by Ella Mai
    if (!song){
        song = "Shot Clock"
    }

    let spotify = new Spotify(keys.spotify);

    spotify.search({type: "track", query: song, limit: 1}, function (err, data){
        if (err) {
            return console.log(err)
        }

        let songInfo = data.tracks.items[0]
        outputData(songInfo.artists[0].name)
        outputData(songInfo.name)
        outputData(songInfo.album.name)
        outputData(songInfo.preview_url)
    })
}

// The following method will take a movie and search IMDB for it.
let movieThis = function(movie){
    //Defaulted to Mr. Nobody as requested in the instructions
    if (movie == "undefined"){
        movie = "Mr.+Nobody"
    }

    let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(err, response, body){
        if (!err && response.statusCode === 200) {
            let movieInfo = JSON.parse(body)

            outputData("Title: " + movieInfo.Title)
            outputData("Release year: " + movieInfo.Year)
            outputData("IMDB Rating: " + movieInfo.imdbRating)
            outputData("Country: " + movieInfo.Country)
            outputData("Language: " + movieInfo.Language)
            outputData("Plot: " + movieInfo.Plot)
            outputData("Actors: " + movieInfo.Actors)
        } 
    })
}

let doWhatItSays = function(){

    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        var dataArr = data.split(",")

        runAction(dataArr[0], dataArr[1])
    });
}

let outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}

let runAction = function(func, parm) {
    switch (func) {
        case "concert-this":
            concertThis(parm)
            break
        case "spotify-this-song":
            spotifyThisSong(parm)
            break
        case "movie-this":
            movieThis(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            outputData("That is not a command that I recognize, please try again.") 
    }
}

runAction(process.argv[2], process.argv[3])
