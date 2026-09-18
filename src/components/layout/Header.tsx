import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Search, Bell, User, ChevronDown, AlertOctagon } from 'lucide-react';
import { IconButton } from '../ui';

const BREADCRUMBS: Record<string, string[]> = {
  '/dashboard':   ['Overview'],
  '/attack-path': ['Attack Path Analysis'],
  '/assets':      ['Assets'],
  '/findings':    ['Findings'],
  '/network':     ['Network'],
  '/sites':       ['Sites'],
  '/monitoring':  ['Monitoring'],
  '/settings':    ['Settings'],
};

interface HeaderProps {
  onSearchChange?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const crumbs = BREADCRUMBS[location.pathname] || [location.pathname.replace('/', '')];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="h-14 bg-header-bg border-b border-header-border flex items-center px-4 gap-4 flex-shrink-0 z-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-sidebar-text text-xs">CyberShield OT</span>
        <span className="text-sidebar-border">/</span>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-sidebar-border text-xs">/</span>}
            <span
              className={clsx(
                'text-xs font-semibold',
                i === crumbs.length - 1 ? 'text-header-text' : 'text-sidebar-text',
              )}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64 flex-shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search assets, findings…"
          value={search}
          onChange={handleSearch}
          aria-label="Global search"
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-sidebar-hover border border-sidebar-border rounded text-header-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors"
        />
      </div>

      {/* Notifications */}
      <div className="relative flex-shrink-0">
        <IconButton
          label="Notifications — 3 critical alerts"
          onClick={() => setNotifOpen(o => !o)}
          className="relative text-sidebar-text hover:text-white hover:bg-sidebar-hover"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-2xs font-bold flex items-center justify-center"
            aria-label="3 notifications"
          >
            3
          </span>
        </IconButton>

        {notifOpen && (
          <div className="absolute right-0 top-10 w-72 bg-white border border-gray-200 rounded-lg shadow-panel z-50 animate-fade-in">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">Notifications</span>
              <button onClick={() => setNotifOpen(false)} className="text-xs text-gray-500 hover:text-gray-700">Dismiss all</button>
            </div>
            {[
              { icon: <AlertOctagon className="w-3.5 h-3.5 text-red-500" />, text: 'Critical finding on PLC-07', time: '17m ago' },
              { icon: <AlertOctagon className="w-3.5 h-3.5 text-red-500" />, text: 'SMB lateral movement detected', time: '45m ago' },
              { icon: <AlertOctagon className="w-3.5 h-3.5 text-orange-500" />, text: 'Sensor degraded: Plant 02', time: '2h ago' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                <div className="mt-0.5">{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 truncate">{n.text}</p>
                  <p className="text-2xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <button
        className="flex items-center gap-2 text-sidebar-text hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        aria-label="User menu — A. Chen"
        aria-expanded="false"
      >
        <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center">
          <span className="text-xs font-semibold text-brand-400">AC</span>
        </div>
        <span className="text-xs font-medium hidden lg:block">A. Chen</span>
        <ChevronDown className="w-3 h-3 hidden lg:block" aria-hidden="true" />
      </button>
    </header>
  );
};

export default Header;
