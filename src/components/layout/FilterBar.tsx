import React, { useState } from 'react';
import clsx from 'clsx';
import { Filter, ChevronDown, X } from 'lucide-react';
import type { FilterState } from '../../types';
import { allSites, allZones } from '../../data/sites';

const TIME_RANGES = [
  { value: '1h',  label: 'Last 1 hour' },
  { value: '6h',  label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High' },
  { value: 'medium',   label: 'Medium' },
  { value: 'low',      label: 'Low' },
];

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const FilterSelect: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  nullable?: boolean;
}> = ({ label, value, options, onChange, nullable = true }) => {
  return (
    <div className="relative flex items-center flex-shrink-0">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={label}
        className={clsx(
          'appearance-none pl-2.5 pr-7 py-2 sm:py-1.5 text-xs border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors cursor-pointer min-h-[36px] sm:min-h-0',
          value && value !== 'all' ? 'border-brand text-brand font-medium' : 'border-gray-200 text-gray-600',
        )}
      >
        {nullable && <option value="">{label}: All</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const siteOptions = allSites.map(s => ({ value: s.id, label: s.name }));
  const zoneOptions = allZones
    .filter(z => !filters.siteId || z.siteId === filters.siteId)
    .map(z => ({ value: z.id, label: z.name }));

  const hasActiveFilters = filters.siteId || filters.zoneId || filters.severity || filters.criticality;

  const clearAll = () => {
    onChange({
      ...filters,
      siteId: null,
      zoneId: null,
      severity: null,
      criticality: null,
    });
  };

  return (
    <div
      role="search"
      aria-label="Filter controls"
      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-b border-surface-border flex-shrink-0 overflow-x-auto no-scrollbar touch-scroll"
    >
      <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 hidden sm:block" aria-hidden="true" />
      <span className="text-xs text-gray-400 font-medium flex-shrink-0 hidden sm:block">Filters:</span>

      <FilterSelect
        label="Site"
        value={filters.siteId || ''}
        options={siteOptions}
        onChange={v => onChange({ ...filters, siteId: v || null, zoneId: null })}
      />

      <FilterSelect
        label="Zone"
        value={filters.zoneId || ''}
        options={zoneOptions}
        onChange={v => onChange({ ...filters, zoneId: v || null })}
      />

      <FilterSelect
        label="Severity"
        value={filters.severity || ''}
        options={SEVERITY_OPTIONS}
        onChange={v => onChange({ ...filters, severity: (v as FilterState['severity']) || null })}
      />

      <div className="h-4 w-px bg-gray-200 mx-0.5 sm:mx-1 flex-shrink-0" aria-hidden="true" />

      <FilterSelect
        label="Time"
        value={filters.timeRange}
        options={TIME_RANGES}
        onChange={v => onChange({ ...filters, timeRange: v as FilterState['timeRange'] })}
        nullable={false}
      />

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-brand font-semibold hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-2 py-1.5 bg-brand-50 border border-brand-200 flex-shrink-0"
          aria-label="Clear all filters"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
