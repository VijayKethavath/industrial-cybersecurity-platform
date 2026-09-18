import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionHeader, Card, Badge } from '../ui';
import { assetSummary } from '../../data/assets';
import { HelpCircle, Cpu, AlertTriangle, WifiOff } from 'lucide-react';

const DEVICE_TYPE_COLORS = [
  '#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6',
];

const deviceTypeData = Object.entries(assetSummary.byType)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 7)
  .map(([name, value]) => ({ name, value }));

const protocolData = Object.entries(assetSummary.byProtocol)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([name, value]) => ({ name, value }));

const AssetVisibility: React.FC = () => {
  const total = assetSummary.total;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Stats */}
      <Card padding="md">
        <SectionHeader title="Asset Inventory" />
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Total', value: total.toLocaleString(), sub: 'Monitored', color: 'text-gray-900' },
            { label: 'Active', value: assetSummary.active.toLocaleString(), sub: 'Online & reporting', color: 'text-green-700' },
            { label: 'Offline', value: assetSummary.offline, icon: <WifiOff className="w-3.5 h-3.5 text-red-400" />, sub: 'Not seen recently', color: 'text-red-700' },
            { label: 'New', value: assetSummary.newLast24h, sub: 'Last 24 hours', color: 'text-brand-700' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span className="text-2xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</span>
              <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-2xs text-gray-400">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Attention flags */}
        <div className="space-y-1.5 border-t border-surface-divider pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-yellow-700">
              <HelpCircle className="w-3.5 h-3.5 text-yellow-500" aria-hidden="true" />
              <span>Unidentified assets</span>
            </div>
            <Badge variant="warning">{assetSummary.unidentified}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <AlertTriangle className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
              <span>Incomplete profiles</span>
            </div>
            <Badge variant="default">{assetSummary.incomplete}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-red-700">
              <Cpu className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
              <span>Exposed critical assets</span>
            </div>
            <Badge variant="danger">{assetSummary.exposedCritical}</Badge>
          </div>
        </div>
      </Card>

      {/* Device Type Pie */}
      <Card padding="md">
        <SectionHeader title="Device Types" />
        <div role="img" aria-label="Pie chart of device types. Largest: Network Device 312, Sensor 198, PLC 187">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={deviceTypeData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                aria-label="Device type distribution"
              >
                {deviceTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={DEVICE_TYPE_COLORS[index % DEVICE_TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E2E8F0' }}
                formatter={(v: number) => [`${v} (${((v / total) * 100).toFixed(1)}%)`, 'Assets']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1 mt-1">
          {deviceTypeData.slice(0, 5).map((d, i) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: DEVICE_TYPE_COLORS[i] }}
                  aria-hidden="true"
                />
                <span className="text-xs text-gray-600 truncate">{d.name}</span>
              </div>
              <span className="text-xs font-medium text-gray-700">{d.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Protocol Distribution */}
      <Card padding="md">
        <SectionHeader title="Protocols" subtitle="Top observed protocols" />
        <div className="space-y-2">
          {protocolData.map((p, i) => {
            const pct = Math.round((p.value / Math.max(...protocolData.map(d => d.value))) * 100);
            return (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-gray-700 font-mono">{p.name}</span>
                  <span className="text-xs text-gray-500">{p.value}</span>
                </div>
                <div
                  className="h-1.5 rounded-full bg-gray-100 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={p.value}
                  aria-valuemax={protocolData[0].value}
                  aria-label={`${p.name}: ${p.value} assets`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: DEVICE_TYPE_COLORS[i % DEVICE_TYPE_COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AssetVisibility;
