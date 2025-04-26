
function searchMovies(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (searchTerm === '') {
        document.getElementById('searchResults').innerHTML = '';
        document.getElementById('about-container').style.display = "block";
        document.getElementById('footer').style.display = "block";
        return;
    }

    var abouthttp = new XMLHttpRequest();
    abouthttp.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=1c61f7854caf371b34a23ef611f0efed&query=${encodeURIComponent(searchTerm)}`);
    abouthttp.send();
    abouthttp.addEventListener('readystatechange', function () {
        if (abouthttp.readyState == 4 && abouthttp.status == 200) {
            var data = JSON.parse(abouthttp.response);
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
                                <button>Watch Now</button>
                            </div>
                        </div>
                    </div>
                `;
            }
            document.getElementById('about-container').style.display = "none";
            document.getElementById('footer').style.display = "none";
            document.getElementById('searchResults').innerHTML = output;
        }
    });
}
