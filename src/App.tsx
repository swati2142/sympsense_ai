import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';

// Layouts
import { ClinicalLayout } from './components/layout/ClinicalLayout';

// Pages
import { Landing } from './pages/Landing';
import { ClinicalLogin } from './pages/clinical/Login';
import { Dashboard } from './pages/clinical/Dashboard';
import { PatientDetail } from './pages/clinical/PatientDetail';
import { Settings } from './pages/clinical/Settings';
import { FamilyLogin } from './pages/family/Login';
import { FamilyStatus } from './pages/family/PatientStatus';

function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* Clinical Routes */}
          <Route path="/clinical/login" element={<ClinicalLogin />} />
          <Route path="/clinical" element={<ClinicalLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patient/:id" element={<PatientDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Family Routes */}
          <Route path="/family/login" element={<FamilyLogin />} />
          <Route path="/family/status/:id" element={<FamilyStatus />} />
        </Routes>
      </BrowserRouter>
    </SimulationProvider>
  );
}

export default App;
