/**
 * SQLite veritabanından PostgreSQL'e veri migrasyon script'i
 * 
 * Kullanım:
 *   node scripts/migrate-sqlite-to-postgres.js
 * 
 * Gereksinimler:
 *   - SQLite veritabanı: database.sqlite (proje kök dizininde)
 *   - PostgreSQL bağlantı bilgileri: POSTGRES_URL environment variable'ında
 */

const sqlite3 = require('sqlite3').verbose();
const { sql } = require('@vercel/postgres');
const path = require('path');
const fs = require('fs');

// SQLite veritabanı yolu
const sqliteDbPath = path.join(__dirname, '..', 'database.sqlite');

// SQLite veritabanını aç
const sqliteDb = new sqlite3.Database(sqliteDbPath, (err) => {
  if (err) {
    console.error('❌ SQLite veritabanı açılamadı:', err.message);
    process.exit(1);
  }
  console.log('✅ SQLite veritabanı açıldı:', sqliteDbPath);
});

// Promise wrapper for SQLite
function sqliteAll(query, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function sqliteGet(query, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// PostgreSQL schema'yı oluştur
async function createPostgresSchema() {
  try {
    console.log('\n📋 PostgreSQL şeması oluşturuluyor...');
    const schemaPath = path.join(__dirname, 'postgres-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Şema statement'larını ayır ve çalıştır
    const statements = schema.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql.query(statement);
        } catch (err) {
          // IF NOT EXISTS kullandığımız için bazı hatalar normal olabilir
          if (!err.message.includes('already exists')) {
            console.warn('⚠️ Şema hatası (muhtemelen normal):', err.message);
          }
        }
      }
    }
    
    console.log('✅ PostgreSQL şeması oluşturuldu\n');
  } catch (error) {
    console.error('❌ Şema oluşturma hatası:', error);
    throw error;
  }
}

// Tabloları sırayla migrate et
async function migrateTable(tableName, order) {
  try {
    console.log(`\n📦 ${order}. ${tableName} tablosu migrate ediliyor...`);
    
    // SQLite'dan verileri al
    const rows = await sqliteAll(`SELECT * FROM ${tableName}`);
    console.log(`   ${rows.length} kayıt bulundu`);
    
    if (rows.length === 0) {
      console.log(`   ⏭️  ${tableName} tablosu boş, atlanıyor`);
      return;
    }
    
    // PostgreSQL'e ekle
    let inserted = 0;
    for (const row of rows) {
      try {
        // Tüm kolonları al (ID dahil)
        const columns = Object.keys(row);
        const values = columns.map(col => row[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        
        // ID'yi dahil et ve sequence'i ayarla
        const insertQuery = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT (id) DO NOTHING
        `;
        
        await sql.query(insertQuery, values);
        inserted++;
      } catch (err) {
        console.error(`   ❌ Hata (satır ${row.id || 'bilinmiyor'}):`, err.message);
        // Devam et
      }
    }
    
    // Sequence'i güncelle (eğer ID kolonu varsa)
    if (rows.length > 0 && rows[0].id !== undefined) {
      try {
        const maxId = Math.max(...rows.map(r => r.id || 0));
        await sql.query(`SELECT setval('${tableName}_id_seq', ${maxId}, true)`);
        console.log(`   🔄 Sequence güncellendi: ${maxId}`);
      } catch (err) {
        // Sequence yoksa veya hata varsa devam et
        console.log(`   ⚠️  Sequence güncellenemedi (normal olabilir): ${err.message}`);
      }
    }
    
    console.log(`   ✅ ${inserted}/${rows.length} kayıt başarıyla migrate edildi`);
  } catch (error) {
    console.error(`   ❌ ${tableName} migrate hatası:`, error.message);
    throw error;
  }
}

// Ana migration fonksiyonu
async function migrate() {
  try {
    console.log('🚀 SQLite → PostgreSQL Migration Başlatılıyor...\n');
    
    // PostgreSQL şemasını oluştur
    await createPostgresSchema();
    
    // Tabloları foreign key sırasına göre migrate et
    const tables = [
      { name: 'companies', order: 1 },
      { name: 'suppliers', order: 2 },
      { name: 'shipping_documents', order: 3 },
      { name: 'shipping_items', order: 4 },
      { name: 'purchase_invoices', order: 5 },
      { name: 'purchase_invoice_items', order: 6 },
      { name: 'invoices', order: 7 },
      { name: 'price_calculations', order: 8 },
    ];
    
    for (const table of tables) {
      await migrateTable(table.name, table.order);
    }
    
    console.log('\n✅ Migration tamamlandı!');
    console.log('\n📊 Özet:');
    
    // Her tablodaki kayıt sayısını kontrol et
    for (const table of tables) {
      try {
        const result = await sql.query(`SELECT COUNT(*) as count FROM ${table.name}`);
        const count = result.rows[0]?.count || 0;
        console.log(`   ${table.name}: ${count} kayıt`);
      } catch (err) {
        console.log(`   ${table.name}: Hata - ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Migration hatası:', error);
    process.exit(1);
  } finally {
    // SQLite veritabanını kapat
    sqliteDb.close((err) => {
      if (err) {
        console.error('❌ SQLite veritabanı kapatma hatası:', err.message);
      } else {
        console.log('\n✅ SQLite veritabanı kapatıldı');
      }
      process.exit(0);
    });
  }
}

// Migration'ı başlat
migrate();
