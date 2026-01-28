import { type NextRequest, NextResponse } from "next/server"
import { getInvoices, createInvoice } from "@/lib/database"

interface CreateInvoiceRequest {
  shippingId: string
  shippingNumber: string
  priceCalculation: {
    calculatedPrice: number
    invoiceType: string
    breakdown: {
      baseAmount: number
      taxAmount: number
      discountAmount: number
    }
  }
}

// Fatura listesi getirme
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("[v0] Fatura listesi API çağrısı:", { search, status, page, limit })

    // Veritabanından faturaları getir
    const { data: invoices, total } = await getInvoices({
      search: search || undefined,
      status: status || undefined,
      page,
      limit
    })

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Fatura listesi API hatası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Fatura listesi alınırken bir hata oluştu",
      },
      { status: 500 },
    )
  }
}

// Yeni fatura oluşturma
export async function POST(request: NextRequest) {
  try {
    const { shippingId, shippingNumber, priceCalculation }: CreateInvoiceRequest = await request.json()

    console.log("[v0] Fatura oluşturma API çağrısı:", {
      shippingId,
      shippingNumber,
      priceCalculation,
    })

    // Veritabanına fatura kaydet
    const newInvoice = await createInvoice({
      shipping_id: parseInt(shippingId),
      invoice_type: priceCalculation.invoiceType as "LIFO" | "SATIS_FATURASI",
      base_amount: priceCalculation.breakdown.baseAmount,
      tax_amount: priceCalculation.breakdown.taxAmount,
      discount_amount: priceCalculation.breakdown.discountAmount,
      total_amount: priceCalculation.calculatedPrice,
      created_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 gün sonra
    })

    return NextResponse.json({
      success: true,
      data: {
        invoice: newInvoice,
        message: "Fatura başarıyla oluşturuldu",
      },
    })
  } catch (error) {
    console.error("[v0] Fatura oluşturma API hatası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Fatura oluşturulurken bir hata oluştu",
      },
      { status: 500 },
    )
  }
}
