'use client'

import { useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { FilterPanel } from "@/components/filter-panel"
import { ShippingList } from "@/components/shipping-list"

export default function HomePage() {
  const [filters, setFilters] = useState({
    company: '',
    supplier: '',
    shippingNumber: '',
    status: ''
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="w-full px-4 md:px-8 lg:px-12 py-8">
        <div className="w-full mx-auto space-y-8 max-w-[1920px]">
          <div>
            <h1 className="text-3xl font-bold text-balance">Tedarikçi İade İrsaliyesi Faturalandırma</h1>
          </div>

          <FilterPanel onFilterChange={handleFilterChange} />
          <ShippingList filters={filters} />
        </div>
      </main>
    </div>
  )
}
