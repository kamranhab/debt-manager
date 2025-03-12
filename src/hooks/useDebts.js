import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export function useDebts() {
  const { supabase, user } = useAuth();
  const queryClient = useQueryClient();

  const debts = useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('debts')
          .select('*')
          .eq('user_id', user?.id)
          .order('creditor', { ascending: true });

        if (error) {
          console.error('Error fetching debts:', error.message);
          throw new Error(`Failed to fetch debts: ${error.message}`);
        }
        
        return data || [];
      } catch (err) {
        console.error('Unexpected error in debts query:', err);
        throw new Error(err instanceof Error ? err.message : 'An unknown error occurred while fetching debts');
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addDebt = useMutation({
    mutationFn: async (newDebt) => {
      try {
        const { data, error } = await supabase.from('debts').insert({
          ...newDebt,
          user_id: user.id,
          status: 'PENDING',
        }).select();
        
        if (error) {
          console.error('Error adding debt:', error.message);
          throw new Error(`Failed to add debt: ${error.message}`);
        }
        
        return data?.[0];
      } catch (err) {
        console.error('Unexpected error in addDebt mutation:', err);
        throw new Error(err instanceof Error ? err.message : 'An unknown error occurred while adding debt');
      }
    },
    onSuccess: (newDebt) => {
      // Optimistic update for immediate UI feedback
      queryClient.setQueryData(['debts'], (oldData = []) => {
        return [...oldData, newDebt];
      });
      
      // Still refetch to ensure server-client consistency
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      // Could trigger a toast notification here
    }
  });

  const updateDebt = useMutation({
    mutationFn: async ({ id, ...data }) => {
      try {
        const { data: updatedData, error } = await supabase
          .from('debts')
          .update(data)
          .eq('id', id)
          .eq('user_id', user.id)
          .select();
        
        if (error) {
          console.error('Error updating debt:', error.message);
          throw new Error(`Failed to update debt: ${error.message}`);
        }
        
        return updatedData?.[0];
      } catch (err) {
        console.error('Unexpected error in updateDebt mutation:', err);
        throw new Error(err instanceof Error ? err.message : 'An unknown error occurred while updating debt');
      }
    },
    onSuccess: (updatedDebt) => {
      // Optimistic update
      queryClient.setQueryData(['debts'], (oldData = []) => {
        return oldData.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt);
      });
      
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
    onError: (error) => {
      console.error('Update error:', error);
    }
  });

  const deleteDebt = useMutation({
    mutationFn: async (id) => {
      try {
        const { error } = await supabase
          .from('debts')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error deleting debt:', error.message);
          throw new Error(`Failed to delete debt: ${error.message}`);
        }
        
        return id;
      } catch (err) {
        console.error('Unexpected error in deleteDebt mutation:', err);
        throw new Error(err instanceof Error ? err.message : 'An unknown error occurred while deleting debt');
      }
    },
    onSuccess: (deletedId) => {
      // Optimistic update
      queryClient.setQueryData(['debts'], (oldData = []) => {
        return oldData.filter(debt => debt.id !== deletedId);
      });
      
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
    onError: (error) => {
      console.error('Delete error:', error);
    }
  });

  return {
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
  };
}