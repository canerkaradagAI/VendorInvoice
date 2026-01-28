import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`SELECT * FROM companies ORDER BY company_name`;
    const companies = result.rows;
    
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


