"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: string | number; // For chart compatibility
}

const COLORS = [
  "#2563eb", // Blue 600 - mais escuro para melhor contraste
  "#dc2626", // Red 600  
  "#16a34a", // Green 600
  "#d97706", // Amber 600
  "#7c3aed", // Violet 600
  "#db2777", // Pink 600
  "#0891b2", // Cyan 600
  "#65a30d", // Lime 600
  "#ea580c", // Orange 600
  "#4f46e5", // Indigo 600
];

export function CategoryBreakdown() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const chartData = useMemo(() => {
    if (!expenses || !Array.isArray(expenses) || !categories || !Array.isArray(categories)) {
      return [];
    }

    // Group expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

    // Create chart data with category names and colors
    const data: CategoryData[] = Object.entries(categoryTotals)
      .map(([categoryName, amount], index) => {
        const category = categories.find(c => c.name === categoryName);
        return {
          name: category?.name || categoryName,
          value: amount,
          color: COLORS[index % COLORS.length],
          percentage: total > 0 ? (amount / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.value - a.value) // Sort by amount descending
      .slice(0, 8); // Show top 8 categories

    return data;
  }, [expenses, categories]);

  const isLoading = expensesLoading || categoriesLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No expense data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of expenses by category
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={(entry: any) => entry.percentage > 5 ? `${entry.percentage.toFixed(1)}%` : ''}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                color: 'hsl(var(--foreground))',
              }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: '500' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}