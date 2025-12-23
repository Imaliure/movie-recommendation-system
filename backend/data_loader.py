import pandas as pd
import json

def convert_csv_to_json(csv_path="../data/imdb_top_1000.csv", json_path="../data/imdb_data.json"):
    """
    IMDB CSV dosyasını okur, verileri temizler ve belirli bir JSON formatına dönüştürür.
    """
    
    # 1. CSV dosyasını pandas DataFrame yapısı olarak oku
    df = pd.read_csv(csv_path)

    # Dönüştürülen film objelerini tutacak boş liste
    movies = []

    # 2. DataFrame'deki her bir satır üzerinde döngü kur
    for i, row in df.iterrows():

        # Released_Year (Yayın Yılı) değerini al ve başındaki/sonundaki boşlukları temizle
        year_value = str(row["Released_Year"]).strip()

        # Veri setindeki bazı hatalı girişleri (sayı olmayan yıllar) filtrele
        # Eğer değer sadece rakamlardan oluşmuyorsa o satırı atla
        if not year_value.isdigit():
            print("Yıl değeri geçersiz, atlanıyor:", year_value)
            continue

        # 3. Genre (Tür) bilgisini işle
        # Örn: "Drama, Sci-Fi" -> ["Drama", "Sci-Fi"] listesine çevir
        genres = [g.strip() for g in row["Genre"].split(",")]

        # 4. JSON yapısına uygun film sözlüğünü (dictionary) oluştur
        movie = {
            "id": int(i),                             # Benzersiz ID (Satır indeksi)
            "title": row["Series_Title"],             # Film adı
            "year": int(year_value),                  # Tam sayıya çevrilmiş yıl
            "genres": genres,                         # Liste formatında türler
            "rating": float(row["IMDB_Rating"]),      # Ondalıklı sayı formatında puan
            "overview": str(row["Overview"]),         # Film özeti
            "poster": row["Poster_Link"]              # Afiş linki
        }

        # Oluşturulan sözlüğü listeye ekle
        movies.append(movie)

    # 5. Sonuç listesini JSON dosyası olarak kaydet
    with open(json_path, "w", encoding="utf-8") as f:
        # indent=4: Dosyanın okunabilir (girintili) olmasını sağlar
        # ensure_ascii=False: Türkçe karakterlerin düzgün görünmesini sağlar
        json.dump(movies, f, indent=4, ensure_ascii=False)

    print("JSON veri başarıyla oluşturuldu:", json_path)


# Script doğrudan çalıştırıldığında fonksiyonu çağır
if __name__ == "__main__":
    convert_csv_to_json()