import { useState, useCallback } from 'react'
import type { ShippingItem } from '@/lib/types'

export function useShippingItems() {
  const [shippingItems, setShippingItems] = useState<ShippingItem[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [manualPrices, setManualPrices] = useState<{[key: number]: number}>({})

  const fetchShippingItems = useCallback(async (shippingId: number) => {
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
        data.data.forEach((item: ShippingItem) => {
          if (item.unit_price) {
            initialPrices[item.id] = item.unit_price
          }
        })
        setManualPrices(initialPrices)
      }
    } catch (err) {
      console.error('İrsaliye detayları yükleme hatası:', err)
      throw err
    } finally {
      setLoadingItems(false)
    }
  }, [])

  const updateManualPrice = useCallback((itemId: number, price: number) => {
    setManualPrices(prev => ({ ...prev, [itemId]: price }))
  }, [])

  const resetManualPrices = useCallback(() => {
    const initialPrices: {[key: number]: number} = {}
    shippingItems.forEach((item) => {
      if (item.unit_price) {
        initialPrices[item.id] = item.unit_price
      }
    })
    setManualPrices(initialPrices)
  }, [shippingItems])

  return {
    shippingItems,
    loadingItems,
    manualPrices,
    fetchShippingItems,
    updateManualPrice,
    resetManualPrices,
    setShippingItems
  }
}
