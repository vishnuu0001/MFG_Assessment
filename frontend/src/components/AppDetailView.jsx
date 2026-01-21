import React from 'react';
import { ArrowLeft, ShieldCheck, Target, Info, CheckCircle2 } from 'lucide-react';

const AppDetailView = ({ app, onBack }) => {
  // Logic from Source 109: Confidence % = (DC + TF + DR + DeR + ER) ÷ 25 × 100
  const confidencePct = ((app.dc + app.tf + app.dr + app.der + app.er) / 25 * 100).toFixed(0);

  // Banding logic from Source 103
  const getBandInfo = (pct) => {
    if (pct >= 75) return { bg: 'bg-green-100', text: 'text-green-700', label: 'High (Committable)' };
    if (pct >= 50) return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium (Conditional)' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Low (Aspirational)' };
  };

  const band = getBandInfo(confidencePct);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 font-bold text-xs group hover:underline"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO SEGMENT INVENTORY
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Assessment Findings [Source 157, 210] */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
              Strategy: {app.strategy || 'Elimination First'} [cite: 224]
            </div>

            <header className="mb-10">
              <h1 className="text-5xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">
                {app.name}
              </h1>
              <p className="text-slate-400 mt-3 font-mono text-sm">
                APP_ID: {app.id} | <span className="text-blue-500 font-bold">WP1 ASSESSMENT COMPLETE</span>
              </p>
            </header>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <CheckCircle2 size={16} /> SIMULATED WP1 FINDINGS [cite: 145]
              </h3>
              <div className="grid gap-4">
                {app.findings?.map((finding, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="mt-1 text-blue-500"><Info size={18} /></div>
                    <p className="text-slate-700 font-medium leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Confidence Scoring [Source 98, 110] */}
        <aside className="space-y-6">
          <div className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-2xl text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Confidence of Realization [cite: 94]
            </p>
            <p className="text-8xl font-black italic tracking-tighter">
              {confidencePct}%
            </p>
            <div className={`mt-6 inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${band.bg} ${band.text}`}>
              {band.label} [cite: 97]
            </div>
          </div>

          {/* Dimension Breakdown [Source 99, 106] */}
          <div className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Target size={16} /> DIMENSION SCORES [cite: 106]
            </h4>

            <div className="space-y-5">
              {[
                { label: 'DATA', val: app.dc },
                { label: 'TECH', val: app.tf },
                { label: 'DEP', val: app.dr },
                { label: 'DEC', val: app.der },
                { label: 'EXEC', val: app.er }
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="flex justify-between items-center mb-1.5 px-1 font-bold text-[10px] text-slate-500 uppercase">
                    <span>{dim.label}</span>
                    <span className="text-blue-600">{dim.val}/5</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(dim.val/5)*100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AppDetailView;