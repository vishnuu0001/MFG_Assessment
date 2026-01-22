import React, { useState } from 'react';
import LandingPage from './components/shared/LandingPage';
import Login from './components/shared/Login';
import HomePage from './components/shared/HomePage';
import Reports from './components/M_M/Reports';
import SmartFactoryAssessment from './components/M_M/SmartFactoryAssessment';
import RatingScales from './components/M_M/RatingScales';
import Matrices from './components/M_M/Matrices';
import RoadMap from './components/M_M/RoadMap';
import ApiDiagnostics from './components/ApiDiagnostics';
import { TAB_NAMES } from './utils/constants';

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  const [activeTab, setActiveTab] = useState(TAB_NAMES[0]);

  const handleNavigate = (tabIndex) => {
    setActiveTab(TAB_NAMES[tabIndex]);
    setShowHomePage(false);
  };

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

  // Show home page after login
  if (showHomePage) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-lg font-black text-slate-600 uppercase tracking-tight">Mahindra & Mahindra</p>
                <p className="text-xs text-slate-500 font-semibold">Digital Maturity Assessment</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setShowLanding(true);
                setShowHomePage(true);
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <HomePage onNavigate={handleNavigate} />
        </div>
      </div>
    );
  }

  // Main app with tab navigation

  return (
    <div className="h-screen flex flex-col bg-white font-sans text-slate-600 selection:bg-red-100 overflow-hidden">
      {/* Fixed Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-lg font-black text-slate-600 uppercase tracking-tight">Mahindra & Mahindra</p>
              <p className="text-xs text-slate-500 font-semibold">Digital Maturity Assessment</p>
            </div>
          </div>
          <button
            onClick={() => setShowHomePage(true)}
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-6 md:p-8 lg:p-10">
          {activeTab === TAB_NAMES[0] && <SmartFactoryAssessment onNavigate={handleNavigate} />}
          {activeTab === TAB_NAMES[1] && <Reports onNavigate={handleNavigate} />}
          {activeTab === TAB_NAMES[2] && <RatingScales onNavigate={handleNavigate} />}
          {activeTab === TAB_NAMES[3] && <Matrices onNavigate={handleNavigate} />}
          {activeTab === TAB_NAMES[4] && <RoadMap onNavigate={handleNavigate} />}
        </div>
      </main>
    </div>
  );
};

export default App;
