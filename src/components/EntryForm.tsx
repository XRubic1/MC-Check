import { useState, FormEvent } from 'react';
import type { MCVerificationInsert } from '../types/mc-check';

interface EntryFormProps {
  onSubmit: (row: MCVerificationInsert) => Promise<void>;
  disabled?: boolean;
}

/** Returns today's date as YYYY-MM-DD for date input default. */
function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Form for entering a new MC verification.
 * Dark luxury theme: navy panel, gold border, gold gradient button.
 */
export function EntryForm({ onSubmit, disabled }: EntryFormProps) {
  const [mcNumber, setMcNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [amount, setAmount] = useState('');
  const [approved, setApproved] = useState(false);
  const [enteredBy, setEnteredBy] = useState('');
  const [notes, setNotes] = useState('');
  const [dateEntered, setDateEntered] = useState(getTodayDateString);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
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
      await onSubmit({
        mc_number: mcNumber.trim(),
        carrier: carrier.trim(),
        amount: num,
        approved,
        entered_by: enteredBy.trim(),
        notes: notes.trim() || null,
        date_entered: dateEntered,
      });
      setMcNumber('');
      setCarrier('');
      setAmount('');
      setApproved(false);
      setEnteredBy('');
      setNotes('');
      setDateEntered(getTodayDateString());
      setMessage({ type: 'success', text: 'Verification added successfully.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border bg-navy-row px-2.5 py-1.5 font-sans text-sm text-slate-200 placeholder-slate-500 focus:border-gold/50 focus:ring-1 focus:ring-gold/25';
  const labelClass = 'mb-0.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[rgba(201,168,76,0.18)] bg-navy-light/60 p-3 sm:p-4"
    >
      <h2 className="mb-3 font-serif text-lg font-normal text-gold-light">
        Enter MC Verification
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label htmlFor="mc-number" className={labelClass}>MC#</label>
          <input
            id="mc-number"
            type="text"
            value={mcNumber}
            onChange={(e) => setMcNumber(e.target.value)}
            className={inputClass}
            placeholder="123456"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="carrier" className={labelClass}>Carrier</label>
          <input
            id="carrier"
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className={inputClass}
            placeholder="Carrier"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="amount" className={labelClass}>Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            placeholder="0.00"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="entered-by" className={labelClass}>User</label>
          <input
            id="entered-by"
            type="text"
            value={enteredBy}
            onChange={(e) => setEnteredBy(e.target.value)}
            className={inputClass}
            placeholder="Name"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="date-entered" className={labelClass}>Date</label>
          <input
            id="date-entered"
            type="date"
            value={dateEntered}
            onChange={(e) => setDateEntered(e.target.value)}
            className={inputClass}
            disabled={disabled}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-1.5 font-sans text-xs text-slate-400">
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
              className="border-gold-muted bg-navy-row text-gold focus:ring-gold/30"
              disabled={disabled}
            />
            Approved
          </label>
        </div>
        <div className="col-span-2 sm:col-span-3 lg:col-span-6">
          <label htmlFor="notes" className={labelClass}>Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={inputClass + ' min-h-[52px] resize-none'}
            placeholder="Optional notes"
            disabled={disabled}
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={disabled || submitting}
          className="min-h-[40px] shrink-0 border-0 px-4 py-1.5 font-sans text-sm font-medium text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundImage: 'linear-gradient(135deg, #c9a84c 0%, #d4b85c 100%)',
            color: '#0a1628',
          }}
        >
          {submitting ? 'Saving…' : 'Save Verification'}
        </button>
        {message && (
          <p
            className={`font-sans text-sm ${
              message.type === 'success' ? 'status-positive' : 'status-negative'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
