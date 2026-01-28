'use client'

import { useState, useEffect } from 'react'

interface ShippingDocument {
  id: number
  shipping_number: string
  supplier_name: string
  supplier_code: string
  supplier_id?: number
  shipping_date: string
  total_amount: number
  item_count: number
  status: 'pending' | 'calculated' | 'invoiced'
  notes?: string
  company?: string
  brand?: string
  invoice_number?: string
}

interface ShippingListProps {
  filters: {
    company: string
    supplier: string
    shippingNumber: string
    status: string
  }
}

export function ShippingList({ filters }: ShippingListProps) {
  const [shippingDocuments, setShippingDocuments] = useState<ShippingDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState<ShippingDocument | null>(null)
  const [showManualModal, setShowManualModal] = useState(false)
  const [manualPrices, setManualPrices] = useState<{[key: number]: number}>({})
  const [calculationResult, setCalculationResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false)
  const [readOnlyDetails, setReadOnlyDetails] = useState(false)
  const [billingMethod, setBillingMethod] = useState<string | null>(null)
  const [shippingItems, setShippingItems] = useState<Array<{
    id: number
    product_code: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>>([])
  const [loadingItems, setLoadingItems] = useState(false)
  
  // Ürün kodunu parse et (örn: "183177 WNT" -> {code: "183177", color: "WNT", size: "-"})
  // veya "183177-WNT" -> {code: "183177", color: "WNT", size: "-"}
  const parseProductCode = (productCode: string) => {
    if (!productCode) {
      return { code: '-', color: '-', size: '-' }
    }
    
    // Önce boşluk veya tire ile ayır
    const parts = productCode.trim().split(/[\s-]+/)
    
    if (parts.length >= 2) {
      // İlk kısım ürün kodu, ikinci kısım renk, üçüncü varsa beden
      return {
        code: parts[0],
        color: parts[1] || '-',
        size: parts[2] || '-'
      }
    } else if (parts.length === 1) {
      // Sadece kod varsa
      return {
        code: parts[0],
        color: '-',
        size: '-'
      }
    }
    
    return {
      code: productCode,
      color: '-',
      size: '-'
    }
  }

  const computeTotalsFromItems = () => {
    const baseAmount = shippingItems.reduce((sum, item) => {
      const price = manualPrices[item.id] || item.unit_price || 0
      return sum + price * item.quantity
    }, 0)

    const taxAmount = baseAmount * 0.18
    const discountAmount = 0
    const calculatedPrice = baseAmount + taxAmount - discountAmount

    setCalculationResult({
      calculatedPrice,
      invoiceType: modalType === 'invoice' ? 'SATIS_FATURASI' : 'MANUAL',
      breakdown: { baseAmount, taxAmount, discountAmount },
      calculation: {
        method: modalType === 'invoice' ? 'Fatura Birim Fiyatı' : 'Manuel Birim Fiyatı',
        details:
          modalType === 'invoice'
            ? 'Seçilen alış faturalarındaki birim fiyatlara göre hesaplandı'
            : 'Manuel girilen birim fiyatlara göre hesaplandı',
      },
    })
  }
  const [modalType, setModalType] = useState<'invoice' | 'manual'>('invoice')
  const [showInvoiceSelectionModal, setShowInvoiceSelectionModal] = useState(false)
  const [selectedItemForInvoice, setSelectedItemForInvoice] = useState<{id: number, productCode: string, quantity: number} | null>(null)
  const [selectedInvoices, setSelectedInvoices] = useState<{[key: number]: {invoiceNo: string, unitPrice: number, quantity: number}[]}>({})
  const [purchaseInvoices, setPurchaseInvoices] = useState<Array<{
    id: number;
    invoice_number: string;
    invoice_date: string;
    items: Array<{
      product_code: string;
      quantity: number;
      unit_price: number;
    }>;
  }>>([])
  const [loadingInvoices, setLoadingInvoices] = useState(false)

  useEffect(() => {
    setCurrentPage(1) // Filtre değiştiğinde sayfayı sıfırla
    fetchShippingDocuments(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  useEffect(() => {
    if (currentPage > 0) {
      fetchShippingDocuments(currentPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  // İrsaliye detaylarını çek
  const fetchShippingItems = async (shippingId: number) => {
    try {
      setLoadingItems(true)
      const response = await fetch(`/api/shipping/${shippingId}/items`)
      if (!response.ok) {
        throw new Error('İrsaliye detayları yüklenemedi')
      }
      const data = await response.json()
      if (data.success) {
        setShippingItems(data.data)
        // Mevcut birim fiyatları yükle
        const initialPrices: {[key: number]: number} = {}
        data.data.forEach((item: any) => {
          if (item.unit_price) {
            initialPrices[item.id] = item.unit_price
          }
        })
        setManualPrices(initialPrices)
      }
    } catch (err) {
      console.error('İrsaliye detayları yükleme hatası:', err)
    } finally {
      setLoadingItems(false)
    }
  }

  // Modal açıldığında items'ı çek
  useEffect(() => {
    if (showItemDetailsModal && selectedShipping) {
      fetchShippingItems(selectedShipping.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showItemDetailsModal, selectedShipping])

  const fetchShippingDocuments = async (page: number = currentPage) => {
    try {
      setLoading(true)
      
      // Filtreleri URL parametrelerine çevir
      const params = new URLSearchParams()
      if (filters.shippingNumber) params.append('shippingNumber', filters.shippingNumber)
      if (filters.status) params.append('status', filters.status)
      if (filters.supplier) params.append('supplierCode', filters.supplier)
      if (filters.company) params.append('companyId', filters.company)
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      
      const response = await fetch(`/api/shipping?${params.toString()}`)
      if (!response.ok) {
        throw new Error('İrsaliye belgeleri yüklenemedi')
      }
      const data = await response.json()
      
      // API verisini frontend formatına çevir
      const enrichedData = data.data.map((doc: any) => ({
        id: parseInt(doc.id),
        shipping_number: doc.shippingNumber,
        supplier_name: doc.supplierName,
        supplier_code: doc.supplierCode || '',
        supplier_id: doc.supplierId || undefined,
        shipping_date: doc.date,
        total_amount: doc.totalAmount,
        item_count: doc.itemCount,
        // API durumlarını doğrudan kullan: 'pending' | 'calculated' | 'invoiced'
        status: doc.status === 'calculated' ? 'calculated' : doc.status === 'invoiced' ? 'invoiced' : 'pending',
        notes: '',
        company: doc.companyName || 'Merkez',
        brand: doc.brandName || 'Marka A',
        invoice_number: doc.invoiceNumber || undefined
      }))
      
      setShippingDocuments(enrichedData)
      
      // Pagination bilgilerini güncelle
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1)
        setTotal(data.pagination.total || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getCompanyName = (supplierId: string) => {
    const companies: { [key: string]: string } = {
      '1': 'Merkez',
      '2': 'Ankara Şube', 
      '3': 'İzmir Şube',
      '4': 'İstanbul Şube',
      '5': 'Merkez'
    }
    return companies[supplierId] || 'Merkez'
  }

  const getBrandName = (supplierId: string) => {
    const brands: { [key: string]: string } = {
      '1': 'Marka A',
      '2': 'Marka B',
      '3': 'Marka C', 
      '4': 'Marka D',
      '5': 'Marka E'
    }
    return brands[supplierId] || 'Marka A'
  }

      const getStatusColor = (status: string) => {
        switch (status) {
          case 'invoiced':
            return 'bg-blue-100 text-blue-800'
          case 'calculated':
            return 'bg-green-100 text-green-800'
          case 'pending':
          default:
            return 'bg-yellow-100 text-yellow-800'
        }
      }

      const getStatusText = (status: string) => {
        switch (status) {
          case 'invoiced':
            return 'Faturalandırıldı'
          case 'calculated':
            return 'Hesaplandı'
          case 'pending':
          default:
            return 'Beklemede'
        }
      }

  const handleInvoiceSelection = async (itemId: number, productCode: string) => {
    const item = shippingItems.find(i => i.id === itemId)
    if (!item || !selectedShipping) return
    
    // Supplier ID'yi al
    if (!selectedShipping.supplier_id) {
      alert('Tedarikçi bilgisi bulunamadı')
      return
    }
    
    setSelectedItemForInvoice({id: itemId, productCode, quantity: item.quantity})
    setShowInvoiceSelectionModal(true)
    
    // Tedarikçi satış faturalarını çek
    try {
      setLoadingInvoices(true)
      // Mevcut birim fiyatı da gönder ki fatura bulunamazsa onu kullanabilelim
      const url = `/api/suppliers/${selectedShipping.supplier_id}/purchase-invoices?productCode=${encodeURIComponent(productCode)}&unitPrice=${item.unit_price || 0}&quantity=${item.quantity}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log('[Frontend] Gelen faturalar:', data.data)
          setPurchaseInvoices(data.data)
        } else {
          console.error('[Frontend] API başarısız:', data)
        }
      } else {
        console.error('[Frontend] API hatası:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Faturalar yüklenemedi:', error)
      alert('Faturalar yüklenirken hata oluştu')
    } finally {
      setLoadingInvoices(false)
    }
  }

  const handleInvoiceSelect = (invoiceId: number, invoiceNumber: string, unitPrice: number, availableQuantity: number) => {
    if (!selectedItemForInvoice) return
    
    const currentSelections = selectedInvoices[selectedItemForInvoice.id] || []
    const selectedQuantity = currentSelections.reduce((sum, sel) => sum + sel.quantity, 0)
    const remainingQuantity = selectedItemForInvoice.quantity - selectedQuantity
    
    if (remainingQuantity <= 0) {
      alert('İade miktarı tamamlandı')
      return
    }
    
    const takeQuantity = Math.min(remainingQuantity, availableQuantity)
    
    const newSelection = {
      invoiceNo: invoiceNumber,
      unitPrice: unitPrice,
      quantity: takeQuantity
    }
    
    setSelectedInvoices(prev => ({
      ...prev,
      [selectedItemForInvoice.id]: [...currentSelections, newSelection]
    }))
    
    // Ortalama birim fiyatı hesapla
    const allSelections = [...currentSelections, newSelection]
    const totalAmount = allSelections.reduce((sum, sel) => sum + (sel.unitPrice * sel.quantity), 0)
    const totalQuantity = allSelections.reduce((sum, sel) => sum + sel.quantity, 0)
    const avgUnitPrice = totalQuantity > 0 ? totalAmount / totalQuantity : 0
    
    setManualPrices(prev => ({
      ...prev,
      [selectedItemForInvoice.id]: avgUnitPrice
    }))
  }

  const handleInvoiceSelectionComplete = () => {
    if (!selectedItemForInvoice) return
    
    const currentSelections = selectedInvoices[selectedItemForInvoice.id] || []
    const selectedQuantity = currentSelections.reduce((sum, sel) => sum + sel.quantity, 0)
    
    if (selectedQuantity < selectedItemForInvoice.quantity) {
      const remaining = selectedItemForInvoice.quantity - selectedQuantity
      alert(`Kalan ${remaining} adet için başka bir fatura seçin`)
      return
    }
    
    setShowInvoiceSelectionModal(false)
    setSelectedItemForInvoice(null)
  }

  const handlePriceCalculation = (doc: ShippingDocument) => {
    setSelectedShipping(doc)
    setShowPriceModal(true)
    setCalculationResult(null)
  }

  const handleCreateInvoiceDirectly = async (doc: ShippingDocument) => {
    try {
      // En son hesaplama sonucunu al
      const response = await fetch(`/api/shipping/${doc.id}/latest-calculation`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Hesaplama sonucu alınamadı')
      }

      const result = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error('Hesaplama sonucu bulunamadı. Lütfen önce fiyat hesaplama yapın.')
      }

      // Mevcut createInvoice fonksiyonunu kullan
      setSelectedShipping(doc)
      await createInvoice(result.data, result.data.invoiceType)
      
    } catch (error) {
      console.error('Fatura oluşturma hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Fatura oluşturma sırasında hata oluştu'
      alert(errorMessage)
    }
  }

  const handleCalculate = async (invoiceType: 'LIFO' | 'SATIS_FATURASI') => {
    if (!selectedShipping) return
    
    try {
      setIsCalculating(true)
      
      const response = await fetch(`/api/shipping/${selectedShipping.id}/calculate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingNumber: selectedShipping.shipping_number,
          invoiceType: invoiceType
        })
      })

      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const errorMessage = result.error || 'Fiyat hesaplama başarısız'
        throw new Error(errorMessage)
      }
      
      setCalculationResult(result.data)
      
    } catch (error) {
      console.error('Fiyat hesaplama hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Fiyat hesaplama sırasında hata oluştu'
      alert(errorMessage)
    } finally {
      setIsCalculating(false)
    }
  }

  const createInvoice = async (priceData: any, invoiceType: string) => {
    if (!selectedShipping) return
    
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingId: selectedShipping.id,
          shippingNumber: selectedShipping.shipping_number,
          priceCalculation: {
            calculatedPrice: priceData.calculatedPrice,
            invoiceType: invoiceType,
            breakdown: priceData.breakdown
          }
        })
      })

      if (!response.ok) {
        throw new Error('Fatura oluşturma başarısız')
      }

      const result = await response.json()
      alert(`Fatura başarıyla oluşturuldu! Fatura No: ${result.data.invoice.invoice_number}`)
      
      // Sayfayı yenile
      fetchShippingDocuments(currentPage)
      // Modal'ı kapat
      setShowPriceModal(false)
      setCalculationResult(null)
      
    } catch (error) {
      console.error('Fatura oluşturma hatası:', error)
      alert('Fatura oluşturma sırasında hata oluştu')
    }
  }

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
            onClick={() => fetchShippingDocuments(currentPage)}
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

        {shippingDocuments.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-2">📄</div>
            <p className="text-gray-600">Henüz irsaliye belgesi bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Şirket
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Marka
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    İrsaliye No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                    Tedarikçi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[110px]">
                    Tarih
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[110px]">
                    Ürün Sayısı
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                    Toplam Tutar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    Fatura No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shippingDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {doc.company || 'Merkez'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {doc.brand || 'Marka A'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doc.shipping_number}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-[300px] truncate" title={doc.supplier_name || '-'}>
                        {doc.supplier_name || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {doc.shipping_date ? new Date(doc.shipping_date).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {doc.item_count || 0}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {doc.status === 'invoiced' || doc.status === 'calculated' ? `₺${(doc.total_amount || 0).toLocaleString('tr-TR')}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {doc.invoice_number || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      {doc.status === 'pending' && (
                        <button 
                          onClick={() => handlePriceCalculation(doc)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md font-medium"
                        >
                          Fiyat Hesapla
                        </button>
                      )}
                      {doc.status === 'calculated' && (
                        <button 
                          onClick={() => handleCreateInvoiceDirectly(doc)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium shadow-sm"
                        >
                          Fatura Oluştur
                        </button>
                      )}
                      {doc.status === 'invoiced' && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sayfalama Kontrolleri */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{(currentPage - 1) * limit + 1}</span>
                {' - '}
                <span className="font-medium">{Math.min(currentPage * limit, total)}</span>
                {' / '}
                <span className="font-medium">{total}</span>
                {' kayıt gösteriliyor'}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İlk
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Sayfa numaraları */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Son
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price Calculation Modal */}
      {showPriceModal && selectedShipping && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Fiyat Hesaplama - {selectedShipping.shipping_number}
              </h3>
              <button
                onClick={() => setShowPriceModal(false)}
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
                    onClick={() => { setBillingMethod('LIFO'); handleCalculate('LIFO') }}
                    disabled={isCalculating}
                    className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCalculating ? 'Hesaplanıyor...' : 'LIFO\'dan Hesapla'}
                  </button>
                  <button 
                    onClick={() => {
                      setModalType('invoice')
                      setReadOnlyDetails(false)
                      setShowItemDetailsModal(true)
                      setBillingMethod('Faturadan')
                    }}
                    disabled={isCalculating}
                    className="flex-1 bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 px-6 py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCalculating ? 'Hesaplanıyor...' : 'Fatura\'dan Hesapla'}
                  </button>
                  <button 
                    onClick={() => {
                      setModalType('manual')
                      setReadOnlyDetails(false)
                      setShowItemDetailsModal(true)
                      setBillingMethod('Manuel')
                    }}
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
                          <span className="font-medium">Ana Tutar:</span> ₺{calculationResult.breakdown.baseAmount.toLocaleString('tr-TR')}
                        </div>
                        <div>
                          <span className="font-medium">KDV:</span> ₺{calculationResult.breakdown.taxAmount.toLocaleString('tr-TR')}
                        </div>
                        <div>
                          <span className="font-medium">İndirim:</span> ₺{calculationResult.breakdown.discountAmount.toLocaleString('tr-TR')}
                        </div>
                        <div>
                          <span className="font-medium">Toplam:</span> ₺{calculationResult.calculatedPrice.toLocaleString('tr-TR')}
                        </div>
                      </div>
                      <p className="text-xs text-green-900 mt-2 font-medium">
                        Hesaplama Yöntemi : {billingMethod || (calculationResult?.invoiceType === 'LIFO' ? 'LIFO' : (modalType === 'invoice' ? 'Faturadan' : 'Manuel'))}
                      </p>
                    </div>
                  <button 
                      onClick={() => { setReadOnlyDetails(true); setShowItemDetailsModal(true) }}
                      className="ml-4 shrink-0 px-3 py-1 rounded-md bg-green-600 text-white text-xs hover:bg-green-700"
                    >
                      Kalem Detaylarını Göster
                    </button>
                  </div>
                  {selectedShipping?.status === 'calculated' && (
                    <div className="flex justify-end pt-3 border-t border-green-200">
                      <button
                        onClick={() => {
                          if (calculationResult) {
                            const invoiceType = calculationResult.invoiceType === 'LIFO' ? 'LIFO' : 'SATIS_FATURASI'
                            createInvoice(calculationResult, invoiceType)
                            setShowPriceModal(false)
                            setCalculationResult(null)
                          }
                        }}
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
      )}

      {/* Kalem Detayları Modal */}
      {showItemDetailsModal && selectedShipping && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Kalem Detayları - {selectedShipping.shipping_number}
              </h3>
              <button
                onClick={() => setShowItemDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* LIFO Hesaplama Sonuçları - Sadece LIFO hesaplama yapıldıysa ve itemCalculations varsa göster */}
              {readOnlyDetails && calculationResult?.itemCalculations && calculationResult.itemCalculations.length > 0 && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-blue-900 mb-3">LIFO Hesaplama Detayları</h4>
                  <div className="space-y-4">
                    {calculationResult.itemCalculations.map((itemCalc: any, idx: number) => {
                      const parsed = parseProductCode(itemCalc.productCode)
                      return (
                        <div key={idx} className="bg-white rounded-md p-3 border border-blue-100">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">{parsed.code}</span>
                              {parsed.color !== '-' && <span className="text-sm text-gray-600 ml-2">({parsed.color})</span>}
                              <span className="text-sm text-gray-600 ml-2">- {itemCalc.quantity} adet</span>
                            </div>
                            <span className="font-semibold text-blue-900">
                              Toplam: ₺{itemCalc.total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {itemCalc.lifoItems.map((lifoItem: any, lifoIdx: number) => (
                              <div key={lifoIdx} className="text-sm text-gray-700 pl-4 border-l-2 border-blue-300">
                                <span className="font-medium">{lifoItem.invoiceNumber}</span>
                                {' - '}
                                <span>{lifoItem.quantity} adet × ₺{lifoItem.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                {' = '}
                                <span className="font-medium">₺{lifoItem.total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Kodu</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Beden</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adet</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referans Fatura No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingItems ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                            Yükleniyor...
                          </div>
                        </td>
                      </tr>
                    ) : shippingItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          İrsaliye detayı bulunamadı
                        </td>
                      </tr>
                    ) : (
                      shippingItems.map((item) => {
                        const parsed = parseProductCode(item.product_code)
                        
                        // LIFO hesaplama sonuçları varsa onları kullan
                        const lifoItemCalc = calculationResult?.itemCalculations?.find((calc: any) => calc.productCode === item.product_code)
                        const unitPrice = lifoItemCalc 
                          ? (lifoItemCalc.total / lifoItemCalc.quantity) // LIFO'dan gelen ortalama birim fiyat
                          : (manualPrices[item.id] || item.unit_price || 0)
                        const totalPrice = unitPrice * item.quantity
                        
                        return (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">{parsed.code}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{parsed.color}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{parsed.size}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {lifoItemCalc ? (
                                <div className="space-y-1">
                                  {lifoItemCalc.lifoItems.map((lifoItem: any, idx: number) => (
                                    <div key={idx} className="text-xs">
                                      {lifoItem.invoiceNumber} ({lifoItem.quantity} adet)
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                (Array.isArray(selectedInvoices[item.id]) && selectedInvoices[item.id].length > 0 ? selectedInvoices[item.id][0].invoiceNo : (selectedInvoices[item.id] as any)?.invoiceNo) || '-'
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {readOnlyDetails || lifoItemCalc ? (
                                <span className="text-sm text-gray-900">₺{unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              ) : (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={manualPrices[item.id] !== undefined ? manualPrices[item.id] : (item.unit_price || '')}
                                  onChange={(e) => setManualPrices(prev => ({...prev, [item.id]: parseFloat(e.target.value) || 0}))}
                                  className={`w-24 px-2 py-1 border rounded text-sm ${modalType === 'invoice' ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300'}`}
                                  placeholder="0.00"
                                  disabled={modalType === 'invoice' || readOnlyDetails}
                                />
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {modalType === 'invoice' && !readOnlyDetails && !lifoItemCalc ? (
                                <button 
                                  onClick={() => handleInvoiceSelection(item.id, item.product_code)}
                                  className="text-blue-600 hover:text-blue-900 text-sm bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                                >
                                  Fatura Seç
                                </button>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ₺{totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
      {/* Tutar Hesapla butonu - LIFO hesaplama yapıldığında gözükmesin */}
              {!(readOnlyDetails && calculationResult?.itemCalculations && calculationResult.itemCalculations.length > 0) && (
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={() => {
                      computeTotalsFromItems()
                      // Hesaplanan toplamları DB'ye 'Hesaplandı' olarak yaz
                      const totals = (() => {
                        const base = shippingItems.reduce((sum, item) => {
                          const price = manualPrices[item.id] || item.unit_price || 0
                          return sum + price * item.quantity
                        }, 0)
                        const tax = base * 0.18
                        const discount = 0
                        const total = base + tax - discount
                        return { base, tax, discount, total }
                      })()
                      fetch(`/api/shipping/${selectedShipping?.id}/mark-calculated`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          totalAmount: totals.total,
                          baseAmount: totals.base,
                          taxAmount: totals.tax,
                          discountAmount: totals.discount,
                          invoiceType: modalType === 'invoice' ? 'SATIS_FATURASI' : 'MANUAL',
                          method: modalType === 'invoice' ? 'Fatura Birim Fiyatı' : 'Manuel Birim Fiyatı',
                          details: modalType === 'invoice' ? 'Fatura fiyatlarıyla hesaplandı' : 'Manuel girilen fiyatlarla hesaplandı'
                        })
                      }).then(() => {
                        setShowItemDetailsModal(false)
                        // Listeyi yenile
                        fetchShippingDocuments(currentPage)
                      })
                    }}
                    disabled={loadingItems || shippingItems.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tutar Hesapla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fatura Seçimi Modal */}
      {showInvoiceSelectionModal && selectedItemForInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Fatura Seçimi - {selectedItemForInvoice.productCode}
              </h3>
              <button
                onClick={() => {
                  setShowInvoiceSelectionModal(false)
                  setSelectedItemForInvoice(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{selectedItemForInvoice.productCode}</strong> ürünü için daha önceki alış faturalarınız:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>İade Edilecek Miktar:</strong> {selectedItemForInvoice.quantity} adet
                  </p>
                  {(() => {
                    const currentSelections = selectedInvoices[selectedItemForInvoice.id] || []
                    const selectedQuantity = currentSelections.reduce((sum, sel) => sum + sel.quantity, 0)
                    const remainingQuantity = selectedItemForInvoice.quantity - selectedQuantity
                    return (
                      <p className={`text-sm mt-1 ${remainingQuantity > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                        <strong>Seçilen:</strong> {selectedQuantity} adet
                        {remainingQuantity > 0 && (
                          <span className="ml-2">⚠️ Kalan: {remainingQuantity} adet</span>
                        )}
                        {remainingQuantity === 0 && (
                          <span className="ml-2">✓ Tamamlandı</span>
                        )}
                      </p>
                    )
                  })()}
                </div>
                
                {/* Seçilen Faturalar Listesi */}
                {(() => {
                  const currentSelections = selectedInvoices[selectedItemForInvoice.id] || []
                  if (currentSelections.length > 0) {
                    return (
                      <div className="mb-4 bg-gray-50 border border-gray-200 rounded-md p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Seçilen Faturalar:</p>
                        <ul className="space-y-1">
                          {currentSelections.map((sel, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              ✓ {sel.invoiceNo} - {sel.quantity} adet × ₺{sel.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} = ₺{(sel.quantity * sel.unitPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
              
              {loadingInvoices ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Faturalar yükleniyor...</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mevcut Adet</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {purchaseInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              Bu ürün için fatura bulunamadı
                            </td>
                          </tr>
                        ) : (
                          purchaseInvoices.map((invoice) => {
                            // Ürün kodunu normalize et ve eşleştir
                            const normalizeCode = (code: string) => code.trim().replace(/\s+/g, '-').toUpperCase()
                            const searchCode = normalizeCode(selectedItemForInvoice.productCode)
                            const item = invoice.items.find(i => {
                              const itemCode = normalizeCode(i.product_code)
                              return itemCode === searchCode || itemCode.startsWith(searchCode.split('-')[0] + '-')
                            })
                            if (!item) return null
                            
                            const currentSelections = selectedInvoices[selectedItemForInvoice.id] || []
                            const selectedQuantity = currentSelections.reduce((sum, sel) => sum + sel.quantity, 0)
                            const remainingQuantity = selectedItemForInvoice.quantity - selectedQuantity
                            const alreadySelected = currentSelections.some(sel => sel.invoiceNo === invoice.invoice_number)
                            const availableQuantity = item.quantity
                            
                            return (
                              <tr key={invoice.id} className={alreadySelected ? 'bg-gray-50' : ''}>
                                <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoice_number}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {new Date(invoice.invoice_date).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  ₺{item.unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{availableQuantity}</td>
                                <td className="px-4 py-3">
                                  {remainingQuantity > 0 ? (
                                    <button 
                                      onClick={() => handleInvoiceSelect(invoice.id, invoice.invoice_number, item.unit_price, availableQuantity)}
                                      disabled={alreadySelected}
                                      className={`text-sm px-3 py-1 rounded ${
                                        alreadySelected
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                          : 'text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100'
                                      }`}
                                    >
                                      {alreadySelected ? 'Seçildi' : 'Seç'}
                                    </button>
                                  ) : (
                                    <span className="text-sm text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowInvoiceSelectionModal(false)
                        setSelectedItemForInvoice(null)
                        // Seçimleri temizle
                        if (selectedItemForInvoice) {
                          setSelectedInvoices(prev => {
                            const newState = { ...prev }
                            delete newState[selectedItemForInvoice.id]
                            return newState
                          })
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleInvoiceSelectionComplete}
                      disabled={(() => {
                        if (!selectedItemForInvoice) return true
                        const currentSelections = selectedInvoices[selectedItemForInvoice.id] || []
                        const selectedQuantity = currentSelections.reduce((sum, sel) => sum + sel.quantity, 0)
                        return selectedQuantity < selectedItemForInvoice.quantity
                      })()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tamam
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

