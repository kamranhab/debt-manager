import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { Database } from '../types/database.types';

type Debt = Database['public']['Tables']['debts']['Row'];
type NewDebt = Database['public']['Tables']['debts']['Insert'];
type UpdateDebt = Database['public']['Tables']['debts']['Update'];

export function useDebts() {
  const { supabase, user } = useAuth();
  const queryClient = useQueryClient();

  const debts = useQuery<Debt[]>({
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
    mutationFn: async (newDebt: Omit<NewDebt, 'user_id'>) => {
      const { error } = await supabase.from('debts').insert({
        ...newDebt,
        user_id: user!.id,
        status: 'PENDING',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const updateDebt = useMutation({
    mutationFn: async ({ id, ...data }: UpdateDebt) => {
      const { error } = await supabase
        .from('debts')
        .update(data)
        .eq('id', id)
        .eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
        .eq('user_id', user!.id);
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