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
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={label}
        className={clsx(
          'appearance-none pl-2.5 pr-7 py-1.5 text-xs border rounded bg-white focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors cursor-pointer',
          value && value !== 'all' ? 'border-brand text-brand font-medium' : 'border-gray-200 text-gray-600',
        )}
      >
        {nullable && <option value="">{label}: All</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" aria-hidden="true" />
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
      className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-surface-border flex-shrink-0 overflow-x-auto"
    >
      <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
      <span className="text-xs text-gray-400 font-medium flex-shrink-0">Filters:</span>

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

      <div className="h-4 w-px bg-gray-200 mx-1 flex-shrink-0" aria-hidden="true" />

      <FilterSelect
        label="Time Range"
        value={filters.timeRange}
        options={TIME_RANGES}
        onChange={v => onChange({ ...filters, timeRange: v as FilterState['timeRange'] })}
        nullable={false}
      />

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-2xs text-brand font-medium hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
          aria-label="Clear all filters"
        >
          <X className="w-3 h-3" aria-hidden="true" />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;
