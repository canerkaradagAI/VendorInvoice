// Tedarikçi İrsaliye Sistemi - Utility Fonksiyonları

import type { ParsedProductCode, UIStatus, DBStatus } from './types';

// Sabitler
export const TAX_RATE = 0.18;
export const PROFIT_MARGIN = 0.10;
export const DISCOUNT_RATE = 0.02;

// Ürün kodu normalizasyonu
export function normalizeProductCode(code: string): string {
  if (!code) return '';
  return code.trim().replace(/\s+/g, '-').toUpperCase();
}

// Ürün kodunu parse et
export function parseProductCode(productCode: string): ParsedProductCode {
  if (!productCode) {
    return { code: '-', color: '-', size: '-' };
  }
  
  const parts = productCode.trim().split(/[\s-]+/);
  
  if (parts.length >= 2) {
    return {
      code: parts[0],
      color: parts[1] || '-',
      size: parts[2] || '-'
    };
  } else if (parts.length === 1) {
    return {
      code: parts[0],
      color: '-',
      size: '-'
    };
  }
  
  return {
    code: productCode,
    color: '-',
    size: '-'
  };
}

// Database status'ünü UI status'üne çevir
export function mapDbStatusToUI(status: string): UIStatus {
  switch (status) {
    case 'approved':
      return 'calculated';
    case 'rejected':
      return 'invoiced';
    case 'pending':
    default:
      return 'pending';
  }
}

// UI status'ünü database status'üne çevir
export function mapUIStatusToDb(status: UIStatus): DBStatus {
  switch (status) {
    case 'calculated':
      return 'approved';
    case 'invoiced':
      return 'rejected';
    case 'pending':
    default:
      return 'pending';
  }
}

// Status renklendirme
export function getStatusColor(status: UIStatus): string {
  switch (status) {
    case 'invoiced':
      return 'bg-blue-100 text-blue-800';
    case 'calculated':
      return 'bg-green-100 text-green-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

// Status metni
export function getStatusText(status: UIStatus): string {
  switch (status) {
    case 'invoiced':
      return 'Faturalandırıldı';
    case 'calculated':
      return 'Hesaplandı';
    case 'pending':
    default:
      return 'Beklemede';
  }
}

// Para formatı
export function formatCurrency(amount: number): string {
  return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Tarih formatı
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('tr-TR');
}

// KDV hesaplama
export function calculateTax(baseAmount: number): number {
  return baseAmount * TAX_RATE;
}

// İndirim hesaplama
export function calculateDiscount(baseAmount: number, rate: number = DISCOUNT_RATE): number {
  return baseAmount * rate;
}

// Kar marjı hesaplama
export function applyProfitMargin(amount: number): number {
  return amount * (1 + PROFIT_MARGIN);
}

// KDV dahil fiyat hesaplama
export function calculateTotalWithTax(baseAmount: number, taxAmount: number, discountAmount: number = 0): number {
  return baseAmount + taxAmount - discountAmount;
}

// KDV hariç fiyattan KDV dahil fiyata çevirme
export function addTaxToPrice(priceWithoutTax: number): number {
  return priceWithoutTax * (1 + TAX_RATE);
}

// KDV dahil fiyattan KDV hariç fiyata çevirme
export function removeTaxFromPrice(priceWithTax: number): number {
  return priceWithTax / (1 + TAX_RATE);
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Logger (environment'a göre log'la)
export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
  }
};
