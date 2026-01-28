import { NextResponse } from "next/server"
import { dbAll } from "../../lib/database"

export async function GET() {
  try {
    const companies = await dbAll('SELECT * FROM companies ORDER BY company_name');
    
    // Frontend'in beklediği formata çevir
    const formattedCompanies = companies.map((company: any) => ({
      id: String(company.id),
      code: company.company_code || '',
      name: company.company_name || ''
    }));
    
    return NextResponse.json({ success: true, data: formattedCompanies });
  } catch (error) {
    console.error("[api/companies] Hata:", error);
    return NextResponse.json(
      { success: false, error: "Şirketler alınamadı" },
      { status: 500 }
    );
  }
}


