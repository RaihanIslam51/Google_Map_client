'use client';

import { useState } from 'react';
import { Save, Shield } from 'lucide-react';

const TABS = ['General', 'Scraper', 'Browser', 'Database', 'Exports'];

function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
      <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-8">
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-800">{label}</p>
        {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function NumberInput({ defaultValue, min, max, unit }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" defaultValue={defaultValue} min={min} max={max}
        className="w-24 bg-[#F8FAFC] border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none text-right" />
      {unit && <span className="text-xs text-slate-500">{unit}</span>}
    </div>
  );
}

function Toggle({ defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button onClick={() => setChecked(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#4F46E5]' : 'bg-slate-200'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <div className="space-y-5 max-w-3xl py-2 text-slate-800">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure the scraper engine and system parameters.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl p-1 w-fit shadow-2xs">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === tab ? 'bg-[#4F46E5] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div className="space-y-4">
          <Section title="Application">
            <Field label="Application Name" description="Display name for the dashboard">
              <input defaultValue="ScrapeFlow" className="w-48 bg-[#F8FAFC] border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none" />
            </Field>
            <Field label="API Base URL" description="Backend API endpoint">
              <input defaultValue="http://localhost:5000/api" className="w-64 bg-[#F8FAFC] border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none" />
            </Field>
          </Section>
        </div>
      )}

      {activeTab === 'Scraper' && (
        <div className="space-y-4">
          <Section title="Collection Limits">
            <Field label="Maximum Results per Search" description="Max businesses to collect per keyword">
              <NumberInput defaultValue={100} min={1} max={500} unit="results" />
            </Field>
            <Field label="Scroll Attempts" description="How many times to scroll the result list">
              <NumberInput defaultValue={30} min={5} max={100} unit="times" />
            </Field>
            <Field label="Retry Count" description="Retries per failed business">
              <NumberInput defaultValue={3} min={1} max={10} unit="retries" />
            </Field>
          </Section>
          <Section title="Timing">
            <Field label="Minimum Delay" description="Min wait time between requests">
              <NumberInput defaultValue={1000} min={500} max={5000} unit="ms" />
            </Field>
            <Field label="Maximum Delay" description="Max wait time between requests">
              <NumberInput defaultValue={2500} min={1000} max={10000} unit="ms" />
            </Field>
            <Field label="Action Timeout" description="Timeout for each page action">
              <NumberInput defaultValue={15000} min={5000} max={60000} unit="ms" />
            </Field>
            <Field label="Navigation Timeout" description="Timeout for page navigation">
              <NumberInput defaultValue={30000} min={5000} max={120000} unit="ms" />
            </Field>
          </Section>
        </div>
      )}

      {activeTab === 'Browser' && (
        <div className="space-y-4">
          <Section title="Chromium Settings">
            <Field label="Headless Mode" description="Run browser without a visible window (faster)">
              <Toggle defaultChecked={false} />
            </Field>
            <Field label="Slow Motion" description="Slow down browser actions for debugging">
              <NumberInput defaultValue={50} min={0} max={500} unit="ms" />
            </Field>
          </Section>
        </div>
      )}

      {activeTab === 'Database' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-0.5">Security Warning</p>
              <p className="text-xs text-amber-700 font-medium">MongoDB credentials and connection strings are managed via <code className="text-amber-900 bg-amber-100 px-1 py-0.5 rounded">.env</code> files on the server. They are not editable here to prevent accidental exposure.</p>
            </div>
          </div>
          <Section title="Connection Status">
            <Field label="Connection" description="Current MongoDB connection">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
              </span>
            </Field>
            <Field label="Database" description="Active database name">
              <span className="text-xs text-slate-700 font-mono font-bold">google_maps_scraper</span>
            </Field>
          </Section>
        </div>
      )}

      {activeTab === 'Exports' && (
        <div className="space-y-4">
          <Section title="Export Defaults">
            <Field label="Default Format" description="Default export file format">
              <select className="bg-[#F8FAFC] border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none">
                <option>CSV</option>
                <option>JSON</option>
              </select>
            </Field>
            <Field label="Auto-export on completion" description="Automatically export data after each scraping run">
              <Toggle defaultChecked={true} />
            </Field>
          </Section>
        </div>
      )}

      {/* Save */}
      {activeTab !== 'Database' && (
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
