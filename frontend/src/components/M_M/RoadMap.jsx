import React, { useState } from 'react';
import { Calendar, CheckCircle, Circle, ChevronRight, Target, TrendingUp } from 'lucide-react';
import NavigationButtons from '../shared/NavigationButtons';

const RoadMap = ({ onNavigate }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);

  const actionTracks = [
    {
      title: 'Stabilize the Basics (0-3 months)',
      goal: 'Get to reliable data capture and visibility (Level 1 → Level 2)',
      owner: 'Ops + IT',
      impact: 'Fast',
      actions: [
        'Instrument critical assets; wire OEE and downtime capture',
        'Create a single source for shift/line KPIs; daily tiered huddles',
        'Close cyber and network gaps (segmentation, backups, access hygiene)'
      ]
    },
    {
      title: 'Integrate & Standardize (3-9 months)',
      goal: 'Move to connected, trusted data (Level 2 → Level 3)',
      owner: 'Ops + IT/OT',
      impact: 'Medium',
      actions: [
        'Integrate MES/ERP with line data; standardize master data and taxonomies',
        'Stand up golden dashboards for quality, throughput, energy with SLAs',
        'Launch role-based training and SOPs for data entry and exception handling'
      ]
    },
    {
      title: 'Predict & Optimize (9-18 months)',
      goal: 'Unlock predictive maintenance and bottleneck elimination (Level 3 → Level 4)',
      owner: 'Ops Excellence + Data',
      impact: 'High',
      actions: [
        'Deploy predictive models on top 3 bottleneck assets; run A/B validations',
        'Implement digital twins for critical lines; simulate changeovers and recipes',
        'Automate alerts and playbooks; measure uplift vs. baseline KPIs'
      ]
    },
    {
      title: 'Autonomous & Scalable (18-30+ months)',
      goal: 'Adaptive, self-healing operations (Level 4 → Level 5)',
      owner: 'CXO + Ops + IT',
      impact: 'Transform',
      actions: [
        'Scale AI/ML to all plants; embed feedback loops into control layers',
        'Expand to suppliers/logistics for end-to-end visibility and orchestration',
        'Institutionalize continuous improvement with innovation pods and funding gates'
      ]
    }
  ];

  const roadmapPhases = [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Foundation & Assessment',
      duration: '0-3 Months',
      status: 'completed',
      color: 'from-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      milestones: [
        { id: 1, title: 'Conduct initial digital maturity assessment', completed: true },
        { id: 2, title: 'Identify key stakeholders and form digital transformation team', completed: true },
        { id: 3, title: 'Define vision and objectives for smart factory initiative', completed: true },
        { id: 4, title: 'Establish baseline metrics and KPIs', completed: true },
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Infrastructure & Connectivity',
      duration: '3-9 Months',
      status: 'in-progress',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      milestones: [
        { id: 1, title: 'Deploy IoT sensors and connectivity infrastructure', completed: true },
        { id: 2, title: 'Implement basic data collection and monitoring systems', completed: true },
        { id: 3, title: 'Establish network security and data governance framework', completed: false },
        { id: 4, title: 'Train operators on new digital tools and dashboards', completed: false },
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Integration & Analytics',
      duration: '9-18 Months',
      status: 'planned',
      color: 'from-amber-600 to-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      milestones: [
        { id: 1, title: 'Integrate MES, ERP, and other enterprise systems', completed: false },
        { id: 2, title: 'Deploy advanced analytics and predictive maintenance solutions', completed: false },
        { id: 3, title: 'Implement digital twin for critical production lines', completed: false },
        { id: 4, title: 'Develop real-time performance dashboards and reporting', completed: false },
      ]
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: 'Optimization & AI',
      duration: '18-30 Months',
      status: 'future',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      milestones: [
        { id: 1, title: 'Deploy AI/ML models for quality prediction and optimization', completed: false },
        { id: 2, title: 'Implement autonomous decision-making systems', completed: false },
        { id: 3, title: 'Enable adaptive manufacturing and self-healing processes', completed: false },
        { id: 4, title: 'Expand digital capabilities across supply chain partners', completed: false },
      ]
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: 'Continuous Innovation',
      duration: '30+ Months',
      status: 'future',
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      milestones: [
        { id: 1, title: 'Establish innovation lab for emerging technologies', completed: false },
        { id: 2, title: 'Deploy advanced robotics and cobots', completed: false },
        { id: 3, title: 'Implement blockchain for traceability and transparency', completed: false },
        { id: 4, title: 'Achieve industry 4.0 excellence and benchmark status', completed: false },
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      planned: { label: 'Planned', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      future: { label: 'Future', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    };
    return badges[status] || badges.future;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">
            Digital Transformation Road Map
          </h1>
          <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">
            Strategic Implementation Timeline & Milestones
          </p>
        </div>
      </div>

      {/* Actionable low-to-high path */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {actionTracks.map((track) => (
          <div key={track.title} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">{track.owner}</p>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{track.title}</h3>
                <p className="text-sm text-slate-600">{track.goal}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-xs font-semibold">
                <Target className="w-4 h-4" />
                <span>{track.impact}</span>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {track.actions.map((action) => (
                <li key={action} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-emerald-600" size={24} />
            <h3 className="font-bold text-emerald-700 uppercase text-xs tracking-wider">Completed</h3>
          </div>
          <p className="text-3xl font-black text-emerald-800">1</p>
          <p className="text-sm text-emerald-600 mt-1">Phase</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="font-bold text-blue-700 uppercase text-xs tracking-wider">In Progress</h3>
          </div>
          <p className="text-3xl font-black text-blue-800">1</p>
          <p className="text-sm text-blue-600 mt-1">Phase</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-amber-600" size={24} />
            <h3 className="font-bold text-amber-700 uppercase text-xs tracking-wider">Planned</h3>
          </div>
          <p className="text-3xl font-black text-amber-800">1</p>
          <p className="text-sm text-amber-600 mt-1">Phase</p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-slate-600" size={24} />
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Duration</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">30+</p>
          <p className="text-sm text-slate-600 mt-1">Months</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-black text-slate-700 uppercase mb-6">Implementation Timeline</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200"></div>

          {/* Phases */}
          <div className="space-y-8">
            {roadmapPhases.map((phase, index) => {
              const isExpanded = selectedPhase === phase.id;
              const statusBadge = getStatusBadge(phase.status);
              const completedMilestones = phase.milestones.filter(m => m.completed).length;
              const progressPercentage = Math.round((completedMilestones / phase.milestones.length) * 100);

              return (
                <div key={phase.id} className="relative pl-20">
                  {/* Timeline dot */}
                  <div className={`absolute left-5 top-6 w-8 h-8 rounded-full bg-gradient-to-br ${phase.color} 
                    border-4 border-white shadow-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">{phase.id}</span>
                  </div>

                  {/* Phase card */}
                  <div 
                    className={`bg-gradient-to-br ${phase.bgColor} border-2 ${phase.borderColor} rounded-2xl p-6 
                      cursor-pointer hover:shadow-lg transition-all`}
                    onClick={() => setSelectedPhase(isExpanded ? null : phase.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-slate-700 uppercase">{phase.phase}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-600">{phase.title}</h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                          <Calendar size={14} />
                          <span className="font-semibold">{phase.duration}</span>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        size={24} 
                      />
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">Progress</span>
                        <span className="text-xs font-bold text-slate-600">{progressPercentage}%</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${phase.color} transition-all`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {isExpanded && (
                      <div className="mt-6 space-y-3 border-t-2 border-white pt-6">
                        <h5 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-4">
                          Key Milestones
                        </h5>
                        {phase.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-start gap-3 bg-white rounded-lg p-3">
                            {milestone.completed ? (
                              <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                            ) : (
                              <Circle className="text-slate-400 flex-shrink-0" size={20} />
                            )}
                            <span className={`text-sm ${milestone.completed ? 'text-slate-700 font-semibold' : 'text-slate-600'}`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <NavigationButtons
        onNavigate={onNavigate}
        previousIndex={3}
        nextIndex={0}
        previousLabel="Matrices"
        nextLabel="Smart Factory Assessment"
      />
    </div>
  );
};

export default RoadMap;
