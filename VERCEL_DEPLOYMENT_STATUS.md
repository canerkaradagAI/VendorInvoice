# Vercel Deployment Durumu ve Eksikler

## ✅ Tamamlanan İşlemler

1. ✅ PostgreSQL paketleri eklendi (`@vercel/postgres`)
2. ✅ SQLite paketleri kaldırıldı (`sqlite3`)
3. ✅ PostgreSQL schema dosyası oluşturuldu (`scripts/postgres-schema.sql`)
4. ✅ Migration script oluşturuldu (`scripts/migrate-sqlite-to-postgres.js`)
5. ✅ `database.ts` PostgreSQL'e göre refactor edildi
6. ✅ `vercel.json` oluşturuldu (git deployment ayarları ile)
7. ✅ Tüm API route'ları PostgreSQL uyumlu hale getirildi

## ⚠️ Kritik Sorunlar

### 1. `sql.query()`, `sql.unsafe()`, `sql.join()`, `sql.raw()` Metodları Yok

`@vercel/postgres` kütüphanesinde bu metodlar yok. Sadece template literal (`sql`...``) kullanılabilir.

**Etkilenen Fonksiyonlar:**
- `getShippingDocuments()` - Dinamik WHERE clause için `sql.join()` kullanılamıyor
- `getInvoices()` - Dinamik WHERE clause için `sql.join()` kullanılamıyor
- `initializeDatabase()` - Raw SQL çalıştırmak için `sql.raw()` kullanılamıyor

### 2. Çözüm: Her Durumu Ayrı Template Literal ile Yazmak

Dinamik sorgular için her filtre kombinasyonunu ayrı ayrı template literal ile yazmak gerekiyor. Bu:
- ✅ Güvenli (SQL injection riski yok)
- ❌ Uzun ve tekrarlayıcı kod
- ❌ Bakımı zor

**Örnek:**
```typescript
// ❌ Çalışmıyor:
const conditions = [sql`col1 = ${val1}`, sql`col2 = ${val2}`];
await sql`SELECT * FROM table WHERE ${sql.join(conditions, sql` AND `)}`;

// ✅ Çalışıyor:
if (val1 && val2) {
  await sql`SELECT * FROM table WHERE col1 = ${val1} AND col2 = ${val2}`;
} else if (val1) {
  await sql`SELECT * FROM table WHERE col1 = ${val1}`;
} else if (val2) {
  await sql`SELECT * FROM table WHERE col2 = ${val2}`;
}
```

## 📋 Yapılması Gerekenler

### 1. `getShippingDocuments()` Fonksiyonunu Düzelt

Tüm filtre kombinasyonlarını ayrı ayrı template literal ile yaz:
- Hiç filtre yok
- Sadece shippingNumber
- Sadece status
- Sadece supplierCode
- Sadece companyId
- shippingNumber + status
- shippingNumber + supplierCode
- shippingNumber + companyId
- status + supplierCode
- status + companyId
- supplierCode + companyId
- shippingNumber + status + supplierCode
- shippingNumber + status + companyId
- shippingNumber + supplierCode + companyId
- status + supplierCode + companyId
- Tüm filtreler

### 2. `getInvoices()` Fonksiyonunu Düzelt

Tüm filtre kombinasyonlarını ayrı ayrı template literal ile yaz:
- Hiç filtre yok
- Sadece search
- Sadece status
- search + status

### 3. `initializeDatabase()` Fonksiyonunu Düzelt

Bu fonksiyon Vercel'de çalışmayacak. Sadece local development için kullanılmalı veya kaldırılmalı.

## 🔧 Alternatif Çözümler

### Seçenek 1: `pg` Kütüphanesi Kullanmak

`@vercel/postgres` yerine `pg` kütüphanesi kullanılabilir. Bu durumda:
- ✅ `query()` metodu var
- ✅ Dinamik sorgular kolay
- ❌ Vercel'in connection pooling'ini kullanamazsınız
- ❌ Environment variable'ları manuel yönetmeniz gerekir

### Seçenek 2: Her Durumu Ayrı Yazmak (ÖNERİLEN)

Mevcut yaklaşımı devam ettirip, tüm kombinasyonları yazmak:
- ✅ Güvenli
- ✅ Vercel'in özelliklerini kullanır
- ❌ Uzun kod

### Seçenek 3: Helper Fonksiyon Oluşturmak

Template literal'ları birleştiren bir helper fonksiyon yazmak (ama bu da karmaşık olabilir).

## 📝 Notlar

- `initializeDatabase()` fonksiyonu Vercel'de çalışmayacak. Veritabanı şeması Vercel Dashboard'dan veya migration script ile oluşturulmalı.
- Build başarısız oluyor çünkü `sql.join()` ve `sql.raw()` metodları yok.
- Tüm dinamik sorguları düzeltmek gerekiyor.

## 🚀 Sonraki Adımlar

1. `getShippingDocuments()` fonksiyonunu tüm kombinasyonları yazarak düzelt
2. `getInvoices()` fonksiyonunu tüm kombinasyonları yazarak düzelt
3. `initializeDatabase()` fonksiyonunu kaldır veya sadece local için kullan
4. Build'i test et
5. GitHub'a push et
6. Vercel'de deploy et
