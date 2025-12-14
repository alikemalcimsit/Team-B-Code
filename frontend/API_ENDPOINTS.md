# API Endpoints Documentation

## 1. Dashboard Endpoint

### Endpoint
```
POST http://localhost:8000/dashboard
```

### Request Body
```json
{
  "district": "Üsküdar"
}
```

### Expected Response
```json
{
  "district": "Üsküdar",
  "stats": {
    "avgPrice": 1250000,
    "medianPrice": 1200000,
    "priceChange": 5.2,
    "listings": 234,
    "predictedPrice": 1250000,
    "percentile": 65.5,
    "minPrice": 800000,
    "maxPrice": 2500000,
    "avgRooms": 3.2,
    "avgArea": 95.5,
    "totalListings": 450,
    "activeListings": 234
  },
  "priceDistribution": {
    "q1": 1000000,
    "q2": 1200000,
    "q3": 1450000
  }
}
```

---

## 2. Trends Endpoint

### Endpoint
```
POST http://localhost:8000/trends
```

### Request Body
```json
{
  "district": "Üsküdar"
}
```

### Expected Response
```json
{
  "district": "Üsküdar",
  "trendInfo": {
    "trend": -0.86,
    "priceHistory": [
      {
        "date": "2019-12",
        "price": 924021.52
      },
      {
        "date": "2020-01",
        "price": 916100.74
      },
      {
        "date": "2020-02",
        "price": 918500.25
      }
    ],
    "currentStats": {
      "avgPrice": 919649.81,
      "medianPrice": 600000.0,
      "minPrice": 177000.0,
      "maxPrice": 9750000.0,
      "listings": 674
    }
  }
}
```

**Not:** 
- `trend`: Yüzde olarak trend değeri (ör: -0.86 = %-0.86)
- `priceHistory`: Zaman serisi verileri, `date` formatı "YYYY-MM"
- `currentStats`: Güncel piyasa istatistikleri

---

## 3. Home Page Stats Endpoint

### Endpoint
```
GET http://localhost:8000/stats
```

### Request Body
Yok (GET request)

### Expected Response
```json
{
  "totalAnalyses": 10000,
  "accuracy": 95.2,
  "districts": 39,
  "totalListings": 45000,
  "recentAnalyses": 1234,
  "avgResponseTime": 0.5
}
```

---

## 4. Predict Endpoint (Mevcut)

### Endpoint
```
POST http://localhost:8000/predict
```

### Request Body (Minimum)
```json
{
  "district": "Kadıköy",
  "net_m2": 85,
  "rooms": 3
}
```

### Request Body (Maximum)
```json
{
  "district": "Üsküdar",
  "neighborhood": "Çengelköy Mh.",
  "net_m2": 95,
  "gross_m2": 110,
  "rooms": 3,
  "building_age": 12,
  "floor": 3,
  "num_floors": 6,
  "bathrooms": 2,
  "asking_price": 1000000,
  "purpose": "yatırım"
}
```

### Response (Zaten mevcut format)
```json
{
  "prediction": {
    "predicted_price": 738017.0,
    "predicted_price_formatted": "738.017 TL",
    "price_range_low": 649455.0,
    "price_range_high": 826579.0,
    "confidence": "Orta"
  },
  "comparison": {
    "verdict": "KOTU_YATIRIM",
    "verdict_emoji": "⏳",
    "verdict_description": "KÖTÜ YATIRIM: Fiyat model tahmininin %35.5 üstünde, amortisman 33.9 yıl.",
    "asking_price": 1000000.0,
    "predicted_price": 738017.0,
    "difference_percent": 35.5,
    "similar_properties_count": 63,
    "similar_avg_price": 564667.0,
    "percentile": 95.2,
    "dataset_prices": [380000.0, 680000.0, ...],
    "dataset_price_min": 265000.0,
    "dataset_price_max": 2200000.0,
    "dataset_price_median": 490000.0
  },
  "input_features": {
    "district": "Üsküdar",
    "neighborhood": "Çengelköy Mh.",
    "net_m2": 95.0,
    "gross_m2": 110.0,
    "rooms": 3,
    "building_age": 12.0,
    "floor": 3,
    "num_floors": 6,
    "bathrooms": 2
  }
}
```

---

---

## 5. Model Training Endpoint

### Endpoint
```
POST http://localhost:8000/train-with-new-data
```

### Request Body
```json
{
  "csv_data": "District;Price;m² (Net);Number of rooms;Building Age;Neighborhood\nÜsküdar;924021.52 TL;95;3+1;12;Çengelköy Mh.",
  "target_column": "Price",
  "test_size": 0.2
}
```

**Not:** 
- `csv_data`: CSV içeriği string olarak gönderilmeli, noktalı virgül (;) ile ayrılmış
- `target_column`: Varsayılan "Price"
- `test_size`: Varsayılan 0.2 (0.1-0.5 arası)

### Expected Response
```json
{
  "status": "success",
  "message": "Model yeni verilerle eğitildi. 150 yeni kayıt eklendi.",
  "training_results": {
    "original_data_size": 5000,
    "new_data_size": 150,
    "combined_data_size": 5150,
    "train_size": 4120,
    "test_size": 1030,
    "train_metrics": {
      "mae": 125000.45,
      "rmse": 180000.32,
      "r2": 0.8745
    },
    "test_metrics": {
      "mae": 135000.67,
      "rmse": 195000.89,
      "r2": 0.8623
    }
  },
  "model_updated": false
}
```

---

## Özet

1. **Dashboard**: `POST /dashboard` - İlçe bazlı genel istatistikler
2. **Trends**: `POST /trends` - İlçe bazlı trend verileri ve fiyat geçmişi
3. **Home Stats**: `GET /stats` - Genel platform istatistikleri
4. **Predict**: `POST /predict` - Fiyat tahmini (mevcut)
5. **Train Model**: `POST /train-with-new-data` - Yeni verilerle model eğitimi

