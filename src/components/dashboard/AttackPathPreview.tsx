import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, ArrowRight, ChevronRight, AlertOctagon } from 'lucide-react';
import { SeverityBadge, ConfidenceIndicator, Card, Badge, SectionHeader, DataQualityBanner } from '../ui';
import { attackPaths } from '../../data/attackPaths';

const AttackPathPreview: React.FC = () => {
  const navigate = useNavigate();
  const path = attackPaths[0]; // Primary featured path

  const nodes = path.nodes.filter(n =>
    ['n-internet', 'n-vendor-vpn', 'n-jump', 'n-eng-wks', 'n-plc07', 'n-scada'].includes(n.id)
  );

  return (
    <div>
      <SectionHeader
        title="Featured Attack Path"
        subtitle="Highest-severity active path requiring investigation"
        action={
          <button
            onClick={() => navigate('/attack-path')}
            className="text-xs text-brand font-semibold hover:text-brand-700 flex items-center gap-1"
            aria-label="View all attack paths"
          >
            View All <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        }
      />
      <Card padding="none" className="overflow-hidden">
        {/* Header strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-red-50 border-b border-red-100 px-3.5 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <AlertOctagon className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-red-900 truncate">{path.name}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <SeverityBadge severity={path.severity} size="xs" />
            <ConfidenceIndicator confidence={path.confidence} />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Path visualization */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider">Attack Chain</span>
              <span className="text-2xs text-brand font-medium sm:hidden">Swipe chain →</span>
            </div>
            <div
              className="flex items-stretch gap-0 overflow-x-auto pb-2 touch-scroll no-scrollbar sm:scrollbar-thin"
              role="img"
              aria-label={`Attack path: ${nodes.map(n => n.name).join(' → ')}`}
            >
              {nodes.map((node, i) => {
                const isTarget = node.role === 'crown_jewel';
                const isSource = node.role === 'source';
                const edge = i < nodes.length - 1 ? path.edges[i] : null;

                return (
                  <React.Fragment key={node.id}>
                    {/* Node card */}
                    <div
                      className={`flex-shrink-0 w-28 sm:w-32 rounded-lg border p-2 sm:p-2.5 ${
                        isTarget ? 'border-red-300 bg-red-50' :
                        isSource ? 'border-gray-200 bg-gray-50' :
                        'border-orange-200 bg-orange-50/50'
                      }`}
                    >
                      <div className="text-2xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5 sm:mb-1 truncate">{node.zoneName}</div>
                      <div className="text-xs font-bold text-gray-900 truncate">{node.name}</div>
                      <div className="text-2xs text-gray-500 truncate">{node.type}</div>
                      {isTarget && (
                        <div className="mt-1">
                          <Badge variant="danger" size="xs">Crown Jewel</Badge>
                        </div>
                      )}
                      {node.role === 'pivot' && (
                        <div className="mt-1">
                          <Badge variant="warning" size="xs">Pivot</Badge>
                        </div>
                      )}
                    </div>

                    {/* Edge */}
                    {edge && (
                      <div className="flex flex-col items-center justify-center mx-1 flex-shrink-0 min-w-[50px] sm:min-w-[60px]">
                        <div className={`text-2xs font-mono font-semibold truncate max-w-[50px] sm:max-w-[56px] text-center ${edge.isSuspicious ? 'text-red-600' : 'text-gray-400'}`}>
                          {edge.protocol}
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <div className={`h-0.5 w-6 sm:w-8 ${edge.isSuspicious ? 'bg-red-400' : 'bg-gray-300'}`} aria-hidden="true" />
                          <ArrowRight className={`w-3 h-3 flex-shrink-0 ${edge.isSuspicious ? 'text-red-400' : 'text-gray-300'}`} aria-hidden="true" />
                        </div>
                        {edge.isSuspicious && (
                          <span className="text-2xs text-red-500 font-medium mt-0.5">Suspicious</span>
                        )}
                        {edge.isCrossZone && !edge.isSuspicious && (
                          <span className="text-2xs text-orange-500 font-medium mt-0.5">Cross-zone</span>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {path.dataQuality !== 'complete' && (
              <DataQualityBanner
                quality={path.dataQuality}
                detail="Some edges in this path have reduced confidence due to sensor degradation in Plant 02."
                className="mt-3"
              />
            )}
          </div>

          {/* Path metadata */}
          <div className="col-span-1 border-t lg:border-t-0 lg:border-l border-surface-border pt-4 lg:pt-0 pl-0 lg:pl-6 flex flex-col gap-3">
            <div>
              <div className="text-2xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Path Summary</div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'Path Risk', value: <SeverityBadge severity={path.severity} size="xs" /> },
                  { label: 'Confidence', value: <ConfidenceIndicator confidence={path.confidence} /> },
                  { label: 'Hops', value: <span className="text-sm font-bold text-gray-900">{path.hops}</span> },
                  { label: 'Cross-zone', value: <span className={`text-xs font-semibold ${path.isCrossZone ? 'text-red-600' : 'text-green-600'}`}>{path.isCrossZone ? 'Yes' : 'No'}</span> },
                  { label: 'Target', value: <span className="text-xs font-mono font-bold text-red-700">SCADA-CORE-01</span> },
                  { label: 'Reachable', value: <span className="text-sm font-bold text-gray-900">{path.reachableAssets} assets</span> },
                ].map(item => (
                  <React.Fragment key={item.label}>
                    <dt className="text-2xs text-gray-400 font-medium">{item.label}</dt>
                    <dd>{item.value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
            <div className="mt-auto pt-2">
              <button
                onClick={() => navigate('/attack-path')}
                className="w-full flex items-center justify-center gap-2 bg-brand text-white text-sm font-semibold min-h-[44px] py-2.5 px-4 rounded-lg hover:bg-brand-600 active:bg-brand-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 shadow-sm active:scale-[0.99]"
                aria-label="Investigate this attack path in the investigation workspace"
              >
                <GitBranch className="w-4 h-4" aria-hidden="true" />
                Investigate Attack Path
              </button>
              <p className="text-2xs text-gray-400 text-center mt-1.5">Opens the investigation workspace</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttackPathPreview;
