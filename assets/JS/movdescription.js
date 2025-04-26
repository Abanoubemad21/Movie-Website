
var data = [];
var simdata = [];

var baseurl = "https://image.tmdb.org/t/p/w500";

function Movie() {
    document.addEventListener("DOMContentLoaded", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get("movieId");
        if (movieId) {
            var myhttp = new XMLHttpRequest();
            myhttp.open('GET', `https://api.themoviedb.org/3/movie/${movieId}?api_key=1c61f7854caf371b34a23ef611f0efed`);
            myhttp.send();
            myhttp.addEventListener('readystatechange', function () {
                if (myhttp.readyState == 4) {
                    data = JSON.parse(myhttp.response);

                }
            });
            var newhttp = new XMLHttpRequest();
            newhttp.open('GET', `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=1c61f7854caf371b34a23ef611f0efed`);
            newhttp.send();
            newhttp.addEventListener('readystatechange', function () {
                if (newhttp.readyState == 4) {
                    var aldata = JSON.parse(newhttp.response);
                    simdata = aldata.results;
                    Displaymov();
                }
            });
        }


    });
}


Movie();


function Displaymov() {
    var inndata = "";
    var genes = "";
    data.genres.forEach(element => {
        genes += `<span> ${element.name} | </span>`;
    });
    var stars = "";
    stars +=
        `<i class="fa-regular fa-star"></i>
         <i class="fa-regular fa-star"></i>
         <i class="fa-regular fa-star"></i>
         <i class="fa-regular fa-star"></i>
         <i class="fa-regular fa-star"></i>
                        `;
    var samdata = "";
    for (i = 0; i < simdata.length; i++) {
        samdata += `
        <div class="card">
            <div class="card-inner">
                <div class="front-card">
                    <img src="${baseurl + simdata[i].poster_path}" alt="">
                </div>
                <div class="back-card">
                    <h1>${simdata[i].title}</h1>
                    <h3>${simdata[i].overview}</h3>
                    <div class="container rating" data-id="${simdata[i].id}">
                        ${stars}
                    </div>
                    <button onclick="redirectToDetails(${simdata[i].id})">Details</button>
                </div>
            </div>
        </div>`;
    }
    inndata += `
    <a href="index.html" class="back-btn"><i class='fas fa-angle-left'></i></a>
        <div class="movie-description">       
                <div class="movimg">
                    <img src="${baseurl + data.poster_path}" alt="">
                </div>
                <div class="movdes">
                    <h3>Title : ${data.title}</h3>
                    <h4>Description : ${data.overview}</h4>
                    <h4>Language: ${data.original_language}</h4>
                    <h4>Genres: ${genes}</h4>
                    <h4>Rating: ${data.vote_average.toFixed(1)}</h4>
                    <div class="container rating" data-id="${data.id}">
                        ${stars}
                    </div>
                </div>
        </div>
        <h1 class="may-header">You may also like </h1>
        <div class="movies-container">${samdata}</div>
        `;



    document.getElementById('decription').innerHTML = inndata;
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
function searchMovies(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (searchTerm === '') {
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('searchResults').style.display = "none";
        document.getElementById('decription').style.display = "block";
        Displaymov();
        return;
    }

    var nehttp = new XMLHttpRequest();
    nehttp.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=1c61f7854caf371b34a23ef611f0efed&query=${encodeURIComponent(searchTerm)}`);
    nehttp.send();
    nehttp.addEventListener('readystatechange', function () {
        if (nehttp.readyState == 4 && nehttp.status == 200) {
            var data = JSON.parse(nehttp.response);
            var searchResults = data.results;

            let output = '';

            for (let movie of searchResults) {
                output += `
                    <div class="card">
                        <div class="card-inner">
                            <div class="front-card">
                                <img src="${baseurl + movie.poster_path}" alt="${movie.title}">
                            </div>
                            <div class="back-card">
                                <h1>${movie.title}</h1>
                                <h3>${movie.overview ? movie.overview.substring(0, 60) + '...' : 'No description available'}</h3>
                                <div class="container rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </div>
                                <button onclick="redirectToDetails(${movie.id})">Watch Now</button>
                            </div>
                        </div>
                    </div>
                `;

            }
            document.getElementById('decription').style.display = "none";
            document.getElementById('searchResults').innerHTML = output;
        }
    });
}
function redirectToDetails(movieId) {
    window.location.href = `pageDetails.html?movieId=${movieId}`;
}