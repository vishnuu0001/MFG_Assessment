import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Target } from 'lucide-react';
import { apiUrl } from '../../config';
import { getDimensionColor, getLevelBadgeColor } from '../../utils/colorUtils';
import { API_ENDPOINTS } from '../../utils/constants';
import LoadingSpinner from '../shared/LoadingSpinner';
import NavigationButtons from '../shared/NavigationButtons';

const RatingScales = ({ onNavigate }) => {
  const [ratingScales, setRatingScales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDimensions, setExpandedDimensions] = useState({});

  const fetchRatingScales = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(API_ENDPOINTS.ratingScales));
      
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

  if (loading) {
    return <LoadingSpinner message="Loading Rating Scales..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">
          Rating Scales & Maturity Levels
        </h1>
        <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">
          {dimensionNames.length} Dimensions with Level 1-5 Maturity Definitions
        </p>
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
              No rating scales data available. Please contact the administrator.
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

      <NavigationButtons
        onNavigate={onNavigate}
        previousIndex={1}
        nextIndex={3}
        previousLabel="Dashboard"
        nextLabel="Matrices"
      />
    </div>
  );
};

export default RatingScales;
