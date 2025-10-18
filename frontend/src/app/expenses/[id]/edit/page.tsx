"use client";

import { useParams } from "next/navigation";
import { ExpenseEditForm } from "@/components/expenses/expense-edit-form";

export default function EditExpensePage() {
  const params = useParams();
  const expenseId = params.id as string;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Expense</h1>
        <p className="text-muted-foreground">
          Update your expense details below.
        </p>
      </div>
      
      <ExpenseEditForm expenseId={expenseId} />
    </div>
  );
}