import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import AttackPath from './pages/AttackPath';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <AppShell showFilterBar={true}>
            {(filters) => <Dashboard filters={filters} />}
          </AppShell>
        }
      />
      <Route
        path="/attack-path"
        element={
          <AppShell showFilterBar={false}>
            {(filters) => <AttackPath filters={filters} />}
          </AppShell>
        }
      />
      {/* Stub pages for sidebar links */}
      <Route
        path="/assets"
        element={
          <AppShell showFilterBar={true}>
            {() => <StubPage title="Assets" description="Asset inventory and management" />}
          </AppShell>
        }
      />
      <Route
        path="/findings"
        element={
          <AppShell showFilterBar={true}>
            {() => <StubPage title="Findings" description="Security findings and vulnerability management" />}
          </AppShell>
        }
      />
      <Route
        path="/network"
        element={
          <AppShell showFilterBar={true}>
            {() => <StubPage title="Network" description="Network topology and communication analysis" />}
          </AppShell>
        }
      />
      <Route
        path="/sites"
        element={
          <AppShell showFilterBar={true}>
            {() => <StubPage title="Sites" description="Site and zone management" />}
          </AppShell>
        }
      />
      <Route
        path="/monitoring"
        element={
          <AppShell showFilterBar={true}>
            {() => <StubPage title="Monitoring" description="Sensor and platform health monitoring" />}
          </AppShell>
        }
      />
      <Route
        path="/settings"
        element={
          <AppShell showFilterBar={false}>
            {() => <StubPage title="Settings" description="Platform configuration and preferences" />}
          </AppShell>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Placeholder for non-implemented pages
const StubPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6">
    <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-4">
      <span className="text-brand text-xl font-bold">○</span>
    </div>
    <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-sm text-gray-500 max-w-xs">{description}</p>
    <p className="text-xs text-gray-400 mt-2">This page is out of scope for the design challenge prototype.</p>
  </div>
);

export default App;
