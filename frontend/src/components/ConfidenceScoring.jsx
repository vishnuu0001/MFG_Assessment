import React from 'react';
import { READINESS_MAP, SCENARIOS, getAdjConf } from '../data/portfolioConfig';

const ConfidenceScoring = ({ data, scenario, sensitivity, onSelectApp }) => (
  <div className="space-y-8 animate-[fadeIn_0.5s]">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic tracking-tight leading-none">Confidence Model</h1>
        <p className="text-[#004A96] mt-2 font-black text-sm uppercase tracking-wider">Weighted Scoring and Readiness</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-3 gap-6">
      {data.apps.map((app) => {
        const adj = getAdjConf(app.confidence, sensitivity);
        const readiness = READINESS_MAP[app.readiness];
        const realizedValue = (app.gross * (adj / 100) * SCENARIOS[scenario].multiplier).toFixed(2);

        return (
          <button
            key={app.id}
            onClick={() => onSelectApp(app)}
            className="group p-6 rounded-2xl border border-slate-200 cursor-pointer hover:border-[#004A96] hover:shadow-xl bg-white transition-all text-left"
          >
            <p className="font-black text-slate-800 text-sm mb-1 truncate">{app.name}</p>
            <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[9px] font-black uppercase mb-4 ${readiness.color}`}>
              {readiness.icon} {readiness.label}
            </div>
            <div className="flex items-end justify-between border-t pt-4">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Impact realization</p>
                <p className="text-xl font-black text-[#004A96]">€{realizedValue}M</p>
              </div>
              <div className="text-right font-black text-sm text-slate-700">{adj}%</div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default ConfidenceScoring;
