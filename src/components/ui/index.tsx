import React from 'react';
import clsx from 'clsx';

// ─── Button ──────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-1.5 font-medium rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:   'bg-brand text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
    ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
    outline:   'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 bg-white',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

// ─── IconButton ──────────────────────────────────────────────────────────────

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'solid';
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  size = 'md',
  variant = 'ghost',
  active = false,
  children,
  className,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    ghost:   clsx('text-gray-500 hover:bg-gray-100 hover:text-gray-800', active && 'bg-gray-100 text-gray-800'),
    outline: clsx('border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 bg-white', active && 'border-brand-300 text-brand bg-brand-50'),
    solid:   clsx('bg-gray-100 text-gray-700 hover:bg-gray-200', active && 'bg-brand text-white hover:bg-brand-600'),
  };

  const sizes = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <button
      aria-label={label}
      title={label}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    brand:   'bg-brand-50 text-brand-700 border border-brand-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    danger:  'bg-red-50 text-red-700 border border-red-200',
    info:    'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-50 text-gray-500 border border-gray-200',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-2xs font-medium rounded-sm',
    sm: 'px-2 py-0.5 text-xs font-medium rounded',
    md: 'px-2.5 py-1 text-xs font-semibold rounded',
  };

  const dotColors = {
    default: 'bg-gray-400',
    brand:   'bg-brand-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger:  'bg-red-500',
    info:    'bg-blue-500',
    neutral: 'bg-gray-400',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1 whitespace-nowrap', variants[variant], sizes[size], className)}>
      {dot && <span className={clsx('inline-block w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} aria-hidden="true" />}
      {children}
    </span>
  );
};

// ─── SeverityBadge ───────────────────────────────────────────────────────────

import type { Severity } from '../../types';
import { SEVERITY_CONFIG } from '../../utils/designSystem';
import { AlertOctagon, AlertTriangle, Zap, Info, HelpCircle, Minus } from 'lucide-react';

const SEVERITY_ICONS: Record<Severity, React.ReactNode> = {
  critical: <AlertOctagon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />,
  high:     <AlertTriangle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />,
  medium:   <Zap className="w-3 h-3 flex-shrink-0" aria-hidden="true" />,
  low:      <Info className="w-3 h-3 flex-shrink-0" aria-hidden="true" />,
  info:     <Minus className="w-3 h-3 flex-shrink-0" aria-hidden="true" />,
  unknown:  <HelpCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />,
};

interface SeverityBadgeProps {
  severity: Severity;
  showIcon?: boolean;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  showIcon = true,
  size = 'sm',
  className,
}) => {
  const config = SEVERITY_CONFIG[severity];

  const sizes = {
    xs: 'px-1.5 py-0.5 text-2xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      role="status"
      aria-label={`Severity: ${config.label}`}
      className={clsx(
        'inline-flex items-center gap-1 font-semibold tracking-wide rounded border whitespace-nowrap',
        config.bg,
        config.border,
        config.text,
        sizes[size],
        className,
      )}
    >
      {showIcon && SEVERITY_ICONS[severity]}
      {config.label}
    </span>
  );
};

// ─── StatusBadge ─────────────────────────────────────────────────────────────

import type { AssetStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/designSystem';

interface StatusBadgeProps {
  status: AssetStatus;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  className,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={`Status: ${config.label}`}
      className={clsx('inline-flex items-center gap-1.5 text-xs font-medium', config.textClass, className)}
    >
      {showDot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dotClass,
            status === 'online' && 'animate-pulse-slow')}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
};

// ─── ConfidenceIndicator ─────────────────────────────────────────────────────

import type { ConfidenceLevel } from '../../types';
import { CONFIDENCE_CONFIG } from '../../utils/designSystem';

interface ConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
  showLabel?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  showLabel = true,
  className,
}) => {
  const config = CONFIDENCE_CONFIG[confidence];

  return (
    <span
      role="status"
      aria-label={`Confidence: ${config.label}`}
      className={clsx('inline-flex items-center gap-1.5', className)}
    >
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3].map(i => (
          <span
            key={i}
            className={clsx(
              'rounded-sm transition-all',
              i === 1 && 'w-1 h-2',
              i === 2 && 'w-1 h-3',
              i === 3 && 'w-1 h-4',
              i <= config.bars ? 'opacity-100' : 'opacity-20 bg-gray-300',
            )}
            style={i <= config.bars ? { backgroundColor: config.color } : {}}
          />
        ))}
      </span>
      {showLabel && (
        <span className={clsx('text-xs font-medium', config.text)}>{config.label}</span>
      )}
    </span>
  );
};

// ─── DataQualityBanner ───────────────────────────────────────────────────────

import type { DataQuality } from '../../types';
import { DATA_QUALITY_CONFIG } from '../../utils/designSystem';
import { AlertTriangle as TriangleIcon, HelpCircle as HelpIcon, CheckCircle } from 'lucide-react';

interface DataQualityBannerProps {
  quality: DataQuality;
  detail?: string;
  className?: string;
}

export const DataQualityBanner: React.FC<DataQualityBannerProps> = ({
  quality,
  detail,
  className,
}) => {
  if (quality === 'complete') return null;

  const config = DATA_QUALITY_CONFIG[quality];

  const icons = {
    partial:  <TriangleIcon className="w-3.5 h-3.5 flex-shrink-0" />,
    degraded: <TriangleIcon className="w-3.5 h-3.5 flex-shrink-0" />,
    unknown:  <HelpIcon className="w-3.5 h-3.5 flex-shrink-0" />,
    complete: <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={clsx(
        'flex items-start gap-2 px-3 py-2 border rounded text-xs',
        config.bannerClass,
        config.textClass,
        className,
      )}
    >
      {icons[quality]}
      <div>
        <span className="font-semibold">{config.label}: </span>
        {detail || config.description}
      </div>
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  onClick,
  hoverable = false,
}) => {
  const pads = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border border-surface-border rounded-lg shadow-card',
        pads[padding],
        hoverable && 'cursor-pointer transition-shadow duration-150 hover:shadow-panel hover:border-gray-300',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
};

// ─── SectionHeader ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => (
  <div className={clsx('flex items-center justify-between mb-4', className)}>
    <div>
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

// ─── EmptyState ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div className={clsx('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
    {icon && (
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
    <p className="text-xs text-gray-500 max-w-xs mb-4">{description}</p>
    {action}
  </div>
);

// ─── LoadingSkeleton ─────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  if (lines === 1) {
    return (
      <div className={clsx('animate-pulse bg-gray-200 rounded', className)} aria-hidden="true" />
    );
  }

  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading...">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx('animate-pulse bg-gray-200 rounded', i === lines - 1 && 'w-3/4', className)}
          style={{ height: 14 }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('bg-white border border-surface-border rounded-lg p-4 shadow-card animate-pulse', className)}>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" aria-hidden="true" />
    <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" aria-hidden="true" />
    <div className="h-2.5 bg-gray-200 rounded w-2/3" aria-hidden="true" />
  </div>
);

// ─── Divider ─────────────────────────────────────────────────────────────────

export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={clsx('border-0 border-t border-surface-border', className)} />
);

// ─── Tooltip wrapper (simple title-based) ────────────────────────────────────

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => (
  <span title={content} className={className}>
    {children}
  </span>
);
