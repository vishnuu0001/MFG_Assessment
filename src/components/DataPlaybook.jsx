import React from 'react';
import { ChevronRight } from 'lucide-react';

const DataPlaybook = ({ data, onSelectApp }) => (
  <div className="animate-[fadeIn_0.5s] space-y-8">
    <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic">Data Playbook</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border-t-4 border-emerald-500 shadow-sm p-6 flex flex-col">
        <h3 className="font-extrabold uppercase text-sm mb-4">Cost Data</h3>
        <div className="space-y-2 mt-auto">
          {data.apps.filter((a) => a.scores.dc < 70).map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app, 'Methodology')}
              className="w-full text-left p-2 bg-slate-50 rounded border border-slate-200 text-[9px] font-bold text-slate-800 flex justify-between group"
            >
              {app.name} <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border-t-4 border-rose-500 shadow-sm p-6 flex flex-col">
        <h3 className="font-extrabold uppercase text-sm mb-4">Usage Data</h3>
        <div className="space-y-2 mt-auto">
          {data.apps.filter((a) => a.scores.tf < 70).map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app, 'Methodology')}
              className="w-full text-left p-2 bg-slate-50 rounded border border-slate-200 text-[9px] font-bold text-slate-800 flex justify-between group"
            >
              {app.name} <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border-t-4 border-amber-500 shadow-sm p-6 flex flex-col">
        <h3 className="font-extrabold uppercase text-sm mb-4">Dependencies</h3>
        <div className="space-y-2 mt-auto">
          {data.apps.filter((a) => a.scores.dr < 70).map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app, 'Methodology')}
              className="w-full text-left p-2 bg-slate-50 rounded border border-slate-200 text-[9px] font-bold text-slate-800 flex justify-between group"
            >
              {app.name} <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DataPlaybook;
