import React from 'react';
import { ArrowRight, TrendingUp, Award, Users } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-white relative overflow-hidden">
      {/* Modern Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(239 68 68) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-red-500 to-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-red-400 to-slate-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Sleek Header */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-8 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-md transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-black text-xl italic">S</span>
                </div>
                <div>
                  <h1 className="text-slate-800 font-black text-2xl tracking-tight">STRAT.IQ</h1>
                  <p className="text-red-600 text-xs font-bold uppercase tracking-widest">Manufacturing Excellence</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex gap-6 items-center">
              <button className="text-slate-600 hover:text-red-600 font-semibold transition-colors text-sm">About</button>
              <button className="text-slate-600 hover:text-red-600 font-semibold transition-colors text-sm">Features</button>
              <button className="text-slate-600 hover:text-red-600 font-semibold transition-colors text-sm">Contact</button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Main Hero - More Compact & Modern */}
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-red-50 to-slate-50 backdrop-blur-sm rounded-full border border-red-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-bold text-xs uppercase tracking-widest">AI-Powered Digital Transformation</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black leading-tight">
                <span className="text-slate-800">Enterprise Digital Cockpit</span>
                <span className="block mt-2 bg-gradient-to-r from-red-600 via-red-600 to-slate-600 bg-clip-text text-transparent">
                  for Smart Factories
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Transform your manufacturing enterprise with AI-driven maturity assessments. Unlock operational excellence, cost efficiency, and accelerated Industry 4.0 adoption through data-driven insights.
              </p>

              <div className="flex justify-center items-center pt-4">
                <button
                  onClick={onGetStarted}
                  className="group px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-3"
                >
                  Start Assessment
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
            </div>

            {/* About Section - Cleaner Design */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg border border-slate-200 p-10 mb-16">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                    Why Choose <span className="text-red-600">STRAT.IQ</span>?
                  </h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    A comprehensive digital platform built on industry-leading frameworks, delivering clear, actionable insights to accelerate your smart manufacturing transformation.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Proven Methodology</h4>
                        <p className="text-sm text-slate-600">Grounded in extensive research and industry benchmarks</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Comprehensive Assessment</h4>
                        <p className="text-sm text-slate-600">End-to-end evaluation across all manufacturing operations</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Actionable Insights</h4>
                        <p className="text-sm text-slate-600">Clear recommendations prioritized by impact and ROI</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Industry Benchmarking</h4>
                        <p className="text-sm text-slate-600">Compare against manufacturing leaders and best practices</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Continuous Monitoring</h4>
                        <p className="text-sm text-slate-600">Track progress and measure improvement over time</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Scalable Platform</h4>
                        <p className="text-sm text-slate-600">From single plants to multi-site global operations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats - Modern Card Design */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-3xl shadow-2xl p-12">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black text-white mb-3">Proven Results Across Industries</h2>
                  <p className="text-slate-300 text-lg">Trusted by manufacturing leaders worldwide</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                          <TrendingUp className="text-white w-8 h-8" />
                        </div>
                      </div>
                      <p className="text-5xl font-black text-white mb-3">€60M+</p>
                      <p className="text-slate-300 font-bold uppercase tracking-wider text-sm">Savings Identified</p>
                      <p className="text-slate-400 text-xs mt-2">Across client portfolio</p>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                          <Users className="text-white w-8 h-8" />
                        </div>
                      </div>
                      <p className="text-5xl font-black text-white mb-3">500+</p>
                      <p className="text-slate-300 font-bold uppercase tracking-wider text-sm">Assessments Completed</p>
                      <p className="text-slate-400 text-xs mt-2">In manufacturing sector</p>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                          <Award className="text-white w-8 h-8" />
                        </div>
                      </div>
                      <p className="text-5xl font-black text-white mb-3">98%</p>
                      <p className="text-slate-300 font-bold uppercase tracking-wider text-sm">Client Satisfaction</p>
                      <p className="text-slate-400 text-xs mt-2">Based on feedback surveys</p>
                    </div>
                  </div>
                </div>

                {/* CTA inside stats section */}
                <div className="text-center mt-12">
                  <button
                    onClick={onGetStarted}
                    className="group px-12 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3"
                  >
                    Begin Your Journey
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Simplified & Modern */}
        <footer className="bg-white border-t border-slate-200 mt-20">
          <div className="container mx-auto px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg italic">S</span>
                </div>
                <div>
                  <p className="font-black text-slate-800">STRAT.IQ</p>
                  <p className="text-slate-500 text-xs">© 2026 All rights reserved</p>
                </div>
              </div>
              <div className="flex gap-8">
                <button className="text-slate-600 hover:text-red-600 font-semibold transition-colors text-sm">Privacy</button>
                <button className="text-slate-600 hover:text-red-600 font-semibold transition-colors text-sm">Terms</button>
                <button className="text-slate-600 hover:text-red-600 font-semibold transition-colors text-sm">Support</button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
