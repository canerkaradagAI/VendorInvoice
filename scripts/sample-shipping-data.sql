-- İrsaliye belgeleri örnek verileri
-- Format: {company_id}-BP-6-{sequential_number}
-- Her tedarikçi için 3-4 irsaliye

-- OLKA Şirketi (company_id = 1) - Tedarikçiler: OLKA001-OLKA010 (supplier_id: 1-10)
-- OLKA001 (supplier_id: 1)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-001', 1, '2024-06-15', 12500.00, 3, 'pending', 'HOPE FAITH LIMITED - İrsaliye 1'),
('1-BP-6-002', 1, '2024-06-18', 18750.00, 5, 'pending', 'HOPE FAITH LIMITED - İrsaliye 2'),
('1-BP-6-003', 1, '2024-06-22', 15200.00, 4, 'approved', 'HOPE FAITH LIMITED - İrsaliye 3');

-- OLKA002 (supplier_id: 2)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-004', 2, '2024-06-10', 22300.00, 6, 'pending', 'HONG KONG GREAT CONTINENT - İrsaliye 1'),
('1-BP-6-005', 2, '2024-06-14', 18900.00, 4, 'pending', 'HONG KONG GREAT CONTINENT - İrsaliye 2'),
('1-BP-6-006', 2, '2024-06-20', 21450.00, 5, 'approved', 'HONG KONG GREAT CONTINENT - İrsaliye 3'),
('1-BP-6-007', 2, '2024-06-25', 17600.00, 3, 'pending', 'HONG KONG GREAT CONTINENT - İrsaliye 4');

-- OLKA003 (supplier_id: 3)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-008', 3, '2024-06-12', 19800.00, 4, 'pending', 'XIAMEN MEIZHOU - İrsaliye 1'),
('1-BP-6-009', 3, '2024-06-16', 16500.00, 3, 'approved', 'XIAMEN MEIZHOU - İrsaliye 2'),
('1-BP-6-010', 3, '2024-06-21', 22100.00, 5, 'pending', 'XIAMEN MEIZHOU - İrsaliye 3');

-- OLKA004 (supplier_id: 4)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-011', 4, '2024-06-11', 14200.00, 3, 'pending', 'SATS WORK - İrsaliye 1'),
('1-BP-6-012', 4, '2024-06-17', 17800.00, 4, 'pending', 'SATS WORK - İrsaliye 2'),
('1-BP-6-013', 4, '2024-06-23', 19500.00, 5, 'approved', 'SATS WORK - İrsaliye 3');

-- OLKA005 (supplier_id: 5)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-014', 5, '2024-06-13', 16800.00, 4, 'pending', 'PAMUSAN NATURAL - İrsaliye 1'),
('1-BP-6-015', 5, '2024-06-19', 20300.00, 6, 'pending', 'PAMUSAN NATURAL - İrsaliye 2'),
('1-BP-6-016', 5, '2024-06-24', 15600.00, 3, 'approved', 'PAMUSAN NATURAL - İrsaliye 3'),
('1-BP-6-017', 5, '2024-06-26', 18900.00, 5, 'pending', 'PAMUSAN NATURAL - İrsaliye 4');

-- OLKA006 (supplier_id: 6)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-018', 6, '2024-06-09', 23400.00, 6, 'pending', 'BENEFIT SYSTEMS - İrsaliye 1'),
('1-BP-6-019', 6, '2024-06-15', 18700.00, 4, 'approved', 'BENEFIT SYSTEMS - İrsaliye 2'),
('1-BP-6-020', 6, '2024-06-22', 21200.00, 5, 'pending', 'BENEFIT SYSTEMS - İrsaliye 3');

-- OLKA007 (supplier_id: 7)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-021', 7, '2024-06-08', 14500.00, 3, 'pending', 'MEHMET CİHAT KÖSE - İrsaliye 1'),
('1-BP-6-022', 7, '2024-06-14', 17200.00, 4, 'pending', 'MEHMET CİHAT KÖSE - İrsaliye 2'),
('1-BP-6-023', 7, '2024-06-20', 19800.00, 5, 'approved', 'MEHMET CİHAT KÖSE - İrsaliye 3');

-- OLKA008 (supplier_id: 8)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-024', 8, '2024-06-10', 16300.00, 4, 'pending', 'ZEYNEP PEKER - İrsaliye 1'),
('1-BP-6-025', 8, '2024-06-16', 19100.00, 5, 'approved', 'ZEYNEP PEKER - İrsaliye 2'),
('1-BP-6-026', 8, '2024-06-21', 15400.00, 3, 'pending', 'ZEYNEP PEKER - İrsaliye 3');

-- OLKA009 (supplier_id: 9)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-027', 9, '2024-06-11', 17900.00, 4, 'pending', 'EDA ÖZDEMİR - İrsaliye 1'),
('1-BP-6-028', 9, '2024-06-17', 20600.00, 6, 'pending', 'EDA ÖZDEMİR - İrsaliye 2'),
('1-BP-6-029', 9, '2024-06-23', 16800.00, 3, 'approved', 'EDA ÖZDEMİR - İrsaliye 3');

-- OLKA010 (supplier_id: 10)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('1-BP-6-030', 10, '2024-06-12', 19200.00, 5, 'pending', 'BENER ATİLA - İrsaliye 1'),
('1-BP-6-031', 10, '2024-06-18', 15700.00, 3, 'approved', 'BENER ATİLA - İrsaliye 2'),
('1-BP-6-032', 10, '2024-06-24', 22400.00, 6, 'pending', 'BENER ATİLA - İrsaliye 3'),
('1-BP-6-033', 10, '2024-06-26', 18500.00, 4, 'pending', 'BENER ATİLA - İrsaliye 4');

-- MARLIN Şirketi (company_id = 2) - Tedarikçiler: MARLIN002-MARLIN010 (supplier_id: 11-19)
-- MARLIN002 (supplier_id: 11)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-001', 11, '2024-06-10', 21300.00, 5, 'pending', 'AYPLASTİK - İrsaliye 1'),
('2-BP-6-002', 11, '2024-06-15', 18900.00, 4, 'pending', 'AYPLASTİK - İrsaliye 2'),
('2-BP-6-003', 11, '2024-06-20', 22500.00, 6, 'approved', 'AYPLASTİK - İrsaliye 3'),
('2-BP-6-004', 11, '2024-06-25', 19700.00, 4, 'pending', 'AYPLASTİK - İrsaliye 4');

-- MARLIN003 (supplier_id: 12)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-005', 12, '2024-06-11', 17600.00, 4, 'pending', 'PİR-İNCİ BUJİTERİ - İrsaliye 1'),
('2-BP-6-006', 12, '2024-06-16', 20400.00, 5, 'approved', 'PİR-İNCİ BUJİTERİ - İrsaliye 2'),
('2-BP-6-007', 12, '2024-06-21', 16100.00, 3, 'pending', 'PİR-İNCİ BUJİTERİ - İrsaliye 3');

-- MARLIN004 (supplier_id: 13)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-008', 13, '2024-06-12', 21800.00, 5, 'pending', 'RDS GAYRİMENKUL - İrsaliye 1'),
('2-BP-6-009', 13, '2024-06-17', 18200.00, 4, 'pending', 'RDS GAYRİMENKUL - İrsaliye 2'),
('2-BP-6-010', 13, '2024-06-22', 23900.00, 6, 'approved', 'RDS GAYRİMENKUL - İrsaliye 3');

-- MARLIN005 (supplier_id: 14)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-011', 14, '2024-06-13', 19500.00, 4, 'pending', 'VOLÜME MÜHENDİSLİK - İrsaliye 1'),
('2-BP-6-012', 14, '2024-06-18', 17100.00, 3, 'approved', 'VOLÜME MÜHENDİSLİK - İrsaliye 2'),
('2-BP-6-013', 14, '2024-06-23', 20700.00, 5, 'pending', 'VOLÜME MÜHENDİSLİK - İrsaliye 3'),
('2-BP-6-014', 14, '2024-06-26', 18400.00, 4, 'pending', 'VOLÜME MÜHENDİSLİK - İrsaliye 4');

-- MARLIN006 (supplier_id: 15)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-015', 15, '2024-06-09', 15200.00, 3, 'pending', 'KORAY YAKICI - İrsaliye 1'),
('2-BP-6-016', 15, '2024-06-14', 18800.00, 4, 'pending', 'KORAY YAKICI - İrsaliye 2'),
('2-BP-6-017', 15, '2024-06-19', 21600.00, 5, 'approved', 'KORAY YAKICI - İrsaliye 3');

-- MARLIN007 (supplier_id: 16)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-018', 16, '2024-06-10', 17300.00, 4, 'pending', 'EMEK 1969 PASTACILIK - İrsaliye 1'),
('2-BP-6-019', 16, '2024-06-15', 19900.00, 5, 'approved', 'EMEK 1969 PASTACILIK - İrsaliye 2'),
('2-BP-6-020', 16, '2024-06-20', 16400.00, 3, 'pending', 'EMEK 1969 PASTACILIK - İrsaliye 3');

-- MARLIN008 (supplier_id: 17)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-021', 17, '2024-06-11', 22700.00, 6, 'pending', 'SÜRTAŞ - İrsaliye 1'),
('2-BP-6-022', 17, '2024-06-16', 19300.00, 4, 'pending', 'SÜRTAŞ - İrsaliye 2'),
('2-BP-6-023', 17, '2024-06-21', 17800.00, 3, 'approved', 'SÜRTAŞ - İrsaliye 3'),
('2-BP-6-024', 17, '2024-06-24', 21100.00, 5, 'pending', 'SÜRTAŞ - İrsaliye 4');

-- MARLIN009 (supplier_id: 18)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-025', 18, '2024-06-12', 18600.00, 4, 'pending', 'ATS GRUP - İrsaliye 1'),
('2-BP-6-026', 18, '2024-06-17', 20200.00, 5, 'approved', 'ATS GRUP - İrsaliye 2'),
('2-BP-6-027', 18, '2024-06-22', 16900.00, 3, 'pending', 'ATS GRUP - İrsaliye 3');

-- MARLIN010 (supplier_id: 19)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('2-BP-6-028', 19, '2024-06-13', 22000.00, 5, 'pending', 'OKYANUS RFID - İrsaliye 1'),
('2-BP-6-029', 19, '2024-06-18', 17500.00, 3, 'pending', 'OKYANUS RFID - İrsaliye 2'),
('2-BP-6-030', 19, '2024-06-23', 20800.00, 4, 'approved', 'OKYANUS RFID - İrsaliye 3'),
('2-BP-6-031', 19, '2024-06-25', 19400.00, 4, 'pending', 'OKYANUS RFID - İrsaliye 4');

-- JUPITER Şirketi (company_id = 3) - Tedarikçiler: JUPITER001-JUPITER010 (supplier_id: 20-27)
-- JUPITER001 (supplier_id: 20)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-001', 20, '2024-06-10', 23100.00, 6, 'pending', 'MONEYPAY - İrsaliye 1'),
('3-BP-6-002', 20, '2024-06-15', 18700.00, 4, 'pending', 'MONEYPAY - İrsaliye 2'),
('3-BP-6-003', 20, '2024-06-20', 21400.00, 5, 'approved', 'MONEYPAY - İrsaliye 3');

-- JUPITER002 (supplier_id: 21)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-004', 21, '2024-06-11', 17900.00, 4, 'pending', 'ERE AVM - İrsaliye 1'),
('3-BP-6-005', 21, '2024-06-16', 20500.00, 5, 'approved', 'ERE AVM - İrsaliye 2'),
('3-BP-6-006', 21, '2024-06-21', 16200.00, 3, 'pending', 'ERE AVM - İrsaliye 3'),
('3-BP-6-007', 21, '2024-06-24', 19800.00, 4, 'pending', 'ERE AVM - İrsaliye 4');

-- JUPITER003 (supplier_id: 22)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-008', 22, '2024-06-12', 22300.00, 5, 'pending', 'KİWİ MEDYA - İrsaliye 1'),
('3-BP-6-009', 22, '2024-06-17', 19000.00, 4, 'pending', 'KİWİ MEDYA - İrsaliye 2'),
('3-BP-6-010', 22, '2024-06-22', 17700.00, 3, 'approved', 'KİWİ MEDYA - İrsaliye 3');

-- JUPITER004 (supplier_id: 23)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-011', 23, '2024-06-13', 19600.00, 4, 'pending', 'VIBE520 MEDIA - İrsaliye 1'),
('3-BP-6-012', 23, '2024-06-18', 17200.00, 3, 'approved', 'VIBE520 MEDIA - İrsaliye 2'),
('3-BP-6-013', 23, '2024-06-23', 20900.00, 5, 'pending', 'VIBE520 MEDIA - İrsaliye 3');

-- JUPITER007 (supplier_id: 24)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-014', 24, '2024-06-09', 15800.00, 3, 'pending', 'ZEYNEP BİLGE ERCAN - İrsaliye 1'),
('3-BP-6-015', 24, '2024-06-14', 18400.00, 4, 'pending', 'ZEYNEP BİLGE ERCAN - İrsaliye 2'),
('3-BP-6-016', 24, '2024-06-19', 21700.00, 5, 'approved', 'ZEYNEP BİLGE ERCAN - İrsaliye 3'),
('3-BP-6-017', 24, '2024-06-25', 20100.00, 4, 'pending', 'ZEYNEP BİLGE ERCAN - İrsaliye 4');

-- JUPITER008 (supplier_id: 25)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-018', 25, '2024-06-10', 22500.00, 5, 'pending', 'MEVSİM OLUKLU - İrsaliye 1'),
('3-BP-6-019', 25, '2024-06-15', 19100.00, 4, 'approved', 'MEVSİM OLUKLU - İrsaliye 2'),
('3-BP-6-020', 25, '2024-06-20', 16800.00, 3, 'pending', 'MEVSİM OLUKLU - İrsaliye 3');

-- JUPITER009 (supplier_id: 26)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-021', 26, '2024-06-11', 23200.00, 6, 'pending', 'U2 DİGİTAL - İrsaliye 1'),
('3-BP-6-022', 26, '2024-06-16', 18800.00, 4, 'pending', 'U2 DİGİTAL - İrsaliye 2'),
('3-BP-6-023', 26, '2024-06-21', 21500.00, 5, 'approved', 'U2 DİGİTAL - İrsaliye 3');

-- JUPITER010 (supplier_id: 27)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('3-BP-6-024', 27, '2024-06-12', 18000.00, 4, 'pending', 'SAMİ SOYDAN - İrsaliye 1'),
('3-BP-6-025', 27, '2024-06-17', 20600.00, 5, 'approved', 'SAMİ SOYDAN - İrsaliye 2'),
('3-BP-6-026', 27, '2024-06-22', 16300.00, 3, 'pending', 'SAMİ SOYDAN - İrsaliye 3');

-- NEPTUN Şirketi (company_id = 4) - Tedarikçiler: NEPTUN002-NEPTUN010 (supplier_id: 28-36)
-- NEPTUN002 (supplier_id: 28)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-001', 28, '2024-06-10', 21900.00, 5, 'pending', 'TEKNO KIRTASİYE - İrsaliye 1'),
('4-BP-6-002', 28, '2024-06-15', 18500.00, 4, 'pending', 'TEKNO KIRTASİYE - İrsaliye 2'),
('4-BP-6-003', 28, '2024-06-20', 21200.00, 5, 'approved', 'TEKNO KIRTASİYE - İrsaliye 3'),
('4-BP-6-004', 28, '2024-06-24', 19700.00, 4, 'pending', 'TEKNO KIRTASİYE - İrsaliye 4');

-- NEPTUN003 (supplier_id: 29)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-005', 29, '2024-06-11', 17400.00, 4, 'pending', 'BELİEVE MATBAACILIK - İrsaliye 1'),
('4-BP-6-006', 29, '2024-06-16', 20000.00, 5, 'approved', 'BELİEVE MATBAACILIK - İrsaliye 2'),
('4-BP-6-007', 29, '2024-06-21', 16700.00, 3, 'pending', 'BELİEVE MATBAACILIK - İrsaliye 3');

-- NEPTUN004 (supplier_id: 30)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-008', 30, '2024-06-12', 22800.00, 6, 'pending', 'ORANSAY TURİZM - İrsaliye 1'),
('4-BP-6-009', 30, '2024-06-17', 19400.00, 4, 'pending', 'ORANSAY TURİZM - İrsaliye 2'),
('4-BP-6-010', 30, '2024-06-22', 17900.00, 3, 'approved', 'ORANSAY TURİZM - İrsaliye 3');

-- NEPTUN005 (supplier_id: 31)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-011', 31, '2024-06-13', 20300.00, 5, 'pending', 'ESATECH GÜÇ - İrsaliye 1'),
('4-BP-6-012', 31, '2024-06-18', 16900.00, 3, 'approved', 'ESATECH GÜÇ - İrsaliye 2'),
('4-BP-6-013', 31, '2024-06-23', 21600.00, 5, 'pending', 'ESATECH GÜÇ - İrsaliye 3'),
('4-BP-6-014', 31, '2024-06-25', 19200.00, 4, 'pending', 'ESATECH GÜÇ - İrsaliye 4');

-- NEPTUN006 (supplier_id: 32)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-015', 32, '2024-06-09', 18100.00, 4, 'pending', 'TURK FİNANSAL - İrsaliye 1'),
('4-BP-6-016', 32, '2024-06-14', 20700.00, 5, 'pending', 'TURK FİNANSAL - İrsaliye 2'),
('4-BP-6-017', 32, '2024-06-19', 16400.00, 3, 'approved', 'TURK FİNANSAL - İrsaliye 3');

-- NEPTUN007 (supplier_id: 33)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-018', 33, '2024-06-10', 22900.00, 5, 'pending', 'EROL TUZGU - İrsaliye 1'),
('4-BP-6-019', 33, '2024-06-15', 19500.00, 4, 'approved', 'EROL TUZGU - İrsaliye 2'),
('4-BP-6-020', 33, '2024-06-20', 17800.00, 3, 'pending', 'EROL TUZGU - İrsaliye 3');

-- NEPTUN008 (supplier_id: 34)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-021', 34, '2024-06-11', 21000.00, 5, 'pending', 'LİMAN RESTORANT - İrsaliye 1'),
('4-BP-6-022', 34, '2024-06-16', 17600.00, 3, 'pending', 'LİMAN RESTORANT - İrsaliye 2'),
('4-BP-6-023', 34, '2024-06-21', 21300.00, 4, 'approved', 'LİMAN RESTORANT - İrsaliye 3'),
('4-BP-6-024', 34, '2024-06-24', 19900.00, 4, 'pending', 'LİMAN RESTORANT - İrsaliye 4');

-- NEPTUN009 (supplier_id: 35)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-025', 35, '2024-06-12', 18700.00, 4, 'pending', 'D-MARKET - İrsaliye 1'),
('4-BP-6-026', 35, '2024-06-17', 20400.00, 5, 'approved', 'D-MARKET - İrsaliye 2'),
('4-BP-6-027', 35, '2024-06-22', 17100.00, 3, 'pending', 'D-MARKET - İrsaliye 3');

-- NEPTUN010 (supplier_id: 36)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('4-BP-6-028', 36, '2024-06-13', 23300.00, 6, 'pending', 'CANDAN TURİZM - İrsaliye 1'),
('4-BP-6-029', 36, '2024-06-18', 18900.00, 4, 'pending', 'CANDAN TURİZM - İrsaliye 2'),
('4-BP-6-030', 36, '2024-06-23', 22200.00, 5, 'approved', 'CANDAN TURİZM - İrsaliye 3');

-- SATURN Şirketi (company_id = 5) - Tedarikçiler: SATURN002-SATURN010 (supplier_id: 37-45)
-- SATURN002 (supplier_id: 37)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-001', 37, '2024-06-10', 19800.00, 4, 'pending', 'RAMAZAN KIRKBINAR - İrsaliye 1'),
('5-BP-6-002', 37, '2024-06-15', 22400.00, 5, 'pending', 'RAMAZAN KIRKBINAR - İrsaliye 2'),
('5-BP-6-003', 37, '2024-06-20', 17700.00, 3, 'approved', 'RAMAZAN KIRKBINAR - İrsaliye 3'),
('5-BP-6-004', 37, '2024-06-25', 21100.00, 4, 'pending', 'RAMAZAN KIRKBINAR - İrsaliye 4');

-- SATURN003 (supplier_id: 38)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-005', 38, '2024-06-11', 18200.00, 4, 'pending', 'ZÜMPA - İrsaliye 1'),
('5-BP-6-006', 38, '2024-06-16', 20800.00, 5, 'approved', 'ZÜMPA - İrsaliye 2'),
('5-BP-6-007', 38, '2024-06-21', 16500.00, 3, 'pending', 'ZÜMPA - İrsaliye 3');

-- SATURN004 (supplier_id: 39)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-008', 39, '2024-06-12', 23000.00, 6, 'pending', 'VOLTRON SOLUTION - İrsaliye 1'),
('5-BP-6-009', 39, '2024-06-17', 19600.00, 4, 'pending', 'VOLTRON SOLUTION - İrsaliye 2'),
('5-BP-6-010', 39, '2024-06-22', 18300.00, 3, 'approved', 'VOLTRON SOLUTION - İrsaliye 3');

-- SATURN005 (supplier_id: 40)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-011', 40, '2024-06-13', 20900.00, 5, 'pending', 'BEYAZ FIRIN - İrsaliye 1'),
('5-BP-6-012', 40, '2024-06-18', 17500.00, 3, 'approved', 'BEYAZ FIRIN - İrsaliye 2'),
('5-BP-6-013', 40, '2024-06-23', 21800.00, 5, 'pending', 'BEYAZ FIRIN - İrsaliye 3'),
('5-BP-6-014', 40, '2024-06-26', 19300.00, 4, 'pending', 'BEYAZ FIRIN - İrsaliye 4');

-- SATURN006 (supplier_id: 41)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-015', 41, '2024-06-09', 15900.00, 3, 'pending', 'TALAY LOJISTIK - İrsaliye 1'),
('5-BP-6-016', 41, '2024-06-14', 18500.00, 4, 'pending', 'TALAY LOJISTIK - İrsaliye 2'),
('5-BP-6-017', 41, '2024-06-19', 22600.00, 6, 'approved', 'TALAY LOJISTIK - İrsaliye 3');

-- SATURN007 (supplier_id: 42)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-018', 42, '2024-06-10', 23400.00, 5, 'pending', 'YALIN ANALİZ - İrsaliye 1'),
('5-BP-6-019', 42, '2024-06-15', 20000.00, 4, 'approved', 'YALIN ANALİZ - İrsaliye 2'),
('5-BP-6-020', 42, '2024-06-20', 17300.00, 3, 'pending', 'YALIN ANALİZ - İrsaliye 3');

-- SATURN008 (supplier_id: 43)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-021', 43, '2024-06-11', 18600.00, 4, 'pending', 'BV CPS TEST - İrsaliye 1'),
('5-BP-6-022', 43, '2024-06-16', 21200.00, 5, 'pending', 'BV CPS TEST - İrsaliye 2'),
('5-BP-6-023', 43, '2024-06-21', 17900.00, 3, 'approved', 'BV CPS TEST - İrsaliye 3'),
('5-BP-6-024', 43, '2024-06-24', 20500.00, 4, 'pending', 'BV CPS TEST - İrsaliye 4');

-- SATURN009 (supplier_id: 44)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-025', 44, '2024-06-12', 22700.00, 5, 'pending', 'SANİYE CANAN VARAN - İrsaliye 1'),
('5-BP-6-026', 44, '2024-06-17', 19300.00, 4, 'approved', 'SANİYE CANAN VARAN - İrsaliye 2'),
('5-BP-6-027', 44, '2024-06-22', 18000.00, 3, 'pending', 'SANİYE CANAN VARAN - İrsaliye 3');

-- SATURN010 (supplier_id: 45)
INSERT OR IGNORE INTO shipping_documents (shipping_number, supplier_id, shipping_date, total_amount, item_count, status, notes) VALUES
('5-BP-6-028', 45, '2024-06-13', 21000.00, 5, 'pending', 'CANKIZ ALPER BİNZAT - İrsaliye 1'),
('5-BP-6-029', 45, '2024-06-18', 17600.00, 3, 'pending', 'CANKIZ ALPER BİNZAT - İrsaliye 2'),
('5-BP-6-030', 45, '2024-06-23', 22300.00, 6, 'approved', 'CANKIZ ALPER BİNZAT - İrsaliye 3'),
('5-BP-6-031', 45, '2024-06-25', 19700.00, 4, 'pending', 'CANKIZ ALPER BİNZAT - İrsaliye 4');
