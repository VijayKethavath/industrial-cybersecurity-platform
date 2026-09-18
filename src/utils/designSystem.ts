import type { Severity, ConfidenceLevel, DataQuality, AssetStatus } from '../types';

// ─── Severity ────────────────────────────────────────────────────────────────

export const SEVERITY_CONFIG: Record<Severity, {
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  icon: string;
}> = {
  critical: {
    label: 'CRITICAL',
    color: '#DC2626',
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
    icon: '⛔',
  },
  high: {
    label: 'HIGH',
    color: '#F97316',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-700',
    icon: '⚠️',
  },
  medium: {
    label: 'MEDIUM',
    color: '#EAB308',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
    icon: '⚡',
  },
  low: {
    label: 'LOW',
    color: '#3B82F6',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    icon: 'ℹ️',
  },
  info: {
    label: 'INFO',
    color: '#6B7280',
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-600',
    icon: '○',
  },
  unknown: {
    label: 'UNKNOWN',
    color: '#9CA3AF',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
    icon: '?',
  },
};

// ─── Status ─────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<AssetStatus, {
  label: string;
  color: string;
  dotClass: string;
  textClass: string;
}> = {
  online: {
    label: 'ONLINE',
    color: '#16A34A',
    dotClass: 'bg-green-500',
    textClass: 'text-green-700',
  },
  offline: {
    label: 'OFFLINE',
    color: '#DC2626',
    dotClass: 'bg-red-500',
    textClass: 'text-red-700',
  },
  degraded: {
    label: 'DEGRADED',
    color: '#EAB308',
    dotClass: 'bg-yellow-500',
    textClass: 'text-yellow-700',
  },
  unknown: {
    label: 'UNKNOWN',
    color: '#9CA3AF',
    dotClass: 'bg-gray-400',
    textClass: 'text-gray-500',
  },
};

// ─── Confidence ─────────────────────────────────────────────────────────────

export const CONFIDENCE_CONFIG: Record<ConfidenceLevel, {
  label: string;
  color: string;
  bg: string;
  text: string;
  bars: number;
}> = {
  high: {
    label: 'High',
    color: '#16A34A',
    bg: 'bg-green-100',
    text: 'text-green-700',
    bars: 3,
  },
  medium: {
    label: 'Medium',
    color: '#EAB308',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    bars: 2,
  },
  low: {
    label: 'Low',
    color: '#F97316',
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    bars: 1,
  },
  unknown: {
    label: 'Unknown',
    color: '#9CA3AF',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    bars: 0,
  },
};

// ─── Data Quality ────────────────────────────────────────────────────────────

export const DATA_QUALITY_CONFIG: Record<DataQuality, {
  label: string;
  description: string;
  bannerClass: string;
  textClass: string;
  icon: string;
}> = {
  complete: {
    label: 'Complete',
    description: 'Full telemetry available.',
    bannerClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-700',
    icon: '✓',
  },
  partial: {
    label: 'Partial Data',
    description: 'Some telemetry missing. Conclusions may be incomplete.',
    bannerClass: 'bg-yellow-50 border-yellow-200',
    textClass: 'text-yellow-700',
    icon: '⚠',
  },
  degraded: {
    label: 'Degraded Data',
    description: 'Sensor degraded. Asset status and relationships may be inaccurate.',
    bannerClass: 'bg-orange-50 border-orange-200',
    textClass: 'text-orange-700',
    icon: '⚠',
  },
  unknown: {
    label: 'No Data',
    description: 'No telemetry available. Status cannot be determined.',
    bannerClass: 'bg-gray-50 border-gray-200',
    textClass: 'text-gray-600',
    icon: '?',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
}

export function formatTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
