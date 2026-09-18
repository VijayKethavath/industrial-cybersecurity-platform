import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, GitBranch, Filter, X } from 'lucide-react';
import { Button } from '../components/ui';
import AttackGraph from '../components/attack-path/AttackGraph';
import type { FilterState } from '../types';

interface AttackPathProps {
  filters: FilterState;
}

const AttackPath: React.FC<AttackPathProps> = ({ filters }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-surface-border bg-white flex-shrink-0 relative">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded py-1 px-1.5 -ml-1"
          aria-label="Back to Security Overview dashboard"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Back to Overview</span>
        </button>

        <div className="h-4 w-px bg-gray-200 hidden sm:block" aria-hidden="true" />

        <div className="flex items-center gap-1.5 min-w-0 flex-1 sm:flex-initial">
          <GitBranch className="w-4 h-4 text-brand flex-shrink-0" aria-hidden="true" />
          <h1 className="text-xs sm:text-sm font-bold text-gray-900 truncate">Attack Path Analysis</h1>
        </div>

        <div className="hidden sm:block flex-1" />

        {/* Desktop Search */}
        <div className="relative hidden md:block w-48 lg:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search assets or paths…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search attack paths"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen(o => !o)}
          className="md:hidden p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100"
          aria-label="Toggle search"
        >
          <Search className="w-4 h-4" />
        </button>

        <Button variant="outline" size="xs" className="sm:hidden" icon={<Filter className="w-3.5 h-3.5" />}>
          Filter
        </Button>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" icon={<Filter className="w-3.5 h-3.5" />}>
          Filters
        </Button>
      </div>

      {/* Mobile Search Input Row */}
      {mobileSearchOpen && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-surface-border md:hidden animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search assets, paths…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Graph takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <AttackGraph />
      </div>
    </div>
  );
};

export default AttackPath;
