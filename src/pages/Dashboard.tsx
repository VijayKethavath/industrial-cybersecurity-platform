import React from 'react';
import type { FilterState } from '../types';
import { securityPosture } from '../data/posture';
import PostureSummary from '../components/dashboard/PostureSummary';
import PriorityAttention from '../components/dashboard/PriorityAttention';
import RiskFindings from '../components/dashboard/RiskFindings';
import AssetVisibility from '../components/dashboard/AssetVisibility';
import AttackPathPreview from '../components/dashboard/AttackPathPreview';
import NetworkTopology from '../components/dashboard/NetworkTopology';
import RecentTimeline from '../components/dashboard/RecentTimeline';
import SensorHealth from '../components/dashboard/SensorHealth';

interface DashboardProps {
  filters: FilterState;
}

const Dashboard: React.FC<DashboardProps> = ({ filters }) => {
  return (
    <div className="px-6 py-5 space-y-8 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Security Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Operational security posture across monitored environments
          {filters.siteId && <span className="text-brand font-medium"> · {filters.siteId.replace('site-', 'Plant 0').replace('p', '')}</span>}
        </p>
      </div>

      {/* Level 1 — Posture + Urgent */}
      <PostureSummary posture={securityPosture} />

      {/* Level 1b — Priority Attention */}
      <PriorityAttention />

      {/* Level 2 — Risk & Findings */}
      <section aria-label="Risk and findings">
        <RiskFindings />
      </section>

      {/* Level 2b — Attack Path Preview */}
      <section aria-label="Attack path preview">
        <AttackPathPreview />
      </section>

      {/* Level 3 — Asset Visibility + Network */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section aria-label="Asset visibility">
          <AssetVisibility />
        </section>
        <section aria-label="Network topology">
          <NetworkTopology />
        </section>
      </div>

      {/* Level 4 — Timeline + Sensor Health */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section aria-label="Recent changes timeline">
          <RecentTimeline />
        </section>
        <section aria-label="Sensor and platform health">
          <SensorHealth />
        </section>
      </div>

      {/* Bottom padding */}
      <div className="h-8" />
    </div>
  );
};

export default Dashboard;
