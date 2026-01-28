const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Veritabanı dosyası yolu
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Veritabanı oluştur
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Veritabanı oluşturma hatası:', err.message);
    process.exit(1);
  }
  console.log('✅ SQLite veritabanı oluşturuldu:', dbPath);
});

// Şema dosyasını oku ve çalıştır
function runSchema() {
  return new Promise((resolve, reject) => {
    // Önce mevcut tabloları DROP et
    const dropTables = `
      DROP TABLE IF EXISTS price_calculations;
      DROP TABLE IF EXISTS purchase_invoice_items;
      DROP TABLE IF EXISTS purchase_invoices;
      DROP TABLE IF EXISTS invoices;
      DROP TABLE IF EXISTS shipping_items;
      DROP TABLE IF EXISTS shipping_documents;
      DROP TABLE IF EXISTS suppliers;
      DROP TABLE IF EXISTS companies;
    `;
    
    db.exec(dropTables, (err) => {
      if (err) {
        console.error('❌ Tablolar silme hatası:', err.message);
        // Devam et, hata olabilir
      }
      
      // Şimdi şemayı oluştur
      const schemaPath = path.join(__dirname, 'database-schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      db.exec(schema, (err) => {
        if (err) {
          console.error('❌ Şema çalıştırma hatası:', err.message);
          reject(err);
        } else {
          console.log('✅ Veritabanı şeması oluşturuldu');
          resolve();
        }
      });
    });
  });
}

// Seed verilerini ekle
function runSeed() {
  return new Promise((resolve, reject) => {
    const seedPath = path.join(__dirname, 'seed-data.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    
    db.exec(seed, (err) => {
      if (err) {
        console.error('❌ Seed veri ekleme hatası:', err.message);
        reject(err);
      } else {
        console.log('✅ Test verileri eklendi');
        resolve();
      }
    });
  });
}

// İrsaliye belgelerini ekle
function runShippingData() {
  return new Promise((resolve, reject) => {
    const shippingPath = path.join(__dirname, 'sample-shipping-data.sql');
    const shipping = fs.readFileSync(shippingPath, 'utf8');
    
    db.exec(shipping, (err) => {
      if (err) {
        console.error('❌ İrsaliye veri ekleme hatası:', err.message);
        reject(err);
      } else {
        console.log('✅ İrsaliye belgeleri eklendi');
        resolve();
      }
    });
  });
}

// İrsaliye detaylarını ekle
function runShippingItems() {
  return new Promise((resolve, reject) => {
    const itemsPath = path.join(__dirname, 'sample-shipping-items.sql');
    const items = fs.readFileSync(itemsPath, 'utf8');
    
    db.exec(items, (err) => {
      if (err) {
        console.error('❌ İrsaliye detay ekleme hatası:', err.message);
        reject(err);
      } else {
        console.log('✅ İrsaliye detayları eklendi');
        resolve();
      }
    });
  });
}

// Tedarikçi satış faturalarını ekle
function runPurchaseInvoices() {
  return new Promise((resolve, reject) => {
    const invoicesPath = path.join(__dirname, 'sample-purchase-invoices.sql');
    const invoices = fs.readFileSync(invoicesPath, 'utf8');
    
    db.exec(invoices, (err) => {
      if (err) {
        console.error('❌ Tedarikçi satış faturası ekleme hatası:', err.message);
        reject(err);
      } else {
        console.log('✅ Tedarikçi satış faturaları eklendi');
        resolve();
      }
    });
  });
}

// Veritabanını başlat
async function initializeDatabase() {
  try {
    await runSchema();
    await runSeed();
    await runShippingData();
    await runShippingItems();
    await runPurchaseInvoices();
    
    // Veritabanını kapat
    db.close((err) => {
      if (err) {
        console.error('❌ Veritabanı kapatma hatası:', err.message);
      } else {
        console.log('✅ Veritabanı başarıyla başlatıldı ve kapatıldı');
        console.log('🚀 Projeyi çalıştırmak için: npm run dev');
      }
    });
  } catch (error) {
    console.error('❌ Veritabanı başlatma hatası:', error);
    process.exit(1);
  }
}

// Başlat
initializeDatabase();
