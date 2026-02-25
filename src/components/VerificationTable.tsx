import { useState, useMemo } from 'react';
import type { MCVerification } from '../types/mc-check';

type SortKey = keyof MCVerification | '';
type SortDir = 'asc' | 'desc';

interface VerificationTableProps {
  list: MCVerification[];
  loading: boolean;
  error: string | null;
  onRefetch?: () => void;
}

/**
 * Sortable, searchable table of MC verifications.
 */
export function VerificationTable({ list, loading, error, onRefetch }: VerificationTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (row) =>
        row.mc_number.toLowerCase().includes(q) ||
        row.carrier.toLowerCase().includes(q) ||
        row.entered_by.toLowerCase().includes(q) ||
        String(row.amount).toLowerCase().includes(q) ||
        (row.notes ?? '').toLowerCase().includes(q)
    );
  }, [list, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey as keyof MCVerification];
      const bVal = b[sortKey as keyof MCVerification];
      if (typeof aVal === 'string' && typeof bVal === 'string')
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean')
        return sortDir === 'asc' ? (aVal === bVal ? 0 : aVal ? 1 : -1) : aVal === bVal ? 0 : bVal ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string')
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ label, column }: { label: string; column: SortKey }) => (
    <button
      type="button"
      onClick={() => column && toggleSort(column)}
      className="flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900"
    >
      {label}
      {sortKey === column && (
        <span className="text-slate-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  if (error) {
    return (
      <div className="animate-fade-in rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">{error}</p>
        {onRefetch && (
          <button
            type="button"
            onClick={onRefetch}
            className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-medium text-slate-600">Search</label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MC#, Carrier, Amount, User, Notes…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 sm:max-w-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading verifications…</div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {list.length === 0 ? 'No verifications yet.' : 'No results match your search.'}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3">
                  <SortHeader label="MC#" column="mc_number" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="Carrier" column="carrier" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="Amount" column="amount" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="Approved" column="approved" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="User" column="entered_by" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="Notes" column="notes" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="Date entered" column="date_entered" />
                </th>
                <th className="px-4 py-3">
                  <SortHeader label="Created" column="created_at" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-slate-800">{row.mc_number}</td>
                  <td className="px-4 py-3 text-slate-700">{row.carrier}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {typeof row.amount === 'number' ? row.amount.toFixed(2) : row.amount}
                  </td>
                  <td className="px-4 py-3">
                    {row.approved ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-green-800">Yes</span>
                    ) : (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.entered_by}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-600" title={row.notes ?? ''}>
                    {row.notes ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.date_entered ? new Date(row.date_entered + 'T12:00:00').toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
