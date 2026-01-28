import { useState, useCallback } from 'react'
import type { PriceCalculationResult } from '@/lib/types'

export function usePriceCalculation() {
  const [calculationResult, setCalculationResult] = useState<PriceCalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculatePrice = useCallback(async (
    shippingId: number,
    shippingNumber: string,
    invoiceType: 'LIFO' | 'SATIS_FATURASI'
  ) => {
    try {
      setIsCalculating(true)
      
      const response = await fetch(`/api/shipping/${shippingId}/calculate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingNumber,
          invoiceType
        })
      })

      const result = await response.json()
      
      if (!response.ok || !result.success) {
        const errorMessage = result.error || 'Fiyat hesaplama başarısız'
        throw new Error(errorMessage)
      }
      
      setCalculationResult(result.data)
      return result.data
    } catch (error) {
      console.error('Fiyat hesaplama hatası:', error)
      const errorMessage = error instanceof Error ? error.message : 'Fiyat hesaplama sırasında hata oluştu'
      throw new Error(errorMessage)
    } finally {
      setIsCalculating(false)
    }
  }, [])

  const resetCalculation = useCallback(() => {
    setCalculationResult(null)
  }, [])

  const createInvoice = useCallback(async (
    shippingId: number,
    shippingNumber: string,
    priceData: PriceCalculationResult
  ) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingId,
          shippingNumber,
          priceCalculation: {
            calculatedPrice: priceData.calculatedPrice,
            invoiceType: priceData.invoiceType,
            breakdown: priceData.breakdown
          }
        })
      })

      if (!response.ok) {
        throw new Error('Fatura oluşturma başarısız')
      }

      const result = await response.json()
      return result.data.invoice
    } catch (error) {
      console.error('Fatura oluşturma hatası:', error)
      throw error
    }
  }, [])

  const getLatestCalculation = useCallback(async (shippingId: number) => {
    try {
      const response = await fetch(`/api/shipping/${shippingId}/latest-calculation`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Hesaplama sonucu alınamadı')
      }

      const result = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error('Hesaplama sonucu bulunamadı')
      }

      return result.data
    } catch (error) {
      console.error('Hesaplama sonucu alma hatası:', error)
      throw error
    }
  }, [])

  return {
    calculationResult,
    isCalculating,
    calculatePrice,
    resetCalculation,
    createInvoice,
    getLatestCalculation,
    setCalculationResult
  }
}
