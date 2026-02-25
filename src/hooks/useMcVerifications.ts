import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { MCVerification, MCVerificationInsert } from '../types/mc-check';

/**
 * Fetches all MC verifications from Supabase.
 * @returns List of MCVerification and loading/error state
 */
export function useMcVerifications() {
  const [list, setList] = useState<MCVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('mc_verifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setList((data as MCVerification[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load verifications');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /**
   * Inserts a new MC verification.
   * @param row - MCVerificationInsert
   * @returns Resolves when insert succeeds; throws on error
   */
  const addVerification = useCallback(
    async (row: MCVerificationInsert) => {
      const { error: err } = await supabase.from('mc_verifications').insert(row);
      if (err) throw err;
      await fetchAll();
    },
    [fetchAll]
  );

  return { list, loading, error, refetch: fetchAll, addVerification };
}
