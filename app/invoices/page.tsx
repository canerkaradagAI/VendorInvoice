import { DashboardHeader } from "@/components/dashboard-header"
import { InvoiceList } from "@/components/invoices/InvoiceList"

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-balance">Fatura Yönetimi</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Oluşturulan faturaları görüntüleyin, indirin ve yönetin.
            </p>
          </div>

          <InvoiceList />
        </div>
      </main>
    </div>
  )
}
