import React from 'react';

const ChangeMgmtView = ({ data }) => {
  if (!data) return <div className="p-10 text-slate-500">Loading Change Strategy...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">Change Management [cite: 9, 89]</h1>

      {/* 4-Week Plan [cite: 21, 83, 85] */}
      <div className="grid grid-cols-4 gap-4">
        {data.comms_plan.map((week) => (
          <div key={week.w} className="bg-white p-4 rounded-2xl border shadow-sm border-t-4 border-t-blue-500">
            <p className="text-blue-600 font-black">{week.w} [cite: 85]</p>
            <p className="text-xs font-bold uppercase mt-1">{week.t} [cite: 85]</p>
            <p className="text-[10px] text-slate-400 mt-2">{week.d} [cite: 85]</p>
          </div>
        ))}
      </div>

      {/* Stakeholder Strategy [cite: 9, 90, 91] */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h3 className="text-xs font-black text-blue-600 uppercase mb-6 tracking-widest">Stakeholder Impact Assessment [cite: 299]</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.stakeholders.map((s) => (
            <div key={s.name} className="p-4 bg-slate-50 rounded-xl border">
              <p className="text-sm font-bold text-slate-800">{s.name} [cite: 91]</p>
              <p className="text-xs text-slate-500 mt-1 italic">{s.strategy} [cite: 301]</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangeMgmtView; // Required to fix the SyntaxError