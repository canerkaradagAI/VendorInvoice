-- Tedarikçi satış faturaları örnek verileri
-- Şirketin tedarikçilerden aldığı ürünlerin faturaları
-- LIFO testi için farklı tarihlerde faturalar

-- OLKA Şirketi - HOPE FAITH LIMITED (supplier_id: 1)
-- Fatura 1: 183177-WNT ürünü için
INSERT OR IGNORE INTO purchase_invoices (invoice_number, supplier_id, invoice_date, total_amount) VALUES
('ALIS-2024-001', 1, '2024-01-15', 7500.00),
('ALIS-2024-002', 1, '2024-02-10', 3600.00),
('ALIS-2024-003', 1, '2024-03-05', 2000.00);

-- Fatura kalemleri
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) VALUES
-- ALIS-2024-001 (en yeni)
(1, '183177-WNT', 50, 150.00, 7500.00),
-- ALIS-2024-002 (orta)
(2, '163460-OLV', 30, 120.00, 3600.00),
-- ALIS-2024-003 (en eski)
(3, '190133-WBK', 20, 100.00, 2000.00);

-- OLKA Şirketi - HONG KONG GREAT CONTINENT (supplier_id: 2)
INSERT OR IGNORE INTO purchase_invoices (invoice_number, supplier_id, invoice_date, total_amount) VALUES
('ALIS-2024-004', 2, '2024-01-20', 12000.00),
('ALIS-2024-005', 2, '2024-02-15', 8000.00),
('ALIS-2024-006', 2, '2024-03-10', 6000.00),
-- 185410 ve 185393 ürün kodları için faturalar (LIFO testi)
('ALIS-2024-015', 2, '2024-03-20', 19200.00), -- En yeni: 185410-BKW için 6 adet 12 liradan
('ALIS-2024-016', 2, '2024-02-25', 5000.00),  -- Orta: 185410-BKW için 5 adet 10 liradan
('ALIS-2024-017', 2, '2024-03-15', 9000.00),  -- En yeni: 185410-NTLB için 50 adet 180 liradan
('ALIS-2024-018', 2, '2024-02-10', 1000.00),  -- Orta: 185410-WBK için 10 adet 100 liradan
('ALIS-2024-019', 2, '2024-03-10', 3000.00),  -- En yeni: 185393-SIL için 25 adet 120 liradan
('ALIS-2024-020', 2, '2024-02-05', 2400.00); -- Orta: 185393-RSGD için 20 adet 120 liradan

INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '190133-NTMT', 40, 200.00, 8000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-004' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '190133-BKGY', 20, 200.00, 4000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-004' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '186990-GLD', 25, 120.00, 3000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-005' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '186001-WHT', 30, 100.00, 3000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-005' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '186001-BLK', 20, 100.00, 2000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-005' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185460-OFWT', 30, 100.00, 3000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-006' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185460-OFNV', 20, 150.00, 3000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-006' AND supplier_id = 2;
-- 185410-BKW için faturalar (LIFO testi: 6 adet 12 liradan, 5 adet 10 liradan)
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185410-BKW', 6, 12.00, 72.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-015' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185410-NTLB', 50, 180.00, 9000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-015' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185410-WBK', 30, 120.00, 3600.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-015' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185393-SIL', 25, 120.00, 3000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-015' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185393-RSGD', 20, 120.00, 2400.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-015' AND supplier_id = 2;
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185410-BKW', 5, 10.00, 50.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-016' AND supplier_id = 2;
-- 185410-NTLB için ek fatura
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185410-NTLB', 50, 180.00, 9000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-017' AND supplier_id = 2;
-- 185410-WBK için ek fatura
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185410-WBK', 10, 100.00, 1000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-018' AND supplier_id = 2;
-- 185393-SIL için ek fatura
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185393-SIL', 25, 120.00, 3000.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-019' AND supplier_id = 2;
-- 185393-RSGD için ek fatura
INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) 
SELECT id, '185393-RSGD', 20, 120.00, 2400.00 FROM purchase_invoices WHERE invoice_number = 'ALIS-2024-020' AND supplier_id = 2;

-- MARLIN Şirketi - AYPLASTİK (supplier_id: 11)
INSERT OR IGNORE INTO purchase_invoices (invoice_number, supplier_id, invoice_date, total_amount) VALUES
('ALIS-2024-007', 11, '2024-01-25', 10000.00),
('ALIS-2024-008', 11, '2024-02-20', 7500.00);

INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) VALUES
-- ALIS-2024-007 (en yeni)
(7, '183177-WNT', 50, 200.00, 10000.00),
-- ALIS-2024-008 (en eski)
(8, '163460-OLV', 50, 150.00, 7500.00);

-- JÜPİTER Şirketi - MONEYPAY (supplier_id: 19)
INSERT OR IGNORE INTO purchase_invoices (invoice_number, supplier_id, invoice_date, total_amount) VALUES
('ALIS-2024-009', 19, '2024-01-30', 9000.00),
('ALIS-2024-010', 19, '2024-02-25', 6000.00);

INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) VALUES
-- ALIS-2024-009 (en yeni)
(9, '190133-WBK', 30, 180.00, 5400.00),
(9, '190133-NTMT', 20, 180.00, 3600.00),
-- ALIS-2024-010 (en eski)
(10, '186990-GLD', 40, 150.00, 6000.00);

-- NEPTÜN Şirketi - TEKNO KIRTASİYE (supplier_id: 27)
INSERT OR IGNORE INTO purchase_invoices (invoice_number, supplier_id, invoice_date, total_amount) VALUES
('ALIS-2024-011', 27, '2024-02-05', 11000.00),
('ALIS-2024-012', 27, '2024-03-01', 8000.00);

INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) VALUES
-- ALIS-2024-011 (en yeni)
(11, '185460-OFWT', 50, 220.00, 11000.00),
-- ALIS-2024-012 (en eski)
(12, '185460-OFNV', 40, 200.00, 8000.00);

-- SATÜRN Şirketi - RAMAZAN KIRKBINAR (supplier_id: 36)
INSERT OR IGNORE INTO purchase_invoices (invoice_number, supplier_id, invoice_date, total_amount) VALUES
('ALIS-2024-013', 36, '2024-02-10', 13000.00),
('ALIS-2024-014', 36, '2024-03-05', 9500.00);

INSERT OR IGNORE INTO purchase_invoice_items (invoice_id, product_code, quantity, unit_price, total_price) VALUES
-- ALIS-2024-013 (en yeni)
(13, '185440-OFWT', 50, 260.00, 13000.00),
-- ALIS-2024-014 (en eski)
(14, '185440-BBK', 38, 250.00, 9500.00);
