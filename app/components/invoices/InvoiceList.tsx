'use client'

import { useState, useEffect } from 'react'
import type { Invoice } from '@/lib/types'
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils'

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [currentPage, searchTerm, statusFilter])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      params.append('page', currentPage.toString())
      params.append('limit', limit.toString())
      
      const response = await fetch(`/api/invoices?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Faturalar yüklenemedi')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setInvoices(data.data)
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1)
          setTotal(data.pagination.total || 0)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
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
            onClick={() => fetchInvoices()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filtreler */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Fatura numarası veya not ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="created">Oluşturuldu</option>
              <option value="sent">Gönderildi</option>
              <option value="paid">Ödendi</option>
              <option value="overdue">Gecikmiş</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İrsaliye No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oluşturma Tarihi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vade Tarihi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Fatura bulunamadı
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">-</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {invoice.invoice_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatCurrency(invoice.total_amount)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDate(invoice.created_date)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDate(invoice.due_date)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status as any)}`}>
                      {getStatusText(invoice.status as any)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      Görüntüle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam {total} fatura
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              <span className="text-sm text-gray-700">
                Sayfa {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
