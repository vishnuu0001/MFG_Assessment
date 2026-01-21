import React, { useState } from 'react';
import { X } from 'lucide-react';
import { READINESS_MAP, SCENARIOS, SCORING_LOGIC, getAdjConf } from '../data/portfolioConfig';

const AppDetailOverlay = ({ app, scenario, sensitivity, initialTab, onClose }) => {
  const [tab, setTab] = useState(initialTab || 'Overview');

  if (!app) return null;

  const adjConf = getAdjConf(app.confidence, sensitivity);
  const weighted = (app.gross * (adjConf / 100) * SCENARIOS[scenario].multiplier).toFixed(2);
  const readiness = READINESS_MAP[app.readiness];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-10">
      <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-[#004A96] p-8 flex justify-between items-start text-white">
          <div className="flex-1">
            <div className="flex gap-3 mb-3">
              <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-wider">{app.segment}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-white/30 ${readiness.color}`}>
                {readiness.icon} {readiness.label}
              </span>
            </div>
            <h2 className="text-4xl font-extrabold italic tracking-tight leading-none mb-2">{app.name}</h2>
            <div className="flex gap-6 mt-2 text-blue-100 text-[10px] font-mono uppercase tracking-widest">
              <span>ID: {app.id}</span> <span>Owner: {app.stakeholder.owner}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 px-8 bg-slate-50">
          {['Overview', 'Methodology', 'Strategy', 'Stakeholders'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${
                tab === t ? 'border-[#004A96] text-[#004A96]' : 'border-transparent text-slate-700 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-[#F0F5FA]">
          {tab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-around text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Gross</p>
                    <p className="text-3xl font-black text-slate-800">€{app.gross.toFixed(2)}M</p>
                  </div>
                  <div className="text-slate-300 font-black text-xl">×</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Adj. Confidence</p>
                    <p className="text-3xl font-black text-slate-800">{adjConf}%</p>
                  </div>
                  <div className="text-slate-300 font-black text-xl">=</div>
                  <div className="bg-[#004A96] p-4 rounded-xl text-white shadow-lg font-black italic text-2xl">€{weighted}M</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border-l-4 border-emerald-500 shadow-sm font-bold">
                  <h3 className="uppercase text-xs tracking-widest mb-4">Uplift Impact</h3>
                  {app.uplift_actions.length > 0 ? (
                    app.uplift_actions.map((act, i) => (
                      <div key={i} className="p-2 bg-slate-50 mb-2 border rounded flex justify-between">
                        <span>{act.task}</span>
                        <span className="text-emerald-600">+{act.impact}%</span>
                      </div>
                    ))
                  ) : (
                    'No active gaps.'
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wide mb-6">Readiness Scores</h3>
                {Object.entries(SCORING_LOGIC).map(([key, methodology]) => (
                  <div key={key} className="relative group mb-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase">{methodology.label}</span>
                      <span className="text-[10px] font-black text-slate-900">{app.scores[key]}/100</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#004A96]" style={{ width: `${app.scores[key]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Methodology' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-[fadeIn_0.3s]">
              <h3 className="font-black text-[#004A96] uppercase text-sm tracking-widest mb-6">Confidence Methodology Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(SCORING_LOGIC).map(([key, m]) => (
                  <div key={key} className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{m.label}</p>
                    <p className="text-sm font-bold text-slate-900 border-l-4 border-[#004A96] pl-4 italic leading-relaxed">"{m.question}"</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Assessed Score</span>
                      <span className="text-lg font-black text-[#004A96]">{app.scores[key]}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-[fadeIn_0.3s]">
              <div className="bg-white p-8 rounded-2xl border-l-4 border-[#004A96] shadow-sm font-bold">
                <h3 className="text-lg font-extrabold text-[#004A96] uppercase mb-4">Strategic Logic</h3>
                <p className="text-sm text-slate-800 leading-relaxed italic mb-4">"{app.rationale.logic}"</p>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Driver: {app.rationale.driver}</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center">
                <div className="relative w-64 h-64 bg-slate-50 border border-slate-300 rounded-xl">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-[8px] font-bold text-slate-400 p-2 uppercase">
                    <span>TOLERATE</span>
                    <span className="text-right">INVEST</span>
                    <span className="self-end">ELIMINATE</span>
                    <span className="self-end text-right">MIGRATE</span>
                  </div>
                  <div
                    className="absolute w-5 h-5 rounded-full bg-[#004A96] border-2 border-white transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: app.rationale.time_quadrant === 'Invest' || app.rationale.time_quadrant === 'Tolerate' ? '25%' : '75%', left: app.rationale.time_quadrant === 'Invest' || app.rationale.time_quadrant === 'Migrate' ? '75%' : '25%' }}
                  />
                </div>
                <p className="mt-4 text-xs font-black uppercase bg-slate-100 px-4 py-1 rounded-full">Placement: {app.rationale.time_quadrant}</p>
              </div>
            </div>
          )}

          {tab === 'Stakeholders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-[fadeIn_0.3s]">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#004A96] flex items-center justify-center text-white text-2xl font-black italic">{app.stakeholder.owner[0]}</div>
                <div>
                  <p className="text-xl font-black text-slate-900">{app.stakeholder.owner}</p>
                  <p className="text-sm text-slate-600 font-bold uppercase tracking-wider">{app.stakeholder.group}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Influence</span>
                  <span className="text-sm font-black">{app.stakeholder.influence}</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Resistance</span>
                  <span className={`text-sm font-black ${app.stakeholder.resistance === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>{app.stakeholder.resistance}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDetailOverlay;
