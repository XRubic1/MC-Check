import { useState } from 'react';
import { EntryForm } from './components/EntryForm';
import { VerificationTable } from './components/VerificationTable';
import { useMcVerifications } from './hooks/useMcVerifications';

type TabId = 'enter' | 'list';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('enter');
  const { list, loading, error, refetch, addVerification } = useMcVerifications();

  const tabs: { id: TabId; label: string }[] = [
    { id: 'enter', label: 'Enter MC Verification' },
    { id: 'list', label: 'Verification List' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-800">MC-Check</h1>
          <p className="mt-0.5 text-sm text-slate-500">MC verification entries</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-slate-200/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'enter' && (
          <EntryForm onSubmit={addVerification} disabled={loading} />
        )}
        {activeTab === 'list' && (
          <VerificationTable
            list={list}
            loading={loading}
            error={error}
            onRefetch={refetch}
          />
        )}
      </main>
    </div>
  );
}
