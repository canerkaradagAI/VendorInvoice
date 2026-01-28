import { NextRequest, NextResponse } from "next/server"
import { getPurchaseInvoicesBySupplier, getPurchaseInvoiceItems } from "../../../../lib/database"
import { normalizeProductCode } from "../../../../lib/utils"
import { sql } from "@vercel/postgres"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supplierId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const productCode = searchParams.get("productCode") || undefined
    const unitPrice = searchParams.get("unitPrice") || undefined
    const quantity = searchParams.get("quantity") || undefined
    
    if (isNaN(supplierId)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz tedarikçi ID" },
        { status: 400 }
      )
    }

    // Tüm faturaları ve items'ları tek query'de getir (N+1 query problemi çözümü)
    const invoices = await getPurchaseInvoicesBySupplier(supplierId, productCode)
    
    if (invoices.length === 0) {
      // Hiç fatura yoksa ve mevcut fiyat varsa sanal fatura oluştur
      if (unitPrice && quantity && productCode) {
        const parsedUnitPrice = parseFloat(unitPrice)
        const parsedQuantity = parseInt(quantity)
        
        if (!isNaN(parsedUnitPrice) && !isNaN(parsedQuantity) && parsedUnitPrice > 0) {
          const currentDate = new Date().toISOString().split('T')[0]
          const invoicesWithItems = [{
            id: 0,
            invoice_number: 'MEVCUT FİYAT',
            supplier_id: supplierId,
            invoice_date: currentDate,
            total_amount: parsedUnitPrice * parsedQuantity,
            created_at: currentDate,
            items: [{
              id: 0,
              invoice_id: 0,
              product_code: productCode,
              quantity: parsedQuantity,
              unit_price: parsedUnitPrice,
              total_price: parsedUnitPrice * parsedQuantity
            }]
          }]
          return NextResponse.json({ success: true, data: invoicesWithItems })
        }
      }
      return NextResponse.json({ success: true, data: [] })
    }
    
    // Tüm invoice ID'leri topla
    const invoiceIds = invoices.map(inv => inv.id)
    
    // Tek query'de tüm items'ları getir
    let allItems: any[] = []
    if (invoiceIds.length > 0) {
      // PostgreSQL için IN clause - array'i string'e çevirip kullan
      const placeholders = invoiceIds.map((_, i) => `$${i + 1}`).join(',')
      const query = `SELECT * FROM purchase_invoice_items WHERE invoice_id IN (${placeholders}) ORDER BY invoice_id`
      const result = await sql.query(query, invoiceIds)
      allItems = result.rows
    }
    
    // Items'ları invoice'lara grupla
    let invoicesWithItems = invoices.map(invoice => ({
      ...invoice,
      items: allItems.filter((item: any) => item.invoice_id === invoice.id)
    }))
    
    // Eğer productCode varsa, sadece ilgili ürün koduna ait faturaları filtrele
    if (productCode) {
      const normalizedSearchCode = normalizeProductCode(productCode)
      invoicesWithItems = invoicesWithItems.filter(invoice => {
        return invoice.items.some((item: Record<string, any>) => {
          const normalizedItemCode = normalizeProductCode(item.product_code)
          return normalizedItemCode === normalizedSearchCode || 
                 normalizedItemCode.startsWith(normalizedSearchCode.split('-')[0] + '-')
        })
      })
    }
    
    // Toplam mevcut miktarı hesapla
    const totalAvailableQuantity = invoicesWithItems.reduce((sum, invoice) => {
      const item = invoice.items.find((i: Record<string, any>) => {
        const normalizedItemCode = normalizeProductCode(i.product_code)
        const normalizedSearchCode = productCode ? normalizeProductCode(productCode) : ''
        return normalizedItemCode === normalizedSearchCode || 
               (normalizedSearchCode && normalizedItemCode.startsWith(normalizedSearchCode.split('-')[0] + '-'))
      })
      return sum + (item ? item.quantity : 0)
    }, 0)
    
    const requiredQuantity = quantity ? parseInt(quantity) : 0
    
    // Eğer hiç fatura yoksa veya toplam miktar yetersizse, sanal fatura oluştur
    if (unitPrice && productCode && requiredQuantity > 0) {
      const parsedUnitPrice = parseFloat(unitPrice)
      
      if (!isNaN(parsedUnitPrice) && parsedUnitPrice > 0) {
        if (invoicesWithItems.length === 0) {
          // Hiç fatura yoksa, tam miktarı içeren sanal fatura oluştur
          const currentDate = new Date().toISOString().split('T')[0]
          invoicesWithItems = [{
            id: 0, // Sanal fatura ID
            invoice_number: 'MEVCUT FİYAT',
            supplier_id: supplierId,
            invoice_date: currentDate,
            total_amount: parsedUnitPrice * requiredQuantity,
            created_at: currentDate,
            items: [{
              id: 0,
              invoice_id: 0,
              product_code: productCode,
              quantity: requiredQuantity,
              unit_price: parsedUnitPrice,
              total_price: parsedUnitPrice * requiredQuantity
            }]
          }]
          console.log('[API] Sanal fatura oluşturuldu (hiç fatura yok):', {
            productCode,
            unitPrice: parsedUnitPrice,
            quantity: requiredQuantity,
            total: parsedUnitPrice * requiredQuantity
          })
        } else if (totalAvailableQuantity < requiredQuantity) {
          // Fatura var ama miktar yetersiz, eksik kısmı tamamlayan sanal fatura ekle
          const missingQuantity = requiredQuantity - totalAvailableQuantity
          const currentDate = new Date().toISOString().split('T')[0]
          invoicesWithItems.push({
            id: 0, // Sanal fatura ID
            invoice_number: 'MEVCUT FİYAT (Eksik Tamamlama)',
            supplier_id: supplierId,
            invoice_date: currentDate,
            total_amount: parsedUnitPrice * missingQuantity,
            created_at: currentDate,
            items: [{
              id: 0,
              invoice_id: 0,
              product_code: productCode,
              quantity: missingQuantity,
              unit_price: parsedUnitPrice,
              total_price: parsedUnitPrice * missingQuantity
            }]
          })
          console.log('[API] Sanal fatura eklendi (eksik tamamlama):', {
            productCode,
            unitPrice: parsedUnitPrice,
            missingQuantity,
            totalAvailableQuantity,
            requiredQuantity,
            total: parsedUnitPrice * missingQuantity
          })
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: invoicesWithItems
    })
  } catch (error) {
    console.error("[api/suppliers/[id]/purchase-invoices] Hata:", error)
    return NextResponse.json(
      { success: false, error: "Tedarikçi satış faturaları alınamadı" },
      { status: 500 }
    )
  }
}
