import type { Site, Zone } from '../types';

export const zones: Zone[] = [
  { id: 'z-corp',   name: 'Corporate',   siteId: 'site-p1', color: '#6366F1', assetCount: 156 },
  { id: 'z-dmz',    name: 'DMZ',         siteId: 'site-p1', color: '#F59E0B', assetCount: 42  },
  { id: 'z-ops',    name: 'Operations',  siteId: 'site-p1', color: '#10B981', assetCount: 234 },
  { id: 'z-ctrl',   name: 'Control',     siteId: 'site-p1', color: '#F97316', assetCount: 189 },
  { id: 'z-safety', name: 'Safety',      siteId: 'site-p1', color: '#DC2626', assetCount: 28  },
  { id: 'z-p2-corp',name: 'Corporate',   siteId: 'site-p2', color: '#6366F1', assetCount: 98  },
  { id: 'z-p2-ops', name: 'Operations',  siteId: 'site-p2', color: '#10B981', assetCount: 167 },
  { id: 'z-p2-ctrl',name: 'Control',     siteId: 'site-p2', color: '#F97316', assetCount: 142 },
  { id: 'z-p3-corp',name: 'Corporate',   siteId: 'site-p3', color: '#6366F1', assetCount: 62  },
  { id: 'z-p3-ctrl',name: 'Control',     siteId: 'site-p3', color: '#F97316', assetCount: 98  },
  { id: 'z-p3-ops', name: 'Operations',  siteId: 'site-p3', color: '#10B981', assetCount: 68  },
];

export const sites: Site[] = [
  {
    id: 'site-p1',
    name: 'Plant 01',
    location: 'Houston, TX',
    assetCount: 649,
    status: 'degraded',
    zones: zones.filter(z => z.siteId === 'site-p1'),
  },
  {
    id: 'site-p2',
    name: 'Plant 02',
    location: 'Detroit, MI',
    assetCount: 407,
    status: 'online',
    zones: zones.filter(z => z.siteId === 'site-p2'),
  },
  {
    id: 'site-p3',
    name: 'Plant 03',
    location: 'Denver, CO',
    assetCount: 228,
    status: 'online',
    zones: zones.filter(z => z.siteId === 'site-p3'),
  },
];

export const allSites = sites;
export const allZones = zones;
