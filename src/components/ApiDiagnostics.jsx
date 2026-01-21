import React, { useState, useEffect } from 'react';
import { API_BASE_URL, apiUrl } from '../config';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const ApiDiagnostics = () => {
  const [tests, setTests] = useState({
    configLoaded: { status: 'pending', message: '' },
    envVariable: { status: 'pending', message: '' },
    baseUrl: { status: 'pending', message: '' },
    apiReachable: { status: 'pending', message: '' },
    areasEndpoint: { status: 'pending', message: '' },
    maturityLevels: { status: 'pending', message: '' },
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Test 1: Config loaded
    setTests(prev => ({
      ...prev,
      configLoaded: { 
        status: 'success', 
        message: 'Config module loaded successfully' 
      }
    }));

    // Test 2: Environment variable
    const viteApiUrl = import.meta.env.VITE_API_URL;
    setTests(prev => ({
      ...prev,
      envVariable: {
        status: viteApiUrl ? 'success' : 'warning',
        message: viteApiUrl 
          ? `VITE_API_URL = ${viteApiUrl}` 
          : 'VITE_API_URL not set, using default (localhost:8000)'
      }
    }));

    // Test 3: Base URL
    setTests(prev => ({
      ...prev,
      baseUrl: {
        status: API_BASE_URL.includes('localhost') ? 'warning' : 'success',
        message: `API_BASE_URL = ${API_BASE_URL}`
      }
    }));

    // Test 4: API Reachable (root)
    try {
      const response = await fetch(API_BASE_URL);
      setTests(prev => ({
        ...prev,
        apiReachable: {
          status: response.ok ? 'success' : 'error',
          message: `${response.status} ${response.statusText}`
        }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        apiReachable: {
          status: 'error',
          message: `Cannot reach ${API_BASE_URL}: ${error.message}`
        }
      }));
    }

    // Test 5: Areas endpoint
    try {
      const response = await fetch(apiUrl('/api/mm/areas'));
      const data = response.ok ? await response.json() : null;
      setTests(prev => ({
        ...prev,
        areasEndpoint: {
          status: response.ok ? 'success' : 'error',
          message: response.ok 
            ? `✅ Got ${Array.isArray(data) ? data.length : 0} areas`
            : `❌ ${response.status} ${response.statusText}`
        }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        areasEndpoint: {
          status: 'error',
          message: error.message
        }
      }));
    }

    // Test 6: Maturity levels endpoint
    try {
      const response = await fetch(apiUrl('/api/mm/maturity-levels'));
      const data = response.ok ? await response.json() : null;
      setTests(prev => ({
        ...prev,
        maturityLevels: {
          status: response.ok ? 'success' : 'error',
          message: response.ok 
            ? `✅ Got ${Array.isArray(data) ? data.length : 0} maturity levels`
            : `❌ ${response.status} ${response.statusText}`
        }
      }));
    } catch (error) {
      setTests(prev => ({
        ...prev,
        maturityLevels: {
          status: 'error',
          message: error.message
        }
      }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={24} />;
      case 'error':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Loader className="text-blue-500 animate-spin" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const allPassing = Object.values(tests).every(t => t.status === 'success');
  const hasErrors = Object.values(tests).some(t => t.status === 'error');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            🔍 API Diagnostics
          </h1>
          <p className="text-gray-600 mb-6">
            Checking connection to backend API...
          </p>

          <div className="space-y-4">
            {Object.entries(tests).map(([key, test]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${getStatusColor(test.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 font-mono">
                      {test.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h2 className="font-bold text-blue-900 mb-3">📋 Status Summary</h2>
            {allPassing && (
              <p className="text-green-700 font-semibold">
                ✅ All tests passing! Your API connection is working correctly.
              </p>
            )}
            {hasErrors && (
              <div className="text-red-700 space-y-2">
                <p className="font-semibold">❌ Issues detected. Check:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Is the backend deployed to Vercel?</li>
                  <li>Is VITE_API_URL environment variable set in Vercel?</li>
                  <li>Does the backend URL end without a trailing slash?</li>
                  <li>Is CORS enabled on the backend?</li>
                  <li>Check browser console (F12) for more details</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={runDiagnostics}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🔄 Re-run Tests
            </button>
            <button
              onClick={() => window.open(API_BASE_URL + '/docs', '_blank')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              📚 Open API Docs
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            🛠️ Quick Fixes
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Backend Not Deployed?</h3>
              <p className="ml-4">Deploy your backend to Vercel following QUICK_START.md</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Environment Variable Not Set?</h3>
              <p className="ml-4">Go to Vercel → Your Frontend Project → Settings → Environment Variables</p>
              <p className="ml-4">Add: <code className="bg-gray-100 px-2 py-1 rounded">VITE_API_URL = https://your-backend.vercel.app</code></p>
              <p className="ml-4 mt-1">Then redeploy the frontend</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Using Localhost?</h3>
              <p className="ml-4">Localhost only works on your computer. Deploy to Vercel for global access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDiagnostics;
