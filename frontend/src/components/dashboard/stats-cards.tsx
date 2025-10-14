"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/hooks/use-expenses";
import { useMemo } from "react";
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function StatsCards() {
  const { data: expenses, isLoading } = useExpenses();

  const stats = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return null;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // This month expenses
    const thisMonthExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Previous month expenses for comparison
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate growth percentage
    const growthPercentage = prevMonthExpenses > 0 
      ? ((thisMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
      : 0;

    // Average expense
    const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    // Budget simulation (in a real app, this would come from user settings)
    const monthlyBudget = 5000; // Mock budget
    const budgetUsed = (thisMonthExpenses / monthlyBudget) * 100;

    return {
      totalExpenses,
      thisMonthExpenses,
      growthPercentage,
      averageExpense,
      monthlyBudget,
      budgetUsed,
      totalTransactions: expenses.length,
    };
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No expenses found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Expenses",
      value: formatCurrency(stats.totalExpenses),
      description: `${stats.totalTransactions} transactions`,
      icon: DollarSign,
      trend: null,
    },
    {
      title: "This Month",
      value: formatCurrency(stats.thisMonthExpenses),
      description: `${stats.growthPercentage >= 0 ? '+' : ''}${stats.growthPercentage.toFixed(1)}% from last month`,
      icon: Calendar,
      trend: stats.growthPercentage,
    },
    {
      title: "Average Expense",
      value: formatCurrency(stats.averageExpense),
      description: "Per transaction",
      icon: TrendingUp,
      trend: null,
    },
    {
      title: "Budget Used",
      value: `${stats.budgetUsed.toFixed(1)}%`,
      description: `${formatCurrency(stats.monthlyBudget - stats.thisMonthExpenses)} remaining`,
      icon: Target,
      trend: stats.budgetUsed > 100 ? stats.budgetUsed - 100 : null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const isPositiveTrend = stat.trend !== null && stat.trend > 0;
        const isNegativeTrend = stat.trend !== null && stat.trend < 0;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                isPositiveTrend 
                  ? 'text-red-600 dark:text-red-400' 
                  : isNegativeTrend 
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-muted-foreground'
              }`}>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}