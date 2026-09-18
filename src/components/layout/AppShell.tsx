import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import FilterBar from './FilterBar';
import type { FilterState } from '../../types';

const DEFAULT_FILTERS: FilterState = {
  siteId: null,
  zoneId: null,
  timeRange: '24h',
  severity: null,
  criticality: null,
  search: '',
};

interface AppShellProps {
  children: (filters: FilterState) => React.ReactNode;
  showFilterBar?: boolean;
}

const AppShell: React.FC<AppShellProps> = ({ children, showFilterBar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-bg">

      {/* ── Mobile overlay backdrop ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      {/* On mobile: fixed drawer controlled by sidebarOpen     */}
      {/* On desktop: always visible, collapsible               */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          onMobileClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onSearchChange={s => setFilters(f => ({ ...f, search: s }))}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />
        {showFilterBar && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-auto"
          aria-label="Main content"
        >
          {children(filters)}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
