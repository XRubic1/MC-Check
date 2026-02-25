import { useState, useMemo } from 'react';
import type { MCVerification, MCVerificationUpdate } from '../types/mc-check';
import { EntryDetailModal } from './EntryDetailModal';

type SortKey = keyof MCVerification | '';
type SortDir = 'asc' | 'desc';

interface VerificationTableProps {
  list: MCVerification[];
  loading: boolean;
  error: string | null;
  onRefetch?: () => void;
  onUpdate: (id: string, updates: MCVerificationUpdate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const BORDER = 'border-[rgba(201,168,76,0.18)]';

/**
 * Sortable, searchable table of MC verifications.
 * Dark luxury theme: alternating near-black rows, DM Mono for codes, status colors.
 */
export function VerificationTable({
  list,
  loading,
  error,
  onRefetch,
  onUpdate,
  onDelete,
}: VerificationTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedEntry, setSelectedEntry] = useState<MCVerification | null>(null);

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
      className="flex items-center gap-1 font-mono text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-gold-light min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
    >
      {label}
      {sortKey === column && (
        <span className="text-gold/70">{sortDir === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  const formatDate = (d: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString() : '—');

  if (error) {
    return (
      <div className={`border ${BORDER} border-red-900/40 bg-navy-row p-4 sm:p-6`}>
        <p className="status-negative font-sans text-sm">{error}</p>
        {onRefetch && (
          <button
            type="button"
            onClick={onRefetch}
            className="mt-3 min-h-[44px] border border-[rgba(201,168,76,0.18)] bg-navy-row px-4 py-2 font-sans text-sm text-gold-light hover:bg-navy-row-alt"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`border ${BORDER} bg-navy-light/40`}>
        <div className={`border-b ${BORDER} p-3 sm:p-4`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-slate-500">Search</label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="MC#, Carrier, User, Notes…"
              className="w-full border border-[rgba(201,168,76,0.18)] bg-navy-row px-3 py-2 font-sans text-sm text-slate-200 placeholder-slate-500 focus:border-gold/50 focus:ring-1 focus:ring-gold/25 sm:max-w-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 sm:p-8 text-center font-sans text-sm text-slate-500">
            Loading verifications…
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-6 sm:p-8 text-center font-sans text-sm text-slate-500">
            {list.length === 0 ? 'No verifications yet.' : 'No results match your search.'}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left font-sans text-sm">
                <thead>
                  <tr className={`border-b ${BORDER} bg-navy-row`}>
                    <th className="px-3 py-2.5"><SortHeader label="MC#" column="mc_number" /></th>
                    <th className="px-3 py-2.5"><SortHeader label="Carrier" column="carrier" /></th>
                    <th className="px-3 py-2.5"><SortHeader label="Amount" column="amount" /></th>
                    <th className="px-3 py-2.5"><SortHeader label="Approved" column="approved" /></th>
                    <th className="px-3 py-2.5"><SortHeader label="User" column="entered_by" /></th>
                    <th className="px-3 py-2.5"><SortHeader label="Date" column="date_entered" /></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedEntry(row)}
                      className={`cursor-pointer border-b ${BORDER} transition hover:bg-[rgba(201,168,76,0.06)] ${
                        i % 2 === 0 ? 'bg-navy-row/80' : 'bg-navy-row-alt/80'
                      }`}
                    >
                      <td className="px-3 py-2.5 font-mono text-gold-light">{row.mc_number}</td>
                      <td className="px-3 py-2.5 text-slate-300">{row.carrier}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-300">
                        {typeof row.amount === 'number' ? row.amount.toFixed(2) : row.amount}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.approved ? (
                          <span className="status-positive font-mono text-xs">Yes</span>
                        ) : (
                          <span className="status-neutral font-mono text-xs">No</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-slate-400">{row.entered_by}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{formatDate(row.date_entered)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 p-3 md:hidden">
              {sorted.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedEntry(row)}
                  className={`w-full border ${BORDER} bg-navy-row p-4 text-left transition hover:bg-navy-row-alt active:bg-[rgba(201,168,76,0.08)]`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-gold-light">{row.mc_number}</span>
                    <span className="font-mono text-slate-300">
                      {typeof row.amount === 'number' ? row.amount.toFixed(2) : row.amount}
                    </span>
                  </div>
                  <div className="mt-1 font-sans text-sm text-slate-400">{row.carrier}</div>
                  <div className="mt-1 flex items-center gap-2 font-sans text-xs text-slate-500">
                    <span>{row.entered_by}</span>
                    <span>·</span>
                    <span className="font-mono">{formatDate(row.date_entered)}</span>
                    {row.approved && (
                      <span className="status-positive font-mono">Approved</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedEntry && (
        <EntryDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
