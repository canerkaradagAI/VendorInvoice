// Tedarikçi İrsaliye Sistemi - Merkezi Type Tanımlamaları

// Şirket
export interface Company {
  id: number;
  company_code: string;
  company_name: string;
  tax_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Tedarikçi
export interface Supplier {
  id: number;
  supplier_code: string;
  supplier_name: string;
  company_id: number;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_number?: string;
  created_at: string;
  updated_at: string;
}

// İrsaliye belgesi
export interface ShippingDocument {
  id: number;
  shipping_number: string;
  supplier_id: number;
  shipping_date: string;
  total_amount: number;
  item_count: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// İrsaliye detayı
export interface ShippingItem {
  id: number;
  shipping_id: number;
  product_code: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// Fatura
export interface Invoice {
  id: number;
  invoice_number: string;
  shipping_id: number;
  invoice_type: 'LIFO' | 'SATIS_FATURASI';
  base_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  created_date: string;
  due_date: string;
  status: 'created' | 'sent' | 'paid' | 'overdue';
  pdf_path?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Fiyat hesaplama
export interface PriceCalculation {
  id: number;
  shipping_id: number;
  invoice_type: string;
  calculated_price: number;
  base_amount: number;
  tax_amount: number;
  discount_amount: number;
  calculation_method?: string;
  calculation_details?: string;
  created_at: string;
}

// Tedarikçi satış faturası
export interface PurchaseInvoice {
  id: number;
  invoice_number: string;
  supplier_id: number;
  invoice_date: string;
  total_amount: number;
  created_at: string;
}

// Tedarikçi satış faturası kalemi
export interface PurchaseInvoiceItem {
  id: number;
  invoice_id: number;
  product_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// UI Status tipleri
export type UIStatus = 'pending' | 'calculated' | 'invoiced';
export type DBStatus = 'pending' | 'approved' | 'rejected';

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// LIFO Calculation
export interface LIFOPrice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface LIFOItemCalculation {
  productCode: string;
  quantity: number;
  lifoItems: Array<{
    invoiceNumber: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  total: number;
}

// Price Calculation Result
export interface PriceCalculationResult {
  calculatedPrice: number;
  invoiceType: string;
  breakdown: {
    baseAmount: number;
    taxAmount: number;
    discountAmount: number;
  };
  calculation: {
    method: string;
    details: string;
  };
  itemCalculations?: LIFOItemCalculation[];
}

// Parsed Product Code
export interface ParsedProductCode {
  code: string;
  color: string;
  size: string;
}
