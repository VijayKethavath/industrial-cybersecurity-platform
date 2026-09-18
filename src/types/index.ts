// ─── Severity & Status ────────────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'unknown';
export type AssetStatus = 'online' | 'offline' | 'degraded' | 'unknown';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';
export type DataQuality = 'complete' | 'partial' | 'degraded' | 'unknown';

// ─── Sites & Zones ────────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  name: string;
  siteId: string;
  color: string;
  assetCount: number;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  zones: Zone[];
  assetCount: number;
  status: AssetStatus;
}

// ─── Assets ──────────────────────────────────────────────────────────────────

export type DeviceType =
  | 'PLC'
  | 'HMI'
  | 'SCADA'
  | 'Engineering Workstation'
  | 'Server'
  | 'Network Device'
  | 'Sensor'
  | 'Historian'
  | 'Safety Controller'
  | 'Firewall'
  | 'Jump Server'
  | 'VPN Gateway'
  | 'Internet'
  | 'External Vendor';

export interface Asset {
  id: string;
  name: string;
  type: DeviceType;
  ip?: string;
  mac?: string;
  vendor?: string;
  firmware?: string;
  siteId: string;
  siteName: string;
  zoneId: string;
  zoneName: string;
  status: AssetStatus;
  criticality: Severity;
  riskScore: number; // 0–100
  protocols: string[];
  isExposed: boolean;
  isCritical: boolean;
  isNew: boolean;
  isIncomplete: boolean;
  dataQuality: DataQuality;
  lastSeen: string; // ISO date
  discoveredAt: string;
  findingCount: number;
  openFindingsBySeverity: Record<Severity, number>;
  description?: string;
}

// ─── Findings ────────────────────────────────────────────────────────────────

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: 'open' | 'in_review' | 'resolved' | 'accepted';
  assetId: string;
  assetName: string;
  siteId: string;
  siteName: string;
  zoneId: string;
  zoneName: string;
  detectedAt: string;
  updatedAt: string;
  cve?: string;
  confidence: ConfidenceLevel;
  evidence: string[];
  recommendedActions: string[];
  relatedPathIds: string[];
  category: 'vulnerability' | 'exposure' | 'misconfiguration' | 'anomaly' | 'policy';
}

// ─── Sensors ─────────────────────────────────────────────────────────────────

export interface Sensor {
  id: string;
  name: string;
  siteId: string;
  siteName: string;
  zoneId: string;
  zoneName: string;
  status: 'healthy' | 'degraded' | 'offline' | 'unknown';
  lastTelemetry: string; // ISO date
  coveragePercent: number;
  affectedAssets: number;
  reason?: string;
}

// ─── Timeline Events ─────────────────────────────────────────────────────────

export type TimelineEventType =
  | 'asset_discovered'
  | 'asset_offline'
  | 'finding_new'
  | 'finding_elevated'
  | 'finding_resolved'
  | 'communication_changed'
  | 'sensor_degraded'
  | 'sensor_restored'
  | 'operator_action'
  | 'risk_increased';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  title: string;
  description: string;
  assetId?: string;
  assetName?: string;
  siteId?: string;
  siteName?: string;
  severity?: Severity;
  actor?: string;
}

// ─── Attack Paths ─────────────────────────────────────────────────────────────

export type NodeRole = 'source' | 'pivot' | 'target' | 'crown_jewel' | 'reachable' | 'normal';

export interface PathNode {
  id: string;
  assetId: string;
  name: string;
  type: DeviceType;
  role: NodeRole;
  criticality: Severity;
  status: AssetStatus;
  zoneId: string;
  zoneName: string;
  siteId: string;
  siteName: string;
  riskScore: number;
  dataQuality: DataQuality;
  x?: number;
  y?: number;
}

export interface PathEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  protocol: string;
  service?: string;
  isSuspicious: boolean;
  isCrossZone: boolean;
  confidence: ConfidenceLevel;
  description?: string;
}

export interface AttackPath {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  confidence: ConfidenceLevel;
  sourceNodeId: string;
  targetNodeId: string;
  nodes: PathNode[];
  edges: PathEdge[];
  hops: number;
  isCrossZone: boolean;
  reachableAssets: number;
  relatedFindingIds: string[];
  detectedAt: string;
  updatedAt: string;
  status: 'active' | 'investigating' | 'mitigated';
  dataQuality: DataQuality;
}

// ─── Dashboard Posture ───────────────────────────────────────────────────────

export interface SecurityPosture {
  score: number; // 0–100
  label: string;
  trend: 'improving' | 'stable' | 'degrading';
  trendValue: number;
  totalAssets: number;
  activeAssets: number;
  criticalAssets: number;
  exposedCriticalAssets: number;
  openFindings: number;
  highRiskPaths: number;
  dataQuality: DataQuality;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface FilterState {
  siteId: string | null;
  zoneId: string | null;
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  severity: Severity | null;
  criticality: Severity | null;
  search: string;
}
