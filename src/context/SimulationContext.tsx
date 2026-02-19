import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Patient, Alert, SimulationScenario, PatientStatus } from '../types';
import { generateVitals } from '../utils/helpers';

interface SimulationContextType {
  patients: Patient[];
  alerts: Alert[];
  acknowledgeAlert: (alertId: string, userId: string) => void;
  resolveAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  setPatientScenario: (patientId: string, scenario: SimulationScenario) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const INITIAL_PATIENTS: Patient[] = [
  // ICU WARD A
  {
    id: 'P001', name: 'Thomas Anderson', bed: 'ICU-A-01', ward: 'ICU Ward A', age: 62, gender: 'M', admissionDate: '2025-11-28',
    status: 'CRITICAL',
    activeScenario: 'CARDIAC_EVENT',
    currentVitals: { timestamp: '', HR: 145, SpO2: 96, SBP: 160, DBP: 95, RR: 22, Temp: 36.9, fall: false },
    history: []
  },
  {
    id: 'P002', name: 'Martha Stewart', bed: 'ICU-A-02', ward: 'ICU Ward A', age: 74, gender: 'F', admissionDate: '2025-11-29',
    status: 'STABLE',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 72, SpO2: 98, SBP: 120, DBP: 78, RR: 16, Temp: 37.0, fall: false },
    history: []
  },
  {
    id: 'P003', name: 'David Miller', bed: 'ICU-A-03', ward: 'ICU Ward A', age: 55, gender: 'M', admissionDate: '2025-11-30',
    status: 'AT_RISK',
    activeScenario: 'SEPSIS_ONSET',
    currentVitals: { timestamp: '', HR: 105, SpO2: 94, SBP: 100, DBP: 65, RR: 20, Temp: 38.4, fall: false },
    history: []
  },

  // ICU WARD B
  {
    id: 'P004', name: 'Sarah Connor', bed: 'ICU-B-01', ward: 'ICU Ward B', age: 45, gender: 'F', admissionDate: '2025-11-30',
    status: 'CRITICAL',
    activeScenario: 'HYPOXIA_EVENT',
    currentVitals: { timestamp: '', HR: 115, SpO2: 82, SBP: 130, DBP: 85, RR: 28, Temp: 37.2, fall: false },
    history: []
  },
  {
    id: 'P005', name: 'Robert Chen', bed: 'ICU-B-02', ward: 'ICU Ward B', age: 68, gender: 'M', admissionDate: '2025-11-30',
    status: 'STABLE',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 68, SpO2: 97, SBP: 125, DBP: 82, RR: 18, Temp: 36.8, fall: false },
    history: []
  },

  // GENERAL WARD
  {
    id: 'P006', name: 'James Bond', bed: 'GW-101', ward: 'General Ward 1', age: 38, gender: 'M', admissionDate: '2025-12-01',
    status: 'STABLE',
    activeScenario: 'RECOVERY',
    currentVitals: { timestamp: '', HR: 65, SpO2: 99, SBP: 118, DBP: 76, RR: 14, Temp: 36.7, fall: false },
    history: []
  },
  {
    id: 'P007', name: 'Lucy Liu', bed: 'GW-102', ward: 'General Ward 1', age: 29, gender: 'F', admissionDate: '2025-12-01',
    status: 'STABLE',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 70, SpO2: 100, SBP: 110, DBP: 70, RR: 12, Temp: 36.8, fall: false },
    history: []
  },
  {
    id: 'P008', name: 'Morgan Freeman', bed: 'GW-103', ward: 'General Ward 1', age: 80, gender: 'M', admissionDate: '2025-12-02',
    status: 'AT_RISK',
    activeScenario: 'NORMAL',
    currentVitals: { timestamp: '', HR: 85, SpO2: 93, SBP: 140, DBP: 90, RR: 19, Temp: 37.1, fall: false },
    history: []
  }
];

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // SIMULATION LOOP (The "Backend" + "Agents")
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prevPatients => {
        return prevPatients.map(p => {
          // 1. Generate new vitals based on SCENARIO
          const newVitals = generateVitals(p.currentVitals, p.activeScenario);
          
          // 2. Update History (Keep last 60 points = 1 min for demo)
          const newHistory = [...p.history, newVitals].slice(-60);

          // 3. Run "Agents" (Logic Checks)
          let newStatus: PatientStatus = 'STABLE';
          let isCritical = false;
          
          // Hypoxia Agent
          if (newVitals.SpO2 < 88) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Hypoxia', 'CRITICAL', `Critical Desaturation: SpO2 ${newVitals.SpO2}%`);
          } else if (newVitals.SpO2 < 94) {
            if (!isCritical) newStatus = 'AT_RISK';
            // Only trigger medium alert occasionally to avoid spam, or if not already active
            if (Math.random() > 0.95) triggerAlert(p.id, 'Hypoxia', 'MEDIUM', `SpO2 trending low: ${newVitals.SpO2}%`);
          }

          // Cardiac Agent
          if (newVitals.HR > 140 || newVitals.HR < 40) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Cardiac', 'CRITICAL', `Dangerous Arrhythmia: HR ${newVitals.HR}`);
          } else if (newVitals.HR > 110) {
            if (!isCritical) newStatus = 'AT_RISK';
            if (Math.random() > 0.95) triggerAlert(p.id, 'Cardiac', 'HIGH', `Tachycardia detected: HR ${newVitals.HR}`);
          }

          // Sepsis Agent (Temp + HR combo)
          if (newVitals.Temp > 38.5 && newVitals.HR > 100) {
            if (!isCritical) newStatus = 'AT_RISK';
            triggerAlert(p.id, 'Sepsis', 'HIGH', `Sepsis Screen Positive: Temp ${newVitals.Temp}°C + HR ${newVitals.HR}`);
          }

          // Fall Agent
          if (newVitals.fall) {
            newStatus = 'CRITICAL';
            isCritical = true;
            triggerAlert(p.id, 'Fall', 'CRITICAL', 'Patient fall detected!');
          }

          return {
            ...p,
            currentVitals: newVitals,
            history: newHistory,
            status: newStatus
          };
        });
      });
    }, 1000); // 1 second tick

    return () => clearInterval(interval);
  }, []);

  const triggerAlert = (patientId: string, type: Alert['type'], severity: Alert['severity'], message: string) => {
    setAlerts(prev => {
      // Avoid spamming duplicate active alerts of same type
      const existing = prev.find(a => a.patientId === patientId && a.type === type && a.status !== 'RESOLVED');
      
      // If existing alert is lower severity, upgrade it
      if (existing) {
        if (severity === 'CRITICAL' && existing.severity !== 'CRITICAL') {
           return prev.map(a => a.id === existing.id ? { ...a, severity: 'CRITICAL', message, timestamp: new Date().toISOString() } : a);
        }
        return prev;
      }

      const newAlert: Alert = {
        id: Math.random().toString(36).substr(2, 9),
        patientId,
        type,
        severity,
        message,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE'
      };
      return [newAlert, ...prev];
    });
  };

  const acknowledgeAlert = (alertId: string, userId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: userId } : a));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a));
  };

  const escalateAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ESCALATED' } : a));
  };

  const setPatientScenario = (patientId: string, scenario: SimulationScenario) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, activeScenario: scenario } : p));
  };

  return (
    <SimulationContext.Provider value={{ patients, alerts, acknowledgeAlert, resolveAlert, escalateAlert, setPatientScenario }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
