/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
// Clean build - selectedItems state removed
import { ChevronDown, ChevronRight, Save, RefreshCw, FileJson, FileSpreadsheet } from 'lucide-react';
import { apiUrl } from '../../config';
import { getLevelColor, getLevelBadgeColor } from '../../utils/colorUtils';
import { API_ENDPOINTS } from '../../utils/constants';
import NavigationButtons from '../shared/NavigationButtons';

const SHOP_UNITS = [
  'Press Shop',
  'BIW 1',
  'BIW 2',
  'BIW 3',
  'Paint Shop 1',
  'Paint Shop 2',
  'Assembly Line 1',
  'Assembly Line 2'
];

const SmartFactoryChecksheet = ({ onNavigate }) => {
  const [maturityLevels, setMaturityLevels] = useState([]);
  const [expandedLevels, setExpandedLevels] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });
  const [expandedItems, setExpandedItems] = useState({}); // Track which sub-items are expanded
  const [itemNotes, setItemNotes] = useState({}); // Store notes for each item
  const [itemTotalCounts, setItemTotalCounts] = useState({}); // Store total count for each item
  const [itemCheckedCounts, setItemCheckedCounts] = useState({}); // Store checked count for each item
  const [plantName, setPlantName] = useState('');
  const [shopUnit, setShopUnit] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDimension, setSelectedDimension] = useState('');
  const [dimensions, setDimensions] = useState([]);
  const [levelNotes, setLevelNotes] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: ''
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initializeAssessment = async () => {
    try {
      // Create a new assessment session
      const response = await fetch(apiUrl(API_ENDPOINTS.assessments), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_name: plantName || 'Default Plant',
          shop_unit: shopUnit,
          dimension_id: selectedDimension ? parseInt(selectedDimension) : null,
          assessor_name: 'User',
          notes: 'Smart Factory CheckSheet Assessment',
          level1_notes: '',
          level2_notes: '',
          level3_notes: '',
          level4_notes: '',
          level5_notes: '',
          overall_count: 0,
          checked_count: 0
        })
      });
      
      if (response.ok) {
        const assessment = await response.json();
        setAssessmentId(assessment.id);
        
        // Load existing assessment data including notes
        if (assessment.shop_unit) setShopUnit(assessment.shop_unit);
        if (assessment.dimension_id) setSelectedDimension(assessment.dimension_id.toString());
        if (assessment.level1_notes) setLevelNotes(prev => ({ ...prev, 1: assessment.level1_notes }));
        if (assessment.level2_notes) setLevelNotes(prev => ({ ...prev, 2: assessment.level2_notes }));
        if (assessment.level3_notes) setLevelNotes(prev => ({ ...prev, 3: assessment.level3_notes }));
        if (assessment.level4_notes) setLevelNotes(prev => ({ ...prev, 4: assessment.level4_notes }));
        if (assessment.level5_notes) setLevelNotes(prev => ({ ...prev, 5: assessment.level5_notes }));
        
        // Load existing selections if any
        const selectionsResponse = await fetch(apiUrl(`/api/mm/checksheet-selections/${assessment.id}`));
        if (selectionsResponse.ok) {
          const selections = await selectionsResponse.json();
          // Note: selectedItems state removed as it wasn't being used
          // Selection data is still loaded but not stored in component state
        }
      }
    } catch (error) {
      console.error('Error initializing assessment:', error);
    }
  };

  const fetchMaturityLevels = async () => {
    try {
      if (!selectedDimension) {

        setMaturityLevels([]);
        setLoading(false);
        return;
      }

      // Get the dimension name for the selected dimension ID
      const selectedDim = dimensions.find(d => d.id.toString() === selectedDimension);
      if (!selectedDim) {

        setMaturityLevels([]);
        setLoading(false);
        return;
      }

      const dimensionName = selectedDim.name;

      
      // Fetch rating scales for this specific dimension
      const url = apiUrl(`${API_ENDPOINTS.ratingScales}/${encodeURIComponent(dimensionName)}`);

      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Failed to fetch rating scales:', response.status, response.statusText);
        setMaturityLevels([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();

      
      // Filter out duplicates - keep only entries with "–" or "-" in rating_name (the descriptive ones)
      // This removes entries like "Level 1", "Level 2" and keeps "1 – Basic Connectivity", etc.
      const filteredData = Array.isArray(data) 
        ? data.filter(scale => scale.rating_name && (scale.rating_name.includes('–') || scale.rating_name.includes('—')))
        : [];
      

      
      // Transform rating scale data to match maturity level structure
      // Rating scales have: level, rating_name, digital_maturity_description
      const transformedData = filteredData.map(scale => ({
        id: scale.id,
        level: scale.level,
        name: scale.rating_name, // e.g., "1 – Basic Connectivity"
        sub_level: scale.level.toString(), // Use level as sub_level
        category: scale.rating_name,
        description: scale.digital_maturity_description,
        dimension_id: selectedDimension
      }));
      

      setMaturityLevels(transformedData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rating scales:', error);
      setMaturityLevels([]);
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!['json', 'xlsx', 'xls'].includes(fileExtension)) {
      alert('❌ Please upload a JSON or Excel file (.json, .xlsx, .xls)');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_type', fileExtension === 'json' ? 'json' : 'excel');

      const response = await fetch(apiUrl('/api/mm/upload-assessment'), {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ File uploaded successfully!\n\n${result.message}\nItems loaded: ${result.items_loaded || 0}`);
        // Refresh the data
        await fetchMaturityLevels();
        await initializeAssessment();
      } else {
        alert(`❌ Error: ${result.detail || 'Failed to upload file'}`);
      }
    } catch (error) {
      alert('❌ Error uploading file.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchDimensions();
    fetchMaturityLevels();
    initializeAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when dimension changes
  useEffect(() => {

    if (selectedDimension && dimensions.length > 0) {
      // Reset UI state when dimension changes
      setExpandedItems({});
      setItemNotes({});
      setItemTotalCounts({});
      setItemCheckedCounts({});
      setLoading(true);
      

      // Fetch new data for selected dimension
      fetchMaturityLevels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDimension, dimensions]);

  const dedupeByName = (items) => {
    const seen = new Set();
    return items.filter((d) => {
      const key = (d.name || '').toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const fetchDimensions = async () => {
    try {
      const response = await fetch(apiUrl('/api/mm/dimensions'));
      if (response.ok) {
        const data = await response.json();
        const dimensionsArray = Array.isArray(data) ? dedupeByName(data) : [];
        setDimensions(dimensionsArray);
        
        // Auto-select first dimension if none is selected
        if (dimensionsArray.length > 0 && !selectedDimension) {

          setSelectedDimension(dimensionsArray[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching dimensions:', error);
    }
  };

  const refreshSimulatedData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(apiUrl('/api/mm/refresh-simulated-data'), {
        method: 'POST',
      });
      const result = await response.json();
      
      if (response.ok) {
        // Reload the maturity levels
        await fetchMaturityLevels();
        alert(`✅ ${result.message}\n\nLoaded ${result.count} items`);
      } else {
        alert(`❌ Error: ${result.detail || 'Failed to refresh data'}`);
      }
    } catch (error) {
      alert('❌ Error refreshing simulated data.');
    } finally {
      setRefreshing(false);
    }
  };

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const toggleItem = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleTotalCountChange = (itemId, value) => {
    const sanitized = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
    // Enforce a single total count across all levels/items
    setItemTotalCounts({ [itemId]: sanitized });
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
      grouped[ml.level].items.push(ml);
    });
    return grouped;
  };



  const groupedLevels = groupByLevel();

  // Calculate overall maturity based on total and checked counts from all items
  const calculateOverallMaturity = () => {
    const totals = Object.values(itemTotalCounts).map(val => parseInt(val, 10) || 0);
    const totalSum = totals.length ? totals[0] : 0;

    let checkedSum = 0;
    Object.values(itemCheckedCounts).forEach(val => {
      checkedSum += parseInt(val, 10) || 0;
    });

    if (totalSum > 0 && checkedSum > totalSum) {
      checkedSum = totalSum;
    }

    const maturity = totalSum > 0 ? Math.round((checkedSum / totalSum) * 100) : 0;
    return { totalSum, checkedSum, maturity };
  };

  const { totalSum, checkedSum } = calculateOverallMaturity();

  const handleSave = async () => {
    if (!assessmentId) {
      alert('❌ No assessment session found. Please refresh the page.');
      return;
    }

    if (!selectedDimension) {
      alert('❌ Please select a dimension before saving.');
      return;
    }

    setSaving(true);
    try {
      const { totalSum, checkedSum, maturity } = calculateOverallMaturity();
      
      // Prepare item data to save
      const itemDataToSave = {
        notes: itemNotes,
        totalCounts: itemTotalCounts,
        checkedCounts: itemCheckedCounts
      };
      
      // First, update assessment details with all captured information
      const updateResponse = await fetch(apiUrl(`/api/mm/assessments/${assessmentId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_name: plantName,
          shop_unit: shopUnit,
          dimension_id: selectedDimension ? parseInt(selectedDimension) : null,
          assessor_name: 'User',
          notes: JSON.stringify(itemDataToSave), // Store item data as JSON
          level1_notes: levelNotes[1],
          level2_notes: levelNotes[2],
          level3_notes: levelNotes[3],
          level4_notes: levelNotes[4],
          level5_notes: levelNotes[5],
          overall_count: totalSum,
          checked_count: checkedSum
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update assessment details');
      }

      // Show success with calculated maturity
      alert(`✅ Assessment Saved & Maturity Calculated!

Plant: ${plantName}
Shop Unit: ${shopUnit}
Date: ${assessmentDate}
Dimension: ${dimensions.find(d => d.id === parseInt(selectedDimension))?.name || 'Not Selected'}

📊 Assessment Results:
Total Count: ${totalSum}
Checked Count: ${checkedSum}
Assessment Maturity: ${maturity}%

All item notes and counts have been saved successfully!`);

    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('❌ Error saving assessment. Please check the console.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">Smart Factory Assessment</h1>
          <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">Digital Maturity Evaluation & Data Collection</p>
        </div>
        <button
          onClick={refreshSimulatedData}
          disabled={refreshing}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-bold text-sm uppercase hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Data Upload Section */}
      <div className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-2">Data Collection Options</h3>
            <p className="text-slate-500 text-sm mb-4">
              Choose to manually enter assessment data below or upload data from a file
            </p>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold text-sm uppercase hover:from-red-700 hover:to-red-800 transition-all cursor-pointer shadow-lg">
                <FileJson size={18} />
                Upload JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-bold text-sm uppercase hover:from-emerald-700 hover:to-emerald-800 transition-all cursor-pointer shadow-lg">
                <FileSpreadsheet size={18} />
                Upload Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {uploading && (
              <div className="mt-3 flex items-center gap-2 text-slate-500">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm font-semibold">Uploading and processing file...</span>
              </div>
            )}
          </div>
          <div className="w-64 bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-bold text-slate-600 text-sm mb-2">File Format Requirements</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• JSON: Assessment data structure</li>
              <li>• Excel: Formatted assessment sheet</li>
              <li>• Uploaded data will replace current selections</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Assessment Information */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Assessment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Plant Name</label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Enter plant name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Shop Unit</label>
            <select
              value={shopUnit}
              onChange={(e) => setShopUnit(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white"
            >
              <option value="">Select shop unit</option>
              {SHOP_UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Assessment Date</label>
            <input
              type="date"
              value={assessmentDate}
              onChange={(e) => setAssessmentDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Dimension/Area</label>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white"
            >
              <option value="">Select dimension</option>
              {dimensions.map(dim => (
                <option key={dim.id} value={dim.id}>{dim.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Total/Checked Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-6 items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-1">Totals Entered</h3>
          <p className="text-slate-500 text-sm">Applies across all levels</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Count Entered</div>
            <div className="text-2xl font-black text-blue-800">{totalSum}</div>
          </div>
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Checked Count Entered</div>
            <div className="text-2xl font-black text-emerald-800">{checkedSum}</div>
          </div>
        </div>
      </div>

      {/* Maturity Levels */}
      <div className="space-y-4">
        {Object.entries(groupedLevels).map(([level, data]) => (
          <div key={level} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Level Header */}
            <div
              className={`bg-gradient-to-r ${getLevelColor(parseInt(level))} p-5 cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => toggleLevel(parseInt(level))}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedLevels[level] ? (
                    <ChevronDown className="text-white" size={24} />
                  ) : (
                    <ChevronRight className="text-white" size={24} />
                  )}
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                      Level {level}: {data.name}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">{data.items.length} capabilities</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 border-white/30 ${getLevelBadgeColor(parseInt(level))}`}>
                  <span className="font-bold text-sm">L{level}</span>
                </div>
              </div>
            </div>

            {/* Level Content */}
            {expandedLevels[level] && (
              <div className="p-6 space-y-4">
                {/* Level-specific notes textarea */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-slate-600 mb-2">
                    Level {level} Notes & Evidence
                  </label>
                  <textarea
                    value={levelNotes[parseInt(level)] || ''}
                    onChange={(e) => setLevelNotes(prev => ({ ...prev, [parseInt(level)]: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                    placeholder={`Add observations, evidence, or notes for Level ${level} capabilities...`}
                    rows="3"
                  />
                </div>

                {/* Sub-level items with collapsible sections */}
                <div className="space-y-3">
                  {data.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                      {/* Item Header - Clickable to expand/collapse */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {expandedItems[item.id] ? (
                            <ChevronDown className="text-slate-600" size={20} />
                          ) : (
                            <ChevronRight className="text-slate-600" size={20} />
                          )}
                          <div className="flex-1">
                            {item.sub_level && (
                              <span className={`px-2 py-1 rounded text-xs font-bold border ${getLevelBadgeColor(item.level)} mr-2`}>
                                {item.sub_level}
                              </span>
                            )}
                            {item.category && (
                              <span className="text-sm font-semibold text-slate-700">
                                {item.category}
                              </span>
                            )}
                            {!item.category && (
                              <span className="text-sm font-semibold text-slate-700">
                                {item.name || item.description?.substring(0, 50)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedItems[item.id] && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50">
                          {/* Description */}
                          <p className="text-sm text-slate-600 mb-4 leading-relaxed">{item.description}</p>
                          
                          {/* Input Section: Large text area + Count boxes */}
                          <div className="flex gap-4">
                            {/* Large text area for user inputs */}
                            <div className="flex-1">
                              <label className="block text-xs font-bold text-slate-600 mb-2">
                                Notes & Evidence
                              </label>
                              <textarea
                                value={itemNotes[item.id] || ''}
                                onChange={(e) => setItemNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none text-sm"
                                placeholder="Add observations, evidence, or notes for this capability..."
                                rows="4"
                              />
                            </div>

                            {/* Count boxes on the right */}
                            <div className="flex gap-3">
                              {/* Total Count */}
                              <div className="w-28">
                                <label className="block text-xs font-bold text-blue-600 mb-2 text-center">
                                  Total Count
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={itemTotalCounts[item.id] || ''}
                                  onChange={(e) => handleTotalCountChange(item.id, e.target.value)}
                                  className="w-full px-2 py-2 border-2 border-blue-300 rounded-lg text-center font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </div>

                              {/* Checked Count */}
                              <div className="w-28">
                                <label className="block text-xs font-bold text-emerald-600 mb-2 text-center">
                                  Checked Count
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={itemCheckedCounts[item.id] || ''}
                                  onChange={(e) => setItemCheckedCounts(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="w-full px-2 py-2 border-2 border-emerald-300 rounded-lg text-center font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => {/* Clear functionality removed */}}
          className="px-6 py-3 bg-slate-200 text-slate-600 rounded-lg font-bold text-sm uppercase hover:bg-slate-300 transition-colors"
        >
          Clear Selection
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold text-sm uppercase hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {saving ? 'Calculating...' : 'Save & Calculate Scores'}
        </button>
      </div>

      <NavigationButtons
        onNavigate={onNavigate}
        previousIndex={3}
        nextIndex={1}
        previousLabel="Matrices"
        nextLabel="Dashboard"
      />
    </div>
  );
};

export default SmartFactoryChecksheet;
