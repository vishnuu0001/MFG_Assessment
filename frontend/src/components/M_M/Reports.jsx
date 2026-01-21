import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, RefreshCw, Calculator, X } from 'lucide-react';
import { apiUrl } from '../../config';

const Reports = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchAreas();
    
    // Auto-refresh every 5 seconds for streaming data demo
    if (autoRefresh) {
      const interval = setInterval(fetchAreas, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchAreas = async () => {
    try {
      const response = await fetch(apiUrl('/api/mm/areas'));
      
      if (!response.ok) {
        console.error('Failed to fetch areas:', response.status, response.statusText);
        setAreas([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAreas(data);
        
        // Expand all areas by default to show the data
        if (data.length > 0) {
          const expandedState = {};
          data.forEach(area => {
            expandedState[area.id] = true;
          });
          setExpandedSections(expandedState);
        }
      } else {
        console.error('Areas data is not an array:', data);
        setAreas([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
      setLoading(false);
    }
  };

  const refreshSimulatedData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(apiUrl('/api/mm/refresh-all-data'), {
        method: 'POST',
      });
      const result = await response.json();
      
      if (response.ok) {
        // Reload the areas
        await fetchAreas();
        
        // Build success message
        let message = '✅ All data refreshed successfully!\n\n';
        if (result.results?.reports) {
          message += `📊 Reports: ${result.results.reports.area_count} Areas, ${result.results.reports.dimension_count} Dimensions\n`;
        }
        if (result.results?.rating_scales) {
          message += `⭐ Rating Scales: ${result.results.rating_scales.dimension_count} Dimensions, ${result.results.rating_scales.rating_count} Ratings\n`;
        }
        if (result.results?.maturity_levels) {
          message += `📈 Maturity Levels: ${result.results.maturity_levels.count} Items\n`;
        }
        
        alert(message);
      } else {
        alert(`❌ Error: ${result.detail || result.message || 'Failed to refresh data'}`);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('❌ Error refreshing data. Please check the console.');
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSection = (areaId) => {
    setExpandedSections(prev => ({
      ...prev,
      [areaId]: !prev[areaId]
    }));
  };

  const downloadCSV = () => {
    try {
      // Prepare CSV data
      const csvRows = [];
      
      // Headers
      csvRows.push(['Area', 'Dimension', 'Current Level', 'Desired Level', 'Gap', 'Status', 'Priority']);
      
      // Data rows
      areas.forEach(area => {
        if (area.dimensions && area.dimensions.length > 0) {
          area.dimensions.forEach(dim => {
            const gap = dim.desired_level - dim.current_level;
            const status = gap === 0 ? 'On Target' : gap > 0 ? 'Below Target' : 'Above Target';
            const priority = gap > 2 ? 'High' : gap > 0 ? 'Medium' : 'Low';
            
            csvRows.push([
              area.name,
              dim.name,
              dim.current_level,
              dim.desired_level,
              gap,
              status,
              priority
            ]);
          });
        }
      });
      
      // Convert to CSV string
      const csvContent = csvRows.map(row => 
        row.map(cell => `"${cell}"`).join(',')
      ).join('\n');
      
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mahindra_Assessment_Data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(`✅ CSV downloaded successfully!\n\n${areas.length} areas with ${areas.reduce((sum, a) => sum + (a.dimensions?.length || 0), 0)} dimensions exported.`);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('❌ Error downloading CSV. Please check the console.');
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-700 border-red-200',
      2: 'bg-orange-100 text-orange-700 border-orange-200',
      3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      4: 'bg-blue-100 text-blue-700 border-blue-200',
      5: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getLevelName = (level) => {
    const names = {
      1: 'Connected & Visible',
      2: 'Integrated & Data Driven',
      3: 'Predictive & Optimized',
      4: 'Flexible, Agile Factory',
      5: 'Autonomous SDF'
    };
    return names[level] || 'N/A';
  };

  const getProgressPercentage = (current, desired) => {
    return (current / desired) * 100;
  };

  const getStatusIcon = (current, desired) => {
    if (current >= desired) {
      return <CheckCircle2 className="text-green-600" size={18} />;
    } else if (current >= desired - 1) {
      return <TrendingUp className="text-blue-600" size={18} />;
    } else {
      return <AlertCircle className="text-orange-600" size={18} />;
    }
  };

  const renderAreaReport = (area) => {
    const isExpanded = expandedSections[area.id];
    const dimensions = area.dimensions || [];
    const avgCurrent = dimensions.length > 0 
      ? (dimensions.reduce((sum, d) => sum + d.current_level, 0) / dimensions.length).toFixed(1) 
      : 0;
    const onTrackCount = dimensions.filter(d => d.current_level >= d.desired_level - 1).length;
    const completedCount = dimensions.filter(d => d.current_level >= d.desired_level).length;

    return (
      <div key={area.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div 
          className="bg-gradient-to-r from-red-600 to-red-700 p-6 cursor-pointer hover:from-red-700 hover:to-red-800 transition-all"
          onClick={() => toggleSection(area.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isExpanded ? 
                <ChevronDown className="text-white" size={24} /> : 
                <ChevronRight className="text-white" size={24} />
              }
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{area.name}</h2>
                <p className="text-red-100 text-sm mt-1">Digital Maturity Assessment</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-red-100 text-xs uppercase tracking-wider">Avg Current</div>
                <div className="text-2xl font-bold text-white">{avgCurrent}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-xs uppercase tracking-wider">Target Level</div>
                <div className="text-2xl font-bold text-white">{area.desired_level || 'Variable'}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-xs uppercase tracking-wider">On Track</div>
                <div className="text-2xl font-bold text-white">{onTrackCount}/{dimensions.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {isExpanded && (
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{completedCount}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Achieved Target</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{onTrackCount - completedCount}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">In Progress</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{dimensions.length - onTrackCount}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Needs Attention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dimensions Detail */}
        {isExpanded && (
          <div className="p-6">
            <div className="space-y-4">
              {dimensions.map((dimension) => (
                <div key={dimension.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-[#004A96] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(dimension.current_level, dimension.desired_level)}
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{dimension.name}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current</div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getLevelColor(dimension.current_level)}`}>
                          L{dimension.current_level}
                        </span>
                      </div>
                      <div className="text-slate-400">→</div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Target</div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getLevelColor(dimension.desired_level)}`}>
                          L{dimension.desired_level}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#004A96] to-[#0066CC] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(dimension.current_level, dimension.desired_level)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{getLevelName(dimension.current_level)}</span>
                      <span className="font-semibold">{Math.round(getProgressPercentage(dimension.current_level, dimension.desired_level))}%</span>
                      <span className="text-slate-400">{getLevelName(dimension.desired_level)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Detail Drill-Down Modal Component
  const DetailModal = () => {
    if (!showDetailModal || !detailData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{detailData.title}</h2>
              <p className="text-red-100 text-sm mt-1">{detailData.subtitle}</p>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all"
            >
              <X className="text-white" size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {detailData.type === 'dimension' && (
              <div className="space-y-6">
                {/* Dimension Overview */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Current Level</div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-bold ${getLevelColor(detailData.dimension.current)}`}>
                        <span className="text-2xl">L{detailData.dimension.current}</span>
                        <span className="text-sm">{getLevelName(detailData.dimension.current)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Target Level</div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-bold ${getLevelColor(detailData.dimension.target)}`}>
                        <span className="text-2xl">L{detailData.dimension.target}</span>
                        <span className="text-sm">{getLevelName(detailData.dimension.target)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Gap Analysis</div>
                      <div className="bg-red-100 border border-red-200 px-4 py-2 rounded-lg">
                        <span className="text-2xl font-black text-red-700">{detailData.dimension.gap}</span>
                        <span className="text-sm text-red-600 ml-2 font-bold">levels behind</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level Progression Details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-600 mb-4">Level Progression Roadmap</h3>
                  <div className="space-y-4">
                    {Array.from({ length: detailData.dimension.gap }, (_, i) => {
                      const fromLevel = detailData.dimension.current + i;
                      const toLevel = fromLevel + 1;
                      return (
                        <div key={i} className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                {i + 1}
                              </div>
                              <div>
                                <span className="font-bold text-slate-600">Phase {i + 1}: </span>
                                <span className="text-slate-600">Level {fromLevel} → Level {toLevel}</span>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                              Est. {2 + i} months
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From: {getLevelName(fromLevel)}</div>
                              <p className="text-sm text-slate-600">Current state with basic capabilities and manual processes</p>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">To: {getLevelName(toLevel)}</div>
                              <p className="text-sm text-slate-600">Enhanced capabilities with improved automation and integration</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Actions Required</div>
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                              <li>Implement digital systems and automation tools</li>
                              <li>Train workforce on new technologies and processes</li>
                              <li>Integrate with existing enterprise systems</li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Investment & Timeline */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-600 mb-4">Investment & Timeline Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Duration</div>
                      <div className="text-2xl font-black text-blue-600">{detailData.dimension.gap * 2}</div>
                      <div className="text-xs text-slate-500">months</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Priority Level</div>
                      <div className={`text-lg font-black ${detailData.dimension.gap > 2 ? 'text-red-600' : detailData.dimension.gap > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {detailData.dimension.gap > 2 ? 'HIGH' : detailData.dimension.gap > 0 ? 'MEDIUM' : 'LOW'}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Business Impact</div>
                      <div className="text-2xl font-black text-blue-600">{detailData.dimension.target * 20}</div>
                      <div className="text-xs text-slate-500">score</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {detailData.type === 'area' && (
              <div className="space-y-6">
                {/* Area Overview */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-slate-600">{detailData.area.dimensions.length}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total Dimensions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-emerald-600">{detailData.area.onTarget}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">On Target</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-amber-600">{detailData.area.belowTarget}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Below Target</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-purple-600">{detailData.area.sustained}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Level 3+ Sustained</div>
                    </div>
                  </div>
                </div>

                {/* Dimension Breakdown */}
                <div>
                  <h3 className="text-lg font-bold text-slate-600 mb-4">Dimension-Level Analysis</h3>
                  <div className="space-y-3">
                    {detailData.area.dimensions.map((dim, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-red-300 transition-all cursor-pointer"
                        onClick={() => {
                          setDetailData({
                            type: 'dimension',
                            title: dim.name,
                            subtitle: `${detailData.area.name} - Detailed Analysis`,
                            dimension: {
                              current: dim.current,
                              target: dim.target,
                              gap: dim.gap
                            }
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {dim.current >= dim.target ? 
                                <CheckCircle2 className="text-green-600" size={20} /> :
                                <AlertCircle className="text-red-600" size={20} />
                              }
                              <h4 className="font-bold text-slate-600">{dim.name}</h4>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getLevelColor(dim.current)}`}>
                                Current: L{dim.current}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getLevelColor(dim.target)}`}>
                                Target: L{dim.target}
                              </span>
                              {dim.gap > 0 && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                                  Gap: {dim.gap} levels
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="text-slate-400" size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold text-sm uppercase transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-[#004A96]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">Digital Maturity Reports & Analytics</h1>
          <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">Real-time Assessment Insights & Data Visualization</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshSimulatedData}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-bold text-sm uppercase hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Simulated Data'}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                : 'bg-slate-100 text-slate-600 border-2 border-slate-300'
            }`}
          >
            <RefreshCw className={autoRefresh ? 'animate-spin' : ''} size={14} />
            {autoRefresh ? 'Live Updates ON' : 'Live Updates OFF'}
          </button>
        </div>
      </div>

      {/* Calculation Status Banner */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <Calculator className="text-red-600" size={20} />
          <div>
            <p className="text-sm font-semibold text-slate-600">
              📊 Dimension scores are calculated from Smart Factory Assessment selections
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Go to Smart Factory Assessment to select capabilities and click "Save & Calculate Scores" to update these values
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-md">
        <div className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
              <Download className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-600 uppercase text-sm">Export to Excel</h3>
              <p className="text-xs text-slate-500">Download complete assessment data</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-4">Export all assessment data including dimension scores, gap analysis, and maturity levels in Excel format for further analysis and reporting.</p>
          <button 
            onClick={downloadCSV}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-bold uppercase hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2">
            <Download size={18} />
            Download Excel Export
          </button>
        </div>
      </div>

      {/* Real-Time Analytics Section */}
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border-2 border-red-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-600 uppercase">Real-Time Analytics & Action Items</h2>
            <p className="text-sm text-slate-500">Key insights and recommended actions for progression</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Items - Low to High Level */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Priority Action Items</h3>
            <div className="space-y-3">
              {areas.flatMap(area => 
                (area.dimensions || [])
                  .filter(dim => dim.current_level < dim.desired_level)
                  .map(dim => ({
                    area: area.name,
                    dimension: dim.name,
                    gap: dim.desired_level - dim.current_level,
                    current: dim.current_level,
                    target: dim.desired_level
                  }))
              )
              .sort((a, b) => b.gap - a.gap)
              .slice(0, 5)
              .map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 cursor-pointer transition-all"
                  onClick={() => {
                    setDetailData({
                      type: 'dimension',
                      title: item.dimension,
                      subtitle: `${item.area} - Detailed Gap Analysis`,
                      dimension: {
                        current: item.current,
                        target: item.target,
                        gap: item.gap
                      }
                    });
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-600">{item.dimension}</p>
                    <p className="text-xs text-slate-500">{item.area}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">
                        L{item.current} → L{item.target}
                      </span>
                      <span className="text-xs text-slate-500">Gap: {item.gap} levels</span>
                    </div>
                  </div>
                  <ChevronRight className="text-red-400 flex-shrink-0" size={18} />
                </div>
              ))}
              {areas.flatMap(area => 
                (area.dimensions || []).filter(dim => dim.current_level < dim.desired_level)
              ).length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 size={32} className="mx-auto mb-2" />
                  <p className="text-sm">All dimensions are on or above target!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sustainability Metrics */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Sustainability & Stability</h3>
            <div className="space-y-4">
              {areas.map(area => {
                const dims = area.dimensions || [];
                const onTarget = dims.filter(d => d.current_level >= d.desired_level).length;
                const belowTarget = dims.filter(d => d.current_level < d.desired_level).length;
                const total = dims.length;
                const percentage = total > 0 ? Math.round((onTarget / total) * 100) : 0;
                const sustained = dims.filter(d => d.current_level >= d.desired_level && d.current_level >= 3).length;
                
                return (
                  <div 
                    key={area.id} 
                    className="border-b border-slate-200 pb-3 last:border-0 last:pb-0 hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition-all"
                    onClick={() => {
                      setDetailData({
                        type: 'area',
                        title: area.name,
                        subtitle: 'Area Performance Analysis',
                        area: {
                          name: area.name,
                          dimensions: dims.map(d => ({
                            name: d.name,
                            current: d.current_level,
                            target: d.desired_level,
                            gap: d.desired_level - d.current_level
                          })),
                          onTarget,
                          belowTarget,
                          sustained
                        }
                      });
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-600">{area.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">{percentage}% On Target</span>
                        <ChevronRight className="text-slate-400" size={16} />
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>{sustained} dimensions sustained at Level 3+</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-red-600">
              {areas.flatMap(a => a.dimensions || []).filter(d => d.current_level < d.desired_level).length}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Gaps to Close</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-emerald-600">
              {areas.flatMap(a => a.dimensions || []).filter(d => d.current_level >= d.desired_level).length}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">On Target</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-purple-600">
              {areas.flatMap(a => a.dimensions || []).filter(d => d.current_level >= 4).length}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Advanced (L4+)</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-black text-amber-600">
              {areas.flatMap(a => a.dimensions || []).filter(d => d.current_level <= 2).length}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Needs Focus (L1-2)</div>
          </div>
        </div>
      </div>

      {/* Area Reports */}
      <div className="space-y-6">
        {areas.map(area => renderAreaReport(area))}
      </div>

      {/* Legend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Maturity Level Legend</h3>
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className={`p-3 rounded-lg border ${getLevelColor(level)}`}>
              <div className="font-bold text-sm mb-1">Level {level}</div>
              <div className="text-xs">{getLevelName(level)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal />
    </div>
  );
};

export default Reports;
