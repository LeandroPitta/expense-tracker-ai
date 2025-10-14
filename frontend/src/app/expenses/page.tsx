"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout";
import { ExpenseList, ExpenseFilters } from "@/components/expenses";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { ExpenseFilters as ExpenseFiltersType } from "@/lib/types";

export default function ExpensesPage() {
  const [filters, setFilters] = useState<ExpenseFiltersType>({});

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Manage all your expenses, add new ones, and track your spending.
            </p>
          </div>
          <Button asChild>
            <Link href="/expenses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <ExpenseFilters onFiltersChange={setFilters} />

        {/* Expense List */}
        <ExpenseList filters={filters} />
      </div>
    </AppShell>
  );
}