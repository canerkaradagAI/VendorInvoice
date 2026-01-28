import { NextRequest, NextResponse } from "next/server"
import { savePriceCalculation, updateShippingDocumentStatus } from "../../../../lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shippingId = parseInt(params.id, 10)
    const body = await request.json()
    const {
      totalAmount,
      baseAmount,
      taxAmount,
      discountAmount,
      invoiceType = 'MANUAL',
      method = 'Manuel Hesaplama',
      details = 'Kalem bazlı girilen fiyatlarla hesaplandı.'
    } = body || {}

    if (typeof totalAmount !== 'number' || isNaN(totalAmount)) {
      return NextResponse.json({ success: false, error: 'totalAmount geçersiz' }, { status: 400 })
    }

    // Hesap kaydı oluştur (opsiyonel, raporlama için)
    await savePriceCalculation({
      shipping_id: shippingId,
      invoice_type: invoiceType,
      calculated_price: totalAmount,
      base_amount: typeof baseAmount === 'number' ? baseAmount : totalAmount,
      tax_amount: typeof taxAmount === 'number' ? taxAmount : 0,
      discount_amount: typeof discountAmount === 'number' ? discountAmount : 0,
      calculation_method: method,
      calculation_details: details,
    })

    // Statüyü Hesaplandı yap ve toplamı güncelle
    await updateShippingDocumentStatus({
      shipping_id: shippingId,
      status: 'calculated',
      total_amount: totalAmount,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[mark-calculated] error', error)
    return NextResponse.json({ success: false, error: 'İşlem başarısız' }, { status: 500 })
  }
}


