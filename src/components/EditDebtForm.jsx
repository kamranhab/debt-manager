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
      <DialogContent className="bg-white border border-[#efefef] p-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-w-md">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-[#262626] text-center">Edit Debt</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#fef2f2] text-[#be123c] text-sm">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm text-[#8e8e8e] font-medium">
                Creditor Name
              </label>
              <Input 
                placeholder="Enter creditor name" 
                className="border-[#dbdbdb] focus:border-[#a8a8a8] focus:ring-0 h-10 rounded-lg shadow-none text-[#262626] placeholder-[#a8a8a8]"
                {...form.register("creditor")} 
              />
              {form.formState.errors.creditor && (
                <p className="text-[#ef4444] text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {form.formState.errors.creditor.message}
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm text-[#8e8e8e] font-medium">
                Amount
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="border-[#dbdbdb] focus:border-[#a8a8a8] focus:ring-0 h-10 rounded-lg shadow-none text-[#262626] placeholder-[#a8a8a8]"
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
                <p className="text-[#ef4444] text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm text-[#8e8e8e] font-medium">
                Status
              </label>
              <Select 
                onValueChange={(value) => form.setValue("status", value)} 
                defaultValue={form.watch("status")}
              >
                <SelectTrigger className="border-[#dbdbdb] focus:border-[#a8a8a8] focus:ring-0 h-10 rounded-lg shadow-none bg-white text-[#262626]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#efefef] p-0 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  <SelectItem value="PENDING" className="hover:bg-[#fafafa] focus:bg-[#fafafa] rounded-lg text-[#f97316]">Pending</SelectItem>
                  <SelectItem value="PAID" className="hover:bg-[#fafafa] focus:bg-[#fafafa] rounded-lg text-[#16a34a]">Paid</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-[#ef4444] text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm text-[#8e8e8e] font-medium">
                Priority Level
              </label>
              <Select 
                onValueChange={(value) => form.setValue("priority", value)} 
                defaultValue={form.watch("priority")}
              >
                <SelectTrigger className="border-[#dbdbdb] focus:border-[#a8a8a8] focus:ring-0 h-10 rounded-lg shadow-none bg-white text-[#262626]">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#efefef] p-0 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  <SelectItem value="LOW" className="hover:bg-[#fafafa] focus:bg-[#fafafa] rounded-lg text-[#8e8e8e]">Low Priority</SelectItem>
                  <SelectItem value="MEDIUM" className="hover:bg-[#fafafa] focus:bg-[#fafafa] rounded-lg text-[#f97316]">Medium Priority</SelectItem>
                  <SelectItem value="HIGH" className="hover:bg-[#fafafa] focus:bg-[#fafafa] rounded-lg text-[#ef4444]">High Priority</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-[#ef4444] text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-3 pt-6">
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg py-2.5 font-medium text-sm transition-all"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Debt'
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="w-full bg-[#efefef] text-[#262626] hover:bg-[#dbdbdb] rounded-lg py-2.5 font-medium text-sm transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}