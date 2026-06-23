'use client';

import React, { memo, useEffect, useState } from 'react';
import ReactFlow, {
  Handle,
  Position,
  NodeProps,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  User,
  Globe,
  Server,
  Database,
  Brain,
  CreditCard,
  Mail,
  MessageSquare,
  Bot,
  Terminal,
  HelpCircle,
  Zap,
  Shield,
  LayoutDashboard,
  Webhook,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  user: User,
  frontend: Globe,
  backend: Server,
  database: Database,
  vector: Zap,
  llm: Brain,
  payment: CreditCard,
  email: Mail,
  sms: MessageSquare,
  agent: Bot,
  webhook: Webhook,
  terminal: Terminal,
  auth: Shield,
  dashboard: LayoutDashboard,
  generic: HelpCircle,
};

// Color accent per node type
const TYPE_ACCENT: Record<string, string> = {
  user: '#a78bfa',
  frontend: '#60a5fa',
  backend: '#34d399',
  database: '#fb923c',
  vector: '#f59e0b',
  llm: '#c084fc',
  payment: '#4ade80',
  email: '#38bdf8',
  sms: '#fb7185',
  agent: '#e879f9',
  webhook: '#94a3b8',
  auth: '#10b981',
  dashboard: '#60a5fa',
  generic: '#94a3b8',
};

const SpatialNode = memo(({ data, type }: NodeProps) => {
  const Icon = ICON_MAP[type] || HelpCircle;
  const accent = TYPE_ACCENT[type] || '#94a3b8';

  return (
    <div
      className="rounded-2xl p-3 select-none"
      style={{
        minWidth: 180,
        background: 'rgba(0,0,0,0.60)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: '1px solid rgba(255,255,255,0.14)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: accent, width: 5, height: 5, border: 'none', opacity: 0.7 }}
      />

      {/* Header row */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            boxShadow: `0 0 8px ${accent}30`,
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
        <span className="text-[11px] font-bold text-white/90 leading-tight">{data.label}</span>
      </div>

      {/* Body subtext */}
      {data.subtext && (
        <p className="text-[9px] text-white/45 mt-2 leading-relaxed font-mono">{data.subtext}</p>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: accent, width: 5, height: 5, border: 'none', opacity: 0.7 }}
      />
    </div>
  );
});
SpatialNode.displayName = 'SpatialNode';

const nodeTypes = Object.fromEntries(
  Object.keys(ICON_MAP).map((k) => [k, SpatialNode])
) as Record<string, typeof SpatialNode>;

interface MindMapProps {
  initialNodes: any[];
  initialEdges: any[];
}

export const MindMap = memo(function MindMap({ initialNodes, initialEdges }: MindMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const styledEdges = initialEdges.map((edge) => ({
      ...edge,
      type: 'default',
      animated: true,
      style: {
        stroke: '#10b981',
        strokeWidth: 1.8,
        filter: 'drop-shadow(0 0 4px #10b98160)',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: '#10b981',
      },
    }));

    setNodes(initialNodes);
    setEdges(styledEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative" style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        preventScrolling={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
});
