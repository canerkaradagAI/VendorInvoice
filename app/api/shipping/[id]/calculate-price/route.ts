import { type NextRequest, NextResponse } from "next/server"
import { savePriceCalculation, getShippingDocumentById, getShippingItems, updateShippingDocumentStatus, getLIFOPrices, getSupplierById } from "../../../../lib/database"

interface PriceCalculationRequest {
  shippingNumber: string
  invoiceType: "LIFO" | "SATIS_FATURASI"
}

interface PriceCalculationResponse {
  success: boolean
  data?: {
    calculatedPrice: number
    invoiceType: string
    breakdown: {
      baseAmount: number
      taxAmount: number
      discountAmount: number
    }
    calculation: {
      method: string
      details: string
    }
    itemCalculations?: Array<{
      productCode: string;
      quantity: number;
      lifoItems: Array<{
        invoiceNumber: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>;
      total: number;
    }>
  }
  error?: string
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { shippingNumber, invoiceType }: PriceCalculationRequest = {
      shippingNumber: body.shippingNumber || `IRS-2024-${params.id.padStart(3, '0')}`,
      invoiceType: body.invoiceType
    }
    const shippingId = params.id

    console.log("[v0] Fiyat hesaplama API çağrısı:", {
      shippingId,
      shippingNumber,
      invoiceType,
    })

    // Gerçek uygulamada burada:
    // 1. İrsaliye detayları veritabanından alınacak
    // 2. LIFO veya Satış Faturası metoduna göre fiyat hesaplanacak
    // 3. ERP sistemi ile entegrasyon yapılacak

    // İrsaliye detaylarını al
    const shippingDoc = await getShippingDocumentById(parseInt(shippingId))
    if (!shippingDoc) {
      throw new Error('İrsaliye bulunamadı')
    }

    // İrsaliye kalemlerini al
    const shippingItems = await getShippingItems(parseInt(shippingId))
    
    if (shippingItems.length === 0) {
      console.error(`[LIFO] İrsaliye ID ${shippingId} (${shippingNumber}) için shipping_items bulunamadı`)
      throw new Error(`İrsaliye detayı bulunamadı. Bu irsaliye için ürün kalemleri (shipping_items) kayıtlı değil. Lütfen önce irsaliye detaylarını ekleyin.`)
    }

    // Tedarikçi bilgisini al
    const supplier = await getSupplierById(shippingDoc.supplier_id)
    if (!supplier) {
      throw new Error('Tedarikçi bulunamadı')
    }
    
    // Hesaplama mantığı
    let baseAmount: number = 0
    let discountRate: number = 0
    let calculationDetails: string = ""
    const itemCalculations: Array<{
      productCode: string;
      quantity: number;
      lifoItems: Array<{
        invoiceNumber: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>;
      total: number;
    }> = []
    
    if (invoiceType === "LIFO") {
      // LIFO: Her ürün için LIFO mantığıyla fiyat hesapla
      for (const item of shippingItems) {
        try {
          console.log(`[LIFO] Ürün kodu aranıyor: ${item.product_code}, Tedarikçi ID: ${shippingDoc.supplier_id}`)
          const lifoPrices = await getLIFOPrices(
            shippingDoc.supplier_id,
            item.product_code,
            item.quantity
          )
          
          console.log(`[LIFO] Bulunan fatura sayısı: ${lifoPrices.length}`, lifoPrices)
          
          if (lifoPrices.length === 0) {
            // Ürün için fatura bulunamadı - bu durumda mevcut birim fiyatı kullan
            console.warn(`[LIFO] ${item.product_code} ürünü için tedarikçi satış faturası bulunamadı. Mevcut birim fiyat kullanılıyor: ${item.unit_price}`)
            
            // Eğer unit_price varsa onu kullan, yoksa hata fırlat
            if (!item.unit_price || item.unit_price === 0) {
              throw new Error(`${item.product_code} ürünü için tedarikçi satış faturası bulunamadı ve birim fiyat bilgisi yok`)
            }
            
            // Mevcut fiyatı kullanarak LIFO benzeri bir yapı oluştur
            const itemTotal = item.unit_price * item.quantity
            baseAmount += itemTotal
            
            itemCalculations.push({
              productCode: item.product_code,
              quantity: item.quantity,
              lifoItems: [{
                invoiceNumber: 'FATURA BULUNAMADI - MEVCUT FİYAT',
                quantity: item.quantity,
                unitPrice: item.unit_price,
                total: itemTotal
              }],
              total: itemTotal
            })
            continue
          }
          
          // Toplam miktar kontrolü
          const totalLifoQuantity = lifoPrices.reduce((sum, lifo) => sum + lifo.quantity, 0)
          
          let itemTotal = lifoPrices.reduce((sum, lifo) => sum + lifo.total, 0)
          const lifoItems = lifoPrices.map(lifo => ({
            invoiceNumber: lifo.invoiceNumber,
            quantity: lifo.quantity,
            unitPrice: lifo.unitPrice,
            total: lifo.total
          }))
          
          // Eğer yetersiz miktar varsa, eksik kısmı mevcut birim fiyatı ile tamamla
          if (totalLifoQuantity < item.quantity) {
            const missingQuantity = item.quantity - totalLifoQuantity
            console.warn(`[LIFO] ${item.product_code} ürünü için yetersiz miktar. İhtiyaç: ${item.quantity}, Mevcut: ${totalLifoQuantity}, Eksik: ${missingQuantity}`)
            
            // Eğer unit_price varsa eksik kısmı tamamla
            if (item.unit_price && item.unit_price > 0) {
              const missingTotal = item.unit_price * missingQuantity
              itemTotal += missingTotal
              
              lifoItems.push({
                invoiceNumber: 'MEVCUT FİYAT (Eksik Tamamlama)',
                quantity: missingQuantity,
                unitPrice: item.unit_price,
                total: missingTotal
              })
              
              console.log(`[LIFO] Eksik ${missingQuantity} adet, mevcut birim fiyat (${item.unit_price}) ile tamamlandı`)
            } else {
              // Unit price yoksa hata fırlat
              throw new Error(`${item.product_code} ürünü için yeterli miktarda fatura bulunamadı (İhtiyaç: ${item.quantity}, Mevcut: ${totalLifoQuantity}) ve birim fiyat bilgisi yok`)
            }
          }
          
          baseAmount += itemTotal
          
          itemCalculations.push({
            productCode: item.product_code,
            quantity: item.quantity,
            lifoItems: lifoItems,
            total: itemTotal
          })
        } catch (error) {
          console.error(`LIFO hesaplama hatası - Ürün: ${item.product_code}`, error)
          throw new Error(`${item.product_code} ürünü için LIFO hesaplama hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
        }
      }
      
      discountRate = 0 // LIFO'da indirim yok
      calculationDetails = `LIFO metodu ile hesaplandı. Toplam ${shippingItems.length} kalem ürün için tedarikçi satış faturalarından en yeni fiyatlar kullanıldı.`
    } else {
      // Satış Faturası: Standart fiyat + %10 kar marjı
      const totalAmount = shippingItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
      baseAmount = totalAmount * 1.1
      discountRate = 0.02
      calculationDetails = `Satış faturası metodu ile hesaplandı. %10 kar marjı ve %2 indirim uygulandı.`
    }

    const taxRate = 0.18 // %18 KDV
    const taxAmount = baseAmount * taxRate
    const discountAmount = baseAmount * discountRate
    const calculatedPrice = baseAmount + taxAmount - discountAmount

    // Hesaplama sonucunu veritabanına kaydet
    await savePriceCalculation({
      shipping_id: parseInt(shippingId),
      invoice_type: invoiceType,
      calculated_price: calculatedPrice,
      base_amount: baseAmount,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      calculation_method: invoiceType === "LIFO" ? "Last In First Out" : "Standart Satış Faturası",
      calculation_details: calculationDetails,
    })

    // İrsaliye durumunu 'calculated' yap ve toplam tutarı güncelle
    await updateShippingDocumentStatus({
      shipping_id: parseInt(shippingId),
      status: 'calculated',
      total_amount: calculatedPrice,
    })

    const response: PriceCalculationResponse = {
      success: true,
      data: {
        calculatedPrice,
        invoiceType,
        breakdown: {
          baseAmount,
          taxAmount,
          discountAmount,
        },
        calculation: {
          method: invoiceType === "LIFO" ? "Last In First Out" : "Standart Satış Faturası",
          details: calculationDetails,
        },
        ...(invoiceType === "LIFO" && { itemCalculations }),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Fiyat hesaplama API hatası:", error)
    const errorMessage = error instanceof Error ? error.message : "Fiyat hesaplanırken bir hata oluştu"
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
