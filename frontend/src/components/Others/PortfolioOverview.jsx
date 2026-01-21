import React from 'react';
import { Target } from 'lucide-react';
import DynamicMonteCarlo from '../DynamicMonteCarlo';
import { getAdjConf } from '../../data/portfolioConfig';

const PortfolioOverview = ({ data, scenario, sensitivity, totalWeighted, onSelectApp }) => (
  <div className="space-y-8 animate-[fadeIn_0.5s]">
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic tracking-tight">Portfolio Overview</h1>
      <p className="text-[#004A96] mt-2 font-black text-sm uppercase tracking-wider">WP1 Decision Cockpit</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-[#004A96] p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between h-full relative overflow-hidden group">
        <p className="text-xs font-bold text-blue-50 uppercase tracking-widest">Savings Ambition</p>
        <p className="text-5xl font-extrabold mt-2">€{data.stats.target}M</p>
        <Target size={100} className="absolute right-[-20px] bottom-[-20px] opacity-10" />
      </div>
      <div className="md:col-span-1">
        <DynamicMonteCarlo data={data} scenario={scenario} sensitivity={sensitivity} />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">Weighted Realization</p>
        <p className="text-4xl font-extrabold text-slate-900">€{totalWeighted.toFixed(2)}M</p>
        <div className="h-2 bg-slate-100 rounded-full mt-4">
          <div className="h-full bg-[#004A96] transition-all" style={{ width: `${Math.min((totalWeighted / data.stats.target) * 100, 100)}%` }} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full text-center">
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-[10px] font-black text-slate-500 uppercase">Coverage</p>
          <p className="text-xs font-black text-emerald-700">{data.stats.coverage.cost}%</p>
        </div>
        <div className="pt-2">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Ambition Gap</p>
          <p className="text-sm font-black text-rose-700">€{(data.stats.target - totalWeighted).toFixed(1)}M</p>
        </div>
      </div>
    </div>

    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">Savings Opportunity Map</h3>
          <p className="text-[10px] font-bold text-slate-400">Blended View: Value (Y) vs. Readiness (X)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] font-bold text-slate-600 uppercase">Strategic Bet</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> <span className="text-[10px] font-bold text-slate-600 uppercase">Quick Win</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-[10px] font-bold text-slate-600 uppercase">High Risk</span></div>
        </div>
      </div>

      <div className="relative w-full h-[400px] bg-white border border-slate-100 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-rose-50/30 border-r border-b border-dashed border-slate-200"><span className="absolute top-4 left-4 text-[10px] font-black text-rose-300 uppercase tracking-widest">High Value / High Risk</span></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-50/30 border-b border-dashed border-slate-200"><span className="absolute top-4 right-4 text-[10px] font-black text-emerald-300 uppercase tracking-widest">Strategic Bets</span></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white border-r border-dashed border-slate-200" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-amber-50/30"><span className="absolute bottom-4 right-4 text-[10px] font-black text-amber-300 uppercase tracking-widest">Quick Wins</span></div>

        {(() => {
          const maxGross = Math.max(...data.apps.map((a) => a.gross), 1);
          return data.apps.map((app) => {
            const adjConf = Math.min(98, Math.max(2, getAdjConf(app.confidence, sensitivity)));
            const gross = app.gross;
            const bottom = Math.min(95, Math.max(5, (gross / maxGross) * 90));
            let color = 'rose';
            if (adjConf >= 70) {
              color = gross >= maxGross * 0.6 ? 'emerald' : 'amber';
            } else if (gross < maxGross * 0.4) {
              color = 'rose';
            }
            const bgColor = `bg-${color}-500`;
            const textColor = `text-${color}-800`;
            const boxBg = `bg-${color}-50`;
            const borderColor = `border-${color}-200`;

            const placeAbove = bottom < 80;
            const tooltipY = placeAbove ? 'bottom-full mb-2' : 'top-full mt-2';
            const tooltipTranslateY = placeAbove ? '-translate-y-0' : 'translate-y-0';
            const clampLeft = Math.min(Math.max(adjConf, 6), 94);

            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app)}
                className="absolute cursor-pointer group z-10"
                style={{ left: `${clampLeft}%`, bottom: `${bottom}%`, transform: 'translate(-50%, 50%)' }}
              >
                <div
                  className={`${boxBg} border ${borderColor} p-2 rounded-lg shadow-sm whitespace-nowrap transition-all group-hover:scale-110 z-20 absolute ${tooltipY} left-1/2 -translate-x-1/2 ${tooltipTranslateY}`}
                >
                  <p className={`text-[9px] font-black ${textColor} uppercase truncate max-w-[140px]`}>{app.name}</p>
                  <p className={`text-[10px] font-bold ${textColor}`}>€{gross.toFixed(1)}M</p>
                </div>
                <div className={`absolute ${placeAbove ? 'bottom-full' : 'top-full'} left-1/2 -translate-x-1/2 w-px h-2 ${bgColor}`} />
                <div className={`w-3 h-3 rounded-full ${bgColor} border-2 border-white shadow-md group-hover:scale-125 transition-transform`} />
              </div>
            );
          });
        })()}
      </div>
    </div>
  </div>
);

export default PortfolioOverview;
