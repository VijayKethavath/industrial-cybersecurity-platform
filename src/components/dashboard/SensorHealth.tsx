import React from 'react';
import clsx from 'clsx';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SectionHeader, Card, Badge, DataQualityBanner } from '../ui';
import { sensors, sensorHealth } from '../../data/sensors';
import { formatRelativeTime } from '../../utils/designSystem';

const SensorHealth: React.FC = () => {
  const degraded = sensors.filter(s => s.status === 'degraded');

  return (
    <div>
      <SectionHeader
        title="Platform & Sensor Health"
        subtitle="Monitoring infrastructure status — affects data completeness"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary card */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Sensor Health</span>
          </div>

          {/* Health ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-shrink-0" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke={sensorHealth.degraded > 0 ? '#EAB308' : '#16A34A'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(sensorHealth.healthy / sensorHealth.total) * 175.9} 175.9`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{sensorHealth.healthy}</span>
                <span className="text-2xs text-gray-400">/{sensorHealth.total}</span>
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold ${sensorHealth.degraded > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                {sensorHealth.degraded > 0 ? `${sensorHealth.degraded} Degraded` : 'All Healthy'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Sensors operational</div>
            </div>
          </div>

          <dl className="space-y-2">
            {[
              {
                label: 'Visibility',
                value: `${sensorHealth.visibilityPercent}%`,
                color: sensorHealth.visibilityPercent < 100 ? 'text-yellow-700' : 'text-green-700',
              },
              {
                label: 'Affected Assets',
                value: sensorHealth.affectedAssets,
                color: sensorHealth.affectedAssets > 0 ? 'text-yellow-700' : 'text-green-700',
              },
              {
                label: 'Last Telemetry',
                value: formatRelativeTime(sensorHealth.lastTelemetry),
                color: 'text-gray-700',
              },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <dt className="text-xs text-gray-500">{item.label}</dt>
                <dd className={`text-xs font-semibold ${item.color}`}>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Important context banner */}
        <Card padding="md" className="md:col-span-2">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-xs font-semibold text-gray-800">Data Completeness Notice</div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                <strong className="text-yellow-700">1 sensor is degraded</strong> at Plant 02, Control zone.
                This means <strong>{sensorHealth.affectedAssets} assets</strong> may have incomplete risk information.
                The absence of a finding does <strong>not</strong> guarantee no risk — visibility is reduced.
              </p>
            </div>
          </div>

          {/* Degraded sensors */}
          {degraded.map(sensor => (
            <div
              key={sensor.id}
              className="border border-yellow-200 bg-yellow-50 rounded p-3 mb-3"
              role="alert"
              aria-label={`Degraded sensor: ${sensor.name}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-yellow-900">{sensor.name}</span>
                <Badge variant="warning" size="xs">DEGRADED</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-2xs text-yellow-800 mb-1.5">
                <div><span className="text-yellow-500">Site:</span> {sensor.siteName}</div>
                <div><span className="text-yellow-500">Zone:</span> {sensor.zoneName}</div>
                <div><span className="text-yellow-500">Last seen:</span> {formatRelativeTime(sensor.lastTelemetry)}</div>
              </div>
              <p className="text-2xs text-yellow-700">{sensor.reason}</p>
              <div className="flex items-center gap-1 mt-2">
                <div
                  className="flex-1 h-1.5 rounded-full bg-yellow-200 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={sensor.coveragePercent}
                  aria-valuemax={100}
                  aria-label={`Coverage: ${sensor.coveragePercent}%`}
                >
                  <div
                    className="h-full rounded-full bg-yellow-500 transition-all"
                    style={{ width: `${sensor.coveragePercent}%` }}
                  />
                </div>
                <span className="text-2xs font-semibold text-yellow-700 flex-shrink-0">{sensor.coveragePercent}% coverage</span>
              </div>
            </div>
          ))}

          {/* Healthy notice */}
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded p-2.5">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-green-500" aria-hidden="true" />
            <span>{sensorHealth.healthy} of {sensorHealth.total} sensors are healthy and reporting normally.</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SensorHealth;
