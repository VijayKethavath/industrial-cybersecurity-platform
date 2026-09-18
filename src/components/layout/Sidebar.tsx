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
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-200 ease-in-out flex-shrink-0',
        collapsed ? 'w-14' : 'w-56',
      )}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className={clsx('flex items-center border-b border-sidebar-border flex-shrink-0', collapsed ? 'h-14 justify-center px-0' : 'h-14 px-4 gap-2.5')}>
        <div className="w-7 h-7 bg-brand rounded flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white leading-none">CyberShield</div>
            <div className="text-2xs text-sidebar-text leading-none mt-0.5 font-medium tracking-wider uppercase">OT Platform</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto" role="navigation" aria-label="Site navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex items-center gap-3 mx-2 my-0.5 rounded text-sm transition-all duration-100',
                collapsed ? 'h-9 w-9 justify-center mx-auto' : 'px-3 py-2',
                isActive
                  ? 'bg-brand/10 text-brand border-l-2 border-brand ml-2 pl-2.5'
                  : 'text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover',
              )}
            >
              <Icon className={clsx('flex-shrink-0', collapsed ? 'w-4.5 h-4.5' : 'w-4 h-4')} aria-hidden="true" />
              {!collapsed && <span className="font-medium truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: Settings + Collapse */}
      <div className="border-t border-sidebar-border py-2">
        <NavLink
          to="/settings"
          aria-label="Settings"
          className={clsx(
            'flex items-center gap-3 mx-2 rounded text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-all duration-100',
            collapsed ? 'h-9 w-9 justify-center mx-auto' : 'px-3 py-2',
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </NavLink>

        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={clsx(
            'flex items-center gap-3 mx-2 rounded text-sm text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover transition-all duration-100 mt-1',
            collapsed ? 'h-9 w-9 justify-center mx-auto' : 'px-3 py-2',
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
