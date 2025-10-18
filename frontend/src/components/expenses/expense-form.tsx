"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useCategories } from "@/hooks/use-categories";
import { useCreateExpense } from "@/hooks/use-expenses";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense";
import type { PaymentMethod, CreateExpenseDto } from "@/lib/types";

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'pix', label: 'PIX' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

export function ExpenseForm() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createExpense = useCreateExpense();
  
  const form = useForm<CreateExpenseDto>({
    // resolver: zodResolver(expenseSchema), // Manual validation in onSubmit
    defaultValues: {
      title: '',
      description: '',
      amount: undefined, // Let user fill this
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'credit_card',
    },
  });

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


      await createExpense.mutateAsync(cleanData);
      toast.success('Expense added successfully!');
      router.push('/expenses');
    } catch (error) {
      console.error('❌ Expense creation error:', error);
      toast.error('Failed to add expense. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Details</CardTitle>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id || category.name} value={category.name}>
                            {category.icon} {category.name}
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
                    <FormLabel>Subcategory</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedCategoryData}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategoryData && Object.entries(selectedCategoryData.subcategories).map(([key, icon]) => (
                          <SelectItem key={key} value={key}>
                            {icon} {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/expenses')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createExpense.isPending}
              >
                {createExpense.isPending ? 'Adding...' : 'Add Expense'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}