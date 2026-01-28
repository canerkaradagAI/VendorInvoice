const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

// 5-BP-6-029 irsaliyesini bul
db.all("SELECT id, shipping_number FROM shipping_documents WHERE shipping_number LIKE '%5-BP-6-029%' LIMIT 1", (err, rows) => {
  if (err) {
    console.error('Hata:', err);
    db.close();
    return;
  }
  
  if (rows.length === 0) {
    console.log('İrsaliye bulunamadı');
    db.close();
    return;
  }
  
  const shippingId = rows[0].id;
  console.log(`İrsaliye bulundu: ID=${shippingId}, No=${rows[0].shipping_number}`);
  
  // Bu irsaliyenin items'larını kontrol et
  db.all('SELECT COUNT(*) as count FROM shipping_items WHERE shipping_id = ?', [shippingId], (err2, rows2) => {
    if (err2) {
      console.error('Item sayısı kontrolü hatası:', err2);
    } else {
      console.log(`Item sayısı: ${rows2[0].count}`);
      
      if (rows2[0].count === 0) {
        console.log('⚠️ Bu irsaliye için item bulunamadı!');
      } else {
        // Item'ları listele
        db.all('SELECT * FROM shipping_items WHERE shipping_id = ? LIMIT 5', [shippingId], (err3, items) => {
          if (err3) {
            console.error('Item listesi hatası:', err3);
          } else {
            console.log('\nİlk 5 item:');
            items.forEach(item => {
              console.log(`  - ${item.product_code}: ${item.quantity} adet`);
            });
          }
          db.close();
        });
      }
    }
  });
});
