import React, { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import clsx from 'clsx';
import type { PathEdge } from '../../types';

interface OTEdgeData extends Omit<PathEdge, 'source' | 'target'> {
  isOnPath: boolean;
  isDimmed: boolean;
  onClick: (edge: PathEdge & { source: string; target: string }) => void;
  edgeId: string;
}

const OTEdge: React.FC<EdgeProps<OTEdgeData>> = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data,
  markerEnd,
}) => {
  if (!data) return null;
  const { protocol, isSuspicious, isCrossZone, isOnPath, isDimmed, onClick, edgeId, ...rest } = data;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const strokeColor =
    isSuspicious ? '#DC2626' :
    isCrossZone  ? '#F97316' :
    '#94A3B8';

  const strokeWidth = isOnPath ? 2.5 : 1.5;
  const opacity = isDimmed ? 0.15 : 1;

  const handleClick = () => {
    onClick({ ...rest, id: edgeId, source: '', target: '', protocol, isSuspicious, isCrossZone });
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
          strokeWidth,
          opacity,
          strokeDasharray: isSuspicious ? '6 3' : isCrossZone ? '4 2' : undefined,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        interactionWidth={12}
      />

      <EdgeLabelRenderer>
        {!isDimmed && (
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              opacity,
            }}
            className={clsx(
              'absolute text-2xs font-mono font-semibold px-1.5 py-0.5 rounded border cursor-pointer transition-all',
              isSuspicious
                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                : isCrossZone
                ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50',
            )}
            role="button"
            aria-label={`Connection: ${protocol}${isSuspicious ? ' — Suspicious' : ''}${isCrossZone ? ' — Cross-zone' : ''}`}
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={e => e.key === 'Enter' && handleClick()}
          >
            {protocol}
            {isSuspicious && <span className="ml-1 text-red-400" aria-hidden="true">⚠</span>}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
});

OTEdge.displayName = 'OTEdge';

export default OTEdge;
