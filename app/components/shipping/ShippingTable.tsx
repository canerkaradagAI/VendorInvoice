import React, { useMemo } from 'react'
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils'

interface ShippingDocument {
  id: number
  shipping_number: string
  supplier_name: string
  supplier_code: string
  shipping_date: string
  total_amount: number
  item_count: number
  status: 'pending' | 'calculated' | 'invoiced'
  company?: string
  brand?: string
  invoice_number?: string
}

interface ShippingTableProps {
  documents: ShippingDocument[]
  loading: boolean
  onPriceCalculation: (doc: ShippingDocument) => void
  onCreateInvoice: (doc: ShippingDocument) => void
}

export const ShippingTable = React.memo(function ShippingTable({
  documents,
  loading,
  onPriceCalculation,
  onCreateInvoice
}: ShippingTableProps) {
  if (documents.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <div className="text-gray-400 mb-2">📄</div>
        <p className="text-gray-600">Henüz irsaliye belgesi bulunmuyor</p>
      </div>
    )
  }

  return (
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
          {documents.map((doc) => (
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
                {formatDate(doc.shipping_date)}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {doc.item_count || 0}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {doc.status === 'invoiced' || doc.status === 'calculated' 
                  ? formatCurrency(doc.total_amount || 0) 
                  : '-'
                }
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
                    onClick={() => onPriceCalculation(doc)}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md font-medium"
                  >
                    Fiyat Hesapla
                  </button>
                )}
                {doc.status === 'calculated' && (
                  <button 
                    onClick={() => onCreateInvoice(doc)}
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
  )
})
