import React, { useMemo, useCallback } from 'react'
import type { PriceCalculationResult, ParsedProductCode } from '@/lib/types'
import { formatCurrency, parseProductCode } from '@/lib/utils'

interface PriceCalculationModalProps {
  show: boolean
  selectedShipping: {
    id: number
    shipping_number: string
    supplier_name: string
    shipping_date: string
    notes?: string
    company?: string
    status: string
  } | null
  calculationResult: PriceCalculationResult | null
  isCalculating: boolean
  billingMethod: string | null
  onClose: () => void
  onCalculateLIFO: () => void
  onCalculateInvoice: () => void
  onCalculateManual: () => void
  onShowDetails: () => void
  onCreateInvoice?: () => void
}

export const PriceCalculationModal = React.memo(function PriceCalculationModal({
  show,
  selectedShipping,
  calculationResult,
  isCalculating,
  billingMethod,
  onClose,
  onCalculateLIFO,
  onCalculateInvoice,
  onCalculateManual,
  onShowDetails,
  onCreateInvoice
}: PriceCalculationModalProps) {
  if (!show || !selectedShipping) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Fiyat Hesaplama - {selectedShipping.shipping_number}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">İrsaliye Detayları</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şirket</label>
                <p className="text-sm text-gray-900">{selectedShipping.company || 'Merkez'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
                <p className="text-sm text-gray-900">{selectedShipping.supplier_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <p className="text-sm text-gray-900">
                  {selectedShipping.shipping_date ? new Date(selectedShipping.shipping_date).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <p className="text-sm text-gray-900">{selectedShipping.notes || '-'}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-3">
              <button 
                onClick={onCalculateLIFO}
                disabled={isCalculating}
                className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? 'Hesaplanıyor...' : 'LIFO\'dan Hesapla'}
              </button>
              <button 
                onClick={onCalculateInvoice}
                disabled={isCalculating}
                className="flex-1 bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? 'Hesaplanıyor...' : 'Fatura\'dan Hesapla'}
              </button>
              <button 
                onClick={onCalculateManual}
                disabled={isCalculating}
                className="flex-1 bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100 px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Manuel Hesapla
              </button>
            </div>
          </div>

          {calculationResult && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-md font-medium text-green-900 mb-2">Hesaplama Sonucu</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Ana Tutar:</span> {formatCurrency(calculationResult.breakdown.baseAmount)}
                    </div>
                    <div>
                      <span className="font-medium">KDV:</span> {formatCurrency(calculationResult.breakdown.taxAmount)}
                    </div>
                    <div>
                      <span className="font-medium">İndirim:</span> {formatCurrency(calculationResult.breakdown.discountAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Toplam:</span> {formatCurrency(calculationResult.calculatedPrice)}
                    </div>
                  </div>
                  <p className="text-xs text-green-900 mt-2 font-medium">
                    Hesaplama Yöntemi: {billingMethod || calculationResult.calculation.method}
                  </p>
                </div>
                <button 
                  onClick={onShowDetails}
                  className="ml-4 shrink-0 px-3 py-1 rounded-md bg-green-600 text-white text-xs hover:bg-green-700"
                >
                  Kalem Detaylarını Göster
                </button>
              </div>
              {selectedShipping.status === 'calculated' && onCreateInvoice && (
                <div className="flex justify-end pt-3 border-t border-green-200">
                  <button
                    onClick={onCreateInvoice}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium shadow-sm"
                  >
                    Fatura Oluştur
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
