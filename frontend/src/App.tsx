import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { UploadContract } from './pages/UploadContract';
import { MyContracts } from './pages/MyContracts';
import { ContractDetail } from './pages/ContractDetail';
import { CompareContracts } from './pages/CompareContracts';
import { RiskReports } from './pages/RiskReports';
import { Playbooks } from './pages/Playbooks';
import { ClauseLibrary } from './pages/ClauseLibrary';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadContract />} />
          <Route path="agreements" element={<MyContracts />} />
          <Route path="contracts" element={<MyContracts />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="compare" element={<CompareContracts />} />
          <Route path="reports" element={<RiskReports />} />
          <Route path="playbooks" element={<Playbooks />} />
          <Route path="clause-library" element={<ClauseLibrary />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
