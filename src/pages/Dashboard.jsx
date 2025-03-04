import { useState } from 'react';
import { useDebts } from '../hooks/useDebts';
import { Button } from '../components/ui/button';
import { DebtForm } from '../components/DebtForm';
import { EditDebtForm } from '../components/EditDebtForm';
import { ProfileMenu } from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function Dashboard() {
  const { debts, deleteDebt } = useDebts();
  const { currencyPreference } = useAuth();
  const [error, setError] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState(null);

  const getCurrencySymbol = (currency = 'INR') => {
    return currency === 'USD' ? '$' : '₹';
  };

  const handleDeleteDebt = async (id) => {
    try {
      setError(null);
      await deleteDebt.mutateAsync(id);
      setDeleteDialogOpen(false);
      setDebtToDelete(null);
    } catch (err) {
      setError('Failed to delete debt');
    }
  };

  const openDeleteDialog = (id) => {
    setDebtToDelete(id);
    setDeleteDialogOpen(true);
  };

  if (debts.isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (debts.isError) {
    return <div className="p-8 text-destructive">Error loading debts</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between mb-8">
              <h1 className="text-3xl font-medium text-gray-900 uppercase">Your Debts</h1>
            <div className="flex items-center gap-4">
              <DebtForm />
              <ProfileMenu />
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 text-sm text-destructive-foreground bg-destructive/10 rounded-lg border border-destructive/20">
              {error}
            </div>
          )}

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-semibold text-slate-700">#</TableHead>
                  <TableHead className="font-semibold text-slate-700">Creditor</TableHead>
                  <TableHead className="font-semibold text-slate-700">Amount (₹)</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                  <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.data?.map((debt, index) => (
                  <TableRow key={debt.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="text-slate-600 text-left">{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900 text-left">{debt.creditor}</TableCell>
                    <TableCell className="text-slate-900 text-left">
                      <span className="font-medium">{getCurrencySymbol(currencyPreference)}{debt.amount.toFixed(2)}</span>
                    </TableCell>
                    <TableCell className="text-left">
                      <Badge
                        variant={debt.status === 'PAID' ? 'success' : 'warning'}
                        className={`font-medium ${debt.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                      >
                        {debt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      <Badge
                        variant={
                          debt.priority === 'HIGH'
                            ? 'destructive'
                            : debt.priority === 'MEDIUM'
                            ? 'warning'
                            : 'secondary'
                        }
                        className={`font-medium ${
                          debt.priority === 'HIGH'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : debt.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {debt.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDebt(debt)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(debt.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!debts.data?.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium mb-2">No debts found</p>
                        <p className="text-sm">Add your first debt to get started!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {editingDebt && (
        <EditDebtForm
          debt={editingDebt}
          open={true}
          onClose={() => setEditingDebt(null)}
        />
      )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the debt record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => debtToDelete && handleDeleteDebt(debtToDelete)}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}