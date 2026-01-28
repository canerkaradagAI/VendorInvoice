import { useState, useEffect, useCallback } from 'react'
import type { ShippingDocument } from '@/lib/types'
import { mapDbStatusToUI } from '@/lib/utils'

interface UseShippingDocumentsProps {
  filters: {
    company: string
    supplier: string
    shippingNumber: string
    status: string
  }
}

interface ShippingDocumentUI extends Omit<ShippingDocument, 'status'> {
  status: 'pending' | 'calculated' | 'invoiced'
  supplier_name: string
  supplier_code: string
  company?: string
  brand?: string
  invoice_number?: string
}

export function useShippingDocuments({ filters }: UseShippingDocumentsProps) {
  const [shippingDocuments, setShippingDocuments] = useState<ShippingDocumentUI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const fetchShippingDocuments = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true)
      setError(null)
      
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
      
      const enrichedData = data.data.map((doc: any) => ({
        id: parseInt(doc.id),
        shipping_number: doc.shippingNumber,
        supplier_name: doc.supplierName,
        supplier_code: doc.supplierCode || '',
        supplier_id: doc.supplierId || undefined,
        shipping_date: doc.date,
        total_amount: doc.totalAmount,
        item_count: doc.itemCount,
        status: doc.status === 'calculated' ? 'calculated' : doc.status === 'invoiced' ? 'invoiced' : 'pending',
        notes: '',
        company: doc.companyName || 'Merkez',
        brand: doc.brandName || 'Marka A',
        invoice_number: doc.invoiceNumber || undefined,
        created_at: doc.created_at || '',
        updated_at: doc.updated_at || ''
      }))
      
      setShippingDocuments(enrichedData)
      
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1)
        setTotal(data.pagination.total || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage, limit])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  useEffect(() => {
    if (currentPage > 0) {
      fetchShippingDocuments(currentPage)
    }
  }, [currentPage, fetchShippingDocuments])

  const refetch = useCallback(() => {
    fetchShippingDocuments(currentPage)
  }, [fetchShippingDocuments, currentPage])

  return {
    shippingDocuments,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    limit,
    refetch
  }
}
