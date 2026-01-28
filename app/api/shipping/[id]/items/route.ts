import { NextRequest, NextResponse } from "next/server"
import { getShippingItems } from "../../../../lib/database"

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

    const items = await getShippingItems(shippingId)
    
    return NextResponse.json({
      success: true,
      data: items
    })
  } catch (error) {
    console.error("[api/shipping/[id]/items] Hata:", error)
    return NextResponse.json(
      { success: false, error: "İrsaliye detayları alınamadı" },
      { status: 500 }
    )
  }
}
