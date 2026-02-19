import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimulation } from '../../context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, CheckCircle, AlertOctagon, Zap, Activity, Thermometer, Wind } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { SimulationScenario } from '../../types';

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, alerts, acknowledgeAlert, resolveAlert, escalateAlert, setPatientScenario } = useSimulation();
  
  const patient = patients.find(p => p.id === id);
  
  if (!patient) return <div className="p-10 text-center">Patient not found</div>;

  const patientAlerts = alerts.filter(a => a.patientId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const activeAlerts = patientAlerts.filter(a => a.status !== 'RESOLVED');

  // Prepare chart data
  const chartData = patient.history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
    ...h
  }));

  const handleScenarioChange = (scenario: SimulationScenario) => {
    setPatientScenario(patient.id, scenario);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/clinical/dashboard')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {patient.name}
              <Badge variant={patient.status === 'CRITICAL' ? 'danger' : patient.status === 'AT_RISK' ? 'warning' : 'success'}>
                {patient.status}
              </Badge>
            </h1>
            <div className="flex gap-4 text-sm text-gray-500 mt-1">
              <span>ID: <span className="font-mono text-gray-700">{patient.id}</span></span>
              <span>Bed: <span className="font-mono text-gray-700">{patient.bed}</span></span>
              <span>{patient.age} yrs / {patient.gender}</span>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">Current Simulation State</p>
          <Badge variant="neutral" className="font-mono">{patient.activeScenario}</Badge>
        </div>
      </div>

      {/* Live Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Heart Rate', value: patient.currentVitals.HR, unit: 'bpm', icon: Activity, color: patient.currentVitals.HR > 100 || patient.currentVitals.HR < 50 ? 'text-red-600' : 'text-emerald-600' },
          { label: 'SpO2', value: patient.currentVitals.SpO2, unit: '%', icon: Wind, color: patient.currentVitals.SpO2 < 94 ? 'text-red-600' : 'text-blue-600' },
          { label: 'BP (Sys/Dia)', value: `${patient.currentVitals.SBP}/${patient.currentVitals.DBP}`, unit: 'mmHg', icon: Activity, color: 'text-purple-600' },
          { label: 'Resp Rate', value: patient.currentVitals.RR, unit: '/min', icon: Wind, color: 'text-teal-600' },
          { label: 'Temp', value: patient.currentVitals.Temp, unit: '°C', icon: Thermometer, color: patient.currentVitals.Temp > 38 ? 'text-orange-600' : 'text-gray-800' },
        ].map((vital, idx) => (
          <Card key={idx} className="text-center py-6 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <vital.icon className="w-8 h-8" />
            </div>
            <p className="text-sm text-gray-500 mb-1 font-medium">{vital.label}</p>
            <p className={cn("text-4xl font-bold font-mono tracking-tight", vital.color)}>{vital.value}</p>
            <p className="text-xs text-gray-400 mt-1">{vital.unit}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Real-time Trends</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> HR</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> SpO2</span>
              </div>
            </div>
            
            <div className="h-64 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" tick={{fontSize: 10, fill: '#9ca3af'}} interval={10} />
                  <YAxis yAxisId="left" domain={[40, 180]} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <Tooltip 
                    contentStyle={{fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    itemStyle={{padding: 0}}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="HR" stroke="#ef4444" strokeWidth={2} fill="url(#colorHR)" isAnimationActive={false} />
                  <Area yAxisId="right" type="monotone" dataKey="SpO2" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSpO2)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-48 w-full">
              <p className="text-xs text-gray-500 mb-2 font-medium">Blood Pressure (SBP)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" tick={{fontSize: 10, fill: '#9ca3af'}} interval={10} />
                  <YAxis domain={[60, 200]} tick={{fontSize: 10, fill: '#9ca3af'}} />
                  <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                  <Line type="monotone" dataKey="SBP" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Simulation Controls - DEMO ONLY */}
          <Card className="p-6 border-2 border-indigo-100 bg-indigo-50/50">
             <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Simulation Controls</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-semibold">Demo Mode</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button 
                  onClick={() => handleScenarioChange('NORMAL')}
                  className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all", patient.activeScenario === 'NORMAL' ? "bg-green-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200")}
                >
                  Normal / Stable
                </button>
                <button 
                  onClick={() => handleScenarioChange('HYPOXIA_EVENT')}
                  className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all", patient.activeScenario === 'HYPOXIA_EVENT' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200")}
                >
                  Induce Hypoxia
                </button>
                <button 
                  onClick={() => handleScenarioChange('CARDIAC_EVENT')}
                  className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all", patient.activeScenario === 'CARDIAC_EVENT' ? "bg-red-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200")}
                >
                  Cardiac Event
                </button>
                <button 
                  onClick={() => handleScenarioChange('SEPSIS_ONSET')}
                  className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all", patient.activeScenario === 'SEPSIS_ONSET' ? "bg-orange-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200")}
                >
                  Sepsis Onset
                </button>
                <button 
                  onClick={() => handleScenarioChange('RECOVERY')}
                  className={cn("px-3 py-2 rounded-lg text-sm font-medium transition-all", patient.activeScenario === 'RECOVERY' ? "bg-teal-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200")}
                >
                  Start Recovery
                </button>
             </div>
             <p className="text-xs text-gray-500 mt-3">
               Clicking a button will force the simulation engine to trend vitals towards that clinical state over the next 10-30 seconds.
             </p>
          </Card>
        </div>

        {/* Alerts & Actions Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full flex flex-col shadow-lg border-gray-200">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-500" />
                Clinical Alerts
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[600px]">
              {activeAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                  <CheckCircle className="w-8 h-8 mb-2 text-gray-200" />
                  <p>No active alerts.</p>
                  <p className="text-xs">Patient is stable.</p>
                </div>
              ) : (
                activeAlerts.map(alert => (
                  <div key={alert.id} className={cn(
                    "border rounded-lg p-4 space-y-3 shadow-sm transition-all animate-in slide-in-from-right-4",
                    alert.severity === 'CRITICAL' ? "bg-red-50 border-red-200 ring-1 ring-red-100" : 
                    alert.severity === 'HIGH' ? "bg-orange-50 border-orange-200" : "bg-yellow-50 border-yellow-200"
                  )}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className={cn("w-4 h-4", alert.severity === 'CRITICAL' ? "text-red-600" : "text-yellow-600")} />
                        <span className="font-bold text-gray-900">{alert.type} Agent</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-800 bg-white/60 p-2 rounded border border-black/5">
                      {alert.message}
                    </p>

                    <div className="flex gap-2 pt-2">
                      {alert.status === 'ACTIVE' && (
                        <button 
                          onClick={() => acknowledgeAlert(alert.id, 'Dr. Connor')}
                          className="flex-1 bg-blue-600 text-white text-xs font-medium py-2 rounded hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status === 'ACKNOWLEDGED' && (
                        <button 
                          onClick={() => resolveAlert(alert.id)}
                          className="flex-1 bg-green-600 text-white text-xs font-medium py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <CheckCircle className="w-3 h-3" /> Resolve
                        </button>
                      )}
                       <button 
                          onClick={() => escalateAlert(alert.id)}
                          className="px-3 bg-white border border-gray-300 text-gray-700 text-xs font-medium py-2 rounded hover:bg-gray-50 transition-colors"
                        >
                          Escalate
                        </button>
                    </div>
                    {alert.status === 'ACKNOWLEDGED' && (
                      <p className="text-xs text-gray-500 italic mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Acknowledged by {alert.acknowledgedBy}
                      </p>
                    )}
                  </div>
                ))
              )}

              {/* History Divider */}
              {patientAlerts.filter(a => a.status === 'RESOLVED').length > 0 && (
                <>
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">Resolved History</span></div>
                  </div>
                  {patientAlerts.filter(a => a.status === 'RESOLVED').slice(0, 3).map(alert => (
                    <div key={alert.id} className="opacity-60 border border-gray-100 rounded p-3 text-sm bg-gray-50 hover:opacity-100 transition-opacity">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">{alert.type} Alert</span>
                        <span className="text-xs text-gray-500">{new Date(alert.resolvedAt!).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{alert.message}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
