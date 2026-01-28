import { type NextRequest, NextResponse } from "next/server"
import { getShippingDocuments } from "../../lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shippingNumber = searchParams.get("shippingNumber")
    const status = searchParams.get("status")
    const supplierCode = searchParams.get("supplierCode") || undefined
    const companyId = searchParams.get("companyId") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("[v0] İrsaliye listesi API çağrısı:", {
      shippingNumber,
      status,
      page,
      limit,
    })

    // Veritabanından irsaliyeleri getir
    const { data: shippingDocuments, total } = await getShippingDocuments({
      shippingNumber: shippingNumber || undefined,
      status: status || undefined,
      supplierCode: supplierCode || undefined,
      companyId: companyId || undefined,
      page,
      limit
    })

    // UI'ın beklediği formata çevir
    const mapped = shippingDocuments.map((sd: Record<string, any>) => ({
      id: String(sd.id),
      shippingNumber: sd.shipping_number,
      companyName: sd.company_name || "-",
      brandName: sd.brand_name || "-",
      supplierName: sd.supplier_name,
      supplierCode: sd.supplier_code || "",
      supplierId: sd.supplier_id || null,
      date: sd.shipping_date,
      totalAmount: sd.total_amount,
      itemCount: sd.total_quantity || sd.item_count || 0, // Toplam ürün miktarı
      status: (sd.status === 'pending' ? 'pending' : sd.status === 'approved' ? 'calculated' : sd.status === 'rejected' ? 'invoiced' : 'pending'),
      invoiceNumber: sd.invoice_number || null
    }))

    return NextResponse.json({
      success: true,
      data: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] İrsaliye listesi API hatası:", error)
    return NextResponse.json(
      {
        success: false,
        error: "İrsaliye listesi alınırken bir hata oluştu",
      },
      { status: 500 },
    )
  }
}
