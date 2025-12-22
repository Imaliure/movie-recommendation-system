const API_URL = "https://movie-recommendation-system-1-9dq3.onrender.com";
const params = new URLSearchParams(window.location.search);
const genre = params.get("genre");

document.getElementById("category-title").innerHTML = `<i class="fas fa-tag"></i> ${genre} Filmleri`;

async function loadCategoryMovies() {
    const res = await fetch(`${API_URL}/genre/${genre}`);
    const data = await res.json();
    const html = data.data.map(m => `
        <div class="movie-card" onclick="location.href='detail.html?id=${m.id}'">
            <img src="${m.poster}" onerror="this.src='no-image.png';">
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
                <div class="movie-rating"><i class="fas fa-star"></i> ${m.rating}</div>
            </div>
        </div>
    `).join('');
    document.getElementById("category-movies").innerHTML = html;
}
loadCategoryMovies();