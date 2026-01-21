import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, ChevronDown, ChevronUp } from 'lucide-react';
import NavigationButtons from '../shared/NavigationButtons';

const Matrices = ({ onNavigate }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    operations: true,
    quality: true,
    assets: true
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const maturityLevels = {
    L1: "L1 At lower maturity- tracking is seen; data is often siloed",
    L2: "L2 At intermediate maturity, metrics become real-time, integrated across MES and ERP, and become more standardized, aligned with APQP and Best Practices.",
    L3: "L3 At advanced maturity Impact is seen on metrices (OEE uplift, energy per unit, COQ reduction, ROCE); self-optimizing KPIs are established; COQ becomes integrated in product development/manufacturing."
  };

  const categories = [
    {
      id: 'operations',
      name: 'Operations & Flow',
      icon: BarChart3,
      color: 'red',
      metrics: [
        "OEE uplift",
        "Throughput increase",
        "Changeover time reduction",
        "Line-Balancing improvements",
        "Cycle time reduction",
        "WIP reduction",
        "Lead Time reduction",
        "Demand variability",
        "Forecast accuracy",
        "SMED implementation"
      ]
    },
    {
      id: 'quality',
      name: 'Quality & Traceability',
      icon: TrendingUp,
      color: 'slate',
      metrics: [
        "FPY improvement",
        "Warranty claims reduction",
        "Traceability coverage",
        "Recall readiness",
        "Root cause closure rate",
        "CAPA effectiveness"
      ]
    },
    {
      id: 'assets',
      name: 'Assets, Maintenance & Energy',
      icon: Package,
      color: 'red',
      metrics: [
        "MTBF increase",
        "MTTR reduction",
        "Energy consumption per unit",
        "Water usage optimization",
        "Carbon footprint reduction",
        "Labor productivity",
        "Absenteeism rate",
        "Training coverage",
        "Safety incidents (LTIR)",
        "Near-miss reporting",
        "OTD (On-Time Delivery)",
        "Inventory turns",
        "Obsolescence cost",
        "Supplier quality",
        "Material yield",
        "Scrap rate",
        "ROCE improvement"
      ]
    }
  ];

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600'
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      icon: 'bg-slate-100 text-slate-600',
      text: 'text-slate-600'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Compact */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase italic tracking-tight">Matrices</h1>
        <p className="text-[#004A96] mt-1 font-bold text-sm uppercase tracking-wider">Key Performance Metrics Framework</p>
      </div>

      {/* Maturity Levels */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <h2 className="font-black text-slate-900 uppercase text-sm mb-4">Maturity Levels</h2>
        <div className="space-y-3">
          {Object.entries(maturityLevels).map(([level, description]) => (
            <div key={level} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-3">
                <span className="font-bold text-blue-600 text-sm min-w-[2rem]">{level}</span>
                <p className="text-slate-700 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const Icon = category.icon;
          const colors = colorClasses[category.color];
          const isExpanded = expandedCategories[category.id];

          return (
            <div key={category.id} className={`${colors.bg} rounded-2xl border ${colors.border} overflow-hidden`}>
              {/* Category Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-opacity-80 transition-all"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase text-sm">{category.name}</h3>
                      <p className={`${colors.text} text-xs font-semibold mt-1`}>
                        {category.metrics.length} Key Metrics
                      </p>
                    </div>
                  </div>
                  <div className={colors.text}>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>
              </div>

              {/* Metrics List */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.metrics.map((metric, index) => (
                      <div 
                        key={index}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-2">
                          <span className={`${colors.text} font-bold text-xs mt-0.5`}>•</span>
                          <p className="text-slate-700 text-sm font-medium">{metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Total Metrics Overview</h3>
            <p className="text-slate-600 text-sm mt-2">
              {categories.reduce((sum, cat) => sum + cat.metrics.length, 0)} metrics across {categories.length} categories
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{categories[0].metrics.length}</div>
              <div className="text-xs text-slate-500 uppercase">Operations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">{categories[1].metrics.length}</div>
              <div className="text-xs text-slate-500 uppercase">Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{categories[2].metrics.length}</div>
              <div className="text-xs text-slate-500 uppercase">Assets</div>
            </div>
          </div>
        </div>
      </div>

      <NavigationButtons
        onNavigate={onNavigate}
        previousIndex={2}
        nextIndex={0}
        previousLabel="Rating Scales"
        nextLabel="Smart Factory Assessment"
      />
    </div>
  );
};

export default Matrices;
