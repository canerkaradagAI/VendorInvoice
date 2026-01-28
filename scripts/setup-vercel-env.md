# Vercel Environment Variables Setup

## Veritabanı Bilgileri

Aşağıdaki environment variable'ları Vercel Dashboard'da ayarlayın:

### Vercel Dashboard → Projeniz → Settings → Environment Variables

Aşağıdaki değişkenleri ekleyin (Production, Preview, Development için hepsini seçin):

1. **POSTGRES_URL**
   ```
   postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require
   ```

2. **DATABASE_URL** (opsiyonel, bazı ORM'ler için gerekli)
   ```
   postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require
   ```

3. **POSTGRES_PRISMA_URL** (opsiyonel, Prisma için)
   ```
   postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require&pgbouncer=true
   ```

## Adımlar

1. Vercel Dashboard → Projeniz → Settings → Environment Variables
2. "Add New" tıklayın
3. Name: `POSTGRES_URL`
4. Value: Yukarıdaki connection string'i yapıştırın
5. Environment: Production, Preview, Development (hepsini seçin)
6. "Save" tıklayın
7. Deploy'u yeniden başlatın

## Migration Script Çalıştırma

Environment variable'ları ayarladıktan sonra, local'de migration script'ini çalıştırın:

```powershell
# .env.local dosyası oluşturun
$env:POSTGRES_URL="postgres://8304a7387ce199dba40c6db68f88acb6727d0e799c4b5684ab5aa8a5bed23186:sk_F0iWpmhLc-KL_y0iOKSku@db.prisma.io:5432/postgres?sslmode=require"

# Migration'ı çalıştırın
node scripts/migrate-sqlite-to-postgres.js
```
