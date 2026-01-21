import React, { useState } from 'react';
import { Home, Factory, Star, Grid } from 'lucide-react';
import LandingPage from './components/shared/LandingPage';
import Login from './components/shared/Login';
import Reports from './components/M_M/Reports';
import SmartFactoryAssessment from './components/M_M/SmartFactoryAssessment';
import RatingScales from './components/M_M/RatingScales';
import Matrices from './components/M_M/Matrices';
import ApiDiagnostics from './components/ApiDiagnostics';

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Smart Factory Assessment');

  const tabs = [
    { id: 'Smart Factory Assessment', label: 'Smart Factory Assessment', icon: Factory },
    { id: 'Dashboard', label: 'Dashboard', icon: Home },
    { id: 'Rating Scales', label: 'Rating Scales', icon: Star },
    { id: 'Matrices', label: 'Matrices', icon: Grid }
  ];

  // Check URL for diagnostics mode
  const isDiagnosticsMode = window.location.search.includes('diagnostics');

  // Show diagnostics page if requested
  if (isDiagnosticsMode) {
    return <ApiDiagnostics />;
  }

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Then show login
  if (!isAuthenticated) {
    return <Login onSuccess={() => setIsAuthenticated(true)} />;
  }

  // Main app with tab navigation

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-600 selection:bg-red-100 overflow-hidden">
      {/* Fixed Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black italic flex items-center justify-center text-lg">M</div>
            <div>
              <p className="text-lg font-black text-slate-600 uppercase tracking-tight">Mahindra & Mahindra</p>
              <p className="text-xs text-slate-500 font-semibold">Digital Maturity Assessment</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setShowLanding(true);
            }}
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            Back to Home
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-slate-200 bg-slate-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wide transition-all border-b-4 ${
                  isActive
                    ? 'bg-white text-red-600 border-red-600'
                    : 'bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-6 md:p-8 lg:p-10">
          {activeTab === 'Smart Factory Assessment' && <SmartFactoryAssessment />}
          {activeTab === 'Dashboard' && <Reports />}
          {activeTab === 'Rating Scales' && <RatingScales />}
          {activeTab === 'Matrices' && <Matrices />}
        </div>
      </main>
    </div>
  );
};

export default App;
