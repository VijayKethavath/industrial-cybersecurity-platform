import React, { useState } from 'react';
import clsx from 'clsx';
import {
  X, ChevronDown, ChevronUp, ExternalLink, AlertOctagon,
  Shield, GitBranch, Activity, FileText, Zap, Network,
} from 'lucide-react';
import {
  SeverityBadge, StatusBadge, ConfidenceIndicator, DataQualityBanner,
  Badge, Button, Card,
} from '../ui';
import type { PathNode, PathEdge, AttackPath } from '../../types';
import { findings } from '../../data/findings';
import { SEVERITY_CONFIG } from '../../utils/designSystem';

interface InvestigationPanelProps {
  node: PathNode | null;
  edge: (PathEdge & { source: string; target: string }) | null;
  activePath: AttackPath;
  onClose: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const PanelSection: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-surface-border last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-brand"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <span className="text-gray-400" aria-hidden="true">{icon}</span>
          {title}
        </div>
        {open
          ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
          : <ChevronDown className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
        }
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
};

const InvestigationPanel: React.FC<InvestigationPanelProps> = ({
  node, edge, activePath, onClose,
}) => {
  const isNode = !!node;
  const isEdge = !!edge;

  const relatedFindings = node
    ? findings.filter(f => f.assetId === node.assetId).slice(0, 3)
    : [];

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 lg:relative lg:inset-auto lg:z-10 lg:w-80 xl:w-96 flex-shrink-0 bg-white border-l border-surface-border flex flex-col h-full overflow-hidden animate-slide-in shadow-2xl lg:shadow-panel"
      aria-label="Investigation panel"
      role="complementary"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          {isNode ? (
            <Shield className="w-4 h-4 text-brand flex-shrink-0" aria-hidden="true" />
          ) : (
            <Network className="w-4 h-4 text-brand flex-shrink-0" aria-hidden="true" />
          )}
          <span className="text-sm font-semibold text-gray-900 truncate">
            {isNode ? node!.name : `${edge!.protocol} Connection`}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close investigation panel"
          className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── NODE PANEL ─────────────────────────────────────────── */}
        {isNode && node && (
          <>
            {/* Summary */}
            <PanelSection title="Summary" icon={<FileText className="w-3.5 h-3.5" />}>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <SeverityBadge severity={node.criticality} />
                <StatusBadge status={node.status} />
                <Badge variant={node.role === 'crown_jewel' ? 'danger' : node.role === 'pivot' ? 'warning' : 'neutral'}>
                  {node.role === 'crown_jewel' ? 'CROWN JEWEL' : node.role.toUpperCase()}
                </Badge>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {[
                  { label: 'Type',       value: node.type },
                  { label: 'Zone',       value: node.zoneName },
                  { label: 'Site',       value: node.siteName },
                  { label: 'Risk Score', value: node.riskScore > 0 ? `${node.riskScore}/100` : 'Unknown' },
                  { label: 'Data',       value: node.dataQuality },
                ].map(item => (
                  <React.Fragment key={item.label}>
                    <dt className="text-gray-400">{item.label}</dt>
                    <dd className="text-gray-800 font-medium">{item.value}</dd>
                  </React.Fragment>
                ))}
              </dl>
              {node.dataQuality !== 'complete' && (
                <DataQualityBanner quality={node.dataQuality} className="mt-3" />
              )}
            </PanelSection>

            {/* Why it matters */}
            <PanelSection title="Why It Matters" icon={<AlertOctagon className="w-3.5 h-3.5" />}>
              <div className="text-xs text-gray-700 leading-relaxed bg-orange-50 border border-orange-100 rounded p-2.5">
                {node.role === 'crown_jewel' && (
                  <p>This asset is the <strong>primary target</strong> of this attack path. It is reachable through a cross-zone path originating from an external exposure point. Compromise would affect <strong>{activePath.reachableAssets} downstream assets</strong>.</p>
                )}
                {node.role === 'pivot' && (
                  <p>This asset serves as a <strong>pivot point</strong> in the attack chain. An attacker who compromises this device can use it to reach deeper into the OT network across zone boundaries.</p>
                )}
                {node.role === 'source' && (
                  <p>This is the <strong>entry point</strong> for this attack path. It represents the attacker's initial access vector into the environment.</p>
                )}
                {node.role === 'reachable' && (
                  <p>This asset is <strong>reachable</strong> from the target node if the attack path succeeds. It is not part of the primary path but could be affected by a successful compromise.</p>
                )}
              </div>
            </PanelSection>

            {/* Evidence */}
            <PanelSection title="Evidence" icon={<FileText className="w-3.5 h-3.5" />}>
              {relatedFindings.length > 0 ? (
                <ul className="space-y-1.5">
                  {relatedFindings.flatMap(f => f.evidence.slice(0, 2)).slice(0, 5).map((ev, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" aria-hidden="true" />
                      {ev}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 italic">No direct evidence items available for this node.</p>
              )}
            </PanelSection>

            {/* Related Findings */}
            <PanelSection title="Related Findings" icon={<AlertOctagon className="w-3.5 h-3.5" />} defaultOpen={relatedFindings.length > 0}>
              {relatedFindings.length > 0 ? (
                <div className="space-y-2">
                  {relatedFindings.map(f => (
                    <div
                      key={f.id}
                      className="border border-surface-border rounded p-2.5 hover:bg-gray-50 cursor-pointer"
                      tabIndex={0}
                      role="button"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold text-gray-800 line-clamp-1">{f.title}</span>
                        <SeverityBadge severity={f.severity} size="xs" />
                      </div>
                      <p className="text-2xs text-gray-500 line-clamp-2">{f.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No findings linked to this specific node.</p>
              )}
            </PanelSection>

            {/* Zone / Asset Context */}
            <PanelSection title="Zone & Asset Context" icon={<Activity className="w-3.5 h-3.5" />}>
              <dl className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">Zone</dt>
                  <dd>
                    <Badge variant="default" size="xs">{node.zoneName}</Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">Site</dt>
                  <dd className="text-gray-700 font-medium">{node.siteName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-400">Role in Path</dt>
                  <dd>
                    <Badge
                      variant={node.role === 'crown_jewel' ? 'danger' : node.role === 'pivot' ? 'warning' : 'default'}
                      size="xs"
                    >
                      {node.role.replace('_', ' ')}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </PanelSection>

            {/* Recommended Actions */}
            <PanelSection title="Recommended Actions" icon={<Zap className="w-3.5 h-3.5" />}>
              <div className="space-y-2">
                {relatedFindings[0]?.recommendedActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-brand-50 text-brand text-2xs font-bold flex items-center justify-center mt-0.5" aria-hidden="true">
                      {i + 1}
                    </span>
                    {action}
                  </div>
                ))}
                {relatedFindings.length === 0 && (
                  <p className="text-xs text-gray-500">No specific recommendations available. Investigate related findings for this asset.</p>
                )}
              </div>
            </PanelSection>
          </>
        )}

        {/* ── EDGE PANEL ─────────────────────────────────────────── */}
        {isEdge && edge && (
          <>
            <PanelSection title="Connection Summary" icon={<Network className="w-3.5 h-3.5" />}>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {edge.isSuspicious && <Badge variant="danger">SUSPICIOUS</Badge>}
                {edge.isCrossZone && <Badge variant="warning">CROSS-ZONE</Badge>}
                <ConfidenceIndicator confidence={edge.confidence} />
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <dt className="text-gray-400">Protocol</dt>
                <dd className="font-mono font-semibold text-gray-800">{edge.protocol}</dd>
                {edge.service && (
                  <>
                    <dt className="text-gray-400">Service</dt>
                    <dd className="text-gray-700">{edge.service}</dd>
                  </>
                )}
                <dt className="text-gray-400">Confidence</dt>
                <dd><ConfidenceIndicator confidence={edge.confidence} /></dd>
                <dt className="text-gray-400">Cross-zone</dt>
                <dd className={edge.isCrossZone ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                  {edge.isCrossZone ? 'Yes — policy violation' : 'No'}
                </dd>
              </dl>
            </PanelSection>

            <PanelSection title="Why It Matters" icon={<AlertOctagon className="w-3.5 h-3.5" />}>
              <div className="text-xs text-gray-700 leading-relaxed bg-orange-50 border border-orange-100 rounded p-2.5">
                {edge.description || 'This connection is part of the identified attack path.'}
                {edge.isSuspicious && (
                  <p className="mt-2 font-semibold text-red-700">⚠ This communication pattern has been flagged as anomalous and does not match baseline behavior.</p>
                )}
                {edge.isCrossZone && (
                  <p className="mt-2 font-semibold text-orange-700">⚠ This connection crosses a network zone boundary. Cross-zone communication requires explicit policy authorization.</p>
                )}
              </div>
            </PanelSection>

            <PanelSection title="Protocol & Service Details" icon={<Activity className="w-3.5 h-3.5" />}>
              <dl className="space-y-2 text-xs">
                <div>
                  <dt className="text-gray-400 mb-0.5">Protocol</dt>
                  <dd className="font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-800 font-semibold">{edge.protocol}</dd>
                </div>
                {edge.service && (
                  <div>
                    <dt className="text-gray-400 mb-0.5">Service / Port</dt>
                    <dd className="text-gray-700">{edge.service}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-400 mb-0.5">Classification</dt>
                  <dd>
                    {edge.isSuspicious
                      ? <Badge variant="danger" size="xs">Anomalous / Suspicious</Badge>
                      : <Badge variant="success" size="xs">Normal behavior</Badge>
                    }
                  </dd>
                </div>
              </dl>
            </PanelSection>
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t border-surface-border bg-gray-50 flex flex-col gap-2 flex-shrink-0">
        {isNode && (
          <>
            <Button variant="primary" size="sm" className="w-full">
              <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
              View Related Paths
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              View Asset Details
            </Button>
          </>
        )}
        {isEdge && (
          <Button variant="primary" size="sm" className="w-full">
            <AlertOctagon className="w-3.5 h-3.5" aria-hidden="true" />
            Investigate Finding
          </Button>
        )}
      </div>
    </aside>
  );
};

export default InvestigationPanel;
