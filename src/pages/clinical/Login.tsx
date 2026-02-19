import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail } from 'lucide-react';

export const ClinicalLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/clinical/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="bg-blue-600 p-3 rounded-2xl inline-block mb-4 shadow-lg shadow-blue-200">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SympSense AI</h1>
        <p className="text-gray-500 mt-2">Clinical Decision Support System</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                defaultValue="dr.connor@hospital.org"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                placeholder="name@hospital.org"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                placeholder="••••••••"
              />
            </div>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Access Portal'}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          Protected by SympSense Secure Gateway v2.1
        </div>
      </div>
    </div>
  );
};
