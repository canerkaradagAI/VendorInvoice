'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { debounce } from '@/lib/utils'

interface FilterPanelProps {
  onFilterChange: (filters: {
    company: string
    supplier: string
    shippingNumber: string
    status: string
  }) => void
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    company: '',
    supplier: '',
    shippingNumber: '',
    status: ''
  })
  
  const [companies, setCompanies] = useState<{id: string, code: string, name: string}[]>([])
  const [suppliers, setSuppliers] = useState<{id: number, supplier_code: string, supplier_name: string}[]>([])

  useEffect(() => {
    // Şirketleri API'den çek
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          console.log('Şirketler yüklendi:', data.data.length, 'şirket')
          setCompanies(data.data)
        } else {
          console.error('Şirketler API hatası:', data.error || 'Bilinmeyen hata')
        }
      })
      .catch(err => {
        console.error('Şirketler yüklenemedi:', err)
      })
  }, [])

  useEffect(() => {
    // Şirket seçildiğinde o şirkete ait tedarikçileri çek, seçilmediğinde tüm tedarikçileri göster
    const url = filters.company 
      ? `/api/suppliers?companyId=${filters.company}`
      : '/api/suppliers'
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuppliers(data.data)
        }
      })
      .catch(err => console.error('Tedarikçiler yüklenemedi:', err))
  }, [filters.company])

  const debouncedFilterChange = useMemo(
    () => debounce((newFilters: typeof filters) => {
      onFilterChange(newFilters)
    }, 500),
    [onFilterChange]
  )

  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    // Şirket değiştiğinde tedarikçi seçimini sıfırla
    if (key === 'company') {
      newFilters.supplier = ''
    }
    setFilters(newFilters)
    
    // İrsaliye numarası için debounce uygula
    if (key === 'shippingNumber') {
      debouncedFilterChange(newFilters)
    } else {
    onFilterChange(newFilters)
  }
  }, [filters, onFilterChange, debouncedFilterChange])

  const handleSearch = useCallback(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleRefresh = useCallback(() => {
    const clearedFilters = {
      company: '',
      supplier: '',
      shippingNumber: '',
      status: ''
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }, [onFilterChange])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm w-full">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900">İrsaliye Filtreleme</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şirket
          </label>
          <select
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Şirket seçin...</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tedarikçi
          </label>
          <select
            value={filters.supplier}
            onChange={(e) => handleFilterChange('supplier', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tedarikçi seçin...</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.supplier_code}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İrsaliye Numarası
          </label>
          <input
            type="text"
            value={filters.shippingNumber}
            onChange={(e) => handleFilterChange('shippingNumber', e.target.value)}
            placeholder="İrsaliye numarasını girin..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statü
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Statü seçin...</option>
            <option value="pending">Beklemede</option>
            <option value="calculated">Hesaplandı</option>
            <option value="invoiced">Faturalandırıldı</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>İrsaliye Listele</span>
        </button>
      </div>
    </div>
  )
}
