import React from 'react';

const SavingsTracker = ({ portfolio }) => {
  const totalWeighted = portfolio?.reduce((acc, curr) => acc + curr.total_weighted, 0) || 0;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="bg-blue-600 text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Confidence-Weighted View [cite: 95]</p>
            <p className="text-7xl font-black italic mt-2">€{totalWeighted.toFixed(2)}M</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Target Threshold [cite: 15, 209]</p>
            <p className="text-4xl font-black mt-2">€60.00M</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-900 opacity-30">
          <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(totalWeighted/60)*100}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "High (Committable)", val: "€1.39M", color: "border-green-500" },
          { label: "Medium (Conditional)", val: "€0.95M", color: "border-amber-500" },
          { label: "Low (Aspirational)", val: "€0.48M", color: "border-red-500" }
        ].map(band => (
          <div key={band.label} className={`bg-white p-6 rounded-2xl border-l-8 ${band.color} shadow-sm`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{band.label} [cite: 97]</p>
            <p className="text-2xl font-black text-slate-800 mt-2">{band.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsTracker;