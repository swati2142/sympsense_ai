import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, HeartHandshake, ArrowRight } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          SympSense <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-xl text-gray-500">
          Next-generation clinical decision support and family connection platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Clinical Portal Card */}
        <Link to="/clinical/login" className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:border-blue-500 transition-all hover:shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-200">
              <Activity className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Clinical Portal</h2>
            <p className="text-gray-500 mb-6">
              For Doctors & Nurses. Real-time ward monitoring, AI alerts, and patient management.
            </p>
            <span className="inline-flex items-center font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              Access Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Family Portal Card */}
        <Link to="/family/login" className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:border-teal-500 transition-all hover:shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors"></div>
          <div className="relative">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-teal-200">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Family Portal</h2>
            <p className="text-gray-500 mb-6">
              For Relatives. Simplified status updates and peace of mind for patient families.
            </p>
            <span className="inline-flex items-center font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
              View Patient Status <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
      
      <footer className="mt-16 text-gray-400 text-sm">
        © 2025 SympSense AI. All rights reserved.
      </footer>
    </div>
  );
};
