"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenseStats } from "@/hooks/use-expenses";
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function StatsCards() {
  const { data: apiStats, isLoading } = useExpenseStats();

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

  if (!apiStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No stats available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate growth percentage
  const growthPercentage = apiStats.previousMonthAmount > 0 
    ? ((apiStats.currentMonthAmount - apiStats.previousMonthAmount) / apiStats.previousMonthAmount) * 100
    : 0;

  // Calculate average expense
  const averageExpense = apiStats.totalExpenses > 0 ? apiStats.totalAmount / apiStats.totalExpenses : 0;

  // Budget simulation (in a real app, this would come from user settings)
  const monthlyBudget = 5000; // Mock budget
  const budgetUsed = (apiStats.currentMonthAmount / monthlyBudget) * 100;

  const statsData = [
    {
      title: "Total Expenses",
      value: formatCurrency(apiStats.totalAmount),
      description: `${apiStats.totalExpenses} transactions`,
      icon: DollarSign,
      trend: null,
    },
    {
      title: "This Month",
      value: formatCurrency(apiStats.currentMonthAmount),
      description: `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}% from last month`,
      icon: Calendar,
      trend: growthPercentage,
    },
    {
      title: "Average Expense",
      value: formatCurrency(averageExpense),
      description: "Per transaction",
      icon: TrendingUp,
      trend: null,
    },
    {
      title: "Budget Used",
      value: `${budgetUsed.toFixed(1)}%`,
      description: `${formatCurrency(monthlyBudget - apiStats.currentMonthAmount)} remaining`,
      icon: Target,
      trend: budgetUsed > 100 ? budgetUsed - 100 : null,
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