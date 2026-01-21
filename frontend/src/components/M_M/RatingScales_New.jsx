import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Target, RefreshCw, Loader } from 'lucide-react';
import { apiUrl } from '../../config';

const RatingScales = () => {
  const [ratingScales, setRatingScales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDimensions, setExpandedDimensions] = useState({});

  const fetchRatingScales = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/mm/rating-scales'));
      
      if (!response.ok) {
        console.error('Failed to fetch rating scales:', response.status);
        setRatingScales([]);
        return;
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setRatingScales(data);
        // Auto-expand first dimension
        if (data.length > 0) {
          setExpandedDimensions({ [data[0].dimension_name]: true });
        }
      } else {
        console.error('Rating scales data is not an array:', data);
        setRatingScales([]);
      }
    } catch (error) {
      console.error('Error fetching rating scales:', error);
      setRatingScales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(apiUrl('/api/mm/refresh-rating-scales'), {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchRatingScales();
        alert('✅ Rating Scales refreshed successfully!');
      } else {
        alert('❌ Failed to refresh rating scales');
      }
    } catch (error) {
      console.error('Error refreshing rating scales:', error);
      alert('❌ Error refreshing rating scales');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRatingScales();
  }, []);

  const groupByDimension = () => {
    const grouped = {};
    ratingScales.forEach(scale => {
      if (!grouped[scale.dimension_name]) {
        grouped[scale.dimension_name] = [];
      }
      grouped[scale.dimension_name].push(scale);
    });
    
    // Sort levels within each dimension
    Object.keys(grouped).forEach(dim => {
      grouped[dim].sort((a, b) => a.level - b.level);
    });
    
    return grouped;
  };

  const groupedScales = groupByDimension();
  const dimensionNames = Object.keys(groupedScales).sort();

  const toggleDimension = (dimensionName) => {
    setExpandedDimensions(prev => ({
      ...prev,
      [dimensionName]: !prev[dimensionName]
    }));
  };

  const getLevelBadgeColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-700 border-red-200',
      2: 'bg-orange-100 text-orange-700 border-orange-200',
      3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      4: 'bg-blue-100 text-blue-700 border-blue-200',
      5: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getDimensionColor = (index) => {
    const colors = [
      'from-red-500 to-red-600',
      'from-orange-500 to-orange-600',
      'from-amber-500 to-amber-600',
      'from-yellow-500 to-yellow-600',
      'from-lime-500 to-lime-600',
      'from-green-500 to-green-600',
      'from-emerald-500 to-emerald-600',
      'from-teal-500 to-teal-600',
      'from-cyan-500 to-cyan-600',
      'from-sky-500 to-sky-600',
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
      'from-violet-500 to-violet-600',
      'from-purple-500 to-purple-600',
      'from-fuchsia-500 to-fuchsia-600',
      'from-pink-500 to-pink-600',
      'from-rose-500 to-rose-600'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-red-600" size={48} />
        <span className="ml-3 text-lg font-semibold text-slate-600">Loading Rating Scales...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">
            Rating Scales & Maturity Levels
          </h1>
          <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">
            {dimensionNames.length} Dimensions with Level 1-5 Maturity Definitions
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

      {/* Info Card */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <Target className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-slate-600 mb-2">Digital Maturity Framework</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Each dimension has 5 maturity levels (1-5) describing the progression from basic to advanced digital capabilities. 
              Use these definitions to assess your current state and plan your transformation roadmap.
            </p>
          </div>
        </div>
      </div>

      {/* Dimensions List */}
      <div className="space-y-4">
        {dimensionNames.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-700 font-semibold">
              No rating scales data available. Click "Refresh Data" to load from the Excel file.
            </p>
          </div>
        ) : (
          dimensionNames.map((dimensionName, index) => {
            const isExpanded = expandedDimensions[dimensionName];
            const levels = groupedScales[dimensionName];
            
            return (
              <div key={dimensionName} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                {/* Dimension Header */}
                <button
                  onClick={() => toggleDimension(dimensionName)}
                  className={`w-full px-6 py-4 bg-gradient-to-r ${getDimensionColor(index)} text-white font-bold text-left flex items-center justify-between hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <span className="text-lg uppercase tracking-wide">{dimensionName}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {levels.length} Levels
                    </span>
                  </div>
                </button>

                {/* Dimension Levels */}
                {isExpanded && (
                  <div className="p-6 space-y-4 bg-slate-50">
                    {levels.map((scale) => (
                      <div
                        key={scale.id}
                        className="bg-white rounded-lg border-2 border-slate-200 p-5 hover:border-red-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`px-4 py-2 ${getLevelBadgeColor(scale.level)} border-2 rounded-lg font-black text-sm uppercase tracking-wider flex-shrink-0`}>
                            Level {scale.level}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-700 mb-2 text-lg">
                              {scale.rating_name}
                            </h4>
                            <p className="text-slate-600 leading-relaxed">
                              {scale.digital_maturity_description}
                            </p>
                            {scale.business_relevance && (
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-sm text-slate-500 italic">
                                  <span className="font-semibold">Business Relevance:</span> {scale.business_relevance}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {dimensionNames.length > 0 && (
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Assessment Coverage</h3>
              <p className="text-slate-300 text-sm">Complete digital maturity framework across all dimensions</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-black">{dimensionNames.length}</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider">Dimensions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">{ratingScales.length}</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider">Total Levels</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingScales;
