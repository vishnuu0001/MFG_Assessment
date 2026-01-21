import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight, Save, RefreshCw, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { apiUrl } from '../../config';
import { getLevelColor, getLevelBadgeColor } from '../../utils/colorUtils';
import { API_ENDPOINTS } from '../../utils/constants';
import LoadingSpinner from '../shared/LoadingSpinner';
import NavigationButtons from '../shared/NavigationButtons';

const SmartFactoryChecksheet = ({ onNavigate }) => {
  const [maturityLevels, setMaturityLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [expandedLevels, setExpandedLevels] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });
  const [plantName, setPlantName] = useState('');
  const [plantLocation, setPlantLocation] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
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
          plant_location: plantLocation,
          assessor_name: 'User',
          notes: 'Smart Factory CheckSheet Assessment',
          level1_notes: '',
          level2_notes: '',
          level3_notes: '',
          level4_notes: '',
          level5_notes: ''
        })
      });
      
      if (response.ok) {
        const assessment = await response.json();
        setAssessmentId(assessment.id);
        
        // Load existing assessment data including notes
        if (assessment.plant_location) setPlantLocation(assessment.plant_location);
        if (assessment.level1_notes) setLevelNotes(prev => ({ ...prev, 1: assessment.level1_notes }));
        if (assessment.level2_notes) setLevelNotes(prev => ({ ...prev, 2: assessment.level2_notes }));
        if (assessment.level3_notes) setLevelNotes(prev => ({ ...prev, 3: assessment.level3_notes }));
        if (assessment.level4_notes) setLevelNotes(prev => ({ ...prev, 4: assessment.level4_notes }));
        if (assessment.level5_notes) setLevelNotes(prev => ({ ...prev, 5: assessment.level5_notes }));
        
        // Load existing selections if any
        const selectionsResponse = await fetch(apiUrl(`/api/mm/checksheet-selections/${assessment.id}`));
        if (selectionsResponse.ok) {
          const selections = await selectionsResponse.json();
          const selectedMap = {};
          selections.forEach(sel => {
            if (sel.is_selected) {
              selectedMap[sel.maturity_level_id] = true;
            }
          });
          setSelectedItems(selectedMap);
        }
      }
    } catch (error) {
      console.error('Error initializing assessment:', error);
    }
  };

  const fetchMaturityLevels = async () => {
    try {
      const response = await fetch(apiUrl(API_ENDPOINTS.maturityLevels));
      
      if (!response.ok) {
        console.error('Failed to fetch maturity levels:', response.status, response.statusText);
        setMaturityLevels([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMaturityLevels(data);
      } else {
        console.error('Maturity levels data is not an array:', data);
        setMaturityLevels([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching maturity levels:', error);
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
      console.error('Error uploading file:', error);
      alert('❌ Error uploading file. Please check the console.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchMaturityLevels();
    initializeAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      console.error('Error refreshing data:', error);
      alert('❌ Error refreshing simulated data. Please check the console.');
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

  const toggleSelection = async (id) => {
    const newValue = !selectedItems[id];
    
    setSelectedItems(prev => ({
      ...prev,
      [id]: newValue
    }));

    // Save selection to backend immediately
    if (assessmentId) {
      try {
        await fetch(apiUrl('/api/mm/checksheet-selections'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([{
            assessment_id: assessmentId,
            maturity_level_id: id,
            is_selected: newValue,
            evidence: null
          }])
        });
      } catch (error) {
        console.error('Error saving selection:', error);
      }
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
      grouped[ml.level].items.push(ml);
    });
    return grouped;
  };

  const groupedLevels = groupByLevel();

  const handleSave = async () => {
    if (!assessmentId) {
      alert('❌ No assessment session found. Please refresh the page.');
      return;
    }

    setSaving(true);
    try {
      // First, update assessment details with all captured information
      const updateResponse = await fetch(apiUrl(`/api/mm/assessments/${assessmentId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_name: plantName,
          plant_location: plantLocation,
          assessor_name: 'User',
          notes: 'Smart Factory CheckSheet Assessment',
          level1_notes: levelNotes[1],
          level2_notes: levelNotes[2],
          level3_notes: levelNotes[3],
          level4_notes: levelNotes[4],
          level5_notes: levelNotes[5]
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update assessment details');
      }

      // Then trigger dimension score calculation
      const response = await fetch(apiUrl(`/api/mm/calculate-dimension-scores?assessment_id=${assessmentId}`), {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ Assessment Saved & Calculated!\n\nPlant: ${plantName}\nLocation: ${plantLocation}\nDate: ${assessmentDate}\nSelected Items: ${Object.values(selectedItems).filter(Boolean).length}\n\n${result.message}\nCalculated Level: ${result.calculated_level}\nDimensions Updated: ${result.dimensions_updated}`);
      } else {
        alert(`❌ Error: ${result.detail || 'Failed to calculate scores'}`);
      }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-semibold text-slate-600 mb-2">Plant Location</label>
            <input
              type="text"
              value={plantLocation}
              onChange={(e) => setPlantLocation(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Enter plant location"
            />
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

                {/* Capability checkboxes */}
                <div className="space-y-3">
                  {data.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedItems[item.id]
                          ? 'border-red-600 bg-red-50'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                      onClick={() => toggleSelection(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {selectedItems[item.id] ? (
                            <CheckSquare className="text-red-600" size={20} />
                          ) : (
                            <Square className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          {item.sub_level && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold border ${getLevelBadgeColor(item.level)}`}>
                                {item.sub_level}
                              </span>
                              {item.category && (
                                <span className="text-xs font-semibold text-slate-500">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
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
          onClick={() => setSelectedItems({})}
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

      {/* Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-1">Assessment Progress</h3>
            <p className="text-slate-500 text-sm">Track your digital maturity evaluation</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600">
              {Object.values(selectedItems).filter(Boolean).length}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Items Selected</div>
          </div>
        </div>
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
