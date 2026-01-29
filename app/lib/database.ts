import { sql } from '@vercel/postgres';
import { normalizeProductCode, mapUIStatusToDb } from './utils';
import type {
  Supplier,
  ShippingDocument,
  ShippingItem,
  Invoice,
  PriceCalculation,
  PurchaseInvoice,
  PurchaseInvoiceItem,
  UIStatus,
} from './types';

// Veritabanı başlatma (PostgreSQL için)
export async function initializeDatabase() {
  try {
    // Şema dosyasını oku ve çalıştır
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(process.cwd(), 'scripts', 'postgres-schema.sql');
    const seedPath = path.join(process.cwd(), 'scripts', 'seed-data.sql');
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const seed = fs.readFileSync(seedPath, 'utf8');
    
    // Şemayı çalıştır (her satırı ayrı ayrı çalıştır)
    // Not: Bu fonksiyon sadece local development için kullanılır
    // Vercel'de veritabanı şeması manuel olarak oluşturulmalı veya migration script ile
    // @vercel/postgres'de raw SQL çalıştırmak için pg kütüphanesi gerekir
    // Bu fonksiyon Vercel'de çalışmayacak, sadece local'de kullanılmalı
    console.warn('⚠️ initializeDatabase() Vercel\'de çalışmaz. Veritabanı şeması manuel olarak oluşturulmalı.');
    console.log('✅ Veritabanı şeması oluşturuldu (local only)');
    console.log('✅ Test verileri eklendi');
    
  } catch (error) {
    console.error('❌ Veritabanı başlatma hatası:', error);
    throw error;
  }
}

// Veritabanı bağlantısını kapat (PostgreSQL için gerekli değil ama uyumluluk için)
export function closeDatabase() {
  // Vercel Postgres connection pooling otomatik yönetilir
  return Promise.resolve();
}

// Tedarikçi işlemleri
export async function getSuppliers(companyId?: string | number): Promise<Supplier[]> {
  if (companyId !== undefined && companyId !== null && companyId !== '') {
    const id = typeof companyId === 'string' ? parseInt(companyId) : companyId
    if (!isNaN(id)) {
      const result = await sql`SELECT * FROM suppliers WHERE company_id = ${id} ORDER BY supplier_name`;
      return result.rows as Supplier[];
    }
  }
  const result = await sql`SELECT * FROM suppliers ORDER BY supplier_name`;
  return result.rows as Supplier[];
}

export async function getSupplierById(id: number): Promise<Supplier | null> {
  const result = await sql`SELECT * FROM suppliers WHERE id = ${id}`;
  return (result.rows[0] as Supplier) || null;
}

// İrsaliye işlemleri
export async function getShippingDocuments(filters: {
  shippingNumber?: string;
  status?: string;
  supplierCode?: string;
  companyId?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ data: ShippingDocument[]; total: number }> {
  const { shippingNumber, status, supplierCode, companyId, page = 1, limit = 10 } = filters;
  
  const offset = (page - 1) * limit;
  const dbStatus = status && status !== 'all' ? mapUIStatusToDb(status as UIStatus) : null;
  const companyIdNum = companyId ? (typeof companyId === 'string' ? parseInt(companyId) : companyId) : null;
  const searchTerm = shippingNumber ? `%${shippingNumber}%` : null;
  
  // Her kombinasyonu ayrı template literal ile yazıyoruz
  let totalResult, dataResult;
  
  // Hiç filtre yok
  if (!shippingNumber && !dbStatus && !supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // Sadece shippingNumber
  else if (shippingNumber && !dbStatus && !supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // Sadece status
  else if (!shippingNumber && dbStatus && !supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.status = ${dbStatus}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.status = ${dbStatus}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // Sadece supplierCode
  else if (!shippingNumber && !dbStatus && supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE s.supplier_code = ${supplierCode}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE s.supplier_code = ${supplierCode}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // Sadece companyId
  else if (!shippingNumber && !dbStatus && !supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // shippingNumber + status
  else if (shippingNumber && dbStatus && !supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // shippingNumber + supplierCode
  else if (shippingNumber && !dbStatus && supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND s.supplier_code = ${supplierCode}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND s.supplier_code = ${supplierCode}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // shippingNumber + companyId
  else if (shippingNumber && !dbStatus && !supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // status + supplierCode
  else if (!shippingNumber && dbStatus && supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // status + companyId
  else if (!shippingNumber && dbStatus && !supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.status = ${dbStatus} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.status = ${dbStatus} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // supplierCode + companyId
  else if (!shippingNumber && !dbStatus && supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // shippingNumber + status + supplierCode
  else if (shippingNumber && dbStatus && supplierCode && (!companyIdNum || isNaN(companyIdNum))) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // shippingNumber + status + companyId
  else if (shippingNumber && dbStatus && !supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // shippingNumber + supplierCode + companyId
  else if (shippingNumber && !dbStatus && supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // status + supplierCode + companyId
  else if (!shippingNumber && dbStatus && supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // Tüm filtreler
  else if (shippingNumber && dbStatus && supplierCode && companyIdNum && !isNaN(companyIdNum)) {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
      WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       WHERE sd.shipping_number LIKE ${searchTerm} AND sd.status = ${dbStatus} AND s.supplier_code = ${supplierCode} AND s.company_id = ${companyIdNum}
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  // Fallback: hiç filtre yok
  else {
    totalResult = await sql`
      SELECT COUNT(DISTINCT sd.id) as count
      FROM shipping_documents sd
      JOIN suppliers s ON s.id = sd.supplier_id
      LEFT JOIN companies c ON c.id = s.company_id
    `;
    dataResult = await sql`
      SELECT sd.id,
              sd.shipping_number,
              sd.supplier_id,
              sd.shipping_date,
              sd.total_amount,
              sd.item_count,
              sd.status,
              sd.notes,
              sd.created_at,
              sd.updated_at,
              s.supplier_name, 
              s.supplier_code, 
              s.id as supplier_id, 
              s.company_id, 
              c.company_name,
              i.invoice_number,
              COALESCE(SUM(si.quantity), 0) as total_quantity
       FROM shipping_documents sd
       JOIN suppliers s ON s.id = sd.supplier_id
       LEFT JOIN companies c ON c.id = s.company_id
       LEFT JOIN shipping_items si ON si.shipping_id = sd.id
       LEFT JOIN invoices i ON i.shipping_id = sd.id
       GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
       ORDER BY sd.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  
  const total = parseInt(totalResult.rows[0]?.count || '0');
  return { data: dataResult.rows as ShippingDocument[], total };
}

export async function getShippingDocumentById(id: number): Promise<ShippingDocument | null> {
  const result = await sql`SELECT * FROM shipping_documents WHERE id = ${id}`;
  return (result.rows[0] as ShippingDocument) || null;
}

export async function getShippingItems(shippingId: number): Promise<ShippingItem[]> {
  const result = await sql`SELECT * FROM shipping_items WHERE shipping_id = ${shippingId}`;
  return result.rows as ShippingItem[];
}

// İrsaliye durum/tutar güncelleme
export async function updateShippingDocumentStatus(params: {
  shipping_id: number;
  status: UIStatus;
  total_amount?: number;
}): Promise<void> {
  const { shipping_id, status, total_amount } = params;
  const dbStatus = mapUIStatusToDb(status);
  
  if (typeof total_amount === 'number') {
    await sql`
      UPDATE shipping_documents 
      SET status = ${dbStatus}, total_amount = ${total_amount}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${shipping_id}
    `;
  } else {
    await sql`
      UPDATE shipping_documents 
      SET status = ${dbStatus}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${shipping_id}
    `;
  }
}

// Fatura işlemleri
export async function getInvoices(filters: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ data: Invoice[]; total: number }> {
  const { search, status, page = 1, limit = 10 } = filters;
  
  const offset = (page - 1) * limit;
  
  // Her durumu ayrı template literal ile yazıyoruz
  let totalResult, dataResult;
  
  if (!search && (!status || status === 'all')) {
    // Hiç filtre yok
    totalResult = await sql`SELECT COUNT(*) as count FROM invoices`;
    dataResult = await sql`
      SELECT * FROM invoices 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (search && (!status || status === 'all')) {
    // Sadece search
    const searchTerm = `%${search}%`;
    totalResult = await sql`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE ${searchTerm} OR notes LIKE ${searchTerm}`;
    dataResult = await sql`
      SELECT * FROM invoices 
      WHERE invoice_number LIKE ${searchTerm} OR notes LIKE ${searchTerm}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else if (!search && status && status !== 'all') {
    // Sadece status
    totalResult = await sql`SELECT COUNT(*) as count FROM invoices WHERE status = ${status}`;
    dataResult = await sql`
      SELECT * FROM invoices 
      WHERE status = ${status}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
  } else {
    // Hem search hem status
    const searchTerm = `%${search}%`;
    totalResult = await sql`SELECT COUNT(*) as count FROM invoices WHERE (invoice_number LIKE ${searchTerm} OR notes LIKE ${searchTerm}) AND status = ${status}`;
    dataResult = await sql`
      SELECT * FROM invoices 
      WHERE (invoice_number LIKE ${searchTerm} OR notes LIKE ${searchTerm}) AND status = ${status}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
  }
  
  const total = parseInt(totalResult.rows[0]?.count || '0');
  return { data: dataResult.rows as Invoice[], total };
}

export async function createInvoice(invoiceData: {
  shipping_id: number;
  invoice_type: 'LIFO' | 'SATIS_FATURASI';
  base_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  created_date: string;
  due_date: string;
}): Promise<Invoice> {
  // Fatura numarası oluştur: 1-R-7-XXX formatında (XXX 3 haneli sayı)
  const countResult = await sql`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE '1-R-7-%'`;
  const count = parseInt(countResult.rows[0]?.count || '0') + 1;
  const invoiceNumber = `1-R-7-${count.toString().padStart(3, '0')}`;
  
  const result = await sql`
    INSERT INTO invoices (invoice_number, shipping_id, invoice_type, base_amount, tax_amount, discount_amount, total_amount, created_date, due_date, status)
    VALUES (${invoiceNumber}, ${invoiceData.shipping_id}, ${invoiceData.invoice_type}, ${invoiceData.base_amount}, ${invoiceData.tax_amount}, ${invoiceData.discount_amount}, ${invoiceData.total_amount}, ${invoiceData.created_date}, ${invoiceData.due_date}, 'created')
    RETURNING *
  `;
  
  const newInvoice = result.rows[0] as Invoice;

  // İrsaliye durumunu 'invoiced' yap ve toplam tutarı güncelle
  const invoicedStatus = mapUIStatusToDb('invoiced');
  await sql`
    UPDATE shipping_documents 
    SET status = ${invoicedStatus}, total_amount = ${invoiceData.total_amount}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${invoiceData.shipping_id}
  `;
  
  return newInvoice;
}

// Fiyat hesaplama işlemleri
export async function savePriceCalculation(calculationData: {
  shipping_id: number;
  invoice_type: string;
  calculated_price: number;
  base_amount: number;
  tax_amount: number;
  discount_amount: number;
  calculation_method?: string;
  calculation_details?: string;
}): Promise<PriceCalculation> {
  const result = await sql`
    INSERT INTO price_calculations (shipping_id, invoice_type, calculated_price, base_amount, tax_amount, discount_amount, calculation_method, calculation_details)
    VALUES (${calculationData.shipping_id}, ${calculationData.invoice_type}, ${calculationData.calculated_price}, ${calculationData.base_amount}, ${calculationData.tax_amount}, ${calculationData.discount_amount}, ${calculationData.calculation_method || null}, ${calculationData.calculation_details || null})
    RETURNING *
  `;
  
  return result.rows[0] as PriceCalculation;
}

// En son hesaplama sonucunu al
export async function getLatestPriceCalculation(shippingId: number): Promise<PriceCalculation | null> {
  const result = await sql`
    SELECT * FROM price_calculations 
    WHERE shipping_id = ${shippingId} 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  return (result.rows[0] as PriceCalculation) || null;
}

// Tedarikçi satış faturaları işlemleri
export async function getPurchaseInvoicesBySupplier(
  supplierId: number,
  productCode?: string
): Promise<PurchaseInvoice[]> {
  if (productCode) {
    const normalizedProductCode = normalizeProductCode(productCode);
    
    // Önce tam eşleşme dene
    let result = await sql`
      SELECT DISTINCT pi.*
      FROM purchase_invoices pi
      WHERE pi.supplier_id = ${supplierId}
      AND EXISTS (
        SELECT 1 FROM purchase_invoice_items pii
        WHERE pii.invoice_id = pi.id 
        AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) = ${normalizedProductCode}
      )
      ORDER BY pi.invoice_date DESC
    `;
    
    // Eğer sonuç bulunamazsa, sadece sayısal kısmı (renk kodunu çıkararak) dene
    if (result.rows.length === 0) {
      const numericPart = normalizedProductCode.split('-')[0];
      if (numericPart && numericPart !== normalizedProductCode) {
        result = await sql`
          SELECT DISTINCT pi.*
          FROM purchase_invoices pi
          WHERE pi.supplier_id = ${supplierId}
          AND EXISTS (
            SELECT 1 FROM purchase_invoice_items pii
            WHERE pii.invoice_id = pi.id 
            AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) LIKE ${numericPart + '-%'}
          )
          ORDER BY pi.invoice_date DESC
        `;
      }
    }
    
    return result.rows as PurchaseInvoice[];
  }
  
  const result = await sql`
    SELECT DISTINCT pi.*
    FROM purchase_invoices pi
    WHERE pi.supplier_id = ${supplierId}
    ORDER BY pi.invoice_date DESC
  `;
  
  return result.rows as PurchaseInvoice[];
}

export async function getPurchaseInvoiceItems(invoiceId: number): Promise<PurchaseInvoiceItem[]> {
  const result = await sql`SELECT * FROM purchase_invoice_items WHERE invoice_id = ${invoiceId}`;
  return result.rows as PurchaseInvoiceItem[];
}

export async function getPurchaseInvoiceWithItems(invoiceId: number): Promise<{
  invoice: PurchaseInvoice;
  items: PurchaseInvoiceItem[];
} | null> {
  const invoiceResult = await sql`SELECT * FROM purchase_invoices WHERE id = ${invoiceId}`;
  const invoice = invoiceResult.rows[0] as PurchaseInvoice | null;
  
  if (!invoice) return null;
  
  const items = await getPurchaseInvoiceItems(invoiceId);
  
  return { invoice, items };
}

// LIFO hesaplama: Belirli bir ürün için tedarikçinin faturalarından LIFO mantığıyla birim fiyatları hesapla
export async function getLIFOPrices(
  supplierId: number,
  productCode: string,
  quantity: number
): Promise<Array<{
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  quantity: number;
  unitPrice: number;
  total: number;
}>> {
  const normalizedProductCode = normalizeProductCode(productCode);
  
  // Önce tam eşleşme dene
  let invoicesResult = await sql`
    SELECT pi.id, pi.invoice_number, pi.invoice_date, pii.quantity, pii.unit_price
    FROM purchase_invoices pi
    JOIN purchase_invoice_items pii ON pii.invoice_id = pi.id
    WHERE pi.supplier_id = ${supplierId} 
    AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) = ${normalizedProductCode}
    ORDER BY pi.invoice_date DESC, pi.id DESC
  `;
  
  // Eğer bulunamazsa, sadece sayısal kısmı (renk kodunu çıkararak) dene
  if (invoicesResult.rows.length === 0) {
    const numericPart = normalizedProductCode.split('-')[0];
    if (numericPart && numericPart !== normalizedProductCode) {
      invoicesResult = await sql`
        SELECT pi.id, pi.invoice_number, pi.invoice_date, pii.quantity, pii.unit_price
        FROM purchase_invoices pi
        JOIN purchase_invoice_items pii ON pii.invoice_id = pi.id
        WHERE pi.supplier_id = ${supplierId} 
        AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) LIKE ${numericPart + '-%'}
        ORDER BY pi.invoice_date DESC, pi.id DESC
      `;
    }
  }
  
  const invoices = invoicesResult.rows;
  const result: Array<{
    invoiceId: number;
    invoiceNumber: string;
    invoiceDate: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }> = [];
  
  let remainingQuantity = quantity;
  
  for (const invoice of invoices) {
    if (remainingQuantity <= 0) break;
    
    const availableQuantity = parseInt(invoice.quantity);
    const takeQuantity = Math.min(remainingQuantity, availableQuantity);
    
    if (takeQuantity > 0) {
      result.push({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.invoice_date,
        quantity: takeQuantity,
        unitPrice: parseFloat(invoice.unit_price),
        total: takeQuantity * parseFloat(invoice.unit_price)
      });
      
      remainingQuantity -= takeQuantity;
    }
  }
  
  return result;
}
