"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { useExpense, useUpdateExpense } from "@/hooks/use-expenses";
import type { PaymentMethod, CreateExpenseDto } from "@/lib/types";

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'pix', label: 'PIX' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

interface ExpenseEditFormProps {
  expenseId: string;
}

export function ExpenseEditForm({ expenseId }: ExpenseEditFormProps) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { data: expense, isLoading, error } = useExpense(expenseId);
  const updateExpense = useUpdateExpense();
  
  const form = useForm<CreateExpenseDto>({
    defaultValues: {
      title: '',
      description: '',
      amount: undefined,
      category: '',
      subcategory: '',
      date: '',
      paymentMethod: 'credit_card',
    },
  });

  // Populate form when expense data and categories are loaded
  useEffect(() => {
    if (expense && categories) {
      // Handle date conversion (could be ISO string or timestamp)
      let dateString = '';
      if (expense.date) {
        // If it's a timestamp (number string), convert to ISO first
        if (/^\d+(\.\d+)?$/.test(expense.date)) {
          const timestamp = parseFloat(expense.date);
          dateString = new Date(timestamp).toISOString().split('T')[0];
        } else {
          // Regular ISO string
          dateString = expense.date.split('T')[0];
        }
      }

      // Verify category exists in categories list
      const categoryExists = categories.find(cat => cat.name === expense.category);
      if (!categoryExists) {
        console.warn(`Category "${expense.category}" not found in categories list`);
      }

      form.reset({
        title: expense.title,
        description: expense.description || '',
        amount: expense.amount,
        category: expense.category,
        subcategory: expense.subcategory,
        date: dateString,
        paymentMethod: expense.paymentMethod,
      });
    }
  }, [expense, categories, form]);

  const selectedCategory = form.watch('category');
  const selectedCategoryData = categories?.find(cat => cat.name === selectedCategory);

  const onSubmit = async (data: CreateExpenseDto) => {
    try {
      // Validate required fields first
      if (!data.title || data.title.trim() === '') {
        toast.error('Title is required');
        return;
      }
      if (!data.category || data.category.trim() === '') {
        toast.error('Please select a category');
        return;
      }
      if (!data.subcategory || data.subcategory.trim() === '') {
        toast.error('Please select a subcategory');
        return;
      }
      if (!data.amount || data.amount <= 0) {
        toast.error('Amount must be greater than 0');
        return;
      }

      // Clean and prepare data for API
      const cleanData: CreateExpenseDto = {
        title: data.title.trim(),
        amount: Number(data.amount),
        category: data.category.trim(),
        subcategory: data.subcategory.trim(),
        date: data.date ? new Date(data.date + 'T12:00:00.000Z').toISOString() : new Date().toISOString(),
        paymentMethod: data.paymentMethod || 'credit_card',
      };

      // Only include description if it has content
      if (data.description && data.description.trim() !== '') {
        cleanData.description = data.description.trim();
      }

      await updateExpense.mutateAsync({ id: expenseId, data: cleanData });
      toast.success('Expense updated successfully!');
      router.push('/expenses');
    } catch (error) {
      console.error('❌ Expense update error:', error);
      toast.error('Failed to update expense. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load expense details. Please try again.
          </p>
          <Button onClick={() => router.push('/expenses')}>
            Back to Expenses
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!expense) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Expense not found.
          </p>
          <Button onClick={() => router.push('/expenses')}>
            Back to Expenses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grocery Shopping" {...field} />
                  </FormControl>
                  <FormDescription>
                    A brief description of your expense
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about this expense..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || value === null || value === undefined) {
                            field.onChange(undefined);
                          } else {
                            const numValue = parseFloat(value);
                            field.onChange(isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset subcategory when category changes
                        form.setValue('subcategory', '');
                      }} 
                      value={field.value}
                      defaultValue={field.value}
                      key={field.value} // Force re-render when value changes
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subcategory */}
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      defaultValue={field.value}
                      key={`${selectedCategory}-${field.value}`} // Force re-render when category or value changes
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategoryData?.subcategories && 
                          Object.entries(selectedCategoryData.subcategories).map(([key, icon]) => (
                            <SelectItem key={key} value={key}>
                              {icon} {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {!selectedCategory && "Please select a category first"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                    key={field.value} // Force re-render when value changes
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/expenses')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateExpense.isPending}
              >
                {updateExpense.isPending ? 'Updating...' : 'Update Expense'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}