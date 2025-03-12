import { useState, useMemo } from 'react';
import { useDebts } from '../hooks/useDebts';
import { Button } from '../components/ui/button';
import { DebtForm } from '../components/DebtForm';
import { EditDebtForm } from '../components/EditDebtForm';
import { ProfileMenu } from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/ui/loading';
import { useToast } from '../components/ui/toast';
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
  const { addToast } = useToast();
  const [error, setError] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'creditor', direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('ALL');

  const getCurrencySymbol = (currency = 'INR') => {
    return currency === 'USD' ? '$' : '₹';
  };

  const handleDeleteDebt = async (id) => {
    try {
      setError(null);
      await deleteDebt.mutateAsync(id);
      setDeleteDialogOpen(false);
      setDebtToDelete(null);
      addToast({
        message: 'Debt was successfully deleted',
        type: 'success'
      });
    } catch (err) {
      setError('Failed to delete debt: ' + (err.message || 'Unknown error'));
      addToast({
        message: 'Failed to delete debt',
        type: 'error'
      });
    }
  };

  const openDeleteDialog = (id) => {
    setDebtToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted debts
  const filteredAndSortedDebts = useMemo(() => {
    if (!debts.data) return [];
    
    // Filter first
    let filteredData = [...debts.data];
    if (filterStatus !== 'ALL') {
      filteredData = filteredData.filter(debt => debt.status === filterStatus);
    }
    
    // Then sort
    return filteredData.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'ascending' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [debts.data, sortConfig, filterStatus]);

  // Calculate total debts
  const totalDebt = useMemo(() => {
    if (!debts.data) return 0;
    return debts.data
      .filter(debt => debt.status === 'PENDING')
      .reduce((sum, debt) => sum + debt.amount, 0);
  }, [debts.data]);

  const totalPaid = useMemo(() => {
    if (!debts.data) return 0;
    return debts.data
      .filter(debt => debt.status === 'PAID')
      .reduce((sum, debt) => sum + debt.amount, 0);
  }, [debts.data]);

  if (debts.isLoading) {
    return <Loading fullScreen message="Loading your debts..." />;
  }

  if (debts.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 max-w-md w-full text-center">
          <div className="mb-6 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-light text-slate-900 mb-2">Error loading debts</h3>
          <p className="text-sm text-slate-500 mb-6">{debts.error?.message || 'Unknown error occurred'}</p>
          <Button 
            onClick={() => debts.refetch()}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-none shadow-none px-8"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-light text-slate-900">debt manager</div>
            <div className="flex items-center gap-6">
              <DebtForm />
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard header with stats */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-slate-900 mb-6">
            Your Debt Overview
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Pending */}
            <div className="bg-white border border-slate-100 p-6">
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Total Pending</div>
              <div className="text-3xl font-light text-slate-900">
                {getCurrencySymbol(currencyPreference)}{totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            {/* Total Paid */}
            <div className="bg-white border border-slate-100 p-6">
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Total Paid</div>
              <div className="text-3xl font-light text-slate-900">
                {getCurrencySymbol(currencyPreference)}{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            {/* Total Records */}
            <div className="bg-white border border-slate-100 p-6">
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Total Records</div>
              <div className="text-3xl font-light text-slate-900">
                {debts.data.length}
              </div>
            </div>
            </div>
          </div>

          {error && (
          <div className="mb-6 p-4 border-l-2 border-red-500 bg-red-50 text-red-700 text-sm">
              {error}
          </div>
        )}

        {/* Filter section */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="text-xs uppercase tracking-wide text-slate-400">Filter Status:</div>
          <div className="flex gap-1">
            <button 
              className={`px-4 py-2 text-sm border ${filterStatus === 'ALL' 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 text-sm border ${filterStatus === 'PENDING' 
                ? 'bg-amber-500 text-white border-amber-500' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              onClick={() => setFilterStatus('PENDING')}
            >
              Pending
            </button>
            <button 
              className={`px-4 py-2 text-sm border ${filterStatus === 'PAID' 
                ? 'bg-emerald-500 text-white border-emerald-500' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              onClick={() => setFilterStatus('PAID')}
            >
              Paid
            </button>
          </div>
          
          {debts.isFetching && !debts.isLoading && (
            <div className="text-xs text-slate-400 flex items-center ml-auto">
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </div>
          )}
        </div>

        {/* Debts Table */}
        {filteredAndSortedDebts.length > 0 ? (
          <div className="overflow-hidden border border-slate-100 bg-white">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Creditor
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 text-left">
                      {debt.creditor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium text-left">
                      {getCurrencySymbol(currencyPreference)}{debt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="text-left">
                        <span 
                          className={`inline-block text-xs px-2 py-1 ${
                            debt.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}
                      >
                        {debt.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="text-left">
                        <span 
                          className={`inline-block text-xs px-2 py-1 ${
                          debt.priority === 'HIGH'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                            : debt.priority === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {debt.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="flex items-start justify-start">
                        <button
                          onClick={() => setEditingDebt(debt)}
                          className="text-slate-500 hover:text-slate-900 text-sm mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteDialog(debt.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                      </div>
        ) : (
          <div className="bg-white border border-slate-100 p-12 text-center">
            <p className="text-lg font-light text-slate-900 mb-2">
              {filterStatus !== 'ALL' 
                ? `No ${filterStatus.toLowerCase()} debts found` 
                : 'No debts found'}
            </p>
            <p className="text-sm text-slate-500 mb-6">
              {filterStatus !== 'ALL' 
                ? 'Try changing your filter or' 
                : 'Add your first debt to get started!'}
            </p>
            <DebtForm customTrigger={true} />
          </div>
        )}
      </main>

      {editingDebt && (
        <EditDebtForm
          debt={editingDebt}
          open={true}
          onClose={() => setEditingDebt(null)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-slate-100 p-6 rounded-none max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-light text-slate-900">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              This action cannot be undone. This will permanently delete the debt record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-4">
            <AlertDialogCancel className="bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-none shadow-none font-normal">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => debtToDelete && handleDeleteDebt(debtToDelete)}
              className="bg-red-500 text-white hover:bg-red-600 rounded-none shadow-none font-normal"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}