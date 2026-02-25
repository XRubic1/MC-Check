import { useState } from 'react';
import { EntryForm } from './components/EntryForm';
import { VerificationTable } from './components/VerificationTable';
import { useMcVerifications } from './hooks/useMcVerifications';

type TabId = 'enter' | 'list';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('enter');
  const { list, loading, error, refetch, addVerification, updateVerification, deleteVerification } =
    useMcVerifications();

  const tabs: { id: TabId; label: string }[] = [
    { id: 'enter', label: 'Enter MC Verification' },
    { id: 'list', label: 'Verification List' },
  ];

  return (
    <div className="relative min-h-[100dvh]">
      <header className="border-b border-[rgba(201,168,76,0.18)] px-3 py-4 sm:px-4 sm:py-5">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-serif text-2xl font-normal tracking-tight text-[#d4b85c] sm:text-3xl">
            MC-Check
          </h1>
          <p className="mt-1 font-sans text-sm text-slate-400">MC verification entries</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-5 sm:px-4 sm:py-6">
        <div className="mb-5 flex border border-[rgba(201,168,76,0.18)] bg-navy-row sm:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] flex-1 border-r border-[rgba(201,168,76,0.18)] px-3 py-2.5 font-sans text-sm font-medium transition last:border-r-0 sm:min-h-0 sm:px-4 ${
                activeTab === tab.id
                  ? 'bg-[rgba(201,168,76,0.12)] text-gold-light'
                  : 'text-slate-400 hover:bg-navy-row-alt hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'enter' && (
          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <EntryForm onSubmit={addVerification} disabled={loading} />
          </div>
        )}
        {activeTab === 'list' && (
          <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
            <VerificationTable
              list={list}
              loading={loading}
              error={error}
              onRefetch={refetch}
              onUpdate={updateVerification}
              onDelete={deleteVerification}
            />
          </div>
        )}
      </main>
    </div>
  );
}
