import React from 'react';

const StakeholderReadiness = ({ data }) => (
  <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic tracking-tight">Stakeholder Readiness</h1>
      <p className="text-[#004A96] mt-2 font-black text-xs uppercase tracking-wider">Organizational Alignment Matrix</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
        <h3 className="w-full font-black text-slate-900 uppercase text-xs tracking-widest mb-8">Influence vs. Resistance Grid</h3>
        <div className="relative w-80 h-80 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 text-[8px] font-bold uppercase p-2">
            <span>Manage Closely</span>
            <span className="text-right">Partner</span>
            <span>Monitor</span>
            <span className="text-right">Inform</span>
          </div>
          {data.stakeholder_matrix.map((s, i) => (
            <div
              key={i}
              className={`absolute w-12 h-12 rounded-full ${s.color} border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-black text-center p-1 cursor-pointer hover:scale-110 transition-transform`}
              style={{ left: `${s.x}%`, bottom: `${s.y}%`, transform: 'translate(-50%, 50%)' }}
            >
              {s.group}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {data.stakeholder_matrix.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-12 rounded-full ${s.color}`} />
              <p className="font-black text-slate-900 text-sm">{s.group}</p>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{s.strategy}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StakeholderReadiness;
