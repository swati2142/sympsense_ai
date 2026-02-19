import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
// Badge not used here
import { Clock, Info, Phone, LogOut } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const FamilyStatus = () => {
  const { id } = useParams();
  const { patients } = useSimulation();
  const patient = patients.find(p => p.id === id);

  if (!patient) return <div className="p-10 text-center">Patient data not available.</div>;

  // Simplified status logic for family
  const getFamilyFriendlyStatus = (status: string) => {
    switch(status) {
      case 'STABLE': return { text: 'Stable', color: 'bg-green-100 text-green-800', desc: 'Vitals are within normal range.' };
      case 'AT_RISK': return { text: 'Being Closely Monitored', color: 'bg-yellow-100 text-yellow-800', desc: 'Medical team is attending to some changes.' };
      case 'CRITICAL': return { text: 'Under Active Care', color: 'bg-red-100 text-red-800', desc: 'Doctors are currently providing critical care.' };
      default: return { text: 'Unknown', color: 'bg-gray-100', desc: '' };
    }
  };

  const statusInfo = getFamilyFriendlyStatus(patient.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-700 text-white p-4 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <span className="font-bold text-lg">Family Connect</span>
          {/* Redirect to Landing Page instead of Family Login */}
          <Link to="/" className="text-teal-100 hover:text-white" title="Logout">
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500">
            {patient.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
          <p className="text-gray-500 text-sm mb-6">Room: {patient.bed} • {patient.ward}</p>

          <div className={cn("p-4 rounded-xl mb-4", statusInfo.color)}>
            <p className="font-bold text-lg">{statusInfo.text}</p>
            <p className="text-sm opacity-90 mt-1">{statusInfo.desc}</p>
          </div>

          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-teal-600" />
            Recent Updates
          </h3>
          <div className="space-y-6 pl-2 border-l-2 border-gray-100 ml-2">
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-white"></div>
              <p className="text-sm font-medium text-gray-800">Current Status Check</p>
              <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleTimeString()} - Automated system check completed.</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
              <p className="text-sm font-medium text-gray-800">Morning Rounds</p>
              <p className="text-xs text-gray-500 mt-1">09:00 AM - Doctor visited. No major concerns reported.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4 border border-blue-100">
          <div className="bg-blue-100 p-2 rounded-full">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">Need to speak to a nurse?</p>
            <p className="text-xs text-blue-700">Call Ward Station: +1 (555) 012-3456</p>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 px-4">
          Disclaimer: This portal provides simplified updates. For detailed medical information, please consult the doctor in charge.
        </p>
      </main>
    </div>
  );
};
