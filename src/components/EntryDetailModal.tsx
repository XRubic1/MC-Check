import { useState, FormEvent, useCallback } from 'react';
import type { MCVerification, MCVerificationUpdate } from '../types/mc-check';

const BORDER = 'border-[rgba(201,168,76,0.18)]';
const INPUT_CLASS =
  'w-full border border-[rgba(201,168,76,0.18)] bg-navy-row px-3 py-2 font-sans text-sm text-slate-200 placeholder-slate-500 focus:border-gold/50 focus:ring-1 focus:ring-gold/25';
const LABEL_CLASS = 'mb-1 block font-mono text-xs font-medium uppercase tracking-wider text-slate-500';

interface EntryDetailModalProps {
  entry: MCVerification | null;
  onClose: () => void;
  onUpdate: (id: string, updates: MCVerificationUpdate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Modal: view entry details, edit form, or delete with confirm.
 * Dark luxury theme: navy panel, gold borders, status colors.
 */
export function EntryDetailModal({ entry, onClose, onUpdate, onDelete }: EntryDetailModalProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [mcNumber, setMcNumber] = useState(entry?.mc_number ?? '');
  const [carrier, setCarrier] = useState(entry?.carrier ?? '');
  const [amount, setAmount] = useState(entry != null ? String(entry.amount) : '');
  const [approved, setApproved] = useState(entry?.approved ?? false);
  const [enteredBy, setEnteredBy] = useState(entry?.entered_by ?? '');
  const [notes, setNotes] = useState(entry?.notes ?? '');
  const [dateEntered, setDateEntered] = useState(entry?.date_entered ?? '');

  const resetForm = useCallback(() => {
    if (entry) {
      setMcNumber(entry.mc_number);
      setCarrier(entry.carrier);
      setAmount(String(entry.amount));
      setApproved(entry.approved);
      setEnteredBy(entry.entered_by);
      setNotes(entry.notes ?? '');
      setDateEntered(entry.date_entered);
    }
    setMode('view');
    setMessage(null);
  }, [entry]);

  if (!entry) return null;

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!mcNumber.trim() || !carrier.trim() || !enteredBy.trim()) {
      setMessage({ type: 'error', text: 'MC#, Carrier, and User are required.' });
      return;
    }
    if (isNaN(num) || num < 0) {
      setMessage({ type: 'error', text: 'Amount must be a valid number.' });
      return;
    }
    setMessage(null);
    setSubmitting(true);
    try {
      await onUpdate(entry.id, {
        mc_number: mcNumber.trim(),
        carrier: carrier.trim(),
        amount: num,
        approved,
        entered_by: enteredBy.trim(),
        notes: notes.trim() || null,
        date_entered: dateEntered,
      });
      setMessage({ type: 'success', text: 'Updated.' });
      setMode('view');
      onClose();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Update failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      await onDelete(entry.id);
      onClose();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Delete failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString() : '—');
  const formatDateTime = (d: string) => (d ? new Date(d).toLocaleString() : '—');

  const goldButtonClass =
    'min-h-[44px] border-0 px-4 py-2 font-sans text-sm font-medium text-navy transition-opacity hover:opacity-90 disabled:opacity-50';
  const outlineButtonClass = `min-h-[44px] border ${BORDER} bg-navy-row px-4 py-2 font-sans text-sm font-medium text-slate-300 hover:bg-navy-row-alt disabled:opacity-50`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-modal-title"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-lg flex-col border ${BORDER} bg-navy-light shadow-xl sm:max-h-[85vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex shrink-0 items-center justify-between border-b ${BORDER} px-4 py-3`}>
          <h2
            id="entry-modal-title"
            className="font-serif text-lg font-normal text-gold-light"
          >
            {mode === 'view' ? 'Verification details' : 'Edit verification'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 font-sans text-2xl leading-none text-slate-500 hover:text-slate-300"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {mode === 'view' ? (
            <dl className="space-y-3 font-sans text-sm">
              <div>
                <dt className={LABEL_CLASS}>MC#</dt>
                <dd className="mt-0.5 font-mono text-gold-light">{entry.mc_number}</dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>Carrier</dt>
                <dd className="mt-0.5 text-slate-300">{entry.carrier}</dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>Amount</dt>
                <dd className="mt-0.5 font-mono text-slate-300">
                  {typeof entry.amount === 'number' ? entry.amount.toFixed(2) : entry.amount}
                </dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>Approved</dt>
                <dd className="mt-0.5">
                  {entry.approved ? (
                    <span className="status-positive font-mono text-xs">Yes</span>
                  ) : (
                    <span className="status-neutral font-mono text-xs">No</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>User (entered by)</dt>
                <dd className="mt-0.5 text-slate-300">{entry.entered_by}</dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>Notes</dt>
                <dd className="mt-0.5 text-slate-400 whitespace-pre-wrap">{entry.notes || '—'}</dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>Date entered</dt>
                <dd className="mt-0.5 font-mono text-slate-400">{formatDate(entry.date_entered)}</dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>Created</dt>
                <dd className="mt-0.5 font-mono text-xs text-slate-500">{formatDateTime(entry.created_at)}</dd>
              </div>
            </dl>
          ) : (
            <form id="entry-edit-form" onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className={LABEL_CLASS}>MC#</label>
                <input type="text" value={mcNumber} onChange={(e) => setMcNumber(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Carrier</label>
                <input type="text" value={carrier} onChange={(e) => setCarrier(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Amount</label>
                <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>User (entered by)</label>
                <input type="text" value={enteredBy} onChange={(e) => setEnteredBy(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Date entered</label>
                <input type="date" value={dateEntered} onChange={(e) => setDateEntered(e.target.value)} className={INPUT_CLASS} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-slate-400">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                  className="border-gold-muted bg-navy-row text-gold focus:ring-gold/30"
                />
                Approved
              </label>
              <div>
                <label className={LABEL_CLASS}>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={INPUT_CLASS} />
              </div>
              {message && (
                <p className={message.type === 'success' ? 'status-positive' : 'status-negative'}>{message.text}</p>
              )}
            </form>
          )}
        </div>

        <div className={`shrink-0 border-t ${BORDER} p-4`}>
          {showDeleteConfirm ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-sm text-slate-400">Delete this entry?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="min-h-[44px] border border-red-900/50 bg-red-950/50 px-4 py-2 font-sans text-sm font-medium text-red-400 hover:bg-red-900/30 disabled:opacity-50"
              >
                {submitting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={submitting} className={outlineButtonClass}>
                Cancel
              </button>
            </div>
          ) : mode === 'view' ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={goldButtonClass}
                style={{ backgroundImage: 'linear-gradient(135deg, #c9a84c 0%, #d4b85c 100%)', color: '#0a1628' }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="min-h-[44px] border border-red-900/50 bg-transparent px-4 py-2 font-sans text-sm font-medium text-red-400 hover:bg-red-950/30"
              >
                Delete
              </button>
              <button type="button" onClick={onClose} className={outlineButtonClass}>
                Close
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                form="entry-edit-form"
                disabled={submitting}
                className={goldButtonClass}
                style={{ backgroundImage: 'linear-gradient(135deg, #c9a84c 0%, #d4b85c 100%)', color: '#0a1628' }}
              >
                {submitting ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} disabled={submitting} className={outlineButtonClass}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
