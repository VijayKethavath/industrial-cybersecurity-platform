import React from 'react';
import clsx from 'clsx';
import { SectionHeader, Card } from '../ui';
import { Network } from 'lucide-react';

const ZONES = [
  { id: 'corporate', label: 'Corporate', color: '#6366F1', assets: 316, x: 10,  y: 15,  w: 18, h: 28 },
  { id: 'dmz',       label: 'DMZ',       color: '#F59E0B', assets: 42,  x: 33,  y: 22,  w: 14, h: 20 },
  { id: 'ops',       label: 'Operations',color: '#10B981', assets: 469, x: 52,  y: 10,  w: 22, h: 35 },
  { id: 'control',   label: 'Control',   color: '#F97316', assets: 429, x: 52,  y: 50,  w: 22, h: 35 },
  { id: 'safety',    label: 'Safety',    color: '#DC2626', assets: 28,  x: 78,  y: 33,  w: 14, h: 20 },
];

const CONNECTIONS = [
  { from: 'corporate', to: 'dmz',     label: 'Internet/VPN', suspicious: true },
  { from: 'dmz',       to: 'ops',     label: 'Jump/RDP',     suspicious: true },
  { from: 'corporate', to: 'ops',     label: 'Cross-zone',   suspicious: true },
  { from: 'ops',       to: 'control', label: 'OPC UA',       suspicious: false },
  { from: 'control',   to: 'safety',  label: 'Safety',       suspicious: false },
];

// Simple SVG-based topology — avoids React Flow complexity at dashboard level
const NetworkTopology: React.FC = () => {
  const getCenterPercent = (zone: typeof ZONES[0]) => ({
    cx: zone.x + zone.w / 2,
    cy: zone.y + zone.h / 2,
  });

  return (
    <div>
      <SectionHeader
        title="Network Topology"
        subtitle="Zone segments and key communication relationships"
        action={
          <button className="text-xs text-brand font-semibold hover:text-brand-700">
            View Network
          </button>
        }
      />
      <Card padding="md">
        <div
          className="relative w-full overflow-hidden rounded"
          style={{ paddingBottom: '42%', minHeight: 200 }}
          role="img"
          aria-label="Network topology diagram showing 5 zones: Corporate, DMZ, Operations, Control, and Safety. Suspicious cross-zone connections are highlighted."
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 58"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Connection lines */}
            {CONNECTIONS.map((conn, i) => {
              const fromZone = ZONES.find(z => z.id === conn.from)!;
              const toZone   = ZONES.find(z => z.id === conn.to)!;
              const f = getCenterPercent(fromZone);
              const t = getCenterPercent(toZone);
              return (
                <g key={i} aria-label={`Connection: ${conn.from} to ${conn.to} — ${conn.label}`}>
                  <line
                    x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                    stroke={conn.suspicious ? '#DC2626' : '#CBD5E1'}
                    strokeWidth={conn.suspicious ? 0.5 : 0.3}
                    strokeDasharray={conn.suspicious ? '1.5 1' : undefined}
                    opacity={0.85}
                  />
                </g>
              );
            })}

            {/* Zone rectangles */}
            {ZONES.map(zone => (
              <g key={zone.id}>
                <rect
                  x={zone.x} y={zone.y}
                  width={zone.w} height={zone.h}
                  rx={1.5}
                  fill={zone.color}
                  fillOpacity={0.08}
                  stroke={zone.color}
                  strokeWidth={0.6}
                  strokeOpacity={0.6}
                />
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + 5}
                  textAnchor="middle"
                  fontSize={2.8}
                  fontWeight={700}
                  fill={zone.color}
                  fillOpacity={0.9}
                >
                  {zone.label}
                </text>
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + 9}
                  textAnchor="middle"
                  fontSize={2.2}
                  fill="#6B7280"
                >
                  {zone.assets} assets
                </text>
                {/* Dots representing assets */}
                {Array.from({ length: Math.min(zone.assets > 100 ? 12 : zone.assets > 50 ? 8 : 5, 14) }).map((_, di) => (
                  <circle
                    key={di}
                    cx={zone.x + 2 + (di % 5) * 3.2}
                    cy={zone.y + 14 + Math.floor(di / 5) * 3.2}
                    r={1.2}
                    fill={zone.color}
                    fillOpacity={0.35}
                    aria-hidden="true"
                  />
                ))}
              </g>
            ))}

            {/* Legend */}
            <g transform="translate(2, 52)">
              <line x1={0} y1={2} x2={4} y2={2} stroke="#DC2626" strokeWidth={0.5} strokeDasharray="1.5 1" />
              <text x={5} y={3} fontSize={1.8} fill="#6B7280">Suspicious / cross-zone</text>
              <line x1={28} y1={2} x2={32} y2={2} stroke="#CBD5E1" strokeWidth={0.3} />
              <text x={33} y={3} fontSize={1.8} fill="#6B7280">Normal communication</text>
            </g>
          </svg>
        </div>

        {/* Zone summary */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-divider">
          {ZONES.map(z => (
            <div key={z.id} className="flex items-center gap-1.5 text-2xs text-gray-600">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: z.color, opacity: 0.8 }} aria-hidden="true" />
              <span className="font-medium">{z.label}</span>
              <span className="text-gray-400">{z.assets}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NetworkTopology;
