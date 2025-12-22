from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Her yerden erişime izin ver
    allow_methods=["*"],      # Tüm HTTP metotlarına izin ver
    allow_headers=["*"],      # Tüm headerlara izin ver
)

# JSON verisini yükle
with open("imdb_data.json", "r", encoding="utf-8") as f:
    movies = json.load(f)

# Filmleri ID'ye göre sırala
movies = sorted(movies, key=lambda x: x["id"])

@app.get("/")
def root():
    return {"message": "Film API çalışıyor!"}

@app.get("/movies")
def get_movies():
    return {"count": len(movies), "data": movies}

@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    for m in movies:
        if m["id"] == movie_id:
            return m
    return {"error": "Film bulunamadı"}


@app.get("/genre/{genre_name}")
def get_movies_by_genre(genre_name: str):
    # Normalize: Küçük harf + tire yerine boşluk yok
    normalized = genre_name.lower().replace("-", "").replace(" ", "")

    result = []

    for movie in movies:
        for g in movie["genres"]:
            g_norm = g.lower().replace("-", "").replace(" ", "")
            if g_norm == normalized:
                result.append(movie)

    return {"count": len(result), "data": result}

