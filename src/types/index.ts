export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED';
export type PatientStatus = 'STABLE' | 'AT_RISK' | 'CRITICAL';

// New: Simulation Scenarios for demo purposes
export type SimulationScenario = 'NORMAL' | 'HYPOXIA_EVENT' | 'CARDIAC_EVENT' | 'SEPSIS_ONSET' | 'RECOVERY';

export interface Vitals {
  timestamp: string;
  HR: number;
  SpO2: number;
  SBP: number;
  DBP: number;
  RR: number;
  Temp: number;
  fall: boolean;
}

export interface Patient {
  id: string;
  name: string;
  bed: string;
  ward: string;
  age: number;
  gender: 'M' | 'F';
  admissionDate: string;
  status: PatientStatus;
  currentVitals: Vitals;
  history: Vitals[]; // Last N points for charts
  activeScenario: SimulationScenario; // Track what's happening to them
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'Cardiac' | 'Hypoxia' | 'Shock' | 'Sepsis' | 'Fall';
  severity: Severity;
  message: string;
  timestamp: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  resolvedAt?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Admin';
  email: string;
}
