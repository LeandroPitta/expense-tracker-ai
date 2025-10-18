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
  Area,
  AreaChart,
} from "recharts";

interface ExpenseTrendData {
  month: string;
  amount: number;
  count: number;
}

export function ExpenseTrend() {
  const { data: expenses, isLoading } = useExpenses();

  const chartData = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return [];

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
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="hsl(var(--border))"
              opacity={0.6}
            />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground) / 0.8)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground) / 0.8)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'amount' ? `$${value.toLocaleString()}` : value,
                name === 'amount' ? 'Total Spent' : 'Transactions'
              ]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                fontSize: '14px',
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#1d4ed8"
              strokeWidth={3}
              fill="url(#colorAmount)"
              dot={{ 
                fill: '#1d4ed8', 
                stroke: '#ffffff',
                strokeWidth: 2, 
                r: 5 
              }}
              activeDot={{ 
                r: 7, 
                fill: '#1d4ed8', 
                stroke: '#ffffff', 
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}