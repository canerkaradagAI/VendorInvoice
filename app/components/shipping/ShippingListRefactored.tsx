'use client'

import { useState, useCallback, useMemo } from 'react'
import { useShippingDocuments } from './hooks/useShippingDocuments'
import { useShippingItems } from './hooks/useShippingItems'
import { usePriceCalculation } from './hooks/usePriceCalculation'
import { ShippingTable } from './ShippingTable'
import { PriceCalculationModal } from './PriceCalculationModal'
import { Pagination } from '../common/Pagination'
import type { PriceCalculationResult } from '@/lib/types'

interface ShippingListProps {
  filters: {
    company: string
    supplier: string
    shippingNumber: string
    status: string
  }
}

interface SelectedShipping {
  id: number
  shipping_number: string
  supplier_name: string
  supplier_id?: number
  shipping_date: string
  notes?: string
  company?: string
  status: string
}

export function ShippingListRefactored({ filters }: ShippingListProps) {
  const {
    shippingDocuments,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    limit,
    refetch
  } = useShippingDocuments({ filters })

  const {
    shippingItems,
    loadingItems,
    manualPrices,
    fetchShippingItems,
    updateManualPrice
  } = useShippingItems()

  const {
    calculationResult,
    isCalculating,
    calculatePrice,
    resetCalculation,
    createInvoice,
    getLatestCalculation,
    setCalculationResult
  } = usePriceCalculation()

  const [showPriceModal, setShowPriceModal] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState<SelectedShipping | null>(null)
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false)
  const [readOnlyDetails, setReadOnlyDetails] = useState(false)
  const [billingMethod, setBillingMethod] = useState<string | null>(null)
  const [modalType, setModalType] = useState<'invoice' | 'manual'>('invoice')

  const handlePriceCalculation = useCallback((doc: any) => {
    setSelectedShipping(doc)
    setShowPriceModal(true)
    resetCalculation()
  }, [resetCalculation])

  const handleCalculateLIFO = useCallback(async () => {
    if (!selectedShipping) return
    
    try {
      setBillingMethod('LIFO')
      await calculatePrice(selectedShipping.id, selectedShipping.shipping_number, 'LIFO')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fiyat hesaplama sırasında hata oluştu'
      alert(errorMessage)
    }
  }, [selectedShipping, calculatePrice])

  const handleCalculateInvoice = useCallback(() => {
    setModalType('invoice')
    setReadOnlyDetails(false)
    setShowItemDetailsModal(true)
    setBillingMethod('Faturadan')
  }, [])

  const handleCalculateManual = useCallback(() => {
    setModalType('manual')
    setReadOnlyDetails(false)
    setShowItemDetailsModal(true)
    setBillingMethod('Manuel')
  }, [])

  const handleShowDetails = useCallback(() => {
    setReadOnlyDetails(true)
    setShowItemDetailsModal(true)
  }, [])

  const handleCreateInvoiceDirectly = useCallback(async (doc: any) => {
    try {
      const calculationData = await getLatestCalculation(doc.id)
      setSelectedShipping(doc)
      const invoice = await createInvoice(doc.id, doc.shipping_number, calculationData)
      alert(`Fatura başarıyla oluşturuldu! Fatura No: ${invoice.invoice_number}`)
      refetch()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fatura oluşturma sırasında hata oluştu'
      alert(errorMessage)
    }
  }, [getLatestCalculation, createInvoice, refetch])

  const handleCreateInvoiceFromModal = useCallback(() => {
    if (calculationResult && selectedShipping) {
      const invoiceType = calculationResult.invoiceType === 'LIFO' ? 'LIFO' : 'SATIS_FATURASI'
      createInvoice(selectedShipping.id, selectedShipping.shipping_number, calculationResult)
        .then((invoice) => {
          alert(`Fatura başarıyla oluşturuldu! Fatura No: ${invoice.invoice_number}`)
          setShowPriceModal(false)
          resetCalculation()
          refetch()
        })
        .catch((error) => {
          alert('Fatura oluşturma sırasında hata oluştu')
        })
    }
  }, [calculationResult, selectedShipping, createInvoice, resetCalculation, refetch])

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">⚠️ Hata</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">İrsaliye Listesi</h2>
            </div>
            <p className="text-sm text-gray-600">
              Toplam {total} irsaliye bulundu (Sayfa {currentPage} / {totalPages})
            </p>
          </div>
        </div>

        <ShippingTable
          documents={shippingDocuments}
          loading={loading}
          onPriceCalculation={handlePriceCalculation}
          onCreateInvoice={handleCreateInvoiceDirectly}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          limit={limit}
          loading={loading}
          onPageChange={setCurrentPage}
        />
      </div>

      <PriceCalculationModal
        show={showPriceModal}
        selectedShipping={selectedShipping}
        calculationResult={calculationResult}
        isCalculating={isCalculating}
        billingMethod={billingMethod}
        onClose={() => setShowPriceModal(false)}
        onCalculateLIFO={handleCalculateLIFO}
        onCalculateInvoice={handleCalculateInvoice}
        onCalculateManual={handleCalculateManual}
        onShowDetails={handleShowDetails}
        onCreateInvoice={handleCreateInvoiceFromModal}
      />

      {/* ItemDetailsModal ve InvoiceSelectionModal burada olacak - şu an sadece temel yapıyı oluşturuyorum */}
    </>
  )
}
