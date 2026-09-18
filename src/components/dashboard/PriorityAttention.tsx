import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, GitBranch, Eye, ChevronRight } from 'lucide-react';
import { SeverityBadge, Card, SectionHeader } from '../ui';

interface PriorityItem {
  icon: React.ReactNode;
  label: string;
  count: number;
  severity: 'critical' | 'high';
  description: string;
  action: string;
  route?: string;
}

const PRIORITY_ITEMS: PriorityItem[] = [
  {
    icon: <AlertOctagon className="w-5 h-5" aria-hidden="true" />,
    label: 'Critical Findings',
    count: 12,
    severity: 'critical',
    description: 'Active, unresolved critical-severity security findings requiring immediate investigation.',
    action: 'View Findings',
    route: '/findings',
  },
  {
    icon: <GitBranch className="w-5 h-5" aria-hidden="true" />,
    label: 'High-Risk Attack Paths',
    count: 8,
    severity: 'critical',
    description: 'Exploitable attack paths reaching critical OT assets. 3 are cross-zone with high confidence.',
    action: 'Investigate Paths',
    route: '/attack-path',
  },
  {
    icon: <Eye className="w-5 h-5" aria-hidden="true" />,
    label: 'Exposed Critical Assets',
    count: 12,
    severity: 'high',
    description: 'Critical-tier assets with direct external exposure or cross-zone accessibility.',
    action: 'Review Assets',
    route: '/assets',
  },
];

const PriorityAttention: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <SectionHeader
        title="Priority Attention"
        subtitle="Items requiring immediate analyst review"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRIORITY_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => item.route && navigate(item.route)}
            aria-label={`${item.count} ${item.label} — ${item.description}`}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-lg"
          >
            <div className="bg-white border border-surface-border rounded-lg p-4 shadow-card transition-all duration-150 group-hover:shadow-panel group-hover:border-gray-300 h-full">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-md ${item.severity === 'critical' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                  {item.icon}
                </div>
                <SeverityBadge severity={item.severity} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{item.count}</div>
              <div className="text-sm font-semibold text-gray-800 mb-2">{item.label}</div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-brand group-hover:gap-2 transition-all">
                {item.action}
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityAttention;
