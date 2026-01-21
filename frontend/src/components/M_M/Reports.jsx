import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, CheckCircle2, Circle } from 'lucide-react';
import { apiUrl } from '../../config';
import { getLevelColor, getLevelBadgeColor } from '../../utils/colorUtils';
import { API_ENDPOINTS } from '../../utils/constants';
import LoadingSpinner from '../shared/LoadingSpinner';
import NavigationButtons from '../shared/NavigationButtons';

const Reports = ({ onNavigate }) => {
  const [maturityLevels, setMaturityLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimension, setSelectedDimension] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [expandedLevels, setExpandedLevels] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchData();
    fetchDimensions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDimension) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDimension]);

  const fetchDimensions = async () => {
    try {
      const response = await fetch(apiUrl('/api/mm/dimensions'));
      if (response.ok) {
        const data = await response.json();
        setDimensions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching dimensions:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch maturity levels with dimension filter
      const mlUrl = selectedDimension 
        ? apiUrl(`${API_ENDPOINTS.maturityLevels}?dimension_id=${selectedDimension}`)
        : apiUrl(API_ENDPOINTS.maturityLevels);
      
      const mlResponse = await fetch(mlUrl);
      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        setMaturityLevels(Array.isArray(mlData) ? mlData : []);
      }
      
      // Fetch latest assessment selections
      const selResponse = await fetch(apiUrl(API_ENDPOINTS.checksheetSelections));
      if (selResponse.ok) {
        const selData = await selResponse.json();
        if (Array.isArray(selData)) {
          const selectedMap = {};
          selData.forEach(sel => {
            if (sel.is_selected) {
              selectedMap[sel.maturity_level_id] = true;
            }
          });
          setSelectedItems(selectedMap);
        }
      }

      // Fetch assessments for filtering
      const assessResponse = await fetch(apiUrl('/api/mm/assessments'));
      if (assessResponse.ok) {
        const assessData = await assessResponse.json();
        setAssessments(Array.isArray(assessData) ? assessData : []);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(apiUrl(API_ENDPOINTS.refreshMaturityData), {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchData();
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

  // Group by Level -> Category (L2) -> Sub-items (L3)
  const groupByLevelAndCategory = () => {
    const grouped = {};
    
    maturityLevels.forEach(ml => {
      if (!grouped[ml.level]) {
        grouped[ml.level] = {
          name: '',
          categories: {}
        };
      }
      
      // Level header (e.g., "Level 1: Connected & Visible")
      if (!ml.sub_level && ml.description && ml.description.includes('Level')) {
        grouped[ml.level].name = ml.description.split(':')[1]?.trim() || ml.name;
      }
      // Category level (e.g., "1.1", "2.1" - pure numeric format without letters)
      else if (ml.sub_level && /^\d+\.\d+$/.test(ml.sub_level)) {
        const categoryKey = ml.sub_level;
        if (!grouped[ml.level].categories[categoryKey]) {
          grouped[ml.level].categories[categoryKey] = {
            name: ml.name || ml.category || ml.description,
            sub_level: ml.sub_level,
            items: []
          };
        }
      }
      // Sub-items (e.g., "1.1a", "2.1b" - has letters)
      else if (ml.sub_level && /^\d+\.\d+[a-z]$/.test(ml.sub_level)) {
        const categoryKey = ml.sub_level.replace(/[a-z]$/, ''); // Extract "1.1" from "1.1a"
        if (!grouped[ml.level].categories[categoryKey]) {
          grouped[ml.level].categories[categoryKey] = {
            name: ml.category || 'Other',
            sub_level: categoryKey,
            items: []
          };
        }
        grouped[ml.level].categories[categoryKey].items.push(ml);
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

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const getCategoryProgress = (items) => {
    if (items.length === 0) return { total: 0, completed: 0, percentage: 0 };
    const completed = items.filter(item => selectedItems[item.id]).length;
    return {
      total: items.length,
      completed,
      percentage: Math.round((completed / items.length) * 100)
    };
  };

  const getLevelProgress = (categories) => {
    let totalItems = 0;
    let completedItems = 0;
    
    Object.values(categories).forEach(category => {
      totalItems += category.items.length;
      completedItems += category.items.filter(item => selectedItems[item.id]).length;
    });
    
    return {
      total: totalItems,
      completed: completedItems,
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  };

  const groupedData = groupByLevelAndCategory();
  const levelKeys = [1, 2, 3, 4, 5];

  if (loading) {
    return <LoadingSpinner message="Loading Dashboard..." />;
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
            Assessment Progress & Capability Status
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

      {/* Dimension Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-600 mb-2">
              Filter by Dimension/Area
            </label>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white"
            >
              <option value="">All Dimensions</option>
              {dimensions.map(dim => (
                <option key={dim.id} value={dim.id}>{dim.name}</option>
              ))}
            </select>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Selected Dimension</div>
            <div className="text-lg font-bold text-slate-700">
              {selectedDimension ? dimensions.find(d => d.id === parseInt(selectedDimension))?.name : 'All'}
            </div>
          </div>
        </div>
        {selectedDimension && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              📊 Showing assessment data for <strong>{dimensions.find(d => d.id === parseInt(selectedDimension))?.name}</strong>.
              {assessments.filter(a => a.dimension_id === parseInt(selectedDimension)).length === 0 && 
                <span className="ml-1 font-semibold text-orange-600">No assessment data captured yet (NA).</span>
              }
            </p>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {selectedDimension && assessments.filter(a => a.dimension_id === parseInt(selectedDimension)).length === 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-bold text-orange-700 mb-2">No Assessment Data Available</h3>
          <p className="text-orange-600">
            No assessment data has been captured for the selected dimension yet. 
            Please conduct an assessment from the Smart Factory Assessment page.
          </p>
        </div>
      )}

      {/* Maturity Levels */}
      <div className="space-y-4">
        {levelKeys.map((level) => {
          const levelData = groupedData[level];
          if (!levelData) return null;

          const isExpanded = expandedLevels[level];
          const categories = levelData.categories;
          const categoryCount = Object.keys(categories).length;
          const levelName = levelData.name || `Level ${level}`;
          const levelProgress = getLevelProgress(categories);

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
                      {categoryCount} categories • {levelProgress.completed}/{levelProgress.total} capabilities completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-black">{levelProgress.percentage}%</div>
                    <div className="text-xs text-white/80">Progress</div>
                  </div>
                  <div className={`px-4 py-2 ${getLevelBadgeColor(level)} rounded-lg font-black text-lg`}>
                    L{level}
                  </div>
                </div>
              </button>

              {/* Categories (L2 Level) */}
              {isExpanded && (
                <div className="p-6 bg-slate-50 space-y-3">
                  {categoryCount === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <p>No categories available for this level.</p>
                    </div>
                  ) : (
                    Object.entries(categories).map(([categoryKey, category]) => {
                      const isCategoryExpanded = expandedCategories[categoryKey];
                      const progress = getCategoryProgress(category.items);
                      
                      return (
                        <div key={categoryKey} className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
                          {/* Category Header (L2) */}
                          <button
                            onClick={() => toggleCategory(categoryKey)}
                            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              {isCategoryExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              <div className={`px-2 py-1 ${getLevelBadgeColor(level)} rounded font-bold text-xs`}>
                                {category.sub_level}
                              </div>
                              <h4 className="font-bold text-slate-700">
                                {category.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-slate-600">
                                {progress.completed}/{progress.total} completed
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                progress.percentage === 100 ? 'bg-green-100 text-green-700' :
                                progress.percentage > 0 ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {progress.percentage}%
                              </div>
                            </div>
                          </button>

                          {/* Sub-items (L3) */}
                          {isCategoryExpanded && category.items.length > 0 && (
                            <div className="p-4 space-y-2 border-t border-slate-200">
                              {category.items.map((item) => {
                                const isCompleted = selectedItems[item.id];
                                
                                return (
                                  <div
                                    key={item.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                      isCompleted 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-white border-slate-200'
                                    }`}
                                  >
                                    <div className="flex-shrink-0 pt-0.5">
                                      {isCompleted ? (
                                        <CheckCircle2 className="text-green-600" size={20} />
                                      ) : (
                                        <Circle className="text-slate-400" size={20} />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start gap-2 mb-1">
                                        <span className={`px-2 py-0.5 ${getLevelBadgeColor(level)} rounded text-xs font-bold`}>
                                          {item.sub_level}
                                        </span>
                                        <span className={`font-semibold text-sm ${isCompleted ? 'text-green-900' : 'text-slate-700'}`}>
                                          {item.name}
                                        </span>
                                      </div>
                                      <p className={`text-sm leading-relaxed ${isCompleted ? 'text-green-700' : 'text-slate-600'}`}>
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
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
              <h3 className="font-bold text-lg mb-1">Overall Assessment Progress</h3>
              <p className="text-slate-300 text-sm">Track your digital transformation journey</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-black">{Object.keys(selectedItems).filter(k => selectedItems[k]).length}</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">{maturityLevels.filter(ml => ml.sub_level && /[a-z]$/.test(ml.sub_level)).length}</p>
                <p className="text-slate-300 text-xs uppercase tracking-wider">Total Capabilities</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <NavigationButtons
        onNavigate={onNavigate}
        previousIndex={0}
        nextIndex={2}
        previousLabel="Smart Factory Assessment"
        nextLabel="Rating Scales"
      />
    </div>
  );
};

export default Reports;
