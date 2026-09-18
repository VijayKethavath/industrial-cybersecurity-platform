import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Shield,
  LayoutDashboard,
  Cpu,
  AlertTriangle,
  GitBranch,
  Network,
  MapPin,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Overview',     icon: LayoutDashboard },
  { to: '/assets',       label: 'Assets',       icon: Cpu },
  { to: '/findings',     label: 'Findings',     icon: AlertTriangle },
  { to: '/attack-path',  label: 'Attack Paths', icon: GitBranch },
  { to: '/network',      label: 'Network',      icon: Network },
  { to: '/sites',        label: 'Sites',        icon: MapPin },
  { to: '/monitoring',   label: 'Monitoring',   icon: Activity },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, onMobileClose }) => {
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-200 ease-in-out flex-shrink-0',
        // On mobile always show full width; on desktop respect collapsed state
        'w-64 lg:w-auto',
        collapsed ? 'lg:w-14' : 'lg:w-56',
      )}
      aria-label="Primary navigation"
    >
      {/* Logo + mobile close */}
      <div className={clsx(
        'flex items-center border-b border-sidebar-border flex-shrink-0 h-14',
        collapsed ? 'lg:justify-center lg:px-0 px-4 gap-2.5' : 'px-4 gap-2.5',
      )}>
        <div className="w-7 h-7 bg-brand rounded flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {/* Always show text on mobile; hide when collapsed on desktop */}
        <div className={clsx(collapsed && 'lg:hidden')}>
          <div className="text-sm font-bold text-white leading-none">CyberShield</div>
          <div className="text-2xs text-sidebar-text leading-none mt-0.5 font-medium tracking-wider uppercase">OT Platform</div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          aria-label="Close navigation menu"
          className="ml-auto lg:hidden p-1 rounded text-sidebar-text hover:text-white hover:bg-sidebar-hover"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto" role="navigation" aria-label="Site navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onMobileClose} // close drawer on mobile nav
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex items-center gap-3.5 mx-2 my-1 rounded-md text-sm transition-all duration-100 active:scale-[0.98]',
                // On mobile ensure comfortable finger touch target (min 44px)
                'px-3.5 py-3 lg:py-2 lg:my-0.5',
                collapsed && 'lg:h-9 lg:w-9 lg:justify-center lg:mx-auto lg:px-0',
                isActive
                  ? 'bg-brand/15 text-brand border-l-2 border-brand font-semibold'
                  : 'text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover',
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className={clsx('font-medium truncate', collapsed && 'lg:hidden')}>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Settings + Collapse */}
      <div className="border-t border-sidebar-border py-2">
        <NavLink
          to="/settings"
          onClick={onMobileClose}
          aria-label="Settings"
          className={clsx(
            'flex items-center gap-3 mx-2 rounded text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-all duration-100 px-3 py-2.5',
            collapsed && 'lg:h-9 lg:w-9 lg:justify-center lg:mx-auto lg:px-0',
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className={clsx('font-medium', collapsed && 'lg:hidden')}>Settings</span>
        </NavLink>

        {/* Desktop collapse button only */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={clsx(
            'hidden lg:flex items-center gap-3 mx-2 rounded text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-all duration-100 mt-1',
            collapsed ? 'h-9 w-9 justify-center mx-auto px-0' : 'px-3 py-2',
          )}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" aria-hidden="true" />
            : <><ChevronLeft className="w-4 h-4" aria-hidden="true" /><span className="font-medium">Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
