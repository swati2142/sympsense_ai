import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Vitals, SimulationScenario } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to clamp values within physiological limits
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

// Advanced Generator: Uses trends based on the active scenario
export const generateVitals = (prev: Vitals, scenario: SimulationScenario): Vitals => {
  const now = new Date();
  
  // 1. Base fluctuation (natural noise)
  let hrChange = (Math.random() - 0.5) * 2;
  let spo2Change = (Math.random() - 0.5) * 1;
  let sbpChange = (Math.random() - 0.5) * 2;
  
  // 2. Scenario-based forcing functions (The "Trend")
  switch (scenario) {
    case 'HYPOXIA_EVENT':
      // SpO2 drops rapidly, HR increases slightly (compensation)
      spo2Change -= 0.8; 
      hrChange += 0.5;
      break;
    
    case 'CARDIAC_EVENT':
      // HR spikes or drops dangerously
      hrChange += 2.5; 
      sbpChange -= 1.5; // BP drops
      break;

    case 'SEPSIS_ONSET':
      // Temp rises, HR rises, BP drops slowly
      hrChange += 0.2;
      sbpChange -= 0.2;
      // Temp handled separately below
      break;

    case 'RECOVERY':
      // Return to normal ranges
      if (prev.SpO2 < 98) spo2Change += 1.5;
      if (prev.HR > 75) hrChange -= 1.0;
      if (prev.HR < 60) hrChange += 1.0;
      if (prev.SBP < 120) sbpChange += 1.0;
      break;

    case 'NORMAL':
    default:
      // Tend towards stability
      if (prev.SpO2 < 96) spo2Change += 0.5;
      if (prev.SpO2 > 99) spo2Change -= 0.5;
      break;
  }

  // 3. Calculate new values with clamping
  const newHR = clamp(prev.HR + hrChange, 30, 200);
  const newSpO2 = clamp(prev.SpO2 + spo2Change, 60, 100);
  const newSBP = clamp(prev.SBP + sbpChange, 50, 220);
  const newDBP = clamp(newSBP * 0.65 + (Math.random() - 0.5) * 2, 40, 130); // DBP linked to SBP roughly
  
  // Temp logic
  const tempChange = (Math.random() - 0.5) * 0.1;
  let adjustedTempChange = tempChange;
  if (scenario === 'SEPSIS_ONSET') adjustedTempChange += 0.05;
  if (scenario === 'RECOVERY' && prev.Temp > 37) adjustedTempChange -= 0.1;
  const newTemp = clamp(prev.Temp + adjustedTempChange, 35, 42);

  return {
    timestamp: now.toISOString(),
    HR: Math.round(newHR),
    SpO2: Math.round(newSpO2),
    SBP: Math.round(newSBP),
    DBP: Math.round(newDBP),
    RR: Math.round(clamp(prev.RR + (Math.random() - 0.5), 8, 40)),
    Temp: Number(newTemp.toFixed(1)),
    fall: scenario === 'NORMAL' && Math.random() > 0.999, // Very rare fall in normal
  };
};
