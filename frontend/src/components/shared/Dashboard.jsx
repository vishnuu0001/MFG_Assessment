import React from 'react';
import { Factory, BarChart3, Target } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  const modules = [
    {
      id: 'smart-factory',
      title: 'Smart Factory',
      description: 'Evaluate your digital maturity across all manufacturing dimensions with industry benchmarks',
      icon: Factory,
      color: 'from-red-600 to-red-700',
      borderColor: 'border-red-200',
      hoverBorder: 'hover:border-red-400'
    },
    {
      id: 'real-time-analytics',
      title: 'Real-time Analytics',
      description: 'Get instant insights and data visualization to drive informed decision-making',
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400'
    },
    {
      id: 'actionable-roadmap',
      title: 'Actionable Roadmap',
      description: 'Receive a customized transformation roadmap with clear priorities and milestones',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-600 mb-4">
          Manufacturing Digital Cockpit
        </h1>
        <p className="text-xl text-slate-500">
          Choose a module to begin your digital transformation journey
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => onNavigate(module.id)}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 ${module.borderColor} ${module.hoverBorder} transform hover:-translate-y-2 text-left`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/50 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <IconComponent className="text-white" size={32} />
                </div>
                <h3 className="text-slate-600 font-black text-2xl mb-3">{module.title}</h3>
                <p className="text-slate-500 leading-relaxed">{module.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-slate-500 font-bold group-hover:text-slate-600 transition-colors">
                  <span>Get Started</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-16 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl p-10">
        <h2 className="text-2xl font-black text-white mb-6 text-center">Platform Overview</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-4xl font-black text-white mb-2">33</p>
            <p className="text-red-100 font-bold uppercase text-sm tracking-wider">Dimensions</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-white mb-2">5</p>
            <p className="text-red-100 font-bold uppercase text-sm tracking-wider">Maturity Levels</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-white mb-2">8</p>
            <p className="text-red-100 font-bold uppercase text-sm tracking-wider">Manufacturing Areas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
