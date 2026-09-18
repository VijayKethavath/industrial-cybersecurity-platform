import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, GitBranch, Filter } from 'lucide-react';
import { Button } from '../components/ui';
import AttackGraph from '../components/attack-path/AttackGraph';
import type { FilterState } from '../types';

interface AttackPathProps {
  filters: FilterState;
}

const AttackPath: React.FC<AttackPathProps> = ({ filters }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border bg-white flex-shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          aria-label="Back to Security Overview dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Overview
        </button>

        <div className="h-4 w-px bg-gray-200" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-brand" aria-hidden="true" />
          <h1 className="text-sm font-bold text-gray-900">Attack Path Analysis</h1>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative w-52">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search assets or paths…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search attack paths"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
          />
        </div>

        <Button variant="outline" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>
          Filters
        </Button>
      </div>

      {/* Graph takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <AttackGraph />
      </div>
    </div>
  );
};

export default AttackPath;
