import { AppShell } from "@/components/layout";
import { ExpenseForm } from "@/components/expenses";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewExpensePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/expenses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Expenses
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Expense</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new expense to your records.
          </p>
        </div>

        {/* Expense Form */}
        <div className="max-w-2xl">
          <ExpenseForm />
        </div>
      </div>
    </AppShell>
  );
}