import React from 'react';
import { TrendingDown, DollarSign, Target, BarChart3 } from 'lucide-react';

const SixRDisposition = () => {
  const dispositionData = [
    {
      disposition: 'Retire (Eliminate: 20%)',
      industryBenchmark: '100% of TCO',
      voiceOfData: '724 (Business Apps)',
      confidenceScore: '15-20%',
      savingsTarget: '€18-22 Mn',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      disposition: 'Replace [SaaS]',
      industryBenchmark: '25-30% TCO',
      voiceOfData: '~200 (Commodity COTS)',
      confidenceScore: '10-15%',
      savingsTarget: '€2-4 Mn',
      color: 'bg-white border-slate-200'
    },
    {
      disposition: 'Rehost',
      industryBenchmark: '15-20% Infra',
      voiceOfData: '~231 (Standard Apps)',
      confidenceScore: '10-15%',
      savingsTarget: '€1-3 Mn',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      disposition: 'Refactor',
      industryBenchmark: '40% of TCO',
      voiceOfData: '790 (Bespoke)',
      confidenceScore: '15-20%',
      savingsTarget: '€9-11 Mn',
      color: 'bg-white border-slate-200'
    }
  ];

  const costBreakdown = [
    { label: 'License costs', percentage: '~30%', color: 'bg-blue-600' },
    { label: 'Labor costs', percentage: '~35%', color: 'bg-indigo-600' },
    { label: 'Infrastructure & Networks', percentage: '~25%', color: 'bg-purple-600' },
    { label: 'Facility & other costs', percentage: '~10%', color: 'bg-slate-600' }
  ];

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic tracking-tight">
          6R Disposition Analysis
        </h1>
        <p className="text-[#004A96] mt-2 font-black text-sm uppercase tracking-wider">
          Potential Opportunities leading towards €60M Annual Run Cost (ARC) Savings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Business Apps</p>
          <p className="text-4xl font-extrabold text-[#004A96]">3,785</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Desktop Apps</p>
          <p className="text-4xl font-extrabold text-slate-700">8,832</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Total Apps</p>
          <p className="text-4xl font-extrabold text-slate-900">12,617</p>
        </div>
        <div className="bg-[#004A96] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <p className="text-xs font-bold text-blue-50 uppercase tracking-widest mb-2">Total Costs</p>
          <p className="text-3xl font-extrabold">€583 Mn</p>
          <p className="text-xs mt-2 text-blue-100">License: €200M | Apps: €383M</p>
          <DollarSign size={80} className="absolute right-[-10px] bottom-[-10px] opacity-10" />
        </div>
      </div>

      {/* Cost Assumption Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0" />
            <p className="text-sm font-bold">
              For simplicity and to provide a rough estimate, we considered 80% of the total 583 million costs as pertaining to business applications.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-white mt-2 flex-shrink-0" />
            <p className="text-sm font-bold">
              We also applied equal weighting to calculate the average cost per application across all 3,785 applications.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">
            Below table is indicative view based on current visibility only considering business apps:
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#004A96] text-white">
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">6R Disposition</th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Industry Benchmark<br />(Potential)
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                  Voice of Data<br />(Potential Candidates)
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Confidence Score</th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Potential Savings Target</th>
              </tr>
            </thead>
            <tbody>
              {dispositionData.map((row, index) => (
                <tr key={index} className={`border-b ${row.color} transition-colors hover:bg-blue-100`}>
                  <td className="px-6 py-4 font-bold text-slate-900">{row.disposition}</td>
                  <td className="px-6 py-4 text-slate-700">{row.industryBenchmark}</td>
                  <td className="px-6 py-4 font-bold text-[#004A96]">{row.voiceOfData}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500"
                          style={{ width: row.confidenceScore.split('-')[1] }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{row.confidenceScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-emerald-700 text-lg">{row.savingsTarget}</td>
                </tr>
              ))}
              
              {/* Total Row */}
              <tr className="bg-slate-100 border-b border-slate-300">
                <td colSpan="3" className="px-6 py-5 font-extrabold text-slate-900 uppercase text-right">
                  Total Potential Savings
                </td>
                <td className="px-6 py-5"></td>
                <td className="px-6 py-5 font-extrabold text-emerald-700 text-2xl">€30-40 Mn</td>
              </tr>
              
              {/* Gap Row */}
              <tr className="bg-rose-50 border-b border-rose-200">
                <td colSpan="3" className="px-6 py-5 font-extrabold text-slate-900 uppercase text-right">
                  GAP to TARGET
                </td>
                <td className="px-6 py-5"></td>
                <td className="px-6 py-5 font-extrabold text-rose-700 text-2xl">€20-30 Mn</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Breakdown Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={24} className="text-[#004A96]" />
          <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">
            Based on our experience and industry benchmark
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {costBreakdown.map((item, index) => (
            <div key={index} className="relative">
              <div className={`${item.color} text-white p-6 rounded-xl shadow-md`}>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2">{item.label}</p>
                <p className="text-3xl font-extrabold">{item.percentage}</p>
              </div>
              <div className="absolute top-3 right-3">
                <TrendingDown size={20} className="text-white/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Cost Distribution */}
        <div className="mt-8">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Cost Distribution</p>
          <div className="h-8 flex rounded-lg overflow-hidden shadow-inner">
            <div className="bg-blue-600 flex items-center justify-center text-white text-xs font-bold" style={{ width: '30%' }}>30%</div>
            <div className="bg-indigo-600 flex items-center justify-center text-white text-xs font-bold" style={{ width: '35%' }}>35%</div>
            <div className="bg-purple-600 flex items-center justify-center text-white text-xs font-bold" style={{ width: '25%' }}>25%</div>
            <div className="bg-slate-600 flex items-center justify-center text-white text-xs font-bold" style={{ width: '10%' }}>10%</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <p className="text-xs text-slate-400">
          Copyright © {new Date().getFullYear()} Tech Mahindra Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SixRDisposition;
