# LIFO Hesaplama Hatası Çözümü

## Sorun
"İrsaliye detayı bulunamadı" hatası alınıyor.

## Neden
LIFO hesaplaması için irsaliyenin ürün kalemlerinin (`shipping_items` tablosunda) kayıtlı olması gerekiyor. Bazı irsaliyelerde bu kalemler eksik.

## Çözüm

### 1. Hata Mesajı İyileştirildi ✅
Artık daha açıklayıcı bir hata mesajı gösteriliyor:
> "İrsaliye detayı bulunamadı. Bu irsaliye için ürün kalemleri (shipping_items) kayıtlı değil. Lütfen önce irsaliye detaylarını ekleyin."

### 2. Kontrol
Item olmayan irsaliyeleri kontrol edin:
- İrsaliye ID=149 (5-BP-6-029) - Item yok ⚠️

### 3. Çözüm Seçenekleri

**Seçenek A: İrsaliye Detaylarını Ekle**
- İrsaliye detayları (ürün kalemleri) veritabanına eklenmeli
- Bu genellikle irsaliye oluşturulurken yapılır

**Seçenek B: Item Olmayan İrsaliyeleri Atla**
- LIFO hesaplaması sadece item'ı olan irsaliyeler için yapılabilir
- Item olmayan irsaliyeler için "Fiyat Hesapla" butonu devre dışı bırakılabilir

**Seçenek C: Fallback Mekanizması**
- Item yoksa, irsaliyenin `total_amount` değerini kullan
- Veya kullanıcıdan manuel fiyat girişi iste

## Öneri
Item olmayan irsaliyeler için "Manuel Hesapla" seçeneğini kullanın veya önce irsaliye detaylarını ekleyin.
