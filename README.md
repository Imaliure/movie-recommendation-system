# 🎬 Movie Recommendation System

Bu proje, kullanıcılara film detayları ve **akıllı benzer film önerileri** sunan modern arayüzlü, web tabanlı bir film öneri sistemidir. Sistem, IMDB verilerini kullanarak dinamik kategoriler oluşturur ve kullanıcı deneyimini ön planda tutan bir arayüz sunar.

🌐 **Canlı Demo:**  
[https://movie-recommendation-system-mu-blue.vercel.app/](https://movie-recommendation-system-mu-blue.vercel.app/)

---

## 🚀 Proje Yapısı

Proje üç ana klasörden oluşmaktadır:

```stylus
.
├── backend             # FastAPI Sunucusu ve API İşlemleri
│   ├── main.py         # API ana giriş noktası
│   ├── data_loader.py  # CSV'den JSON'a veri dönüştürücü (Bilgi amaçlı)
│   └── requirements.txt# Gerekli Python kütüphaneleri
│
├── data                # Ham Veri Kaynağı
│   ├── imdb_data.json  # API'nin kullandığı işlenmiş veri seti
│   └── imdb_top_1000.csv # Orijinal veri seti
│
├── frontend            # Kullanıcı Arayüzü (Vercel'de Deploy Edilmiştir)
│   ├── index.html      # Ana Sayfa
│   ├── detail.html     # Film Detay & Öneri Sayfası
│   ├── favorites.html  # Favori Listesi
│   ├── category.html   # Tür Bazlı Listeleme
│   ├── style.css       # Tasarım & Modern UX
│   ├── app.js          # Ana Sayfa Mantığı & Kategori Poster Atama
│   ├── detail.js       # Öneri Algoritması & Detaylar
│   ├── favorites.js    # LocalStorage Yönetimi
│   ├── category.js     # Kategori Filtreleme
│   └── no-image.png    # Kırık resimler için yedek görsel
│
└── README.md
```

---

## 📊 Veri Hazırlama Süreci (Bilgi Amaçlı)

Sistem, `data/imdb_top_1000.csv` dosyasındaki verileri kullanır. Backend içerisinde bulunan `data_loader.py` dosyası, bu ham veriyi temizleyerek API'nin hızlı okuyabileceği ve frontend'in ihtiyaç duyduğu şu JSON formatına dönüştürür:

```json
{
    "id": 79,
    "title": "Witness for the Prosecution",
    "year": 1957,
    "genres": ["Crime", "Drama", "Mystery"],
    "rating": 8.4,
    "overview": "A veteran British barrister must defend his client...",
    "poster": "https://m.media-amazon.com/images/..."
}
```
*Not: `imdb_data.json` dosyası halihazırda oluşturulmuş ve projeye dahil edilmiştir.*

---

## 🧠 Benzer Film Öneri Mantığı

Sistem, bir film seçildiğinde şu algoritmayı çalıştırır:
1.  Seçilen filmin türleri (genres) analiz edilir.
2.  Diğer tüm filmlerle tür bazlı karşılaştırma yapılarak **Benzerlik Skoru** hesaplanır.
3.  En yüksek skora sahip ilk 20 film filtrelenir.
4.  Kullanıcıya her seferinde farklı bir içerik sunmak adına, bu 20 film arasından **rastgele 10 film** seçilerek önerilir.

---

## 🖥️ Backend’i Lokal Olarak Çalıştırma

### 1️⃣ Gerekli ortamı hazırlayın
```bash
cd backend
python -m venv venv
```

### 2️⃣ Sanal ortamı aktif edin
- **Windows:** `venv\Scripts\activate`
- **Mac / Linux:** `source venv/bin/activate`

### 3️⃣ Bağımlılıkları yükleyin ve başlatın
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
*Backend adresi:* `http://127.0.0.1:8000`

---

## 🔁 Frontend – API URL Yapılandırması

Canlı demoda frontend, Render üzerindeki backend ile konuşur. Lokal çalışırken tüm `.js` dosyalarındaki `API_URL` değişkenini değiştirmeniz gerekir:

```javascript
// Tüm JS dosyalarının en başındaki satırı bulun:
const API_URL = "http://127.0.0.1:8000"; // Lokal kullanım için
```

---

## 🌐 Frontend’i Çalıştırma

Proje statik dosyalardan oluştuğu için modern tarayıcı güvenlik politikaları (CORS) gereği bir sunucu üzerinden açılması önerilir:

✅ **Yöntem 1: VS Code Live Server**  
`index.html` dosyasına sağ tıklayıp **"Open with Live Server"** deyin.

✅ **Yöntem 2: PHP Sunucusu**  
```bash
php -S localhost:5500
```

---

## ⚠️ Önemli Uyarılar (Demo Hakkında)

Backend, **Render** ücretsiz planı üzerinde çalışmaktadır. Bu nedenle:
- Sunucu belirli bir süre kullanılmadığında "uyku moduna" geçer.
- Uygulama ilk açıldığında verilerin gelmesi **5-10 dakika** sürebilir.
- Eğer film listesi boş görünürse, lütfen Render sunucusunun uyanması için kısa bir süre bekleyip sayfayı yenileyiniz.

---

## 👤 Geliştirici
**Movie Recommendation System**

*Frontend & Backend geliştirme*  
*FastAPI • JavaScript • Render • Vercel*
