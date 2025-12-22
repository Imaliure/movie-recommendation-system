const API_URL = "https://movie-recommendation-system-1-9dq3.onrender.com";
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

async function loadMovieDetail() {
    const res = await fetch(`${API_URL}/movies/${movieId}`);
    const movie = await res.json();
    
    const isFav = favorites.includes(movie.id);

    document.getElementById("movie-detail").innerHTML = `
        <div class="detail-container">
            <img src="${movie.poster}" class="detail-poster" onerror="this.src='no-image.png';">
            <div class="detail-content">
                <h1>${movie.title}</h1>
                <div class="detail-meta">
                    <span><i class="fas fa-calendar"></i> ${movie.year}</span>
                    <span><i class="fas fa-star" style="color:gold"></i> ${movie.rating}</span>
                    <span><i class="fas fa-film"></i> ${movie.genres.join(", ")}</span>
                </div>
                <p class="overview">${movie.overview}</p>
                
                <button class="btn fav-btn ${isFav ? 'remove' : ''}" onclick="toggleFavorite(${movie.id})">
                    <i class="fas ${isFav ? 'fa-heart-broken' : 'fa-heart'}"></i>
                    ${isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                </button>
            </div>
        </div>
    `;
    loadSimilarMovies(movie.genres[0]);
}

async function loadSimilarMovies(genre) {
    const res = await fetch(`${API_URL}/genre/${genre}`);
    const data = await res.json();
    const html = data.data
        .filter(m => m.id != movieId)
        .slice(0, 6)
        .map(m => `
            <div class="movie-card" onclick="location.href='detail.html?id=${m.id}'">
                <img src="${m.poster}" onerror="this.src='no-image.png';">
                <div class="movie-info">
                    <div class="movie-title">${m.title}</div>
                </div>
            </div>
        `).join('');
    document.getElementById("similar-movies").innerHTML = html;
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadMovieDetail();
}

loadMovieDetail();