import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { SCENARIOS } from '../data/portfolioConfig';

const DynamicMonteCarlo = ({ data, scenario, sensitivity }) => {
  const probability = useMemo(() => {
    const trials = 2000;
    let successes = 0;
    const target = data.stats.target;
    const mult = SCENARIOS[scenario].multiplier;

    for (let i = 0; i < trials; i++) {
      let trialTotal = 0;
      data.apps.forEach((app) => {
        const baseAdj = Math.max(0, Math.min(100, app.confidence + sensitivity));
        const variance = (Math.random() - 0.5) * 30;
        const realizedConf = Math.max(0, Math.min(100, baseAdj + variance));
        trialTotal += app.gross * (realizedConf / 100) * mult;
      });
      if (trialTotal >= target) successes += 1;
    }

    return ((successes / trials) * 100).toFixed(1);
  }, [data.apps, data.stats.target, scenario, sensitivity]);

  return (
    <div className="bg-gradient-to-br from-[#00356B] to-[#004A96] p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Statistical Probability</p>
        <p className="text-5xl font-black mb-2">{probability}%</p>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${probability}%` }} />
        </div>
      </div>
      <Target size={100} className="absolute right-[-20px] bottom-[-20px] opacity-10" />
    </div>
  );
};

export default DynamicMonteCarlo;
