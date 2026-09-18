import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts';
import { SectionHeader, Card, SeverityBadge } from '../ui';
import { findingSummary, findings } from '../../data/findings';

const SEVERITY_COLORS = {
  critical: '#DC2626',
  high:     '#F97316',
  medium:   '#EAB308',
  low:      '#3B82F6',
};

const SEVERITY_BAR_DATA = [
  { name: 'Critical', count: findingSummary.bySeverity.critical, color: SEVERITY_COLORS.critical, key: 'critical' },
  { name: 'High',     count: findingSummary.bySeverity.high,     color: SEVERITY_COLORS.high,     key: 'high' },
  { name: 'Medium',   count: findingSummary.bySeverity.medium,   color: SEVERITY_COLORS.medium,   key: 'medium' },
  { name: 'Low',      count: findingSummary.bySeverity.low,      color: SEVERITY_COLORS.low,      key: 'low' },
];

const CustomBarLabel: React.FC<any> = ({ x, y, width, value }) => (
  <text x={x + width + 4} y={y + 10} fill="#6B7280" fontSize={11} fontWeight={600}>{value}</text>
);

const RiskFindings: React.FC = () => {
  const recentCritical = findings
    .filter(f => f.severity === 'critical' && f.status === 'open')
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Severity Distribution */}
      <Card className="col-span-1 lg:col-span-2" padding="md">
        <SectionHeader title="Severity Distribution" subtitle={`${findingSummary.open} open findings`} />
        <div role="img" aria-label="Bar chart: Critical 12, High 25, Medium 33, Low 14 findings">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={SEVERITY_BAR_DATA}
              layout="vertical"
              margin={{ top: 0, right: 32, bottom: 0, left: -12 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }} width={48} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value: number, name: string) => [value, 'Open findings']}
                labelFormatter={label => `Severity: ${label}`}
              />
              <Bar dataKey="count" radius={[0, 3, 3, 0]} label={<CustomBarLabel />}>
                {SEVERITY_BAR_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Accessible table fallback */}
        <table className="sr-only" aria-label="Finding severity counts">
          <thead><tr><th>Severity</th><th>Count</th></tr></thead>
          <tbody>
            {SEVERITY_BAR_DATA.map(d => <tr key={d.key}><td>{d.name}</td><td>{d.count}</td></tr>)}
          </tbody>
        </table>
      </Card>

      {/* Trend */}
      <Card className="col-span-1 lg:col-span-3" padding="md">
        <SectionHeader title="Finding Trend" subtitle="Last 8 days — open findings by severity" />
        <div role="img" aria-label="Line chart showing finding counts over 8 days. Critical and high counts are trending upward.">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={findingSummary.trend} margin={{ top: 4, right: 10, bottom: 0, left: -22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={d => d.slice(5)}
              />
              <YAxis tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E2E8F0' }}
                formatter={(value: number, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
              <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2} dot={false} name="Critical" />
              <Line type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} dot={false} name="High" />
              <Line type="monotone" dataKey="medium" stroke="#EAB308" strokeWidth={1.5} dot={false} name="Medium" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="low" stroke="#3B82F6" strokeWidth={1.5} dot={false} name="Low" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Critical Findings List */}
      <Card className="col-span-1 lg:col-span-5" padding="md">
        <SectionHeader title="Recent Critical Findings" subtitle="Unresolved — requires immediate action" />
        <div className="space-y-2">
          {recentCritical.map(f => (
            <div
              key={f.id}
              className="p-3 rounded-lg border border-red-100 bg-red-50/40 hover:bg-red-50/70 transition-colors cursor-pointer"
              role="article"
              aria-label={`Finding: ${f.title}`}
              tabIndex={0}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0">
                    <SeverityBadge severity={f.severity} size="xs" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{f.title}</span>
                </div>
                <div className="flex items-center gap-2 text-2xs text-gray-400 flex-shrink-0">
                  <span>{f.assetName} · {f.zoneName}</span>
                  <span aria-hidden="true">·</span>
                  <time>{new Date(f.detectedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</time>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 sm:line-clamp-1">{f.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RiskFindings;
