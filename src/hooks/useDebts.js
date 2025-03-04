import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export function useDebts() {
  const { supabase, user } = useAuth();
  const queryClient = useQueryClient();

  const debts = useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user?.id)
        .order('creditor', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addDebt = useMutation({
    mutationFn: async (newDebt) => {
      const { error } = await supabase.from('debts').insert({
        ...newDebt,
        user_id: user.id,
        status: 'PENDING',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const updateDebt = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase
        .from('debts')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const deleteDebt = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  return {
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
  };
}