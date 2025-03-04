import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useEffect } from "react";
import { useDebts } from "../hooks/useDebts";
import { Database } from "../types/database.types";

type Debt = Database['public']['Tables']['debts']['Row'];

const debtSchema = z.object({
  creditor: z.string().min(1, "Creditor is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  status: z.enum(['PENDING', 'PAID']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be LOW, MEDIUM, or HIGH",
  })
});

type DebtFormData = z.infer<typeof debtSchema>;

interface EditDebtFormProps {
  debt: Debt;
  onClose: () => void;
  open: boolean;
}

export function EditDebtForm({ debt, onClose, open }: EditDebtFormProps) {
  const { updateDebt } = useDebts();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DebtFormData>({    
    resolver: zodResolver(debtSchema),
    defaultValues: {
      creditor: debt.creditor,
      amount: debt.amount,
      status: debt.status as 'PENDING' | 'PAID',
      priority: debt.priority as 'LOW' | 'MEDIUM' | 'HIGH'
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        creditor: debt.creditor,
        amount: debt.amount,
        status: debt.status as 'PENDING' | 'PAID',
        priority: debt.priority as 'LOW' | 'MEDIUM' | 'HIGH'
      });
    }
  }, [debt, open, form]);

  const onSubmit = async (data: DebtFormData) => {
    try {
      setError(null);
      const formattedData = {
        ...data,
        amount: Number(data.amount),
      };
      await updateDebt.mutateAsync({
        id: debt.id,
        ...formattedData
      });
      onClose();
    } catch (err) {
      setError("Failed to update debt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Edit Debt</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-destructive-foreground bg-destructive/10 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}
            <FormField
              control={form.control}
              name="creditor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Creditor Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter creditor name" 
                      className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="PENDING" className="text-amber-700 hover:bg-amber-50">Pending</SelectItem>
                      <SelectItem value="PAID" className="text-emerald-700 hover:bg-emerald-50">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      <SelectItem value="LOW" className="text-slate-700 hover:bg-slate-50">Low Priority</SelectItem>
                      <SelectItem value="MEDIUM" className="text-amber-700 hover:bg-amber-50">Medium Priority</SelectItem>
                      <SelectItem value="HIGH" className="text-red-700 hover:bg-red-50">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 border-gray-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Debt'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}