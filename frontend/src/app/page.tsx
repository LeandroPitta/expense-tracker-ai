import { AppShell } from "@/components/layout";
import { 
  StatsCards, 
  ExpenseTrend, 
  CategoryBreakdown, 
  RecentExpenses 
} from "@/components/dashboard";

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your expense tracking dashboard
          </p>
        </div>
        
        {/* Stats Cards */}
        <StatsCards />

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <ExpenseTrend />
          <CategoryBreakdown />
        </div>

        {/* Recent Expenses */}
        <RecentExpenses />
      </div>
    </AppShell>
  );
}
