import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useState } from "react";
import { useDebts } from "../hooks/useDebts";

const debtSchema = z.object({
  creditor: z.string().min(1, "Creditor is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be LOW, MEDIUM, or HIGH",
  }),
  status: z.enum(['PENDING', 'PAID']).default('PENDING')
});

type DebtFormData = z.infer<typeof debtSchema>;

export function DebtForm() {
  const [open, setOpen] = useState(false);
  const { addDebt } = useDebts();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      status: 'PENDING',
    },
  });

  const onSubmit = async (data: DebtFormData) => {
    try {
      setError(null);
      const formattedData = {
        ...data,
        amount: Number(data.amount),
      };
      await addDebt.mutateAsync(formattedData);
      form.reset();
      setOpen(false);
    } catch (err) {
      setError("Failed to add debt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 flex items-center gap-2 shadow-sm transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add New Debt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Add New Debt</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
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
                    <SelectContent className="bg-white border-slate-200">
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
                onClick={() => setOpen(false)}
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
                    Adding...
                  </>
                ) : (
                  'Add Debt'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}