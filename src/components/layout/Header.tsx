import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Search, Bell, User, ChevronDown, AlertOctagon, Menu, X } from 'lucide-react';
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
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, onMenuClick }) => {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const crumbs = BREADCRUMBS[location.pathname] || [location.pathname.replace('/', '')];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="h-14 bg-header-bg border-b border-header-border flex items-center px-3 sm:px-4 gap-2 sm:gap-4 flex-shrink-0 z-20 relative">

      {/* ── Hamburger (mobile only) ─────────────────────── */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="lg:hidden p-2 -ml-1 rounded-md text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-95"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Breadcrumb (hidden on small screens) ───── */}
      <div className="hidden sm:flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-sidebar-text text-xs hidden md:block">CyberShield OT</span>
        <span className="text-sidebar-border hidden md:block">/</span>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-sidebar-border text-xs">/</span>}
            <span className={clsx('text-xs font-semibold', i === crumbs.length - 1 ? 'text-header-text' : 'text-sidebar-text')}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Page title on mobile */}
      <div className="sm:hidden flex-1 min-w-0">
        <span className="text-sm font-bold text-white truncate block">{crumbs[crumbs.length - 1]}</span>
      </div>

      {/* ── Search — desktop input ─────── */}
      <div className="relative hidden md:block w-56 lg:w-64 flex-shrink-0">
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

      {/* Mobile search toggle */}
      <button
        className={clsx(
          'md:hidden p-2 rounded-md transition-colors focus:outline-none',
          searchOpen ? 'text-white bg-sidebar-hover' : 'text-sidebar-text hover:text-white hover:bg-sidebar-hover'
        )}
        onClick={() => setSearchOpen(o => !o)}
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Mobile search expanded */}
      {searchOpen && (
        <div className="absolute top-14 left-0 right-0 bg-header-bg border-b border-header-border px-3 py-2.5 md:hidden z-50 shadow-lg flex items-center gap-2 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search assets, findings, paths…"
              value={search}
              onChange={handleSearch}
              autoFocus
              aria-label="Search"
              className="w-full pl-9 pr-3 py-2 text-sm bg-sidebar-hover border border-sidebar-border rounded-md text-header-text placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="p-2 text-sidebar-text hover:text-white rounded-md hover:bg-sidebar-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Notifications ───────────────────────────────── */}
      <div className="relative flex-shrink-0">
        <IconButton
          label="Notifications — 3 critical alerts"
          onClick={() => setNotifOpen(o => !o)}
          className="relative text-sidebar-text hover:text-white hover:bg-sidebar-hover p-2"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span
            className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-2xs font-bold flex items-center justify-center pointer-events-none"
            aria-label="3 notifications"
          >
            3
          </span>
        </IconButton>

        {notifOpen && (
          <>
            {/* Backdrop on mobile */}
            <div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setNotifOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-1.5rem)] bg-white border border-gray-200 rounded-lg shadow-panel z-50 animate-fade-in">
              <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800">Notifications</span>
                <button onClick={() => setNotifOpen(false)} className="text-xs text-brand font-medium hover:text-brand-700">Dismiss all</button>
              </div>
              {[
                { icon: <AlertOctagon className="w-4 h-4 text-red-500" />, text: 'Critical finding on PLC-07', time: '17m ago' },
                { icon: <AlertOctagon className="w-4 h-4 text-red-500" />, text: 'SMB lateral movement detected', time: '45m ago' },
                { icon: <AlertOctagon className="w-4 h-4 text-orange-500" />, text: 'Sensor degraded: Plant 02', time: '2h ago' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3.5 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer">
                  <div className="mt-0.5 flex-shrink-0">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{n.text}</p>
                    <p className="text-2xs text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── User ─────────────────────────────────────────── */}
      <button
        className="flex items-center gap-2 text-sidebar-text hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded flex-shrink-0"
        aria-label="User menu — A. Chen"
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
