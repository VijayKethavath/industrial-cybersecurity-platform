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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-bg">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onSearchChange={s => setFilters(f => ({ ...f, search: s }))} />
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
