"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExpenses, useDeleteExpense } from "@/hooks/use-expenses";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit, Trash2, DollarSign, Calendar, CreditCard } from "lucide-react";
import type { ExpenseFilters, Expense } from "@/lib/types";

interface ExpenseListProps {
  filters?: ExpenseFilters;
}

export function ExpenseList({ filters }: ExpenseListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Add pagination and sorting to filters  
  const fullFilters = {
    ...filters,
    page: 1,
    limit: 50 // Get more items to include recent expenses
  };
  
  const { data: expenses, isLoading, error } = useExpenses(fullFilters);
  const deleteExpense = useDeleteExpense();

  const handleDeleteExpense = async (expense: Expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.title}"? This action cannot be undone.`)) {
      try {
        await deleteExpense.mutateAsync(expense.id);
      } catch (error) {
        // Error handling is done in the mutation hook
        console.error('Delete failed:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load expenses. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
          <p className="text-muted-foreground mb-4">
            {filters && Object.keys(filters).length > 0 
              ? "Try adjusting your filters or add a new expense."
              : "Start by adding your first expense."}
          </p>
          <Button>Add Your First Expense</Button>
        </CardContent>
      </Card>
    );
  }

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = expenses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

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
        <CardTitle>
          Expenses ({expenses.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.title}</div>
                      {expense.description && (
                        <div className="text-sm text-muted-foreground">
                          {expense.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{expense.category}</div>
                      {expense.subcategory && (
                        <div className="text-muted-foreground">
                          {expense.subcategory}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getPaymentMethodColor(expense.paymentMethod)}`}
                    >
                      {expense.paymentMethod.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteExpense(expense)}
                        disabled={deleteExpense.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedExpenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{expense.title}</h3>
                  <span className="font-semibold text-lg">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                
                {expense.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {expense.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{expense.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                  
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getPaymentMethodColor(expense.paymentMethod)}`}
                  >
                    {expense.paymentMethod.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-end mt-3 space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteExpense(expense)}
                    disabled={deleteExpense.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, expenses.length)} of {expenses.length} expenses
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}