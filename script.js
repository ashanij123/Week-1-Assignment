var page = 1;
var currentSearchTerm = '';
var hidden = false;

const moviesForm = document.querySelector("form");
const moviesArea = document.querySelector("#movies-area");

const pageSize = 20;
const offset = page * pageSize;
const posterSize = "w185";

moviesForm.addEventListener("submit", getMovies);
//this is for the serach function of the site
async function getMovies(event){
    event.preventDefault();
    console.log("does this work?", event);
    const moviesInput = event.target.movies;
    const movies = moviesInput.value;
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${movies}&api_key=a137a94d2acebd8426970054198eb174&language=en-US&page=${page}`;
    console.log("apiUrl is", searchUrl)

    const response = await fetch(searchUrl);
    const responseData = await response.json();
    const movieData = responseData.results;


    generateHTML(movieData);
}

function generateHTML(movieData){
  moviesArea.innerHTML = '';
  hidden = true;
  for (i = 0; i < movieData.length; i++){
    const posterPath = movieData[i].poster_path;
    const posterSize = "w185";
    console.log("moviedata", movieData)
    moviesArea.innerHTML +=
    `<div class="tags" id="pics"><img src="http://image.tmdb.org/t/p/${posterSize}/${posterPath}" alt="movie poster"/>
    <div class="words"><h4 class="words"> ${movieData[i].title} </h4>
    <h5> \u2B50 ${movieData[i].vote_average} </h5></div></div>`;
  }
}

//this is to display all the movies on the page before any changes are made
window.addEventListener("load", allMovies);

async function allMovies(event){
  event.preventDefault();
  const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=a137a94d2acebd8426970054198eb174&language=en-US&page=${page}`;
  const response = await fetch(apiUrl);
  const responseData = await response.json();
  const movieData = responseData.results;
  console.log("allMovies data", movieData)

  allResults(movieData);
  }

function allResults(flix) {
  for (i = 0; i < flix.length; i++){
    const posterPath = flix[i].poster_path;
    console.log("moviedata", flix)
    moviesArea.innerHTML +=
    `<div class="tags" ><img src="http://image.tmdb.org/t/p/${posterSize}/${posterPath}"/>
    <div class="words"><h4> ${flix[i].title} </h4>
    <h5> \u2B50 ${flix[i].vote_average} </h5></div></div>`;
    loadMoreButton.classList.remove('hidden');
  }
}

// Load more button
const loadMoreButton = document.querySelector("#load-more-btn")
loadMoreButton.addEventListener("click", loadMoreMovies);

//The main function that will call the other two fuctions 
async function loadMoreMovies(event) {
  page++;
  event.preventDefault();
  const results = await getResults();
  displayResults(results);
}

//The two other functions
async function getResults() {
  const offset = page * pageSize;
  const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=a137a94d2acebd8426970054198eb174&language=en-US&page=${page}&limit=${pageSize}&offset=${offset}`);
  const jsonResponse = await response.json();
  return jsonResponse.results;
}

/** Render list of results. */
function displayResults(results) {
  const moviesHTMLString = results.map(movies => `
      <div class="tags">
          <img src="http://image.tmdb.org/t/p/${posterSize}/${movies.poster_path}" />
          <div class="words"><h4> ${movies.title} </h4>
          <h5> \u2B50 ${movies.vote_average} </h5></div>
      </div>
  `).join('');

  moviesArea.innerHTML = moviesArea.innerHTML + moviesHTMLString;
}

//clear button(refresh page)
const clearButton = document.querySelector("#clear-btn")
clearButton.addEventListener("click", clearBtn);

function clearBtn (event){
  location.reload();
}
