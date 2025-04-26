var movdata = [];
var filteredMoves = [];
var baseurl = "https://image.tmdb.org/t/p/w500";
var genres = [];
var genreList = [];

function Movies(page) {
    var myhttp = new XMLHttpRequest();
    myhttp.open('GET', `https://api.themoviedb.org/3/movie/popular?api_key=1c61f7854caf371b34a23ef611f0efed&page=${page}`);
    myhttp.send();
    myhttp.addEventListener('readystatechange', function () {
        if (myhttp.readyState == 4) {
            var data = JSON.parse(myhttp.response);
            movdata = data.results;
            Display(movdata);

        }
    });
}
Movies(1);

function DisplayByGenre(genreId) {
    var myhttp = new XMLHttpRequest();
    myhttp.open('GET', `https://api.themoviedb.org/3/discover/movie?api_key=1c61f7854caf371b34a23ef611f0efed&with_genres=${genreId}`);
    myhttp.send();
    myhttp.addEventListener('readystatechange', function () {
        if (myhttp.readyState == 4) {
            var data = JSON.parse(myhttp.response);
            movdata = data.results;
            Display(movdata);
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    // ... your existing DOMContentLoaded code ...

    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // Search when button is clicked
    searchButton.addEventListener('click', function () {
        searchMovies(searchInput.value);
    });

    // Search when Enter key is pressed
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            searchMovies(searchInput.value);
        }
    });
});



function Display(fetchdata) {
    var data = "";
    if (fetchdata.length === 0) {
        data = `<div class="no-results">No movies found matching your search.</div>`;
    } else {
        for (var i = 0; i < fetchdata.length; i++) {
            data += `
        <div class="card">
            <div class="card-inner">
                <div class="front-card">
                    <img src="${baseurl + fetchdata[i].poster_path}" alt="">
                </div>
                <div class="back-card">
                    <h1>${fetchdata[i].title}</h1>
                    <h3>${fetchdata[i].overview}</h3>
                    <div class="container rating" data-id="${fetchdata[i].id}">
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    <button onclick="redirectToDetails(${fetchdata[i].id})">Watch Now</button>
                </div>
            </div>
        </div>`;
        }
    }

    document.getElementById('div').innerHTML = data;


    RatingStars();
}
function RatingStars() {
    var ratingContainers = document.querySelectorAll('.rating');
    ratingContainers.forEach(function (container) {
        var movieId = container.getAttribute('data-id');
        var stars = container.querySelectorAll('i');

        var savedRate = localStorage.getItem(`rate : ${movieId}`);
        if (savedRate) {
            setRate(stars, parseInt(savedRate) - 1);
        }

        stars.forEach(function (star, index) {
            star.addEventListener('click', function () {
                setRate(stars, index);
                localStorage.setItem(`rate : ${movieId}`, index + 1);
            });
        });
    });
}


function setRate(stars, index) {
    for (var i = 0; i < stars.length; i++) {
        if (i <= index) {
            stars[i].classList.add("fa-solid");
            stars[i].classList.remove("fa-regular");
        } else {
            stars[i].classList.remove("fa-solid");
            stars[i].classList.add("fa-regular");
        }
    }
}
movPages();

document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("menu-toggle");
    const navList = document.querySelector(".navbar ul");

    toggle.addEventListener("click", function () {
        navList.classList.toggle("show");
    });
});


// Movie Pages
function movPages() {
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            page = btn.value;
            Movies(page);
            document.getElementById('searchInput').value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function redirectToDetails(movieId) {
    window.location.href = `pageDetails.html?movieId=${movieId}`;
}


function searchMovies(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (searchTerm === '') {
        Movies(1);  
        return;
    }

    var myhttp = new XMLHttpRequest();
    myhttp.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=1c61f7854caf371b34a23ef611f0efed&query=${encodeURIComponent(searchTerm)}`);
    myhttp.send();
    myhttp.addEventListener('readystatechange', function () {
        if (myhttp.readyState == 4) {
            var data = JSON.parse(myhttp.response);
            var searchResults = data.results;
            Display(searchResults);
        }
    });
}

MovieGeneres();
function populateGenreDropdown() {
    var genreSelect = document.getElementById('mov-gener');

    // Clear existing options
    genreSelect.innerHTML = '';

    // Add default option
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a genre';
    genreSelect.appendChild(defaultOption);

    // Add genre options
    genres.forEach(function (genre) {
        var option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}
function MovieGeneres() {
    var myhttp = new XMLHttpRequest();
    myhttp.open('GET', `https://api.themoviedb.org/3/genre/movie/list?api_key=1c61f7854caf371b34a23ef611f0efed`);
    myhttp.send();
    myhttp.addEventListener('readystatechange', function () {
        if (myhttp.readyState == 4) {
            var data = JSON.parse(myhttp.response);
            genres = data.genres;
            genreList = genres;
            populateGenreDropdown();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const genreSelect = document.getElementById('mov-gener');
    genreSelect.addEventListener('change', function () {
        if (genreSelect.value) {
            DisplayByGenre(genreSelect.value);
        }
        else {
            Movies(1);
        }
    });
});
