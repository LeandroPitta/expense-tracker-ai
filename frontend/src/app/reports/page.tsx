import { AppShell } from "@/components/layout";

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate detailed reports and analytics of your spending patterns.
          </p>
        </div>
        
        {/* Placeholder content - será implementado */}
        <div className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Advanced reporting features are being developed.
          </p>
        </div>
      </div>
    </AppShell>
  );
}