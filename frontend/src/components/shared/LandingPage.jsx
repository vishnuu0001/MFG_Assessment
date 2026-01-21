import React from 'react';
import { ArrowRight, TrendingUp, Award, Users } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5FA] via-white to-[#E8F0FE] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-black text-2xl italic">S</span>
                </div>
                <div>
                  <h1 className="text-slate-600 font-black text-2xl tracking-tight">STRAT.IQ - Tech M Digital Cockpit</h1>
                  <p className="text-red-600 text-xs font-bold uppercase tracking-wider">Manufacturing Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Main Hero */}
            <div className="text-center mb-20 space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-red-200 shadow-md">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Digital Transformation Platform</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-slate-600 leading-tight">
                Enterprise Digital Cockpit
                <span className="block bg-gradient-to-r from-red-600 via-red-700 to-red-600 bg-clip-text text-transparent">
                  for Smart Factories
                </span>
              </h1>
              
              <p className="text-2xl text-slate-500 leading-relaxed max-w-4xl mx-auto font-medium">
                Unlock the full potential of your manufacturing enterprise with a structured digital maturity assessment enabling informed decisions, operational optimization, cost efficiency, and accelerated Industry 4.0 adoption.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <button
                  onClick={onGetStarted}
                  className="group px-12 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-black text-xl uppercase tracking-wide shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 flex items-center gap-3"
                >
                  Get started
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-12 mb-20">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full"></div>
                  <h2 className="text-4xl font-black text-slate-600">About the Enterprise Digital Cockpit for Smart Factories</h2>
                </div>
                
                <div className="space-y-6 text-slate-500 leading-relaxed">
                  <p className="text-xl font-medium text-slate-600">
                    The Enterprise Digital Cockpit for Smart Factories is a comprehensive digital platform designed to evaluate, monitor, and accelerate the digital maturity of manufacturing enterprises. Grounded in industry-leading frameworks and proven best practices, the platform delivers clear, actionable insights to guide and optimize your smart manufacturing transformation.
                  </p>
                  
                  <p className="text-lg">
                    Leveraging extensive research and benchmarking methodologies, the assessment evaluates digital maturity across end-to-end manufacturing operations. It identifies improvement opportunities, highlights areas where digital investments have delivered measurable value, and benchmarks performance against industry leaders enabling data-driven decision-making and sustained competitive advantage.
                  </p>

                  <div className="pt-6">
                    <h3 className="text-2xl font-black text-slate-600 mb-6">Five Critical Pillars</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex gap-4 p-5 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-600 mb-1">Industry 4.0 Progress</h4>
                          <p className="text-sm text-slate-500">Assess your adoption of smart manufacturing technologies and automation</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-600 mb-1">Data & Analytics</h4>
                          <p className="text-sm text-slate-500">Evaluate your data infrastructure and analytical capabilities</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-600 mb-1">Connected Operations</h4>
                          <p className="text-sm text-slate-500">Measure integration across your manufacturing ecosystem</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">4</span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-600 mb-1">Digital Workforce</h4>
                          <p className="text-sm text-slate-500">Review skills, training, and digital adoption among teams</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-100 hover:shadow-lg transition-shadow md:col-span-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">5</span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-600 mb-1">Technology Infrastructure</h4>
                          <p className="text-sm text-slate-500">Analyze your IT/OT convergence and cloud readiness</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-600 rounded-3xl shadow-2xl p-12">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-white mb-3">Trusted by Industry Leaders</h2>
                  <p className="text-red-100 text-lg">Join hundreds of companies transforming their operations</p>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                      <div className="flex items-center justify-center mb-4">
                        <TrendingUp className="text-white w-10 h-10" />
                      </div>
                      <p className="text-5xl font-black text-white mb-2">€60M+</p>
                      <p className="text-red-100 font-bold uppercase tracking-wider text-sm">Savings Identified</p>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                      <div className="flex items-center justify-center mb-4">
                        <Users className="text-white w-10 h-10" />
                      </div>
                      <p className="text-5xl font-black text-white mb-2">500+</p>
                      <p className="text-red-100 font-bold uppercase tracking-wider text-sm">Assessments Completed</p>
                    </div>
                  </div>
                  
                  <div className="text-center group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                      <div className="flex items-center justify-center mb-4">
                        <Award className="text-white w-10 h-10" />
                      </div>
                      <p className="text-5xl font-black text-white mb-2">98%</p>
                      <p className="text-red-100 font-bold uppercase tracking-wider text-sm">Client Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white/70 backdrop-blur-lg border-t border-white/20 mt-20">
          <div className="container mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-lg italic">S</span>
                </div>
                <div>
                  <p className="font-black text-slate-600">STRAT.IQ - Tech M Digital Cockpit</p>
                  <p className="text-slate-500 text-xs">© 2026 All rights reserved</p>
                </div>
              </div>
              <div className="flex gap-8">
                <button className="text-slate-500 hover:text-red-600 font-semibold transition-colors">Privacy Policy</button>
                <button className="text-slate-500 hover:text-red-600 font-semibold transition-colors">Terms of Service</button>
                <button className="text-slate-500 hover:text-red-600 font-semibold transition-colors">Contact Support</button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
