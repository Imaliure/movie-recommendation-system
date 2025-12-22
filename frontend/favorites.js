const API_URL = "https://movie-recommendation-system-1-9dq3.onrender.com";
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

async function loadFavorites() {
    const listDiv = document.getElementById("favorite-list");
    if (favorites.length === 0) {
        listDiv.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; font-size: 1.2rem; margin-top: 50px;">Henüz favori film eklemediniz.</p>`;
        return;
    }

    let html = "";
    for (let id of favorites) {
        const res = await fetch(`${API_URL}/movies/${id}`);
        const m = await res.json();
        html += `
            <div class="movie-card">
                <img src="${m.poster}" onclick="location.href='detail.html?id=${m.id}'">
                <div class="movie-info">
                    <div class="movie-title">${m.title}</div>
                    <button class="btn fav-btn remove" onclick="removeFavorite(${m.id})" style="padding: 5px; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i> Kaldır
                    </button>
                </div>
            </div>
        `;
    }
    listDiv.innerHTML = html;
}

function removeFavorite(id) {
    favorites = favorites.filter(f => f !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
}
loadFavorites();