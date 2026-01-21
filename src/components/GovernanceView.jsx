import React from 'react';

const GovernanceView = ({ data }) => {
  if (!data) return <div className="p-10 text-slate-500">Loading Governance Data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-800">Governance & RACI [cite: 6, 169]</h1>

      {/* RACI Matrix [cite: 172] */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm">
        <h3 className="text-xs font-black text-blue-600 uppercase mb-6 tracking-widest">Decision Rights Matrix [cite: 170]</h3>
        <table className="w-full text-left">
          <thead className="border-b text-[10px] uppercase text-slate-400 font-bold">
            <tr>
              <th className="pb-4">Program Activity</th>
              <th className="pb-4">Role</th>
              <th className="pb-4">Responsibility</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {data.raci.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-4 font-bold text-slate-700">{row.task} [cite: 172]</td>
                <td className="py-4 text-slate-600">{row.role} [cite: 171]</td>
                <td className="py-4 font-black text-blue-600 italic">{row.raci} [cite: 172]</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gate Criteria [cite: 172, 176] */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl">
        <h3 className="text-xs font-black text-blue-400 uppercase mb-4">Phase-Gate Readiness [cite: 172]</h3>
        <ul className="space-y-3 text-sm">
          {data.gates.map((gate, i) => (
            <li key={i} className="flex items-center gap-2">✔ {gate} [cite: 320]</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GovernanceView; // Required to fix the SyntaxError