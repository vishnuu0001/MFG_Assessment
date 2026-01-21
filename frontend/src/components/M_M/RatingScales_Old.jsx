import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Target } from 'lucide-react';

const RatingScales = () => {
  const [expandedAreas, setExpandedAreas] = useState({
    'Press Shop': true,
    'Assembly Area': false,
    'Machine Shop 1': false
  });

  const [expandedDimensions, setExpandedDimensions] = useState({});

  // Define dimensions for each area with 3 maturity levels each
  const dimensionsByArea = {
    'Press Shop': [
      {
        name: 'Asset Connectivity and OEE',
        levels: [
          { level: 1, title: 'Basic', description: 'Manual data collection, limited visibility into equipment status. OEE calculated offline from manual logs.' },
          { level: 2, title: 'Connected', description: 'Real-time machine connectivity with automated OEE tracking. Digital dashboards showing production metrics.' },
          { level: 3, title: 'Optimized', description: 'Advanced analytics with predictive OEE optimization. AI-driven insights for performance improvement and root cause analysis.' }
        ]
      },
      {
        name: 'Cyber Security and Data Governance',
        levels: [
          { level: 1, title: 'Basic', description: 'Basic password protection, limited access controls. Ad-hoc data backup procedures.' },
          { level: 2, title: 'Managed', description: 'Structured access management, network segmentation, regular security audits. Defined data governance policies.' },
          { level: 3, title: 'Advanced', description: 'Zero-trust architecture, real-time threat detection, automated compliance monitoring. Enterprise-grade data governance with encryption and audit trails.' }
        ]
      },
      {
        name: 'Logistics and Supply Chain',
        levels: [
          { level: 1, title: 'Manual', description: 'Paper-based material tracking, manual inventory counts. Reactive material planning based on historical consumption.' },
          { level: 2, title: 'Digital', description: 'Barcode/RFID tracking, digital inventory management. Automated material replenishment with vendor integration.' },
          { level: 3, title: 'Intelligent', description: 'AI-powered demand forecasting, autonomous material handling (AGV/AMR). Real-time supply chain visibility with predictive alerts.' }
        ]
      },
      {
        name: 'MES & System Integration',
        levels: [
          { level: 1, title: 'Standalone', description: 'Isolated systems with manual data entry. Limited integration between production floor and enterprise systems.' },
          { level: 2, title: 'Integrated', description: 'MES deployed with ERP integration. Automated data flow between shop floor and business systems.' },
          { level: 3, title: 'Unified', description: 'Fully integrated digital thread across all systems. Real-time synchronization with advanced analytics and digital twin capabilities.' }
        ]
      }
    ],
    'Assembly Area': [
      {
        name: 'Maintenance and Reliability',
        levels: [
          { level: 1, title: 'Reactive', description: 'Breakdown maintenance approach. Manual maintenance logs and schedules.' },
          { level: 2, title: 'Preventive', description: 'Scheduled maintenance based on time/usage intervals. CMMS system for work order management.' },
          { level: 3, title: 'Predictive', description: 'Condition-based monitoring with IoT sensors. AI/ML models predicting failures before occurrence with optimized maintenance scheduling.' }
        ]
      },
      {
        name: 'Multi-Plant Orchestration',
        levels: [
          { level: 1, title: 'Independent', description: 'Each plant operates autonomously with local decision-making. Limited visibility across facilities.' },
          { level: 2, title: 'Connected', description: 'Centralized monitoring of key metrics across plants. Standardized processes and data sharing between facilities.' },
          { level: 3, title: 'Orchestrated', description: 'Dynamic production allocation across plants based on real-time capacity. AI-driven load balancing and resource optimization across enterprise.' }
        ]
      },
      {
        name: 'Sustainability & Energy',
        levels: [
          { level: 1, title: 'Basic', description: 'Manual utility meter readings. Basic awareness of energy consumption with limited tracking.' },
          { level: 2, title: 'Monitored', description: 'Automated energy monitoring systems. Regular reporting on sustainability KPIs with energy efficiency initiatives.' },
          { level: 3, title: 'Optimized', description: 'Real-time energy optimization with renewable integration. Carbon footprint tracking and AI-powered sustainability recommendations.' }
        ]
      },
      {
        name: 'Traceability and Quality',
        levels: [
          { level: 1, title: 'Basic', description: 'Batch-level traceability with manual quality logs. Reactive quality control through sampling.' },
          { level: 2, title: 'Digital', description: 'Part-level traceability with digital quality records. Automated in-process quality checks with SPC.' },
          { level: 3, title: 'Advanced', description: 'Full genealogy tracking with AI-powered quality prediction. Zero-defect manufacturing with closed-loop corrective actions.' }
        ]
      }
    ],
    'Machine Shop 1': [
      {
        name: 'Utility Areas',
        levels: [
          { level: 1, title: 'Manual', description: 'Manual monitoring of compressed air, hydraulics, cooling systems. Reactive response to utility failures.' },
          { level: 2, title: 'Monitored', description: 'Automated monitoring of utility parameters. Alarm systems for critical deviations with trend analysis.' },
          { level: 3, title: 'Optimized', description: 'Predictive analytics for utility systems. Autonomous optimization of utility consumption with demand-based scaling.' }
        ]
      },
      {
        name: 'Workforce and User Experience',
        levels: [
          { level: 1, title: 'Traditional', description: 'Paper-based work instructions. Limited digital tools for operators with classroom-based training.' },
          { level: 2, title: 'Digital', description: 'Digital work instructions and SOPs. Mobile devices for operators with e-learning platforms and basic skill tracking.' },
          { level: 3, title: 'Augmented', description: 'AR/VR-based guidance and training. AI-powered skill matching and continuous learning recommendations with immersive digital experiences.' }
        ]
      }
    ]
  };

  const toggleArea = (area) => {
    setExpandedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  const toggleDimension = (dimensionName) => {
    setExpandedDimensions(prev => ({
      ...prev,
      [dimensionName]: !prev[dimensionName]
    }));
  };

  const getAreaColor = (area) => {
    const colors = {
      'Press Shop': 'from-red-500 to-red-600',
      'Assembly Area': 'from-emerald-500 to-emerald-600',
      'Machine Shop 1': 'from-purple-500 to-purple-600'
    };
    return colors[area] || 'from-slate-500 to-slate-600';
  };

  const getLevelBadgeColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-700 border-red-200',
      2: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      3: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">Rating Scales & Maturity Levels</h1>
        <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">Dimension Definitions by Manufacturing Area</p>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <Target className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-slate-600 mb-2">Digital Maturity Framework</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Each manufacturing area contains key dimensions with 3 maturity levels. Use these definitions to assess your current state 
              and plan your digital transformation journey from basic operations to optimized, intelligent manufacturing.
            </p>
          </div>
        </div>
      </div>

      {/* Areas with Dimensions */}
      <div className="space-y-4">
        {Object.keys(dimensionsByArea).map((area) => (
          <div key={area} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Area Header */}
            <div
              className={`bg-gradient-to-r ${getAreaColor(area)} p-5 cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => toggleArea(area)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedAreas[area] ? (
                    <ChevronDown className="text-white" size={24} />
                  ) : (
                    <ChevronRight className="text-white" size={24} />
                  )}
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">{area}</h2>
                </div>
                <div className="text-sm text-white font-semibold">
                  {dimensionsByArea[area].length} Dimensions
                </div>
              </div>
            </div>

            {/* Area Dimensions */}
            {expandedAreas[area] && (
              <div className="p-6 space-y-4">
                {dimensionsByArea[area].map((dimension) => (
                  <div key={dimension.name} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Dimension Header */}
                    <div
                      className="bg-slate-50 p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => toggleDimension(dimension.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedDimensions[dimension.name] ? (
                            <ChevronDown className="text-slate-600" size={20} />
                          ) : (
                            <ChevronRight className="text-slate-600" size={20} />
                          )}
                          <h3 className="font-bold text-slate-600">{dimension.name}</h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">3 Levels</span>
                      </div>
                    </div>

                    {/* Maturity Levels */}
                    {expandedDimensions[dimension.name] && (
                      <div className="p-4 space-y-3 bg-white">
                        {dimension.levels.map((levelData) => (
                          <div key={levelData.level} className="border-l-4 border-slate-300 pl-4 py-3 bg-slate-50 rounded-r-lg">
                            <div className="flex items-start gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getLevelBadgeColor(levelData.level)}`}>
                                Level {levelData.level}
                              </span>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-600 text-sm mb-1">{levelData.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{levelData.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-black text-red-600 mb-2">3</div>
          <div className="text-sm text-slate-600 uppercase tracking-wider font-semibold">Manufacturing Areas</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-black text-emerald-600 mb-2">10</div>
          <div className="text-sm text-slate-600 uppercase tracking-wider font-semibold">Total Dimensions</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-black text-purple-600 mb-2">3</div>
          <div className="text-sm text-slate-600 uppercase tracking-wider font-semibold">Maturity Levels Each</div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Maturity Level Progression</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold">Level 1</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600">Basic / Manual / Reactive</p>
              <p className="text-xs text-slate-500">Foundation level with limited automation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold">Level 2</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600">Digital / Connected / Managed</p>
              <p className="text-xs text-slate-500">Digitized processes with integration</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold">Level 3</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600">Advanced / Optimized / Intelligent</p>
              <p className="text-xs text-slate-500">AI-powered with predictive capabilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingScales;
