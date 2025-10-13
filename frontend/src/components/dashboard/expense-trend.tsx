"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/hooks/use-expenses";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ExpenseTrendData {
  month: string;
  amount: number;
  count: number;
}

export function ExpenseTrend() {
  const { data: expenses, isLoading } = useExpenses();

  const chartData = useMemo(() => {
    if (!expenses) return [];

    // Get last 6 months of data
    const months: ExpenseTrendData[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      });

      const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      months.push({
        month: monthName,
        amount: totalAmount,
        count: monthExpenses.length,
      });
    }

    return months;
  }, [expenses]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Trend</CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly expense overview for the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'amount' ? `$${value.toLocaleString()}` : value,
                name === 'amount' ? 'Total Spent' : 'Transactions'
              ]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}