import { NextResponse } from "next/server"
import { getSuppliers } from "../../lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    const suppliers = await getSuppliers(companyId ? parseInt(companyId) : undefined)
    return NextResponse.json({ success: true, data: suppliers })
  } catch (error) {
    console.error("[api/suppliers] Hata:", error)
    return NextResponse.json({ success: false, error: "Tedarikçiler alınamadı" }, { status: 500 })
  }
}


