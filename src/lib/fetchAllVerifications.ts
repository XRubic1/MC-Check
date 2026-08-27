import { supabase } from './supabase';
import type { MCVerification } from '../types/mc-check';

/** PostgREST default max-rows; each request must stay at or below this. */
const PAGE_SIZE = 1000;

/**
 * Loads every MC verification, paging past Supabase's 1000-row API cap.
 * @returns All rows newest-first, or throws on a query failure
 */
export async function fetchAllVerifications(): Promise<MCVerification[]> {
  const rows: MCVerification[] = [];
  let from = 0;
  let total: number | null = null;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await supabase
      .from('mc_verifications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, to);

    if (error) throw error;

    if (typeof count === 'number') {
      total = count;
    }

    const page = (data as MCVerification[]) ?? [];
    rows.push(...page);

    const reachedKnownTotal = total !== null && rows.length >= total;
    const reachedShortPage = total === null && page.length < PAGE_SIZE;
    if (page.length === 0 || reachedKnownTotal || reachedShortPage) break;

    from += page.length;
  }

  return rows;
}
