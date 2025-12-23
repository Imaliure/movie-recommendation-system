import pandas as pd
import json

def convert_csv_to_json(csv_path="../data/imdb_top_1000.csv", json_path="../data/imdb_data.json"):
    df = pd.read_csv(csv_path)

    movies = []

    for i, row in df.iterrows():

        # 1) Released_Year değerini güvenli şekilde al
        year_value = str(row["Released_Year"]).strip()

        # Eğer sayı değilse bu filmi atla
        if not year_value.isdigit():
            print("Yıl değeri geçersiz, atlanıyor:", year_value)
            continue

        # 2) Genre → listeye çevir
        genres = [g.strip() for g in row["Genre"].split(",")]

        movie = {
            "id": int(i),
            "title": row["Series_Title"],
            "year": int(year_value),
            "genres": genres,
            "rating": float(row["IMDB_Rating"]),
            "overview": str(row["Overview"]),
            "poster": row["Poster_Link"]
        }

        movies.append(movie)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(movies, f, indent=4, ensure_ascii=False)

    print("JSON veri oluşturuldu:", json_path)


if __name__ == "__main__":
    convert_csv_to_json()
