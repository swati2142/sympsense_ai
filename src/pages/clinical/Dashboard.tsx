import { useState, useMemo } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Heart, Activity, Wind, Thermometer, AlertTriangle, ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/helpers';

export const Dashboard = () => {
  const { patients, alerts } = useSimulation();
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState<string>('All Wards');

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');

  // Get unique wards
  const wards = useMemo(() => ['All Wards', ...Array.from(new Set(patients.map(p => p.ward)))], [patients]);

  // Filter patients
  const filteredPatients = selectedWard === 'All Wards' 
    ? patients 
    : patients.filter(p => p.ward === selectedWard);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left: Ward View */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Ward Monitor
          </h1>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {wards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map(patient => (
            <Card 
              key={patient.id} 
              onClick={() => navigate(`/clinical/patient/${patient.id}`)}
              className="cursor-pointer hover:shadow-md transition-shadow border-l-4 relative overflow-hidden group"
            >
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                patient.status === 'CRITICAL' ? 'bg-red-500' : 
                patient.status === 'AT_RISK' ? 'bg-yellow-500' : 'bg-green-500'
              )} />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{patient.bed}</h3>
                    <span className="text-sm text-gray-500">{patient.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">{patient.ward}</p>
                </div>
                <Badge variant={
                  patient.status === 'CRITICAL' ? 'danger' : 
                  patient.status === 'AT_RISK' ? 'warning' : 'success'
                }>
                  {patient.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">HR</p>
                    <p className="text-lg font-semibold">{patient.currentVitals.HR}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">SpO2</p>
                    <p className={cn("text-lg font-semibold", patient.currentVitals.SpO2 < 94 ? "text-red-600" : "")}>
                      {patient.currentVitals.SpO2}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">BP</p>
                    <p className="text-lg font-semibold">{patient.currentVitals.SBP}/{patient.currentVitals.DBP}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Temp</p>
                    <p className="text-lg font-semibold">{patient.currentVitals.Temp}°C</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-1">
                   {/* Active Alert Icons */}
                   {activeAlerts.filter(a => a.patientId === patient.id).map(alert => (
                     <div key={alert.id} className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={alert.type}></div>
                   ))}
                </div>
                <span className="text-xs text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Alert Feed */}
      <div className="col-span-12 lg:col-span-3 flex flex-col h-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Alerts
            </h2>
            <Badge variant="neutral">{activeAlerts.length}</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No active alerts.
                <br/>System monitoring...
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div key={alert.id} className={cn(
                  "p-3 rounded-lg border text-sm transition-all animate-in slide-in-from-right-2",
                  alert.severity === 'CRITICAL' ? "bg-red-50 border-red-200" : 
                  alert.severity === 'HIGH' ? "bg-orange-50 border-orange-200" : "bg-yellow-50 border-yellow-200"
                )}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-800">{alert.type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                      {patients.find(p => p.id === alert.patientId)?.bed || alert.patientId}
                    </span>
                    <button 
                      onClick={() => navigate(`/clinical/patient/${alert.patientId}`)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
