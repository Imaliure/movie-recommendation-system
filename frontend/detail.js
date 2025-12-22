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

    loadSimilarMovies(movie.genres);
}

async function loadSimilarMovies(genres) {
    let allMovies = [];

    for (let g of genres) {
        const res = await fetch(`${API_URL}/genre/${encodeURIComponent(g)}`);
        const data = await res.json();
        allMovies.push(...data.data);
    }

    const scoreMap = {};

    for (let m of allMovies) {
        if (m.id == movieId) continue;

        if (!scoreMap[m.id]) {
            scoreMap[m.id] = { movie: m, score: 1 };
        } else {
            scoreMap[m.id].score++;
        }
    }

    const sortedByScore = Object.values(scoreMap)
        .sort((a, b) => b.score - a.score)
        .map(item => item.movie);

    const top15 = sortedByScore.slice(0, 20);
    const shuffled = top15.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    const html = selected.map(m => `
        <div class="movie-card" onclick="location.href='detail.html?id=${m.id}'">
            <img src="${m.poster}" onerror="this.src='no-image.png';">
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
            </div>
        </div>
    `).join('');

    document.getElementById("similar-movies").innerHTML = html;
}

// ✅ SADECE BUTONU GÜNCELLER
function updateFavoriteButton() {
    const isFav = favorites.includes(Number(movieId));
    const btn = document.querySelector(".fav-btn");

    if (!btn) return;

    btn.classList.toggle("remove", isFav);
    btn.innerHTML = `
        <i class="fas ${isFav ? 'fa-heart-broken' : 'fa-heart'}"></i>
        ${isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    `;
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));

    updateFavoriteButton(); // 🔥 ARTIK BENZERLER DEĞİŞMEZ
}

loadMovieDetail();
