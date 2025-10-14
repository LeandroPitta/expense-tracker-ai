"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/hooks/use-expenses";
import { useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

export function RecentExpenses() {
  const { data: expenses, isLoading } = useExpenses();

  const recentExpenses = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return [];

    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recentExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No expenses found. Start by adding your first expense.
            </p>
            <Button asChild>
              <Link href="/expenses/new">Add Expense</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'credit_card':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'debit_card':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'pix':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'bank_transfer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Expenses</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/expenses">
            View all
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium truncate">
                  {expense.title}
                </h4>
                <span className="text-sm font-semibold text-right">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(expense.date)}</span>
                <span>•</span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${getPaymentMethodColor(expense.paymentMethod)}`}
                >
                  {expense.paymentMethod.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {expense.category} {expense.subcategory && `• ${expense.subcategory}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}