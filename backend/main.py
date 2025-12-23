from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

# FastAPI uygulamasını başlat
app = FastAPI()

# CORS (Cross-Origin Resource Sharing) ayarları
# Bu ayar, farklı adreslerdeki (örneğin React veya Vue gibi frontend uygulamaları) 
# istemcilerin bu API'ye erişmesine izin verir.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Tüm domainlerden gelen isteklere izin ver
    allow_methods=["*"],      # Tüm HTTP metodlarına (GET, POST, PUT, DELETE vb.) izin ver
    allow_headers=["*"],      # Tüm header bilgilerine izin ver
)

# Uygulama başladığında JSON verisini belleğe (RAM) yükle
try:
    with open("../data/imdb_data.json", "r", encoding="utf-8") as f:
        movies = json.load(f)
    
    # Filmleri ID'ye göre küçükten büyüğe sırala (Hızlı erişim ve düzen için)
    movies = sorted(movies, key=lambda x: x["id"])
except FileNotFoundError:
    # Dosya bulunamazsa hata vermemesi için boş liste ata
    movies = []
    print("Hata: JSON dosyası bulunamadı!")

# 1. Root (Kök) Endpoint: API'nin çalışıp çalışmadığını kontrol etmek için
@app.get("/")
def root():
    return {"message": "Film API çalışıyor!"}

# 2. Tüm Filmleri Getir: Film sayısını ve listenin tamamını döner
@app.get("/movies")
def get_movies():
    return {"count": len(movies), "data": movies}

# 3. ID'ye Göre Film Getir: Belirli bir ID'ye sahip tek bir filmi döndürür
@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    # Liste içinde döngü kurarak ID eşleşmesini kontrol et
    for m in movies:
        if m["id"] == movie_id:
            return m
    # Eğer döngü biter ve bulunamazsa hata mesajı dön
    return {"error": "Film bulunamadı"}

# 4. Türe Göre Filtrele: Belirli bir film türündeki (Genre) tüm filmleri getirir
@app.get("/genre/{genre_name}")
def get_movies_by_genre(genre_name: str):
    # Normalizasyon: Gelen tür ismini küçük harfe çevir, boşlukları ve tireleri kaldır
    # Bu sayede "Sci-Fi" ile "scifi" veya "Sci Fi" aramaları aynı sonucu verir.
    normalized = genre_name.lower().replace("-", "").replace(" ", "")

    result = []

    # Tüm filmleri tek tek kontrol et
    for movie in movies:
        # Her filmin içindeki türler listesini dön
        for g in movie["genres"]:
            # Film türünü de aynı şekilde normalize et
            g_norm = g.lower().replace("-", "").replace(" ", "")
            
            # Eğer aranan tür ile filmdeki tür eşleşiyorsa listeye ekle
            if g_norm == normalized:
                result.append(movie)
                break  # Bir filmde aynı türden iki tane olmaz, iç döngüden çık

    return {"count": len(result), "data": result}