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
  const { debts, deleteDebt, updateDebt } = useDebts();
  const { currencyPreference } = useAuth();
  const { addToast } = useToast();
  const [error, setError] = useState(null);
  const [editingDebt, setEditingDebt] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'creditor', direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

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

  const handleMarkAsPaid = async (debt) => {
    try {
      setError(null);
      await updateDebt.mutateAsync({
        ...debt,
        status: 'PAID'
      });
      addToast({
        message: `${debt.creditor} debt was marked as paid`,
        type: 'success'
      });
    } catch (err) {
      setError('Failed to update debt: ' + (err.message || 'Unknown error'));
      addToast({
        message: 'Failed to mark debt as paid',
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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 relative mb-5">
            <div className="absolute inset-0 rounded-full bg-[#2563eb]/10 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-normal text-[#262626]">Loading...</p>
        </div>
      </div>
    );
  }

  if (debts.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
        <div 
          className="bg-white rounded-xl p-8 max-w-md w-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        >
          <div className="w-14 h-14 mx-auto mb-6 rounded-full flex items-center justify-center bg-[#ef4444]/10 text-[#ef4444]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#262626] mb-3 text-center">Couldn't Load Data</h3>
          <p className="text-[#8e8e8e] text-center mb-6">
            {debts.error?.message || 'We couldn\'t load your data. Please try again.'}
          </p>
          <Button 
            onClick={() => debts.refetch()}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-full py-2.5 font-medium text-sm transition-all"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Top navigation bar */}
      <header className="sticky top-0 z-10 border-b border-[#dbdbdb] bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="font-semibold text-xl bg-gradient-to-r from-[#2563eb] to-[#16a34a] bg-clip-text text-transparent">Debt Manager</div>
            <div className="flex items-center gap-4">
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">

          {error && (
          <div className="mb-6 rounded-xl bg-[#fef2f2] px-4 py-3 text-sm text-[#be123c] flex items-start gap-3 mx-auto max-w-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard stats */}
        <div className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-[#262626] mb-6">
            Overview
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Pending */}
            <div 
              className="bg-white rounded-xl p-5 shadow-sm border border-[#efefef] transform transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-sm text-[#8e8e8e] mb-2">Total Pending</div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">
                  {getCurrencySymbol(currencyPreference)}{totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#f97316]/10 flex items-center justify-center text-[#f97316]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Total Paid */}
            <div 
              className="bg-white rounded-xl p-5 shadow-sm border border-[#efefef] transform transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-sm text-[#8e8e8e] mb-2">Total Paid</div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">
                  {getCurrencySymbol(currencyPreference)}{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#16a34a]/10 flex items-center justify-center text-[#16a34a]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Total Records */}
            <div 
              className="bg-white rounded-xl p-5 shadow-sm border border-[#efefef] transform transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-sm text-[#8e8e8e] mb-2">Total Records</div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">
                  {debts.data.length}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter section */}
        <div className="mb-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#262626]">Your Debt Records</h2>
            
            {debts.isFetching && !debts.isLoading && (
              <div className="text-xs text-[#8e8e8e] flex items-center">
                <div className="w-3 h-3 rounded-full border border-[#8e8e8e] border-t-transparent animate-spin mr-2"></div>
                Refreshing...
            </div>
          )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Filter Buttons - placed in a container with the same styling as view toggle */}
            <div className="inline-flex rounded-full bg-[#efefef] p-1 space-x-1">
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === 'ALL' 
                  ? 'bg-white text-[#262626] shadow-sm' 
                  : 'text-[#8e8e8e] hover:text-[#262626]'}`}
                onClick={() => setFilterStatus('ALL')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  All Records
                </div>
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === 'PENDING' 
                  ? 'bg-white text-[#f97316] shadow-sm' 
                  : 'text-[#8e8e8e] hover:text-[#262626]'}`}
                onClick={() => setFilterStatus('PENDING')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                </div>
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === 'PAID' 
                  ? 'bg-white text-[#16a34a] shadow-sm' 
                  : 'text-[#8e8e8e] hover:text-[#262626]'}`}
                onClick={() => setFilterStatus('PAID')}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Paid
                </div>
              </button>
            </div>

            <div className="flex-grow"></div>

            {/* View Toggle Buttons - keep the same styling */}
            <div className="inline-flex rounded-full bg-[#efefef] p-1 space-x-1">
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-[#262626] shadow-sm' 
                    : 'text-[#8e8e8e] hover:text-[#262626]'
                }`}
                onClick={() => setViewMode('cards')}
                title="Card View"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Cards
                </div>
              </button>
              <button 
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-[#262626] shadow-sm' 
                    : 'text-[#8e8e8e] hover:text-[#262626]'
                }`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Table
                </div>
              </button>
            </div>
            
            {/* Add more horizontal space between button groups */}
            <div className="w-2"></div>
            
            {/* Add New Button - update to match the same height and text size */}
            <DebtForm customTrigger={
              <button className="inline-flex items-center px-5 py-2 rounded-full text-sm font-medium bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Debt
              </button>
            } />
          </div>
        </div>

        {/* Debts Cards/List */}
        <div className="max-w-3xl mx-auto">
          {filteredAndSortedDebts.length > 0 ? (
            viewMode === 'cards' ? (
              <div className="space-y-4">
                {filteredAndSortedDebts.map((debt) => (
                  <div 
                    key={debt.id}
                    className="bg-white rounded-xl shadow-sm border border-[#efefef] p-4 transition-all hover:shadow-md"
                    onMouseEnter={() => setHoveredRow(debt.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <div className="flex items-start">
                      {/* Creditor avatar with status indicator */}
                      <div className="relative mr-4 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[#262626] font-medium text-xl ${
                          debt.priority === 'HIGH'
                            ? 'bg-[#ef4444]/10' 
                            : debt.priority === 'MEDIUM'
                              ? 'bg-[#f97316]/10'
                              : 'bg-[#efefef]'
                        }`}>
                          {debt.creditor.substring(0, 1).toUpperCase()}
                        </div>
                        {/* Status indicator dot */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          debt.status === 'PAID' ? 'bg-[#16a34a]' : 'bg-[#f97316]'
                        }`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-left">
                            <div className="font-semibold text-base text-[#262626]">{debt.creditor}</div>
                            <div className="text-xs text-[#8e8e8e] mt-0.5">
                              Added {debt.created_at ? new Date(debt.created_at).toLocaleDateString() : 'Unknown date'} • {debt.priority.toLowerCase()} priority
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className={`text-base font-semibold ${
                              debt.status === 'PAID' 
                                ? 'text-[#16a34a]' 
                                : debt.priority === 'HIGH'
                                  ? 'text-[#ef4444]'
                                  : debt.priority === 'MEDIUM'
                                    ? 'text-[#f97316]'
                                    : 'text-[#262626]'
                            }`}>
                              {getCurrencySymbol(currencyPreference)}{debt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span 
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              debt.status === 'PAID'
                                ? 'bg-[#16a34a]/10 text-[#16a34a]'
                                : 'bg-[#f97316]/10 text-[#f97316]'
                            }`}
                          >
                            {debt.status === 'PAID' ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Paid
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending
                              </>
                            )}
                          </span>
                          
                          <span 
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          debt.priority === 'HIGH'
                                ? 'bg-[#ef4444]/10 text-[#ef4444]'
                            : debt.priority === 'MEDIUM'
                                  ? 'bg-[#f97316]/10 text-[#f97316]'
                                  : 'bg-[#8e8e8e]/10 text-[#8e8e8e]'
                            }`}
                          >
                            {debt.priority === 'HIGH' ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              </>
                            ) : debt.priority === 'MEDIUM' ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </>
                            )}
                            {debt.priority} Priority
                          </span>
                          
                          <div className="flex ml-auto gap-2">
                            {debt.status === 'PENDING' && (
                              <button
                                onClick={() => handleMarkAsPaid(debt)}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors"
                                title="Mark as Paid"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Mark as Paid
                              </button>
                            )}
                            <button
                          onClick={() => setEditingDebt(debt)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20 transition-colors"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit
                            </button>
                            <button
                          onClick={() => openDeleteDialog(debt.id)}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors"
                              title="Delete"
                        >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                          Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Table View
              <div className="bg-white rounded-xl shadow-sm border border-[#efefef] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#efefef]">
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider cursor-pointer hover:text-[#262626]"
                          onClick={() => requestSort('creditor')}
                        >
                          <div className="flex items-center">
                            Creditor
                            {sortConfig.key === 'creditor' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider cursor-pointer hover:text-[#262626]"
                          onClick={() => requestSort('amount')}
                        >
                          <div className="flex items-center">
                            Amount
                            {sortConfig.key === 'amount' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider cursor-pointer hover:text-[#262626]"
                          onClick={() => requestSort('status')}
                        >
                          <div className="flex items-center">
                            Status
                            {sortConfig.key === 'status' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider cursor-pointer hover:text-[#262626]"
                          onClick={() => requestSort('priority')}
                        >
                          <div className="flex items-center">
                            Priority
                            {sortConfig.key === 'priority' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider cursor-pointer hover:text-[#262626]"
                          onClick={() => requestSort('created_at')}
                        >
                          <div className="flex items-center">
                            Added On
                            {sortConfig.key === 'created_at' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedDebts.map((debt, index) => (
                        <tr 
                          key={debt.id} 
                          className={`${
                            index !== filteredAndSortedDebts.length - 1 ? 'border-b border-[#efefef]' : ''
                          } hover:bg-[#fafafa] transition-colors`}
                          onMouseEnter={() => setHoveredRow(debt.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#262626] font-medium text-sm mr-3 ${
                                debt.priority === 'HIGH' 
                                  ? 'bg-[#ef4444]/10' 
                                  : debt.priority === 'MEDIUM'
                                    ? 'bg-[#f97316]/10'
                                    : 'bg-[#efefef]'
                              }`}>
                                {debt.creditor.substring(0, 1).toUpperCase()}
                              </div>
                              <span className="font-medium text-[#262626]">{debt.creditor}</span>
                      </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`font-medium ${
                              debt.status === 'PAID' 
                                ? 'text-[#16a34a]' 
                                : debt.priority === 'HIGH'
                                  ? 'text-[#ef4444]'
                                  : debt.priority === 'MEDIUM'
                                    ? 'text-[#f97316]'
                                    : 'text-[#262626]'
                            }`}>
                              {getCurrencySymbol(currencyPreference)}{debt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span 
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                debt.status === 'PAID'
                                  ? 'bg-[#16a34a]/10 text-[#16a34a]'
                                  : 'bg-[#f97316]/10 text-[#f97316]'
                              }`}
                            >
                              {debt.status === 'PAID' ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Paid
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pending
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span 
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                debt.priority === 'HIGH'
                                  ? 'bg-[#ef4444]/10 text-[#ef4444]'
                                  : debt.priority === 'MEDIUM'
                                    ? 'bg-[#f97316]/10 text-[#f97316]'
                                    : 'bg-[#8e8e8e]/10 text-[#8e8e8e]'
                              }`}
                            >
                              {debt.priority === 'HIGH' ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                </>
                              ) : debt.priority === 'MEDIUM' ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </>
                              )}
                              {debt.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs text-[#8e8e8e]">
                            {debt.created_at ? new Date(debt.created_at).toLocaleDateString() : 'Unknown date'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-1">
                              {debt.status === 'PENDING' && (
                                <button
                                  onClick={() => handleMarkAsPaid(debt)}
                                  className="p-2 rounded-full hover:bg-[#16a34a]/10 text-[#16a34a] transition-colors"
                                  title="Mark as Paid"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => setEditingDebt(debt)}
                                className="p-2 rounded-full hover:bg-[#2563eb]/10 text-[#2563eb] transition-colors"
                                title="Edit"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openDeleteDialog(debt.id)}
                                className="p-2 rounded-full hover:bg-[#ef4444]/10 text-[#ef4444] transition-colors"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#efefef] p-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#262626] mb-3">
                {filterStatus !== 'ALL' 
                  ? `No ${filterStatus.toLowerCase()} debts found` 
                  : 'No debts yet'}
              </h3>
              <p className="text-[#8e8e8e] mb-8 max-w-sm mx-auto">
                {filterStatus !== 'ALL' 
                  ? 'Try changing your filter or add a new debt record' 
                  : 'Add your first debt record to start tracking'}
              </p>
              <DebtForm customTrigger={
                <button className="px-6 py-2.5 rounded-full text-sm transition-colors bg-[#2563eb] text-white font-medium hover:bg-[#1d4ed8]">
                  + Add New Debt
                </button>
              } />
          </div>
          )}
        </div>
      </main>

      {editingDebt && (
        <EditDebtForm
          debt={editingDebt}
          open={true}
          onClose={() => setEditingDebt(null)}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-lg border border-[#efefef]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-[#262626] text-center">Delete this debt?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8e8e8e] text-center mt-2">
              This action cannot be undone. This debt will be permanently deleted from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col gap-3">
            <AlertDialogAction
              onClick={() => debtToDelete && handleDeleteDebt(debtToDelete)}
              className="w-full bg-[#ef4444] text-white border-0 px-4 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-[#dc2626]"
            >
              Delete
            </AlertDialogAction>
            <AlertDialogCancel className="w-full bg-[#efefef] text-[#262626] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#dbdbdb] transition-colors">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}