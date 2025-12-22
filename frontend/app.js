const API_URL = "https://movie-recommendation-system-1-9dq3.onrender.com";

async function getMovies() {
    try {
        const res = await fetch(`${API_URL}/movies`);
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error("API Hatası:", err);
        return [];
    }
}

function checkImage(url) {
    return new Promise(resolve => {
        if(!url || url === "N/A") resolve(false);
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

async function extractGenrePosters(movies) {
    const genrePosterMap = {};

    for (const movie of movies) {
        for (const g of movie.genres) {

            if (!genrePosterMap[g]) {
                
                const poster = movie.poster;

                // Poster boş veya N/A ise doğrudan atla
                if (!poster || poster === "" || poster === "N/A") continue;

                // Gerçekten yüklenebilir mi? (asenkron kontrol)
                const isWorking = await checkImage(poster);
                if (!isWorking) continue;

                // Aynı poster başka kategoride kullanılmış mı?
                if (Object.values(genrePosterMap).includes(poster)) continue;

                // Poster tamamen geçerli → kategori posteri olarak seç
                genrePosterMap[g] = poster;
            }
        }
    }

    return genrePosterMap;
}

// Film kartı HTML template'i (Her yerde aynı yapıyı kullanmak için)
function createMovieCard(movie) {
    return `
        <div class="movie-card" onclick="goDetail(${movie.id})">
            <img src="${movie.poster}" onerror="this.src='no-image.png';">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-rating"><i class="fas fa-star"></i> ${movie.rating || 'N/A'}</div>
            </div>
        </div>
    `;
}

async function loadHomePage() {
    const movies = await getMovies();
    const genrePosterMap = await extractGenrePosters(movies);

    // Kategoriler
    let categoryHTML = "";
    Object.keys(genrePosterMap).forEach(g => {
        categoryHTML += `
            <div class="category-card" onclick="goCategory('${g}')">
                <img src="${genrePosterMap[g]}" onerror="this.src='no-image.png';">
                <p class="category-name">${g}</p>
            </div>
        `;
    });
    document.getElementById("category-list").innerHTML = categoryHTML;

    // Öne Çıkanlar
    const featured = movies.filter(m => m.rating >= 8.5).slice(0, 16);
    document.getElementById("featured-list").innerHTML = featured.map(m => createMovieCard(m)).join('');
}

function goCategory(g) { window.location.href = `category.html?genre=${g}`; }
function goDetail(id) { window.location.href = `detail.html?id=${id}`; }

loadHomePage();