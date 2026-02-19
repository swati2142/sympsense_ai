import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, KeyRound } from 'lucide-react';

export const FamilyLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call - Redirecting to first patient for demo
    setTimeout(() => {
      navigate('/family/status/P001');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="bg-teal-600 p-3 rounded-full inline-block mb-4 shadow-lg shadow-teal-200">
          <HeartHandshake className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Family Connect</h1>
        <p className="text-gray-500 mt-2">Stay updated on your loved one's status</p>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID / Phone Number</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" 
              placeholder="e.g. P001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none font-mono tracking-widest" 
                placeholder="123-456"
              />
            </div>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-teal-200"
          >
            {loading ? 'Verifying...' : 'View Status'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Need an access code? Please contact the ward reception.
        </p>
      </div>
    </div>
  );
};
