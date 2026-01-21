import React from 'react';
import { SCENARIOS } from '../data/portfolioConfig';

const SimulationControls = ({ scenario, setScenario, sensitivity, setSensitivity }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    <div className="bg-white p-3 rounded-xl border border-slate-300 flex justify-between items-center shadow-sm">
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {Object.keys(SCENARIOS).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-md ${scenario === s ? 'bg-white text-[#004A96] shadow-sm' : 'text-slate-500'}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
    <div className="bg-white p-4 rounded-xl border border-slate-300 flex flex-col justify-center shadow-sm px-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-slate-700 uppercase">Confidence Adjustment</span>
        <span className={`px-2 py-0.5 rounded font-black text-[10px] ${sensitivity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {sensitivity}%
        </span>
      </div>
      <input
        type="range"
        min="-10"
        max="10"
        step="1"
        value={sensitivity}
        onChange={(e) => setSensitivity(parseInt(e.target.value, 10))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#004A96]"
      />
    </div>
  </div>
);

export default SimulationControls;
