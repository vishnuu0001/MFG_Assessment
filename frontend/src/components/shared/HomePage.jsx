import React from 'react';
import { Factory, BarChart3, Star, Grid, MapPin } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const cards = [
    {
      id: 'Smart Factory Assessment',
      title: 'Smart Factory Assessment',
      description: 'Evaluate your digital maturity across all manufacturing dimensions with industry benchmarks',
      icon: Factory,
      color: 'from-red-600 to-red-700',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      hoverShadow: 'hover:shadow-red-200/50'
    },
    {
      id: 'Dashboard',
      title: 'Dashboard',
      description: 'Get instant insights and data visualization to drive informed decision-making',
      icon: BarChart3,
      color: 'from-slate-600 to-slate-700',
      bgGradient: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-200',
      hoverShadow: 'hover:shadow-slate-200/50'
    },
    {
      id: 'Rating Scales',
      title: 'Rating Scales',
      description: 'Review maturity level definitions and assessment criteria for each dimension',
      icon: Star,
      color: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      hoverShadow: 'hover:shadow-red-200/50'
    },
    {
      id: 'Matrices',
      title: 'Matrices',
      description: 'Explore comprehensive assessment matrices and correlation analysis',
      icon: Grid,
      color: 'from-slate-500 to-slate-600',
      bgGradient: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-200',
      hoverShadow: 'hover:shadow-slate-200/50'
    },
    {
      id: 'Road Map',
      title: 'Road Map',
      description: 'Plan your digital transformation journey with strategic milestones and implementation roadmap',
      icon: MapPin,
      color: 'from-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      hoverShadow: 'hover:shadow-emerald-200/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-bold text-sm uppercase tracking-wider">
                Digital Maturity Assessment Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-700 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Smart Factory Assessment
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Choose a module below to begin your digital transformation journey
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(index)}
                className={`group relative bg-gradient-to-br ${card.bgGradient} rounded-3xl p-8 border-2 ${card.borderColor} 
                  hover:scale-105 hover:shadow-2xl ${card.hoverShadow} transition-all duration-300 text-left`}
              >
                {/* Icon Container */}
                <div className={`w-20 h-20 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center 
                  mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-white" size={32} />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-700 uppercase tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {card.description}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
