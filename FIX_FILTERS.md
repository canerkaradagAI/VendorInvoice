# Filtre Sorunları Düzeltildi

## Yapılan Düzeltmeler

### 1. Şirket Listesi API Formatı ✅
**Sorun:** API'den gelen şirket verileri frontend'in beklediği formatta değildi.

**Çözüm:** `app/api/companies/route.ts` dosyasında şirket verilerini frontend'in beklediği formata çevirdim:
```typescript
{
  id: string,
  code: string,
  name: string
}
```

### 2. Tedarikçi Filtresi ✅
**Sorun:** Şirket seçilmediğinde tedarikçiler listesi boşaltılıyordu.

**Çözüm:** `filter-panel.tsx` dosyasında şirket seçilmediğinde de tüm tedarikçileri gösterdim.

### 3. API Parametreleri ✅
**Sorun:** Boş string değerleri API'ye gönderiliyordu.

**Çözüm:** Boş değerleri `undefined` olarak gönderecek şekilde düzelttim.

## Test

1. **Tarayıcıda sayfayı yenileyin** (F5 veya Ctrl+R)
2. **Şirket dropdown'ını açın** - 5 şirket görünmeli:
   - OLKA SPOR MALZEMELERİ TİC. A.Ş.
   - MARLIN SPOR MALZEMELERI TICARET A.Ş.
   - JÜPİTER MODA VE SPOR MALZEMELERİ TİCARET A.Ş.
   - NEPTÜN SPOR MALZEMELERİ TİCARET A.Ş.
   - SATÜRN SPOR MALZEMELERİ TİCARET A.Ş.

3. **Filtreleri test edin:**
   - Şirket seçimi
   - Tedarikçi seçimi
   - İrsaliye numarası arama
   - Statü filtresi

## Sorun Devam Ederse

1. Tarayıcı console'unu açın (F12)
2. Hata mesajlarını kontrol edin
3. Network tab'ında `/api/companies` isteğini kontrol edin
4. Sayfayı hard refresh yapın (Ctrl+Shift+R)
