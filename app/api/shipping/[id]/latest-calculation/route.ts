import { type NextRequest, NextResponse } from "next/server"
import { getLatestPriceCalculation, getShippingDocumentById } from "../../../../lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shippingId = parseInt(params.id)
    
    if (isNaN(shippingId)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz irsaliye ID" },
        { status: 400 }
      )
    }

    // İrsaliye bilgisini kontrol et
    const shippingDoc = await getShippingDocumentById(shippingId)
    if (!shippingDoc) {
      return NextResponse.json(
        { success: false, error: "İrsaliye bulunamadı" },
        { status: 404 }
      )
    }

    // En son hesaplama sonucunu al
    let calculation = await getLatestPriceCalculation(shippingId)
    
    // Eğer hesaplama sonucu yoksa, shipping document'ın total_amount'ını kullan
    if (!calculation) {
      // Shipping document'dan total_amount'ı al ve varsayılan değerlerle hesaplama sonucu oluştur
      const totalAmount = shippingDoc.total_amount || 0
      
      if (totalAmount === 0) {
        return NextResponse.json(
          { success: false, error: "Hesaplama sonucu bulunamadı ve toplam tutar bilgisi yok" },
          { status: 404 }
        )
      }
      
      // KDV hariç tutarı hesapla (KDV %18)
      const baseAmount = totalAmount / 1.18
      const taxAmount = baseAmount * 0.18
      const discountAmount = 0
      
      // Varsayılan olarak SATIS_FATURASI tipini kullan
      return NextResponse.json({
        success: true,
        data: {
          calculatedPrice: totalAmount,
          invoiceType: 'SATIS_FATURASI',
          breakdown: {
            baseAmount: baseAmount,
            taxAmount: taxAmount,
            discountAmount: discountAmount,
          },
          calculation: {
            method: 'Mevcut Toplam Tutar',
            details: 'Hesaplama kaydı bulunamadı, mevcut toplam tutar kullanıldı',
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        calculatedPrice: calculation.calculated_price,
        invoiceType: calculation.invoice_type,
        breakdown: {
          baseAmount: calculation.base_amount,
          taxAmount: calculation.tax_amount,
          discountAmount: calculation.discount_amount,
        },
        calculation: {
          method: calculation.calculation_method || '',
          details: calculation.calculation_details || '',
        },
      },
    })
  } catch (error) {
    console.error("[api/shipping/[id]/latest-calculation] Hata:", error)
    return NextResponse.json(
      { success: false, error: "Hesaplama sonucu alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
