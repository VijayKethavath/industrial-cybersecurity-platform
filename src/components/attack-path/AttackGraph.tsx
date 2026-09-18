import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import clsx from 'clsx';
import { attackPaths } from '../../data/attackPaths';
import type { AttackPath, PathNode, PathEdge } from '../../types';
import OTNode from './OTNode';
import OTEdge from './OTEdge';
import InvestigationPanel from './InvestigationPanel';
import { Button, Badge, SeverityBadge, ConfidenceIndicator } from '../ui';
import { ZoomIn, ZoomOut, Maximize2, Layers, GitBranch, AlertTriangle, ChevronDown, X, Info, Shield, Check } from 'lucide-react';

const NODE_TYPES = { otNode: OTNode };
const EDGE_TYPES = { otEdge: OTEdge };

const HORIZONTAL_SPACING = 220;
const VERTICAL_SPACING = 180;

function buildRFNodes(
  path: AttackPath,
  selectedNodeId: string | null,
  selectedPathIds: Set<string>,
  dimUnrelated: boolean,
  onNodeClick: (node: PathNode) => void,
): Node[] {
  const pathNodeIds = new Set(path.nodes.map(n => n.id));

  return path.nodes.map((n, i) => {
    const isOnPath = pathNodeIds.has(n.id);
    const isSelected = n.id === selectedNodeId;
    const isDimmed = dimUnrelated && !isOnPath && !isSelected;

    // Calculate layout: auto-layout along path
    const x = n.x ?? i * HORIZONTAL_SPACING;
    const y = n.y ?? 300;

    return {
      id: n.id,
      type: 'otNode',
      position: { x, y },
      data: {
        ...n,
        isSelected,
        isOnPath,
        isDimmed,
        onClick: onNodeClick,
      },
    };
  });
}

function buildRFEdges(
  path: AttackPath,
  selectedEdgeId: string | null,
  selectedPathIds: Set<string>,
  dimUnrelated: boolean,
  onEdgeClick: (edge: PathEdge & { source: string; target: string }) => void,
): Edge[] {
  return path.edges.map(e => {
    const isSelected = e.id === selectedEdgeId;
    const isOnPath = true; // all edges are on the selected path
    const isDimmed = dimUnrelated && !isOnPath;

    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'otEdge',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: e.isSuspicious ? '#DC2626' : e.isCrossZone ? '#F97316' : '#94A3B8',
      },
      data: {
        ...e,
        edgeId: e.id,
        isOnPath,
        isDimmed: isDimmed && !isSelected,
        onClick: onEdgeClick,
      },
    };
  });
}

interface AttackGraphProps {
  selectedPathId?: string;
}

const AttackGraph: React.FC<AttackGraphProps> = ({ selectedPathId }) => {
  const [activePath, setActivePath] = useState<AttackPath>(
    attackPaths.find(p => p.id === selectedPathId) || attackPaths[0]
  );
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<(PathEdge & { source: string; target: string }) | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dimUnrelated, setDimUnrelated] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [mobilePathsOpen, setMobilePathsOpen] = useState(false);
  const [mobileLegendOpen, setMobileLegendOpen] = useState(false);

  const rfNodes = useMemo(
    () => buildRFNodes(activePath, selectedNode?.id || null, new Set(), dimUnrelated, (node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
      setPanelOpen(true);
    }),
    [activePath, selectedNode, dimUnrelated]
  );

  const rfEdges = useMemo(
    () => buildRFEdges(activePath, selectedEdge?.id || null, new Set(), dimUnrelated, (edge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
      setPanelOpen(true);
    }),
    [activePath, selectedEdge, dimUnrelated]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  useEffect(() => { setNodes(rfNodes); }, [rfNodes]);
  useEffect(() => { setEdges(rfEdges); }, [rfEdges]);

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Mobile Floating Action Header */}
      <div className="lg:hidden absolute top-2 left-2 right-2 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
        {/* Path Selector Button */}
        <button
          onClick={() => setMobilePathsOpen(true)}
          className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-md text-xs font-semibold text-gray-800 active:scale-95 transition-all max-w-[210px] sm:max-w-xs truncate"
          aria-label="Switch active attack path"
        >
          <SeverityBadge severity={activePath.severity} size="xs" showIcon={false} />
          <span className="truncate">{activePath.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        </button>

        {/* Action Pills */}
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            onClick={() => setDimUnrelated(d => !d)}
            className={clsx(
              'px-2.5 py-1.5 rounded-lg border text-xs font-medium shadow-md transition-all active:scale-95',
              dimUnrelated
                ? 'bg-brand text-white border-brand'
                : 'bg-white/95 backdrop-blur-sm text-gray-700 border-gray-200'
            )}
            aria-label="Toggle focus mode"
            title="Focus mode"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMobileLegendOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border bg-white/95 backdrop-blur-sm text-gray-700 border-gray-200 text-xs font-medium shadow-md active:scale-95 transition-all"
            aria-label="Open legend"
            title="Legend"
          >
            Legend
          </button>
        </div>
      </div>

      {/* Mobile Hint Banner */}
      <div className="lg:hidden absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-gray-900/80 backdrop-blur-sm text-white text-2xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
          Tap node to inspect · Pinch to zoom
        </div>
      </div>

      {/* Graph Area */}
      <div className={clsx('flex-1 relative h-full', panelOpen ? 'mr-0' : '')}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          attributionPosition="bottom-right"
          aria-label="Attack path graph. Use arrow keys to navigate nodes, Enter to select."
        >
          <Background color="#E2E8F0" gap={20} size={1} />

          {showMiniMap && (
            <div className="hidden lg:block">
              <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
                nodeColor={(n) => {
                  const role = n.data?.role;
                  if (role === 'crown_jewel') return '#DC2626';
                  if (role === 'pivot') return '#F97316';
                  if (role === 'source') return '#6B7280';
                  return '#CBD5E1';
                }}
                maskColor="rgba(255,255,255,0.7)"
                style={{ borderRadius: 6, border: '1px solid #E2E8F0' }}
              />
            </div>
          )}

          <Controls showInteractive={false} className="hidden sm:block" />

          {/* Desktop Top-left panel: path switcher + stats */}
          <Panel position="top-left" className="hidden lg:flex flex-col gap-2" style={{ maxWidth: 280 }}>
            {/* Path selector */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-card overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-100 text-2xs font-semibold text-gray-500 uppercase tracking-wider">
                Attack Paths ({attackPaths.length})
              </div>
              {attackPaths.map(path => (
                <button
                  key={path.id}
                  onClick={() => {
                    setActivePath(path);
                    setSelectedNode(null);
                    setSelectedEdge(null);
                    setPanelOpen(false);
                  }}
                  className={clsx(
                    'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors text-xs',
                    activePath.id === path.id ? 'bg-brand-50 border-l-2 border-brand' : 'border-l-2 border-transparent',
                  )}
                  aria-current={activePath.id === path.id ? 'true' : undefined}
                  aria-label={`Select attack path: ${path.name}. Severity: ${path.severity}`}
                >
                  <SeverityBadge severity={path.severity} size="xs" showIcon={false} />
                  <span className="font-medium text-gray-800 truncate flex-1">{path.name}</span>
                  <span className="text-gray-400 flex-shrink-0">{path.hops}h</span>
                </button>
              ))}
            </div>

            {/* Active path stats */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-card p-3">
              <div className="text-2xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Path</div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {[
                  { label: 'Severity',   v: <SeverityBadge severity={activePath.severity} size="xs" /> },
                  { label: 'Confidence', v: <ConfidenceIndicator confidence={activePath.confidence} /> },
                  { label: 'Hops',       v: <span className="text-xs font-bold text-gray-900">{activePath.hops}</span> },
                  { label: 'Cross-zone', v: <span className={`text-xs font-semibold ${activePath.isCrossZone ? 'text-red-600' : 'text-gray-500'}`}>{activePath.isCrossZone ? 'Yes' : 'No'}</span> },
                  { label: 'Reachable',  v: <span className="text-xs font-bold text-gray-900">{activePath.reachableAssets}</span> },
                  { label: 'Data',       v: <span className={`text-xs font-semibold ${activePath.dataQuality !== 'complete' ? 'text-yellow-600' : 'text-green-600'}`}>{activePath.dataQuality}</span> },
                ].map(item => (
                  <React.Fragment key={item.label}>
                    <dt className="text-2xs text-gray-400">{item.label}</dt>
                    <dd>{item.v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </Panel>

          {/* Desktop Top-right: graph controls */}
          <Panel position="top-right" className="hidden lg:block">
            <div className="flex flex-col gap-1.5 bg-white rounded-lg border border-gray-200 shadow-card p-2">
              <button
                onClick={() => setDimUnrelated(d => !d)}
                className={clsx(
                  'flex items-center gap-1.5 text-xs px-2 py-1.5 rounded transition-colors font-medium',
                  dimUnrelated ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100',
                )}
                aria-pressed={dimUnrelated}
                aria-label="Focus mode — dim unrelated nodes"
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                Focus Mode
              </button>
              <button
                onClick={() => setShowMiniMap(m => !m)}
                className={clsx(
                  'flex items-center gap-1.5 text-xs px-2 py-1.5 rounded transition-colors font-medium',
                  showMiniMap ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-100',
                )}
                aria-pressed={showMiniMap}
                aria-label="Toggle minimap"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                Minimap
              </button>
            </div>
          </Panel>

          {/* Desktop Legend */}
          <Panel position="bottom-left" className="hidden lg:block">
            <div className="bg-white rounded border border-gray-200 shadow-card px-3 py-2">
              <div className="text-2xs font-semibold text-gray-400 uppercase mb-1.5">Legend</div>
              <div className="flex flex-col gap-1 text-2xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 bg-red-500 inline-block" style={{ borderTop: '2px dashed #DC2626' }} aria-hidden="true" />
                  Suspicious connection
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 inline-block" style={{ borderTop: '2px dashed #F97316' }} aria-hidden="true" />
                  Cross-zone connection
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 bg-gray-300 inline-block" aria-hidden="true" />
                  Normal communication
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-3 h-3 rounded border-2 border-red-600 ring-1 ring-red-300 inline-block" aria-hidden="true" />
                  Crown Jewel / Target
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border-2 border-orange-400 inline-block" aria-hidden="true" />
                  Pivot node
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border border-dashed border-gray-400 inline-block" aria-hidden="true" />
                  Reachable asset
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* ── Mobile Path Selector Drawer ────────────────────── */}
      {mobilePathsOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobilePathsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-t-2xl max-h-[80vh] flex flex-col shadow-2xl z-50 animate-slide-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-brand" />
                <span className="text-sm font-bold text-gray-900">Select Attack Path</span>
              </div>
              <button
                onClick={() => setMobilePathsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-3 space-y-2">
              {attackPaths.map(path => (
                <button
                  key={path.id}
                  onClick={() => {
                    setActivePath(path);
                    setSelectedNode(null);
                    setSelectedEdge(null);
                    setPanelOpen(false);
                    setMobilePathsOpen(false);
                  }}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between',
                    activePath.id === path.id
                      ? 'border-brand bg-brand-50/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  )}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={path.severity} size="xs" />
                      <span className="text-xs text-gray-400 font-mono">{path.hops} hops</span>
                      {path.isCrossZone && (
                        <span className="text-2xs text-red-600 bg-red-50 border border-red-200 rounded px-1 font-medium">Cross-zone</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{path.name}</div>
                    <div className="text-2xs text-gray-500 mt-0.5">Reaches {path.reachableAssets} assets · {path.dataQuality} fidelity</div>
                  </div>
                  {activePath.id === path.id && (
                    <div className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Active Path Stats Summary in Drawer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <div className="text-2xs text-gray-400">Severity</div>
                <div className="font-bold text-gray-900 uppercase text-xs mt-0.5">{activePath.severity}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <div className="text-2xs text-gray-400">Confidence</div>
                <div className="font-bold text-gray-900 uppercase text-xs mt-0.5">{activePath.confidence}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <div className="text-2xs text-gray-400">Reachable</div>
                <div className="font-bold text-gray-900 text-xs mt-0.5">{activePath.reachableAssets}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Legend Drawer ───────────────────────────── */}
      {mobileLegendOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileLegendOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-t-2xl max-h-[70vh] flex flex-col shadow-2xl z-50 animate-slide-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-900">Map Legend</span>
              <button
                onClick={() => setMobileLegendOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs text-gray-700">
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 bg-red-500 inline-block" style={{ borderTop: '2px dashed #DC2626' }} aria-hidden="true" />
                <span><strong>Suspicious connection:</strong> flagged lateral move</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 inline-block" style={{ borderTop: '2px dashed #F97316' }} aria-hidden="true" />
                <span><strong>Cross-zone connection:</strong> crosses network boundary</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 bg-gray-300 inline-block" aria-hidden="true" />
                <span><strong>Normal communication:</strong> baseline traffic</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="w-4 h-4 rounded border-2 border-red-600 ring-2 ring-red-200 inline-block flex-shrink-0" aria-hidden="true" />
                <span><strong>Crown Jewel / Target:</strong> highest criticality asset</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded border-2 border-orange-400 inline-block flex-shrink-0" aria-hidden="true" />
                <span><strong>Pivot node:</strong> intermediate hop across zones</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded border border-dashed border-gray-400 inline-block flex-shrink-0" aria-hidden="true" />
                <span><strong>Reachable asset:</strong> exposed to lateral compromise</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Investigation Panel with Mobile Backdrop ───────── */}
      {panelOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs animate-fade-in"
            onClick={closePanel}
            aria-hidden="true"
          />
          <InvestigationPanel
            node={selectedNode}
            edge={selectedEdge ? { ...selectedEdge } : null}
            activePath={activePath}
            onClose={closePanel}
          />
        </>
      )}
    </div>
  );
};

export default AttackGraph;
