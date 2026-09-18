import React from 'react';
import clsx from 'clsx';
import { TrendingDown, TrendingUp, Minus, Shield, AlertOctagon, GitBranch, Eye } from 'lucide-react';
import { SeverityBadge, DataQualityBanner, Card } from '../ui';
import type { SecurityPosture } from '../../types';

interface PostureSummaryProps {
  posture: SecurityPosture;
}

const PostureSummary: React.FC<PostureSummaryProps> = ({ posture }) => {
  const scoreColor =
    posture.score >= 90 ? 'text-green-600' :
    posture.score >= 70 ? 'text-yellow-600' :
    posture.score >= 50 ? 'text-orange-600' :
    'text-red-600';

  const scoreRing =
    posture.score >= 90 ? '#16A34A' :
    posture.score >= 70 ? '#EAB308' :
    posture.score >= 50 ? '#F97316' :
    '#DC2626';

  const strokeDash = 251.2; // circumference for r=40
  const filled = (posture.score / 100) * strokeDash;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">
      {/* Score */}
      <Card className="flex items-center gap-4 sm:gap-5 col-span-1 p-4 sm:p-5" padding="none">
        {/* Ring */}
        <div className="relative flex-shrink-0" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 88 88" className="-rotate-90 sm:w-[88px] sm:h-[88px]">
            <circle cx="44" cy="44" r="38" fill="none" stroke="#E2E8F0" strokeWidth="6" />
            <circle
              cx="44" cy="44" r="38"
              fill="none"
              stroke={scoreRing}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(posture.score / 100) * 238.76} 238.76`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx('text-xl sm:text-2xl font-bold leading-none', scoreColor)}>{posture.score}</span>
            <span className="text-2xs text-gray-400 font-medium">/100</span>
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
            <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider">Security Posture</span>
          </div>
          <h2 className={clsx('text-base sm:text-lg font-bold', scoreColor)} aria-label={`Security posture: ${posture.score} out of 100 — ${posture.label}`}>
            {posture.label}
          </h2>
          <div className="flex items-center gap-1 mt-0.5 sm:mt-1 flex-wrap">
            {posture.trend === 'degrading' ? (
              <TrendingDown className="w-3.5 h-3.5 text-red-500 flex-shrink-0" aria-hidden="true" />
            ) : posture.trend === 'improving' ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            )}
            <span className={clsx(
              'text-xs font-semibold',
              posture.trend === 'degrading' ? 'text-red-600' :
              posture.trend === 'improving' ? 'text-green-600' : 'text-gray-500',
            )}>
              {posture.trend === 'degrading' ? `${posture.trendValue} pts` :
               posture.trend === 'improving' ? `+${Math.abs(posture.trendValue)} pts` : 'Stable'}
            </span>
            <span className="text-gray-400 text-2xs font-normal">vs 7d</span>
          </div>
          <p className="text-2xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
            Composite score of asset risk, findings, exposure, and data fidelity.
          </p>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {[
          {
            label: 'Total Assets',
            value: posture.totalAssets.toLocaleString(),
            sub: `${posture.activeAssets.toLocaleString()} active`,
            icon: <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
            color: 'text-gray-700',
            iconColor: 'text-gray-400',
          },
          {
            label: 'Critical Assets',
            value: posture.criticalAssets,
            sub: 'Across all sites',
            icon: <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
            color: 'text-gray-900',
            iconColor: 'text-gray-400',
          },
          {
            label: 'Exposed Critical',
            value: posture.exposedCriticalAssets,
            sub: 'Require action',
            icon: <AlertOctagon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
            color: 'text-red-700',
            iconColor: 'text-red-400',
            bgAccent: 'bg-red-50/70 border-red-100',
          },
          {
            label: 'Open Findings',
            value: posture.openFindings,
            sub: '12 crit, 25 high',
            icon: <AlertOctagon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
            color: 'text-orange-700',
            iconColor: 'text-orange-400',
            bgAccent: 'bg-orange-50/70 border-orange-100',
          },
          {
            label: 'High-Risk Paths',
            value: posture.highRiskPaths,
            sub: '3 critical severity',
            icon: <GitBranch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
            color: 'text-red-700',
            iconColor: 'text-red-400',
            bgAccent: 'bg-red-50/70 border-red-100',
          },
          {
            label: 'Monitoring',
            value: '96%',
            sub: '1 degraded',
            icon: <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
            color: 'text-yellow-700',
            iconColor: 'text-yellow-500',
            bgAccent: 'bg-yellow-50/70 border-yellow-100',
          },
        ].map((kpi, i) => (
          <div
            key={i}
            className={clsx(
              'rounded-lg border p-2.5 sm:p-3 flex flex-col gap-0.5 sm:gap-1 bg-white shadow-card',
              kpi.bgAccent || 'border-surface-border',
            )}
          >
            <div className={clsx('flex items-center gap-1.5', kpi.iconColor)}>
              {kpi.icon}
              <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider truncate">{kpi.label}</span>
            </div>
            <div className={clsx('text-xl sm:text-2xl font-bold', kpi.color)}>{kpi.value}</div>
            <div className="text-2xs text-gray-400 truncate">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Data quality banner */}
      {posture.dataQuality !== 'complete' && (
        <div className="col-span-1 lg:col-span-3">
          <DataQualityBanner
            quality={posture.dataQuality}
            detail="Plant 02 — Control zone sensor is degraded. Some asset risk scores and relationships may be incomplete."
          />
        </div>
      )}
    </div>
  );
};

export default PostureSummary;
