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
 * Submits MC#, Carrier, Amount, Approved, User, Notes, Date entered.
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

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Enter MC Verification</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mc-number" className="mb-1 block text-sm font-medium text-slate-600">
            MC#
          </label>
          <input
            id="mc-number"
            type="text"
            value={mcNumber}
            onChange={(e) => setMcNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. 123456"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="carrier" className="mb-1 block text-sm font-medium text-slate-600">
            Carrier
          </label>
          <input
            id="carrier"
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Carrier name"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-slate-600">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="entered-by" className="mb-1 block text-sm font-medium text-slate-600">
            User (entered by)
          </label>
          <input
            id="entered-by"
            type="text"
            value={enteredBy}
            onChange={(e) => setEnteredBy(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Your name"
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="date-entered" className="mb-1 block text-sm font-medium text-slate-600">
            Date entered
          </label>
          <input
            id="date-entered"
            type="date"
            value={dateEntered}
            onChange={(e) => setDateEntered(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={disabled}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              disabled={disabled}
            />
            <span className="text-sm font-medium text-slate-600">Approved</span>
          </label>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-600">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Optional notes"
            disabled={disabled}
          />
        </div>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
      <div className="mt-5">
        <button
          type="submit"
          disabled={disabled || submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save Verification'}
        </button>
      </div>
    </form>
  );
}
