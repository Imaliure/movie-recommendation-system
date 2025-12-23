const API_URL = "https://movie-recommendation-system-1-9dq3.onrender.com";
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

// Değişkeni "let" ile tanımlıyoruz ki güncelleyebilelim
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

async function loadMovieDetail() {
    const res = await fetch(`${API_URL}/movies/${movieId}`);
    const movie = await res.json();
    
    // Favori durumunu her seferinde güncel listeden kontrol et
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
                
                <button class="btn fav-btn ${isFav ? 'remove' : ''}" 
                    onclick="toggleFavorite(${movie.id})"
                    style="${isFav ? 'background-color: #444;' : ''}">
                    <i class="fas ${isFav ? 'fa-heart-broken' : 'fa-heart'}"></i>
                    ${isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                </button>
            </div>
        </div>
    `;
    loadSimilarMovies(movie.genres[0]);
}

// Favori ekleme/çıkarma fonksiyonu
function toggleFavorite(id) {
    // Güncel listeyi al
    favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadMovieDetail(); // UI'ı güncelle
}

// 1. Sayfa ilk açıldığında çalıştır
loadMovieDetail();

// 2. Geri gelindiğinde çalıştır (Sorunu çözen kısım)
window.addEventListener('pageshow', (event) => {
    favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    loadMovieDetail();
});