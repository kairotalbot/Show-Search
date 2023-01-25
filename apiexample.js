if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // updatePage

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    elemDiv.classList.add("showBox"); // add a class to apply css

    var elemImage = document.createElement("img");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    elemGenre.classList.add("genreBox")
    var elemRating = document.createElement("div");
    elemRating.classList.add("ratingBox")
    var elemSummary = document.createElement("div");
    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    elemGenre.innerHTML = "<h3 class='subtitle'>Genres:</h3> " + showGenres(tvshowJSON.show.genres);
    elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    elemSummary.innerHTML = tvshowJSON.show.summary;
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    elemEpisodes.classList.add("episodesListBox")
    var output = "<ol>";
    for (episode in data) {
      /* change the function call to 'fetchEpisodeInfo' */
        output += "<li><a href='javascript:fetchEpisodeInfo(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
        
} // showEpisodes

// open lightbox and display episode info
function showLightBox(data){//change the parameter here to data

  console.log(data)
                                              //console log data so you know what is available to use)
     document.getElementById("lightbox").style.display = "block";
     
  //you need to call the api usingn the episodeID to get all info about that episode

     // show episode info in lightbox
     document.getElementById("message").innerHTML = "<h3>Episode: " + data.name + "</h3>";
     document.getElementById("message").innerHTML += "<h3>season: " + data.season + "</h3>";
     document.getElementById("message").innerHTML += "<h3>Episode: " + data.number + "</h3>";
     document.getElementById("message").innerHTML += "<p>Summary: " + data.summary + "</p>";
     document.getElementById("message").innerHTML += '<img src=" '  + data.image.medium  + '" alt="">';
     
     
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 

//make a functoin called showEpisodeInfo that uses a fetch to get API data about a specific episode by its episode ID
//this function will call a fetch, and a .then and another .nthen.. and then it will call showLihgtBox

function fetchEpisodeInfo(episodeId){ //add a receiving paramater: episode id
  fetch('https://api.tvmaze.com/episodes/' + episodeId)  
  .then(response => response.json())
  .then(data => showLightBox(data)); //call showLightBox instead to show episode info
} 