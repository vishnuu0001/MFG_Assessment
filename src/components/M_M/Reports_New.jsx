import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, Loader } from 'lucide-react';
import { apiUrl } from '../../config';

const Reports = () => {
  const [maturityLevels, setMaturityLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });

  useEffect(() => {
    fetchMaturityLevels();
  }, []);

  const fetchMaturityLevels = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/mm/maturity-levels'));
      
      if (!response.ok) {
        console.error('Failed to fetch maturity levels:', response.status);
        setMaturityLevels([]);
        return;
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setMaturityLevels(data);
      } else {
        console.error('Maturity levels data is not an array:', data);
        setMaturityLevels([]);
      }
    } catch (error) {
      console.error('Error fetching maturity levels:', error);
      setMaturityLevels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(apiUrl('/api/mm/refresh-simulated-data'), {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchMaturityLevels();
        alert('✅ Dashboard data refreshed successfully!');
      } else {
        alert('❌ Failed to refresh data');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('❌ Error refreshing data');
    } finally {
      setRefreshing(false);
    }
  };

  const groupByLevel = () => {
    const grouped = {};
    maturityLevels.forEach(ml => {
      if (!grouped[ml.level]) {
        grouped[ml.level] = {
          name: ml.name,
          items: []
        };
      }
      // Only add items with sub_level (actual capabilities, not just headers)
      if (ml.sub_level && ml.sub_level.includes('.')) {
        grouped[ml.level].items.push(ml);
      } else if (!ml.sub_level && ml.description && ml.description.includes('Level')) {
        // This is a level header, store the name
        grouped[ml.level].name = ml.description.split(':')[1]?.trim() || ml.name;
      }
    });
    return grouped;
  };

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'from-red-500 to-red-600',
      2: 'from-orange-500 to-orange-600',
      3: 'from-yellow-500 to-yellow-600',
      4: 'from-blue-500 to-blue-600',
      5: 'from-green-500 to-green-600'
    };
    return colors[level] || 'from-gray-500 to-gray-600';
  };

  const getLevelBadgeColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-700',
      2: 'bg-orange-100 text-orange-700',
      3: 'bg-yellow-100 text-yellow-700',
      4: 'bg-blue-100 text-blue-700',
      5: 'bg-green-100 text-green-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const groupedLevels = groupByLevel();
  const levelKeys = [1, 2, 3, 4, 5];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-red-600" size={48} />
        <span className="ml-3 text-lg font-semibold text-slate-600">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">
            Dashboard
          </h1>
          <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">
            Digital Maturity Overview by Levels
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-bold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Maturity Levels */}
      <div className="space-y-4">
        {levelKeys.map((level) => {
          const levelData = groupedLevels[level];
          if (!levelData) return null;

          const isExpanded = expandedLevels[level];
          const capabilityCount = levelData.items.length;
          const levelName = levelData.name || `Level ${level}`;

          return (
            <div key={level} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
              {/* Level Header */}
              <button
                onClick={() => toggleLevel(level)}
                className={`w-full px-6 py-5 bg-gradient-to-r ${getLevelColor(level)} text-white font-bold text-left flex items-center justify-between hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center gap-4">
                  {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wide">
                      LEVEL {level}: {levelName.toUpperCase()}
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      {capabilityCount} capabilities
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 ${getLevelBadgeColor(level)} rounded-lg font-black text-lg`}>
                  L{level}
                </div>
              </button>

              {/* Level Capabilities */}
              {isExpanded && (
                <div className="p-6 bg-slate-50 space-y-3">
                  {capabilityCount === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>No capabilities data available for this level.</p>
                      <p className="text-sm mt-2">Click "Refresh Data" to load capabilities.</p>
                    </div>
                  ) : (
                    levelData.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg border-2 border-slate-200 p-4 hover:border-red-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`px-3 py-1 ${getLevelBadgeColor(level)} rounded-md font-bold text-sm flex-shrink-0`}>
                            {item.sub_level}
                          </div>
                          <div className="flex-1">
                            {item.category && (
                              <h4 className="font-bold text-slate-700 text-sm mb-1">
                                {item.category}
                              </h4>
                            )}
                            <p className="text-slate-600 leading-relaxed text-sm">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {maturityLevels.length > 0 && (
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Maturity Framework Overview</h3>
              <p className="text-slate-300 text-sm">Five-level digital transformation journey</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-black">{maturityLevels.length}</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider">Total Capabilities</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">5</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider">Maturity Levels</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
