import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import clsx from 'clsx';
import { StatusBadge, SeverityBadge, Badge } from '../ui';
import type { PathNode } from '../../types';
import { SEVERITY_CONFIG } from '../../utils/designSystem';
import {
  Cpu, Monitor, Server, Network, Shield, Zap, HardDrive, Globe, Router, AlertOctagon,
} from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'PLC':                    <Cpu className="w-4 h-4" />,
  'HMI':                    <Monitor className="w-4 h-4" />,
  'SCADA':                  <Server className="w-4 h-4" />,
  'Historian':              <HardDrive className="w-4 h-4" />,
  'Engineering Workstation':<Monitor className="w-4 h-4" />,
  'Server':                 <Server className="w-4 h-4" />,
  'Network Device':         <Network className="w-4 h-4" />,
  'Sensor':                 <Zap className="w-4 h-4" />,
  'Safety Controller':      <Shield className="w-4 h-4" />,
  'Firewall':               <Shield className="w-4 h-4" />,
  'Jump Server':            <Server className="w-4 h-4" />,
  'VPN Gateway':            <Router className="w-4 h-4" />,
  'Internet':               <Globe className="w-4 h-4" />,
  'External Vendor':        <Globe className="w-4 h-4" />,
};

interface NodeData extends PathNode {
  isSelected: boolean;
  isOnPath: boolean;
  isDimmed: boolean;
  onClick: (node: PathNode) => void;
}

const NODE_ROLE_STYLES: Record<string, string> = {
  source:      'border-gray-400 bg-gray-50',
  pivot:       'border-orange-400 bg-orange-50/60',
  target:      'border-red-500 bg-red-50',
  crown_jewel: 'border-red-600 bg-red-50 ring-2 ring-red-300 ring-offset-1',
  reachable:   'border-dashed border-gray-300 bg-white',
  normal:      'border-gray-200 bg-white',
};

const OTNode: React.FC<NodeProps<NodeData>> = memo(({ data, selected }) => {
  const {
    name, type, role, criticality, status, zoneName,
    riskScore, dataQuality, isSelected, isOnPath, isDimmed, onClick,
  } = data;

  const isCrownJewel = role === 'crown_jewel';
  const isSource = role === 'source';
  const isPivot = role === 'pivot';
  const isReachable = role === 'reachable';

  const sevConfig = SEVERITY_CONFIG[criticality];

  const handleClick = () => onClick(data);

  return (
    <div
      className={clsx(
        'relative rounded-lg border-2 cursor-pointer transition-all duration-150 select-none',
        'min-w-[140px] max-w-[160px]',
        NODE_ROLE_STYLES[role] || NODE_ROLE_STYLES.normal,
        isSelected && 'ring-2 ring-brand ring-offset-1 shadow-panel',
        isDimmed && !isSelected && 'opacity-30',
        !isDimmed && !isSelected && 'hover:shadow-panel hover:scale-105',
        isCrownJewel && 'border-red-600',
      )}
      role="button"
      aria-label={`${name} — ${type} — ${role} — Criticality: ${criticality}`}
      aria-pressed={isSelected}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? handleClick() : undefined}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-gray-400 !border-white" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-gray-400 !border-white" />

      {/* Crown jewel banner */}
      {isCrownJewel && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center" aria-hidden="true">
          <span className="bg-red-600 text-white text-2xs font-bold px-2 py-0.5 rounded-t-sm flex items-center gap-1">
            <AlertOctagon className="w-2.5 h-2.5" />
            CROWN JEWEL
          </span>
        </div>
      )}

      <div className="p-2.5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className={clsx('flex items-center gap-1.5', sevConfig.text)}>
            {TYPE_ICONS[type] || <Server className="w-4 h-4" />}
            <span className="text-2xs font-bold uppercase tracking-wider truncate">{name}</span>
          </div>
          {dataQuality !== 'complete' && (
            <span className="text-yellow-500 flex-shrink-0" title={`Data quality: ${dataQuality}`} aria-label={`Data quality: ${dataQuality}`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>

        {/* Type */}
        <div className="text-2xs text-gray-500 mb-1.5 truncate">{type}</div>

        {/* Severity + Status row */}
        <div className="flex items-center gap-1 flex-wrap mb-1.5">
          <SeverityBadge severity={criticality} size="xs" showIcon />
          <StatusBadge status={status} showDot />
        </div>

        {/* Zone */}
        <div className="text-2xs text-gray-400">
          <span className="font-medium">Zone:</span> {zoneName}
        </div>

        {/* Risk score bar */}
        {!isSource && riskScore > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-2xs text-gray-400">Risk</span>
              <span className={clsx('text-2xs font-bold', sevConfig.text)}>{riskScore}</span>
            </div>
            <div className="h-1 rounded-full bg-gray-100" role="progressbar" aria-valuenow={riskScore} aria-valuemax={100} aria-label={`Risk score: ${riskScore}`}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${riskScore}%`, backgroundColor: sevConfig.color }}
              />
            </div>
          </div>
        )}

        {/* Role badge */}
        <div className="mt-1.5">
          {isCrownJewel && <Badge variant="danger" size="xs">TARGET</Badge>}
          {isPivot    && <Badge variant="warning" size="xs">PIVOT</Badge>}
          {isSource   && <Badge variant="neutral" size="xs">ENTRY</Badge>}
          {isReachable && <Badge variant="info" size="xs">REACHABLE</Badge>}
        </div>
      </div>
    </div>
  );
});

OTNode.displayName = 'OTNode';

export default OTNode;
