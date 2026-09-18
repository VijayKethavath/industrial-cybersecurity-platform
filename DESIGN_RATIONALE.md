# Design Rationale — CyberShield OT Platform

## 1. Information Prioritization

The dashboard information hierarchy is intentionally structured around the question: **"What does this user need to know in the next 10 seconds?"**

### Level 1 (Immediate): Posture + Urgent Flags
The security posture score and priority attention section sit above-the-fold. The score is prominently sized but not dominant — it sits beside six supporting KPIs that contextualize it. This prevents the "single number" anti-pattern where leadership sees only a score without understanding what drives it.

The Priority Attention section shows exactly three items: critical findings, high-risk paths, exposed critical assets. These are clickable and lead directly to relevant content. This answers the most critical leadership question in under 2 seconds.

### Level 2: Risk Evidence and Attack Paths
Findings charts and the attack path preview appear next. These support the analyst's need to understand *why* the score is what it is. The attack path preview links directly to the investigation workspace, creating a natural flow from "awareness" to "investigation."

### Level 3: Asset Inventory and Network Context
Asset visibility and network topology provide the operational context needed by OT security analysts. Device types, protocol distribution, and zone relationships answer "what do we have and how is it connected?"

### Level 4: Recent Changes and Sensor Health
Timeline and sensor health appear last. These are important but not urgent for the initial dashboard read. They answer "what changed?" and "can I trust this data?"

---

## 2. Supporting Leadership and Analyst Workflows

### Leadership (CISO) Flow
1. Land on dashboard → see posture score and trend (degrading -4 pts)
2. See "12 exposed critical assets" in priority attention
3. See "8 high-risk attack paths" → click to investigate
4. Understand business impact from KPI grid

### SOC Analyst Flow
1. Land on dashboard → priority attention flags triage items
2. See "Critical finding on PLC-07" in timeline
3. Click attack path preview → navigate to graph
4. Select nodes/edges → investigation panel provides evidence
5. Review findings, recommended actions, related paths

### OT Security Analyst Flow
1. Filter by site (Plant 01) → context narrows
2. Check asset visibility for unidentified/offline devices
3. Review protocol distribution for anomalies
4. Investigate specific PLC/HMI findings via panel

---

## 3. Attack Path Visual Overload Prevention

The attack path graph uses several strategies to remain readable at scale:

### Path Isolation
- **Path Switcher Panel**: left panel lists all paths; clicking one replaces the displayed graph
- **Focus Mode**: dims all nodes not on the active path; selected node always remains visible
- This prevents the "hairball" graph problem common in network visualization

### Progressive Disclosure
- Edge labels are concise (protocol name only)
- Detail appears only in the investigation panel on click
- Minimap provides overview without cluttering the main canvas

### Node Design
- Nodes communicate role through: shape (role badge), color (border + background), icon (device type), and text (name + zone)
- Severity is communicated via: colored border, SeverityBadge component (text + icon + color), risk score bar
- Never relies on color alone

### Clustering Strategy
- At dashboard level: simplified chain visualization (no React Flow)
- At investigation level: full graph with focus mode
- For very large environments: the path switcher means only the relevant subgraph is shown

---

## 4. Uncertainty and Incomplete Data

One of the most important design decisions in this prototype is **explicit data quality communication**.

### Three distinct states:
1. **No problem** — data is complete, no threat found
2. **Degraded/Partial** — some data is missing; conclusions may be incomplete  
3. **Unknown** — insufficient telemetry; status cannot be determined

These states are communicated through:
- `DataQualityBanner` component (yellow/orange banners with explicit text)
- Node-level warning icon when `dataQuality !== 'complete'`
- Sensor health section clearly separates "1 sensor degraded" from a clean bill of health
- Confidence indicator shows bars + text (High/Medium/Low/Unknown)

**Design principle**: The interface must never imply certainty when data is incomplete. A finding absence should not be read as "no risk" when visibility is degraded.

---

## 5. Scalability to Large Environments

The prototype architecture supports large environments through:

### Filtering
- Global filter bar (site, zone, severity, time range)
- Filters thread through to all sections
- Empty state handling when no results match

### Graph Scalability
- Path-focused view (not "all assets simultaneously")
- Focus mode isolates the active path
- Minimap provides spatial context for large graphs
- Cluster expansion would be added for 100+ node paths

### Data Architecture
- All data is structured in typed interfaces supporting pagination, filtering, aggregation
- Summary objects (`assetSummary`, `findingSummary`, etc.) separate from raw records
- Charts use pre-aggregated trend data

---

## 6. Assumptions Made

This prototype makes the following assumptions where the challenge intentionally omits proprietary details:

1. **Posture Score** (82/100): A composite score is shown with a simple explanation. The actual scoring algorithm is implementation-specific and not invented here.

2. **Attack Path Generation**: Paths are presented as pre-computed outputs. The detection algorithm that generates them is not modeled.

3. **Protocol Identification**: Protocol data is shown as-is from passive network analysis. Active probing or deep packet inspection methods are not specified.

4. **Confidence Levels**: Confidence is shown as High/Medium/Low with a textual explanation. The statistical model behind it is not implemented.

5. **User Authentication and Roles**: The prototype shows a single analyst view (A. Chen). Role-based access control and multi-tenancy are out of scope.

6. **Time-Specific Data**: All timestamps are relative to the prototype load time. Real data would come from a time-series backend.

7. **Cross-Zone Detection**: The "suspicious" and "cross-zone" classifications on edges represent detections from the platform's behavioral analysis engine. The specific algorithm is not specified or invented.
