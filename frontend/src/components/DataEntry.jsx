import React, { useMemo, useState } from 'react';
import { SCENARIOS, getAdjConf } from '../data/portfolioConfig';
import DynamicMonteCarlo from './DynamicMonteCarlo';

const DataEntry = ({ data, scenario, sensitivity, onScenarioChange, onSensitivityChange, onSave }) => {
  const [name, setName] = useState('New Initiative');
  const [segment, setSegment] = useState('Unassigned');
  const [gross, setGross] = useState(10);
  const [confidence, setConfidence] = useState(60);
  const [readiness, setReadiness] = useState('Conditional');
  const [logic, setLogic] = useState('User-entered business logic');

  const previewValue = useMemo(() => {
    const g = Number(gross) || 0;
    const c = Number(confidence) || 0;
    const adj = getAdjConf(c, sensitivity);
    return (g * (adj / 100) * SCENARIOS[scenario].multiplier).toFixed(2);
  }, [gross, confidence, scenario, sensitivity]);

  const previewData = useMemo(
    () => ({
      ...data,
      apps: [
        ...data.apps,
        {
          id: 'PREVIEW',
          name,
          segment,
          gross: Number(gross) || 0,
          confidence: Number(confidence) || 0,
          scores: { dc: Number(confidence) || 0, tf: Number(confidence) || 0, dr: Number(confidence) || 0, der: Number(confidence) || 0 },
          readiness,
          stakeholder: { owner: 'Preview', group: segment, influence: 'Low', resistance: 'Low' },
          strategy: 'Preview',
          rationale: { driver: 'User preview', logic, alternatives: ['Status Quo'], time_quadrant: 'Invest' },
        },
      ],
    }),
    [data, name, gross, confidence, readiness, segment, logic]
  );

  const handleSave = (e) => {
    e.preventDefault();
    const g = Number(gross) || 0;
    const c = Number(confidence) || 0;
    onSave({
      name,
      segment,
      gross: g,
      confidence: c,
      readiness,
      logic,
      scores: { dc: c, tf: c, dr: c, der: c },
    });
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s]">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic tracking-tight">Data Entry</h1>
        <p className="text-[#004A96] mt-2 font-black text-sm uppercase tracking-wider">Enter values and preview simulation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">Segment</label>
              <input
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">Gross (€M)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={gross}
                onChange={(e) => setGross(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">Confidence (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">Readiness</label>
              <select
                value={readiness}
                onChange={(e) => setReadiness(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option>Ready</option>
                <option>Conditional</option>
                <option>Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-2">Logic / Rationale</label>
              <textarea
                value={logic}
                onChange={(e) => setLogic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-slate-600">Scenario</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(SCENARIOS).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onScenarioChange(s)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase border ${scenario === s ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-slate-500">Sensitivity</span>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={sensitivity}
                  onChange={(e) => onSensitivityChange(parseInt(e.target.value, 10))}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#004A96]"
                />
                <span className={`text-xs font-black ${sensitivity >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{sensitivity}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Preview Realized</p>
              <p className="text-3xl font-black text-slate-900">€{previewValue}M</p>
              <p className="text-[10px] text-slate-500">Adjusted by scenario and sensitivity</p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Gross: €{Number(gross).toFixed(1)}M</p>
              <p>Confidence: {confidence}%</p>
              <p>Scenario: {scenario}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black uppercase tracking-wide shadow-lg hover:bg-blue-700 transition-colors"
            >
              Save and Send to Dashboard
            </button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Realtime probability with preview</p>
          <DynamicMonteCarlo data={previewData} scenario={scenario} sensitivity={sensitivity} />
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
