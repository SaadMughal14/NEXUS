export type PortType = 'input' | 'output';

export interface Port {
  id: string;
  type: PortType;
  label?: string;
  offsetX: number; // Relative to component center/top-left (unrotated)
  offsetY: number;
}

export interface CircuitComponentType {
  type: string;
  name: string;
  category: 'gate' | 'source' | 'output' | 'memory' | 'complex';
  icon: string; // Lucide icon name
  width: number;
  height: number;
  ports: Port[];
  description?: string;
}

export interface CircuitNode {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  label?: string;
  data: Record<string, any>; // Simulation state
}

export interface Wire {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  state: boolean; // High/Low
}

export interface CircuitState {
  nodes: CircuitNode[];
  wires: Wire[];
  scale: number;
  offset: { x: number; y: number };
  selectedId: string | null;
}

export interface TruthTableRow {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
}