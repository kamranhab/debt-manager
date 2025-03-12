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
import { useToast } from "./ui/toast";

const debtSchema = z.object({
  creditor: z.string().min(1, "Creditor is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  status: z.enum(['PENDING', 'PAID']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be LOW, MEDIUM, or HIGH",
  })
});

export function EditDebtForm({ debt, onClose, open }) {
  const { updateDebt } = useDebts();
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const form = useForm({    
    resolver: zodResolver(debtSchema),
    defaultValues: {
      creditor: debt.creditor,
      amount: debt.amount,
      status: debt.status,
      priority: debt.priority
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        creditor: debt.creditor,
        amount: debt.amount,
        status: debt.status,
        priority: debt.priority
      });
    }
  }, [debt, open, form]);

  const onSubmit = async (data) => {
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
      
      // Add toast notification
      addToast({
        message: `Debt to ${data.creditor} was successfully updated`,
        type: 'success',
        duration: 5000
      });
      
      onClose();
    } catch (err) {
      setError("Failed to update debt");
      
      // Error toast notification
      addToast({
        message: "Failed to update debt",
        type: 'error',
        duration: 5000
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-slate-100 p-0 rounded-none shadow-md max-w-md">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-light text-slate-900">Edit Debt</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
          {error && (
            <div className="mb-6 p-3 border-l-2 border-red-500 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Creditor Name
              </label>
              <Input 
                placeholder="Enter creditor name" 
                className="border-slate-200 focus:border-slate-400 focus:ring-0 h-10 rounded-none shadow-none text-slate-900"
                {...form.register("creditor")} 
              />
              {form.formState.errors.creditor && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.creditor.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Amount
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="border-slate-200 focus:border-slate-400 focus:ring-0 h-10 rounded-none shadow-none text-slate-900"
                {...form.register("amount", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = e.target.value;
                    if (value === "") return form.setValue("amount", undefined);
                    form.setValue("amount", parseFloat(value));
                  }
                })}
              />
              {form.formState.errors.amount && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Status
              </label>
              <Select 
                onValueChange={(value) => form.setValue("status", value)} 
                defaultValue={form.watch("status")}
              >
                <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-0 h-10 rounded-none shadow-none bg-white text-slate-900">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-100 p-0 rounded-none shadow-md">
                  <SelectItem value="PENDING" className="hover:bg-slate-50 focus:bg-slate-50 rounded-none">Pending</SelectItem>
                  <SelectItem value="PAID" className="hover:bg-slate-50 focus:bg-slate-50 rounded-none">Paid</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.status.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Priority Level
              </label>
              <Select 
                onValueChange={(value) => form.setValue("priority", value)} 
                defaultValue={form.watch("priority")}
              >
                <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-0 h-10 rounded-none shadow-none bg-white text-slate-900">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-100 p-0 rounded-none shadow-md">
                  <SelectItem value="LOW" className="hover:bg-slate-50 focus:bg-slate-50 rounded-none">Low Priority</SelectItem>
                  <SelectItem value="MEDIUM" className="hover:bg-slate-50 focus:bg-slate-50 rounded-none">Medium Priority</SelectItem>
                  <SelectItem value="HIGH" className="hover:bg-slate-50 focus:bg-slate-50 rounded-none">High Priority</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.priority.message}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 rounded-none shadow-none"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-none shadow-none"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  'Update Debt'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}