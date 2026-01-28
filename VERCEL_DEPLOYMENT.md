# Vercel Deployment Rehberi

## Durum
✅ GitHub'a push edildi: `canerkaradagAI/VendorInvoice`
✅ vercel.json kaldırıldı
✅ PostgreSQL migration tamamlandı

## Sonraki Adımlar

### 1. Vercel Dashboard'da Environment Variables Ayarlayın

1. Vercel Dashboard → Projeniz → Settings → Environment Variables
2. Aşağıdaki değişkenleri ekleyin:

**POSTGRES_URL** (ZORUNLU):
```
postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require
```

**DATABASE_URL** (Opsiyonel):
```
postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require
```

**POSTGRES_PRISMA_URL** (Opsiyonel):
```
postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require&pgbouncer=true
```

**Önemli:** Her değişken için "Production", "Preview", "Development" seçeneklerini işaretleyin.

### 2. Deploy'u Tetikleyin

GitHub'a push edildiği için otomatik deploy başlamalı. Eğer başlamadıysa:

1. Vercel Dashboard → Projeniz → Deployments
2. "Redeploy" tıklayın
3. Veya GitHub'da yeni bir commit yapın (otomatik deploy tetiklenir)

### 3. Migration Script'ini Çalıştırın

Deploy başarılı olduktan sonra, local'de migration script'ini çalıştırın:

```powershell
cd C:\Users\caner.karadag\Cursor_Projeler\Tedarikci_Irsaliye\app

# Environment variable'ı ayarlayın
$env:POSTGRES_URL="postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require"

# Migration'ı çalıştırın
node scripts/migrate-sqlite-to-postgres.js
```

### 4. Uygulamayı Test Edin

1. Vercel Dashboard → Projeniz → Deployments
2. En son deployment'ın "Ready" durumunda olduğunu kontrol edin
3. URL'yi açın ve uygulamayı test edin

## Sorun Giderme

### Build Hatası
- Environment Variables'ın doğru eklendiğini kontrol edin
- POSTGRES_URL'in doğru olduğunu kontrol edin

### Database Connection Hatası
- Migration script'ini çalıştırdınız mı?
- Environment variable'ların Production, Preview, Development için ayarlandığını kontrol edin

### Migration Script Hatası
- POSTGRES_URL environment variable'ının ayarlandığını kontrol edin
- SQLite database.sqlite dosyasının mevcut olduğunu kontrol edin
