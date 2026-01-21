import React, { useState } from 'react';

const Login = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = username.trim().toLowerCase();
    const pass = password.trim();
    if (user === 'admin' && pass === 'password') {
      setError('');
      onSuccess();
    } else {
      setError('Invalid credentials. Use admin / password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-10 w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-black text-center text-slate-900 uppercase tracking-tight">Mahindra and Mahindra</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-slate-800"
              placeholder=""
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-slate-800"
              placeholder=""
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-wide shadow-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
