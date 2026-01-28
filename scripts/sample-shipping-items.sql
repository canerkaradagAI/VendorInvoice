-- İrsaliye detayları (shipping_items) örnek verileri
-- Format: {item_code}-{color_code} (örn: 183177-WNT)
-- Her irsaliye için 3-5 kalem ürün

-- OLKA Şirketi İrsaliyeleri
-- 1-BP-6-001 (shipping_id: 1) - HOPE FAITH LIMITED
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(1, '183177-WNT', 'Ürün 183177 WNT', 50, 150.00, 7500.00),
(1, '163460-OLV', 'Ürün 163460 OLV', 30, 100.00, 3000.00),
(1, '190133-WBK', 'Ürün 190133 WBK', 20, 100.00, 2000.00);

-- 1-BP-6-002 (shipping_id: 2)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(2, '190133-NTMT', 'Ürün 190133 NTMT', 40, 200.00, 8000.00),
(2, '190133-BKGY', 'Ürün 190133 BKGY', 35, 180.00, 6300.00),
(2, '186990-GLD', 'Ürün 186990 GLD', 25, 120.00, 3000.00),
(2, '186001-WHT', 'Ürün 186001 WHT', 30, 100.00, 3000.00),
(2, '186001-BLK', 'Ürün 186001 BLK', 20, 100.00, 2000.00);

-- 1-BP-6-003 (shipping_id: 3)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(3, '185460-OFWT', 'Ürün 185460 OFWT', 45, 180.00, 8100.00),
(3, '185460-OFNV', 'Ürün 185460 OFNV', 30, 150.00, 4500.00),
(3, '185460-BRN', 'Ürün 185460 BRN', 25, 100.00, 2500.00),
(3, '185440-OFWT', 'Ürün 185440 OFWT', 10, 100.00, 1000.00);

-- 1-BP-6-004 (shipping_id: 4) - HONG KONG GREAT CONTINENT
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(4, '185440-BBK', 'Ürün 185440 BBK', 60, 200.00, 12000.00),
(4, '185414-WBK', 'Ürün 185414 WBK', 40, 150.00, 6000.00),
(4, '185414-NTBR', 'Ürün 185414 NTBR', 35, 120.00, 4200.00),
(4, '185410-WBK', 'Ürün 185410 WBK', 10, 100.00, 1000.00);

-- 1-BP-6-005 (shipping_id: 5)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(5, '185410-NTLB', 'Ürün 185410 NTLB', 50, 180.00, 9000.00),
(5, '185410-BKW', 'Ürün 185410 BKW', 30, 150.00, 4500.00),
(5, '185393-SIL', 'Ürün 185393 SIL', 25, 120.00, 3000.00),
(5, '185393-RSGD', 'Ürün 185393 RSGD', 20, 120.00, 2400.00);

-- 1-BP-6-006 (shipping_id: 6)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(6, '185381-NTGD', 'Ürün 185381 NTGD', 55, 200.00, 11000.00),
(6, '185381-BKGD', 'Ürün 185381 BKGD', 40, 180.00, 7200.00),
(6, '185355-SIL', 'Ürün 185355 SIL', 30, 150.00, 4500.00),
(6, '185355-GLD', 'Ürün 185355 GLD', 25, 150.00, 3750.00);

-- 1-BP-6-007 (shipping_id: 7)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(7, '185354-WBK', 'Ürün 185354 WBK', 45, 180.00, 8100.00),
(7, '185351-NTMT', 'Ürün 185351 NTMT', 35, 150.00, 5250.00),
(7, '185325-YEL', 'Ürün 185325 YEL', 30, 120.00, 3600.00),
(7, '185325-MNT', 'Ürün 185325 MNT', 25, 120.00, 3000.00),
(7, '185325-LTPK', 'Ürün 185325 LTPK', 20, 100.00, 2000.00);

-- 1-BP-6-008 (shipping_id: 8) - XIAMEN MEIZHOU
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(8, '185324-SIL', 'Ürün 185324 SIL', 50, 200.00, 10000.00),
(8, '185323-BKBR', 'Ürün 185323 BKBR', 40, 180.00, 7200.00),
(8, '185252-WSL', 'Ürün 185252 WSL', 30, 150.00, 4500.00),
(8, '185252-BKSL', 'Ürün 185252 BKSL', 25, 150.00, 3750.00);

-- 1-BP-6-009 (shipping_id: 9)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(9, '185239-TPE', 'Ürün 185239 TPE', 45, 180.00, 8100.00),
(9, '185239-BKW', 'Ürün 185239 BKW', 35, 150.00, 5250.00),
(9, '185237-SIL', 'Ürün 185237 SIL', 30, 120.00, 3600.00),
(9, '185237-RSGD', 'Ürün 185237 RSGD', 25, 120.00, 3000.00);

-- 1-BP-6-010 (shipping_id: 10)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(10, '185236-WSL', 'Ürün 185236 WSL', 55, 200.00, 11000.00),
(10, '185236-BKSL', 'Ürün 185236 BKSL', 40, 180.00, 7200.00),
(10, '185234-NTMT', 'Ürün 185234 NTMT', 30, 150.00, 4500.00),
(10, '185234-LGMT', 'Ürün 185234 LGMT', 25, 150.00, 3750.00);

-- 1-BP-6-011 (shipping_id: 11) - SATS WORK
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(11, '185233-NTBK', 'Ürün 185233 NTBK', 50, 180.00, 9000.00),
(11, '185232-WBK', 'Ürün 185232 WBK', 35, 150.00, 5250.00),
(11, '185232-NTLB', 'Ürün 185232 NTLB', 30, 100.00, 3000.00);

-- 1-BP-6-012 (shipping_id: 12)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(12, '185232-BKW', 'Ürün 185232 BKW', 45, 200.00, 9000.00),
(12, '185222-WHT', 'Ürün 185222 WHT', 40, 150.00, 6000.00),
(12, '185222-BLK', 'Ürün 185222 BLK', 30, 120.00, 3600.00),
(12, '185202-SAND', 'Ürün 185202 SAND', 25, 100.00, 2500.00);

-- 1-BP-6-013 (shipping_id: 13)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(13, '185202-PNK', 'Ürün 185202 PNK', 55, 200.00, 11000.00),
(13, '185202-LTBL', 'Ürün 185202 LTBL', 40, 180.00, 7200.00),
(13, '185200-WHT', 'Ürün 185200 WHT', 30, 150.00, 4500.00),
(13, '185200-BLK', 'Ürün 185200 BLK', 25, 150.00, 3750.00);

-- 1-BP-6-014 (shipping_id: 14) - PAMUSAN NATURAL
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(14, '185170-WSL', 'Ürün 185170 WSL', 50, 180.00, 9000.00),
(14, '185170-NTGD', 'Ürün 185170 NTGD', 35, 150.00, 5250.00),
(14, '185151-WMLT', 'Ürün 185151 WMLT', 30, 120.00, 3600.00),
(14, '185150-OFWT', 'Ürün 185150 OFWT', 25, 100.00, 2500.00);

-- 1-BP-6-015 (shipping_id: 15)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(15, '185150-BURG', 'Ürün 185150 BURG', 60, 200.00, 12000.00),
(15, '185150-BLK', 'Ürün 185150 BLK', 40, 150.00, 6000.00),
(15, '185082-WSL', 'Ürün 185082 WSL', 30, 120.00, 3600.00),
(15, '185082-NTGD', 'Ürün 185082 NTGD', 25, 120.00, 3000.00);

-- 1-BP-6-016 (shipping_id: 16)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(16, '185082-BBK', 'Ürün 185082 BBK', 45, 180.00, 8100.00),
(16, '185064-OFWT', 'Ürün 185064 OFWT', 35, 150.00, 5250.00),
(16, '185064-BKNT', 'Ürün 185064 BKNT', 30, 150.00, 4500.00);

-- 1-BP-6-017 (shipping_id: 17)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(17, '185031-WNT', 'Ürün 185031 WNT', 50, 200.00, 10000.00),
(17, '185031-NTPK', 'Ürün 185031 NTPK', 40, 180.00, 7200.00),
(17, '185031-BKNT', 'Ürün 185031 BKNT', 30, 150.00, 4500.00),
(17, '185016-WTGD', 'Ürün 185016 WTGD', 25, 120.00, 3000.00);

-- 1-BP-6-018 (shipping_id: 18) - BENEFIT SYSTEMS
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(18, '185016-WBK', 'Ürün 185016 WBK', 55, 200.00, 11000.00),
(18, '185016-BKRG', 'Ürün 185016 BKRG', 40, 180.00, 7200.00),
(18, '185011-WNT', 'Ürün 185011 WNT', 30, 150.00, 4500.00),
(18, '185008-WHT', 'Ürün 185008 WHT', 25, 120.00, 3000.00),
(18, '185008-NAT', 'Ürün 185008 NAT', 20, 100.00, 2000.00);

-- 1-BP-6-019 (shipping_id: 19)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(19, '185008-BKW', 'Ürün 185008 BKW', 50, 180.00, 9000.00),
(19, '185003-WTAN', 'Ürün 185003 WTAN', 35, 150.00, 5250.00),
(19, '185003-NTBR', 'Ürün 185003 NTBR', 30, 120.00, 3600.00),
(19, '185003-BKNT', 'Ürün 185003 BKNT', 25, 100.00, 2500.00);

-- 1-BP-6-020 (shipping_id: 20)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(20, '185000-WPLM', 'Ürün 185000 WPLM', 60, 200.00, 12000.00),
(20, '185000-NTMT', 'Ürün 185000 NTMT', 40, 180.00, 7200.00),
(20, '183921-WHT', 'Ürün 183921 WHT', 30, 150.00, 4500.00);

-- 1-BP-6-021 (shipping_id: 21) - MEHMET CİHAT KÖSE
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(21, '183921-CSNT', 'Ürün 183921 CSNT', 45, 180.00, 8100.00),
(21, '183502-WMLT', 'Ürün 183502 WMLT', 35, 150.00, 5250.00),
(21, '183500-MLT', 'Ürün 183500 MLT', 30, 120.00, 3600.00),
(21, '183430-OLV', 'Ürün 183430 OLV', 25, 100.00, 2500.00);

-- 1-BP-6-022 (shipping_id: 22)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(22, '183430-OFWT', 'Ürün 183430 OFWT', 50, 200.00, 10000.00),
(22, '183430-BKGY', 'Ürün 183430 BKGY', 40, 180.00, 7200.00),
(22, '183402-WGR', 'Ürün 183402 WGR', 30, 150.00, 4500.00);

-- 1-BP-6-023 (shipping_id: 23)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(23, '183402-NAT', 'Ürün 183402 NAT', 55, 200.00, 11000.00),
(23, '183402-BLK', 'Ürün 183402 BLK', 40, 180.00, 7200.00),
(23, '183320-WHT', 'Ürün 183320 WHT', 30, 150.00, 4500.00),
(23, '183320-GRY', 'Ürün 183320 GRY', 25, 150.00, 3750.00);

-- 1-BP-6-024 (shipping_id: 24) - ZEYNEP PEKER
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(24, '183320-BLK', 'Ürün 183320 BLK', 50, 180.00, 9000.00),
(24, '183312-OLV', 'Ürün 183312 OLV', 35, 150.00, 5250.00),
(24, '183312-BLK', 'Ürün 183312 BLK', 30, 120.00, 3600.00),
(24, '183310-MUSH', 'Ürün 183310 MUSH', 25, 100.00, 2500.00);

-- 1-BP-6-025 (shipping_id: 25)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(25, '183310-BLK', 'Ürün 183310 BLK', 45, 200.00, 9000.00),
(25, '183250-WGR', 'Ürün 183250 WGR', 40, 180.00, 7200.00),
(25, '183250-SAGE', 'Ürün 183250 SAGE', 30, 150.00, 4500.00),
(25, '183250-OFWT', 'Ürün 183250 OFWT', 25, 120.00, 3000.00);

-- 1-BP-6-026 (shipping_id: 26)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(26, '183250-BLK', 'Ürün 183250 BLK', 60, 200.00, 12000.00),
(26, '183241-WNV', 'Ürün 183241 WNV', 40, 180.00, 7200.00),
(26, '183241-WHT', 'Ürün 183241 WHT', 30, 150.00, 4500.00);

-- 1-BP-6-027 (shipping_id: 27) - EDA ÖZDEMİR
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(27, '183241-WBUG', 'Ürün 183241 WBUG', 55, 200.00, 11000.00),
(27, '183241-NAT', 'Ürün 183241 NAT', 40, 180.00, 7200.00),
(27, '183241-BLK', 'Ürün 183241 BLK', 30, 150.00, 4500.00),
(27, '183240-BLK', 'Ürün 183240 BLK', 25, 120.00, 3000.00);

-- 1-BP-6-028 (shipping_id: 28)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(28, '183221-NVY', 'Ürün 183221 NVY', 50, 200.00, 10000.00),
(28, '183221-BLK', 'Ürün 183221 BLK', 35, 180.00, 6300.00),
(28, '183216-SIL', 'Ürün 183216 SIL', 30, 150.00, 4500.00),
(28, '183215-WBK', 'Ürün 183215 WBK', 25, 120.00, 3000.00);

-- 1-BP-6-029 (shipping_id: 29)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(29, '183215-MUSH', 'Ürün 183215 MUSH', 45, 200.00, 9000.00),
(29, '183215-BLU', 'Ürün 183215 BLU', 40, 180.00, 7200.00),
(29, '183215-BKGY', 'Ürün 183215 BKGY', 30, 150.00, 4500.00),
(29, '183214-GRY', 'Ürün 183214 GRY', 25, 120.00, 3000.00);

-- 1-BP-6-030 (shipping_id: 30) - BENER ATİLA
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(30, '183214-DKGY', 'Ürün 183214 DKGY', 55, 200.00, 11000.00),
(30, '183199-WGY', 'Ürün 183199 WGY', 40, 180.00, 7200.00),
(30, '183199-BKGY', 'Ürün 183199 BKGY', 30, 150.00, 4500.00),
(30, '183199-BBK', 'Ürün 183199 BBK', 25, 120.00, 3000.00);

-- 1-BP-6-031 (shipping_id: 31)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(31, '183196-WBK', 'Ürün 183196 WBK', 50, 200.00, 10000.00),
(31, '183196-NTNV', 'Ürün 183196 NTNV', 35, 180.00, 6300.00),
(31, '183196-BBK', 'Ürün 183196 BBK', 30, 150.00, 4500.00);

-- 1-BP-6-032 (shipping_id: 32)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(32, '183188-GRY', 'Ürün 183188 GRY', 60, 200.00, 12000.00),
(32, '183186-NTMT', 'Ürün 183186 NTMT', 40, 180.00, 7200.00),
(32, '183186-BRCK', 'Ürün 183186 BRCK', 30, 150.00, 4500.00),
(32, '183177-WHT', 'Ürün 183177 WHT', 25, 120.00, 3000.00);

-- 1-BP-6-033 (shipping_id: 33)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(33, '183177-NVY', 'Ürün 183177 NVY', 55, 200.00, 11000.00),
(33, '183177-COG', 'Ürün 183177 COG', 40, 180.00, 7200.00),
(33, '183177-BLK', 'Ürün 183177 BLK', 30, 150.00, 4500.00),
(33, '183158-WNT', 'Ürün 183158 WNT', 25, 120.00, 3000.00);

-- MARLIN Şirketi İrsaliyeleri (shipping_id: 34-63)
-- 2-BP-6-001 (shipping_id: 34) - AYPLASTİK
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(34, '183158-GRY', 'Ürün 183158 GRY', 50, 200.00, 10000.00),
(34, '183158-BLK', 'Ürün 183158 BLK', 35, 180.00, 6300.00),
(34, '183156-WHT', 'Ürün 183156 WHT', 30, 150.00, 4500.00),
(34, '183156-TAN', 'Ürün 183156 TAN', 25, 120.00, 3000.00);

-- 2-BP-6-002 (shipping_id: 35)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(35, '183156-BLK', 'Ürün 183156 BLK', 45, 200.00, 9000.00),
(35, '183145-WNV', 'Ürün 183145 WNV', 40, 180.00, 7200.00),
(35, '183145-WHT', 'Ürün 183145 WHT', 30, 150.00, 4500.00),
(35, '183145-TAN', 'Ürün 183145 TAN', 25, 150.00, 3750.00);

-- 2-BP-6-003 (shipping_id: 36)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(36, '183145-BLK', 'Ürün 183145 BLK', 60, 200.00, 12000.00),
(36, '183140-WHT', 'Ürün 183140 WHT', 40, 180.00, 7200.00),
(36, '183140-WBL', 'Ürün 183140 WBL', 30, 150.00, 4500.00),
(36, '183140-CCOR', 'Ürün 183140 CCOR', 25, 120.00, 3000.00);

-- 2-BP-6-004 (shipping_id: 37)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(37, '183140-BLK', 'Ürün 183140 BLK', 55, 200.00, 11000.00),
(37, '183102-WRD', 'Ürün 183102 WRD', 40, 180.00, 7200.00),
(37, '183101-BKRD', 'Ürün 183101 BKRD', 30, 150.00, 4500.00);

-- 2-BP-6-005 (shipping_id: 38) - PİR-İNCİ BUJİTERİ
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(38, '183079-LTGY', 'Ürün 183079 LTGY', 50, 200.00, 10000.00),
(38, '183075-WBK', 'Ürün 183075 WBK', 35, 180.00, 6300.00),
(38, '183075-SAGE', 'Ürün 183075 SAGE', 30, 150.00, 4500.00),
(38, '183075-BBK', 'Ürün 183075 BBK', 25, 120.00, 3000.00);

-- 2-BP-6-006 (shipping_id: 39)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(39, '183070-YEL', 'Ürün 183070 YEL', 45, 200.00, 9000.00),
(39, '183070-WHT', 'Ürün 183070 WHT', 40, 180.00, 7200.00),
(39, '183070-NVY', 'Ürün 183070 NVY', 30, 150.00, 4500.00),
(39, '183022-TPE', 'Ürün 183022 TPE', 25, 120.00, 3000.00);

-- 2-BP-6-007 (shipping_id: 40)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(40, '183022-NVY', 'Ürün 183022 NVY', 60, 200.00, 12000.00),
(40, '183020-NTYL', 'Ürün 183020 NTYL', 40, 180.00, 7200.00),
(40, '183020-GRY', 'Ürün 183020 GRY', 30, 150.00, 4500.00);

-- 2-BP-6-008 (shipping_id: 41) - RDS GAYRİMENKUL
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(41, '183009-WHT', 'Ürün 183009 WHT', 55, 200.00, 11000.00),
(41, '183009-BLK', 'Ürün 183009 BLK', 40, 180.00, 7200.00),
(41, '183007-OLV', 'Ürün 183007 OLV', 30, 150.00, 4500.00),
(41, '183007-COG', 'Ürün 183007 COG', 25, 150.00, 3750.00);

-- 2-BP-6-009 (shipping_id: 42)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(42, '183007-CHAR', 'Ürün 183007 CHAR', 50, 200.00, 10000.00),
(42, '183007-BBK', 'Ürün 183007 BBK', 35, 180.00, 6300.00),
(42, '183004-NVY', 'Ürün 183004 NVY', 30, 150.00, 4500.00),
(42, '183004-NAT', 'Ürün 183004 NAT', 25, 120.00, 3000.00);

-- 2-BP-6-010 (shipping_id: 43)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(43, '183004-BLK', 'Ürün 183004 BLK', 60, 200.00, 12000.00),
(43, '180500-SLT', 'Ürün 180500 SLT', 40, 180.00, 7200.00),
(43, '180500-GRY', 'Ürün 180500 GRY', 30, 150.00, 4500.00),
(43, '180500-BBK', 'Ürün 180500 BBK', 25, 120.00, 3000.00);

-- 2-BP-6-011 (shipping_id: 44) - VOLÜME MÜHENDİSLİK
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(44, '180399-WBK', 'Ürün 180399 WBK', 55, 200.00, 11000.00),
(44, '180399-TPBK', 'Ürün 180399 TPBK', 40, 180.00, 7200.00),
(44, '180399-BKW', 'Ürün 180399 BKW', 30, 150.00, 4500.00),
(44, '180358-LTGD', 'Ürün 180358 LTGD', 25, 150.00, 3750.00);

-- 2-BP-6-012 (shipping_id: 45)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(45, '180358-LTBL', 'Ürün 180358 LTBL', 50, 200.00, 10000.00),
(45, '180358-BLK', 'Ürün 180358 BLK', 35, 180.00, 6300.00),
(45, '180355-OFWT', 'Ürün 180355 OFWT', 30, 150.00, 4500.00),
(45, '180355-GYMT', 'Ürün 180355 GYMT', 25, 120.00, 3000.00);

-- 2-BP-6-013 (shipping_id: 46)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(46, '180330-SLGY', 'Ürün 180330 SLGY', 45, 200.00, 9000.00),
(46, '180330-SLBK', 'Ürün 180330 SLBK', 40, 180.00, 7200.00),
(46, '180330-RSGD', 'Ürün 180330 RSGD', 30, 150.00, 4500.00);

-- 2-BP-6-014 (shipping_id: 47)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(47, '180317-NTOL', 'Ürün 180317 NTOL', 60, 200.00, 12000.00),
(47, '180317-GRY', 'Ürün 180317 GRY', 40, 180.00, 7200.00),
(47, '180296-MVE', 'Ürün 180296 MVE', 30, 150.00, 4500.00),
(47, '180296-BKHP', 'Ürün 180296 BKHP', 25, 120.00, 3000.00);

-- 2-BP-6-015 (shipping_id: 48) - KORAY YAKICI
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(48, '180277-TPE', 'Ürün 180277 TPE', 55, 200.00, 11000.00),
(48, '180277-PRBK', 'Ürün 180277 PRBK', 40, 180.00, 7200.00),
(48, '180277-BKW', 'Ürün 180277 BKW', 30, 150.00, 4500.00),
(48, '180272-SLTP', 'Ürün 180272 SLTP', 25, 150.00, 3750.00);

-- 2-BP-6-016 (shipping_id: 49)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(49, '180272-NTPR', 'Ürün 180272 NTPR', 50, 200.00, 10000.00),
(49, '180272-BRN', 'Ürün 180272 BRN', 35, 180.00, 6300.00),
(49, '180272-BKW', 'Ürün 180272 BKW', 30, 150.00, 4500.00);

-- 2-BP-6-017 (shipping_id: 50)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(50, '180271-BRMT', 'Ürün 180271 BRMT', 45, 200.00, 9000.00),
(50, '180265-TAN', 'Ürün 180265 TAN', 40, 180.00, 7200.00),
(50, '180265-OLPK', 'Ürün 180265 OLPK', 30, 150.00, 4500.00),
(50, '180265-BBK', 'Ürün 180265 BBK', 25, 120.00, 3000.00);

-- 2-BP-6-018 (shipping_id: 51) - EMEK 1969 PASTACILIK
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(51, '180262-OWGR', 'Ürün 180262 OWGR', 60, 200.00, 12000.00),
(51, '180262-CCLV', 'Ürün 180262 CCLV', 40, 180.00, 7200.00),
(51, '180262-BKTP', 'Ürün 180262 BKTP', 30, 150.00, 4500.00);

-- 2-BP-6-019 (shipping_id: 52)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(52, '180261-NTPR', 'Ürün 180261 NTPR', 55, 200.00, 11000.00),
(52, '180261-CCPR', 'Ürün 180261 CCPR', 40, 180.00, 7200.00),
(52, '180500-SLT', 'Ürün 180500 SLT', 30, 150.00, 4500.00),
(52, '180500-GRY', 'Ürün 180500 GRY', 25, 120.00, 3000.00);

-- 2-BP-6-020 (shipping_id: 53)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(53, '180500-BBK', 'Ürün 180500 BBK', 50, 200.00, 10000.00),
(53, '180399-WBK', 'Ürün 180399 WBK', 35, 180.00, 6300.00),
(53, '180399-TPBK', 'Ürün 180399 TPBK', 30, 150.00, 4500.00);

-- 2-BP-6-021 (shipping_id: 54) - SÜRTAŞ
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(54, '180399-BKW', 'Ürün 180399 BKW', 45, 200.00, 9000.00),
(54, '180358-LTGD', 'Ürün 180358 LTGD', 40, 180.00, 7200.00),
(54, '180358-LTBL', 'Ürün 180358 LTBL', 30, 150.00, 4500.00),
(54, '180358-BLK', 'Ürün 180358 BLK', 25, 150.00, 3750.00);

-- 2-BP-6-022 (shipping_id: 55)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(55, '180355-OFWT', 'Ürün 180355 OFWT', 60, 200.00, 12000.00),
(55, '180355-GYMT', 'Ürün 180355 GYMT', 40, 180.00, 7200.00),
(55, '180330-SLGY', 'Ürün 180330 SLGY', 30, 150.00, 4500.00);

-- 2-BP-6-023 (shipping_id: 56)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(56, '180330-SLBK', 'Ürün 180330 SLBK', 55, 200.00, 11000.00),
(56, '180330-RSGD', 'Ürün 180330 RSGD', 40, 180.00, 7200.00),
(56, '180317-NTOL', 'Ürün 180317 NTOL', 30, 150.00, 4500.00),
(56, '180317-GRY', 'Ürün 180317 GRY', 25, 120.00, 3000.00);

-- 2-BP-6-024 (shipping_id: 57)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(57, '180296-MVE', 'Ürün 180296 MVE', 50, 200.00, 10000.00),
(57, '180296-BKHP', 'Ürün 180296 BKHP', 35, 180.00, 6300.00),
(57, '180277-TPE', 'Ürün 180277 TPE', 30, 150.00, 4500.00),
(57, '180277-PRBK', 'Ürün 180277 PRBK', 25, 120.00, 3000.00);

-- 2-BP-6-025 (shipping_id: 58) - ATS GRUP
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(58, '180277-BKW', 'Ürün 180277 BKW', 45, 200.00, 9000.00),
(58, '180272-SLTP', 'Ürün 180272 SLTP', 40, 180.00, 7200.00),
(58, '180272-NTPR', 'Ürün 180272 NTPR', 30, 150.00, 4500.00),
(58, '180272-BRN', 'Ürün 180272 BRN', 25, 150.00, 3750.00);

-- 2-BP-6-026 (shipping_id: 59)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(59, '180272-BKW', 'Ürün 180272 BKW', 60, 200.00, 12000.00),
(59, '180271-BRMT', 'Ürün 180271 BRMT', 40, 180.00, 7200.00),
(59, '180265-TAN', 'Ürün 180265 TAN', 30, 150.00, 4500.00);

-- 2-BP-6-027 (shipping_id: 60)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(60, '180265-OLPK', 'Ürün 180265 OLPK', 55, 200.00, 11000.00),
(60, '180265-BBK', 'Ürün 180265 BBK', 40, 180.00, 7200.00),
(60, '180262-OWGR', 'Ürün 180262 OWGR', 30, 150.00, 4500.00),
(60, '180262-CCLV', 'Ürün 180262 CCLV', 25, 120.00, 3000.00);

-- 2-BP-6-028 (shipping_id: 61) - OKYANUS RFID
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(61, '180262-BKTP', 'Ürün 180262 BKTP', 50, 200.00, 10000.00),
(61, '180261-NTPR', 'Ürün 180261 NTPR', 35, 180.00, 6300.00),
(61, '180261-CCPR', 'Ürün 180261 CCPR', 30, 150.00, 4500.00),
(61, '183177-WNT', 'Ürün 183177 WNT', 25, 120.00, 3000.00);

-- 2-BP-6-029 (shipping_id: 62)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(62, '163460-OLV', 'Ürün 163460 OLV', 45, 200.00, 9000.00),
(62, '190133-WBK', 'Ürün 190133 WBK', 40, 180.00, 7200.00),
(62, '190133-NTMT', 'Ürün 190133 NTMT', 30, 150.00, 4500.00);

-- 2-BP-6-030 (shipping_id: 63)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(63, '190133-BKGY', 'Ürün 190133 BKGY', 60, 200.00, 12000.00),
(63, '186990-GLD', 'Ürün 186990 GLD', 40, 180.00, 7200.00),
(63, '186001-WHT', 'Ürün 186001 WHT', 30, 150.00, 4500.00),
(63, '186001-BLK', 'Ürün 186001 BLK', 25, 120.00, 3000.00);

-- 2-BP-6-031 (shipping_id: 64)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(64, '185460-OFWT', 'Ürün 185460 OFWT', 55, 200.00, 11000.00),
(64, '185460-OFNV', 'Ürün 185460 OFNV', 40, 180.00, 7200.00),
(64, '185460-BRN', 'Ürün 185460 BRN', 30, 150.00, 4500.00),
(64, '185440-OFWT', 'Ürün 185440 OFWT', 25, 150.00, 3750.00);

-- JUPITER, NEPTUN ve SATURN şirketleri için de benzer şekilde devam edilebilir
-- Kısalık için sadece birkaç örnek daha ekliyorum:

-- 3-BP-6-001 (shipping_id: 65) - MONEYPAY
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(65, '185440-BBK', 'Ürün 185440 BBK', 50, 200.00, 10000.00),
(65, '185414-WBK', 'Ürün 185414 WBK', 40, 180.00, 7200.00),
(65, '185414-NTBR', 'Ürün 185414 NTBR', 35, 150.00, 5250.00),
(65, '185410-WBK', 'Ürün 185410 WBK', 30, 120.00, 3600.00),
(65, '185410-NTLB', 'Ürün 185410 NTLB', 25, 100.00, 2500.00);

-- 3-BP-6-002 (shipping_id: 66)
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(66, '185410-BKW', 'Ürün 185410 BKW', 45, 200.00, 9000.00),
(66, '185393-SIL', 'Ürün 185393 SIL', 40, 180.00, 7200.00),
(66, '185393-RSGD', 'Ürün 185393 RSGD', 30, 150.00, 4500.00),
(66, '185381-NTGD', 'Ürün 185381 NTGD', 25, 150.00, 3750.00);

-- 4-BP-6-001 (shipping_id: 67) - TEKNO KIRTASİYE
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(67, '185381-BKGD', 'Ürün 185381 BKGD', 55, 200.00, 11000.00),
(67, '185355-SIL', 'Ürün 185355 SIL', 40, 180.00, 7200.00),
(67, '185355-GLD', 'Ürün 185355 GLD', 30, 150.00, 4500.00),
(67, '185354-WBK', 'Ürün 185354 WBK', 25, 120.00, 3000.00);

-- 5-BP-6-001 (shipping_id: 68) - RAMAZAN KIRKBINAR
INSERT OR IGNORE INTO shipping_items (shipping_id, product_code, product_name, quantity, unit_price, total_price) VALUES
(68, '185351-NTMT', 'Ürün 185351 NTMT', 50, 200.00, 10000.00),
(68, '185325-YEL', 'Ürün 185325 YEL', 40, 180.00, 7200.00),
(68, '185325-MNT', 'Ürün 185325 MNT', 30, 150.00, 4500.00),
(68, '185325-LTPK', 'Ürün 185325 LTPK', 25, 150.00, 3750.00);

-- Not: Geri kalan tüm irsaliyeler için de benzer şekilde ürün kodları kullanılarak
-- shipping_items kayıtları oluşturulabilir. Toplam ~150 irsaliye için
-- her birine 3-5 kalem ürün eklenmesi gerekiyor.
