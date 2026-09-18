import React from 'react';
import clsx from 'clsx';
import {
  AlertOctagon, Cpu, TrendingUp, WifiOff, GitBranch,
  AlertTriangle, Activity, User, HelpCircle,
} from 'lucide-react';
import { SectionHeader, SeverityBadge, Card } from '../ui';
import { timelineEvents } from '../../data/timeline';
import { formatTimestamp } from '../../utils/designSystem';
import type { TimelineEventType, Severity } from '../../types';

const EVENT_ICONS: Record<TimelineEventType, React.ReactNode> = {
  finding_elevated:     <AlertOctagon className="w-3.5 h-3.5" />,
  finding_new:          <AlertTriangle className="w-3.5 h-3.5" />,
  finding_resolved:     <Activity className="w-3.5 h-3.5" />,
  asset_discovered:     <Cpu className="w-3.5 h-3.5" />,
  asset_offline:        <WifiOff className="w-3.5 h-3.5" />,
  communication_changed:<GitBranch className="w-3.5 h-3.5" />,
  risk_increased:       <TrendingUp className="w-3.5 h-3.5" />,
  sensor_degraded:      <Activity className="w-3.5 h-3.5" />,
  sensor_restored:      <Activity className="w-3.5 h-3.5" />,
  operator_action:      <User className="w-3.5 h-3.5" />,
};

const EVENT_COLORS: Partial<Record<Severity, string>> = {
  critical: 'text-red-500 bg-red-50 border-red-100',
  high:     'text-orange-500 bg-orange-50 border-orange-100',
  medium:   'text-yellow-600 bg-yellow-50 border-yellow-100',
  low:      'text-blue-500 bg-blue-50 border-blue-100',
  info:     'text-gray-400 bg-gray-50 border-gray-100',
};

const RecentTimeline: React.FC = () => {
  const events = timelineEvents.slice(0, 7);

  return (
    <div>
      <SectionHeader
        title="Recent Changes"
        subtitle="Security-relevant events in the last 24 hours"
        action={
          <button className="text-xs text-brand font-semibold hover:text-brand-700">
            Full Timeline
          </button>
        }
      />
      <Card padding="none">
        <ol className="divide-y divide-surface-divider" aria-label="Recent security timeline events">
          {events.map((event, i) => {
            const colorClass = event.severity ? (EVENT_COLORS[event.severity] || EVENT_COLORS.info) : EVENT_COLORS.info;
            return (
              <li
                key={event.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface-divider/50 transition-colors cursor-pointer focus-within:ring-inset focus-within:ring-1 focus-within:ring-brand"
                tabIndex={0}
                role="button"
                aria-label={`${event.title} — ${event.assetName || event.siteName || ''} — ${formatTimestamp(event.timestamp)}`}
              >
                {/* Icon */}
                <div className={clsx('flex-shrink-0 mt-0.5 w-6 h-6 rounded border flex items-center justify-center', colorClass)}>
                  {EVENT_ICONS[event.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{event.title}</span>
                    {event.severity && event.severity !== 'info' && (
                      <SeverityBadge severity={event.severity} size="xs" />
                    )}
                  </div>
                  {event.assetName && (
                    <div className="text-xs text-gray-500 mt-0.5 font-mono">{event.assetName}{event.siteName && ` · ${event.siteName}`}</div>
                  )}
                  {!event.assetName && event.siteName && (
                    <div className="text-xs text-gray-500 mt-0.5">{event.siteName}</div>
                  )}
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{event.description}</p>
                </div>

                {/* Timestamp */}
                <time
                  dateTime={event.timestamp}
                  className="flex-shrink-0 text-xs text-gray-400 font-mono tabular-nums"
                >
                  {formatTimestamp(event.timestamp)}
                </time>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
};

export default RecentTimeline;
