import React, { useState } from 'react';
import { Save, FileJson, FileSpreadsheet, ChevronDown, ChevronRight } from 'lucide-react';
import { apiUrl } from '../../config';

const SmartFactoryAssessment = () => {
  const [expandedAreas, setExpandedAreas] = useState({
    'Press Shop': true,
    'Assembly Area': false,
    'Machine Shop 1': false
  });

  const [assessmentData, setAssessmentData] = useState({
    plantName: '',
    assessor: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    areas: {
      'Press Shop': {},
      'Assembly Area': {},
      'Machine Shop 1': {}
    }
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Define questions for each area with their types
  const questionsByArea = {
    'Press Shop': [
      { id: 'ps_q1', question: 'Stamping Process Automation Level', type: 'dropdown', options: ['Manual', 'Semi-Automated', 'Fully Automated', 'Smart/Autonomous'] },
      { id: 'ps_q2', question: 'Real-time Quality Monitoring', type: 'checkbox', label: 'Enabled' },
      { id: 'ps_q3', question: 'Tool Life Prediction System', type: 'checkbox', label: 'Implemented' },
      { id: 'ps_q4', question: 'Material Traceability', type: 'dropdown', options: ['None', 'Batch Level', 'Part Level', 'Full Genealogy'] },
      { id: 'ps_q5', question: 'Press Line OEE Monitoring', type: 'checkbox', label: 'Active' },
      { id: 'ps_q6', question: 'Predictive Maintenance for Presses', type: 'dropdown', options: ['Reactive', 'Preventive', 'Predictive', 'Prescriptive'] },
      { id: 'ps_q7', question: 'Energy Consumption Monitoring', type: 'checkbox', label: 'Installed' },
      { id: 'ps_q8', question: 'Digital Work Instructions', type: 'checkbox', label: 'Deployed' },
      { id: 'ps_q9', question: 'Die Change Optimization', type: 'text', placeholder: 'Describe your SMED implementation' },
      { id: 'ps_q10', question: 'Scrap Tracking & Analytics', type: 'dropdown', options: ['Manual', 'Semi-Automated', 'Real-time Digital', 'AI-Powered'] }
    ],
    'Assembly Area': [
      { id: 'aa_q1', question: 'Assembly Line Digital Twin', type: 'checkbox', label: 'Implemented' },
      { id: 'aa_q2', question: 'Torque Tool Data Collection', type: 'dropdown', options: ['None', 'Manual Logging', 'Semi-Automated', 'Fully Digital'] },
      { id: 'aa_q3', question: 'AGV/AMR Integration', type: 'checkbox', label: 'Operational' },
      { id: 'aa_q4', question: 'Collaborative Robots (Cobots)', type: 'dropdown', options: ['None', '1-5 Units', '6-15 Units', '15+ Units'] },
      { id: 'aa_q5', question: 'Vision-based Quality Inspection', type: 'checkbox', label: 'Deployed' },
      { id: 'aa_q6', question: 'Sequence Planning System', type: 'dropdown', options: ['Manual', 'Static Digital', 'Dynamic Optimization', 'AI-Driven'] },
      { id: 'aa_q7', question: 'Operator Guidance System', type: 'checkbox', label: 'Available' },
      { id: 'aa_q8', question: 'Just-in-Sequence (JIS) Integration', type: 'checkbox', label: 'Enabled' },
      { id: 'aa_q9', question: 'Line Balancing Methodology', type: 'text', placeholder: 'Describe your approach' },
      { id: 'aa_q10', question: 'First Pass Yield Tracking', type: 'dropdown', options: ['Manual', 'Daily Reports', 'Real-time', 'Predictive Analytics'] }
    ],
    'Machine Shop 1': [
      { id: 'ms_q1', question: 'CNC Machine Connectivity', type: 'dropdown', options: ['Standalone', 'Basic IoT', 'Full MES Integration', 'Edge Computing'] },
      { id: 'ms_q2', question: 'Tool Management System', type: 'checkbox', label: 'Implemented' },
      { id: 'ms_q3', question: 'In-Process Quality Gates', type: 'checkbox', label: 'Automated' },
      { id: 'ms_q4', question: 'Machine Health Monitoring', type: 'dropdown', options: ['None', 'Basic Sensors', 'Advanced Predictive', 'Self-Optimizing'] },
      { id: 'ms_q5', question: 'Spindle Monitoring & Analytics', type: 'checkbox', label: 'Active' },
      { id: 'ms_q6', question: 'Coolant Optimization System', type: 'checkbox', label: 'Installed' },
      { id: 'ms_q7', question: 'Job Scheduling Automation', type: 'dropdown', options: ['Manual', 'Semi-Automated', 'Dynamic Scheduling', 'AI-Optimized'] },
      { id: 'ms_q8', question: 'Chip Evacuation Monitoring', type: 'checkbox', label: 'Monitored' },
      { id: 'ms_q9', question: 'Process Parameter Recording', type: 'text', placeholder: 'Describe data collection approach' },
      { id: 'ms_q10', question: 'Dimensional Inspection Integration', type: 'dropdown', options: ['Manual CMM', 'Automated CMM', 'In-line Gauging', 'Vision-based AI'] }
    ]
  };

  const toggleArea = (area) => {
    setExpandedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  const handleInputChange = (area, questionId, value) => {
    setAssessmentData(prev => ({
      ...prev,
      areas: {
        ...prev.areas,
        [area]: {
          ...prev.areas[area],
          [questionId]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    if (!assessmentData.plantName) {
      alert('❌ Please enter plant name before saving');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(apiUrl('/api/mm/save-area-assessment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Assessment Saved Successfully!\n\nPlant: ${assessmentData.plantName}\nAssessor: ${assessmentData.assessor}\nDate: ${assessmentData.assessmentDate}`);
      } else {
        alert(`❌ Error: ${result.detail || 'Failed to save assessment'}`);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('❌ Error saving assessment. Please check the console.');
    } finally {
      setSaving(false);
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

      const response = await fetch(apiUrl('/api/mm/upload-area-assessment'), {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ File uploaded successfully!\n\n${result.message}`);
        // Reload the page to show uploaded data
        if (result.data) {
          setAssessmentData(result.data);
        }
      } else {
        alert(`❌ Error: ${result.detail || 'Failed to upload file'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('❌ Error uploading file. Please check the console.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const renderQuestion = (area, question) => {
    const value = assessmentData.areas[area][question.id] || '';

    switch (question.type) {
      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => handleInputChange(area, question.id, e.target.checked)}
              className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500"
            />
            <label className="text-sm text-slate-600">{question.label}</label>
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(area, question.id, e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm text-slate-600"
          >
            <option value="">Select option...</option>
            {question.options.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'text':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(area, question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none text-sm text-slate-600"
            rows="3"
          />
        );

      default:
        return null;
    }
  };

  const getAreaColor = (area) => {
    const colors = {
      'Press Shop': 'from-red-500 to-red-600',
      'Assembly Area': 'from-emerald-500 to-emerald-600',
      'Machine Shop 1': 'from-purple-500 to-purple-600'
    };
    return colors[area] || 'from-slate-500 to-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-600 uppercase italic tracking-tight">Smart Factory Assessment</h1>
        <p className="text-red-600 mt-1 font-bold text-sm uppercase tracking-wider">Area-Based Digital Maturity Evaluation</p>
      </div>

      {/* Assessment Information */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Assessment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Plant Name *</label>
            <input
              type="text"
              value={assessmentData.plantName}
              onChange={(e) => setAssessmentData(prev => ({ ...prev, plantName: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Enter plant name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Assessor Name</label>
            <input
              type="text"
              value={assessmentData.assessor}
              onChange={(e) => setAssessmentData(prev => ({ ...prev, assessor: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Enter assessor name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Assessment Date</label>
            <input
              type="date"
              value={assessmentData.assessmentDate}
              onChange={(e) => setAssessmentData(prev => ({ ...prev, assessmentDate: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-sm">
        <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-4">Upload Assessment Data</h3>
        <div className="flex items-center gap-4">
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
          {uploading && (
            <span className="text-sm text-slate-500 font-semibold">Uploading...</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-3">Upload a pre-filled assessment file with the same question format</p>
      </div>

      {/* Assessment Areas */}
      <div className="space-y-4">
        {Object.keys(questionsByArea).map((area) => (
          <div key={area} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Area Header */}
            <div
              className={`bg-gradient-to-r ${getAreaColor(area)} p-5 cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => toggleArea(area)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedAreas[area] ? (
                    <ChevronDown className="text-white" size={24} />
                  ) : (
                    <ChevronRight className="text-white" size={24} />
                  )}
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">{area}</h2>
                </div>
                <div className="text-sm text-white font-semibold">
                  {questionsByArea[area].length} Questions
                </div>
              </div>
            </div>

            {/* Area Questions */}
            {expandedAreas[area] && (
              <div className="p-6 space-y-4">
                {questionsByArea[area].map((question) => (
                  <div key={question.id} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      {question.question}
                    </label>
                    {renderQuestion(area, question)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setAssessmentData({
            plantName: '',
            assessor: '',
            assessmentDate: new Date().toISOString().split('T')[0],
            areas: {
              'Press Shop': {},
              'Assembly Area': {},
              'Machine Shop 1': {}
            }
          })}
          className="px-6 py-3 bg-slate-200 text-slate-600 rounded-lg font-bold text-sm uppercase hover:bg-slate-300 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold text-sm uppercase hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-600 uppercase text-xs tracking-widest mb-1">Assessment Progress</h3>
            <p className="text-slate-500 text-sm">Complete all areas for comprehensive evaluation</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600">
              {Object.values(assessmentData.areas).reduce((total, area) => 
                total + Object.keys(area).length, 0
              )}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Questions Answered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFactoryAssessment;
