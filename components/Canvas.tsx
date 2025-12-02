import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CircuitNode, Wire, CircuitState, Port } from '../types';
import { COMPONENT_DEFINITIONS, GRID_SIZE } from '../constants';
import { Trash2, RotateCw } from 'lucide-react';

interface CanvasProps {
  state: CircuitState;
  onStateChange: (newState: CircuitState) => void;
  isSimulating: boolean;
  wireStyle: 'curved' | 'straight';
  theme: 'dark' | 'light';
  wireColor: string;
}

const Canvas: React.FC<CanvasProps> = ({ state, onStateChange, isSimulating, wireStyle, theme, wireColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interaction States
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wiringStart, setWiringStart] = useState<{ nodeId: string; portId: string; x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
  const [hoveredPort, setHoveredPort] = useState<{ nodeId: string, portId: string } | null>(null);

  // Dynamic Styles based on Theme
  const isDark = theme === 'dark';
  
  // COLOR PALETTE
  // Light Mode: Black wire for ink-on-paper look.
  // Dark Mode: Custom User Selection.
  const wireActiveColor = isDark ? wireColor : '#000000'; 
  const wireInactiveColor = isDark ? '#52525b' : '#d1d5db'; 
  
  // Port Styles
  const portBg = isDark ? 'bg-zinc-800 border-zinc-500' : 'bg-white border-black'; // High contrast ports in light mode

  // --- Helpers ---
  const getNodeStyles = (type: string) => {
    const def = COMPONENT_DEFINITIONS[type];
    const cat = def.category;

    // Base Styles
    let styles = {
        bg: isDark ? 'bg-zinc-800' : 'bg-white',
        border: isDark ? 'border-zinc-500' : 'border-zinc-800', // Dark border in light mode
        text: isDark ? 'text-zinc-400' : 'text-zinc-900', // Black text in light mode
        activeBorder: isDark ? 'border-amber-400' : 'border-blue-600',
        activeText: isDark ? 'text-amber-400' : 'text-blue-600',
        shadow: isDark ? 'shadow-none' : 'shadow-md shadow-zinc-200',
        glow: isDark ? 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' : '' // Remove glow in light mode
    };

    // Category Overrides (Restoring the colorful look but keeping contrast)
    switch (cat) {
        case 'source': // Inputs (Green)
            styles.bg = isDark ? 'bg-[#052e16]' : 'bg-emerald-50'; 
            styles.border = isDark ? 'border-emerald-700' : 'border-emerald-600';
            styles.text = isDark ? 'text-emerald-400' : 'text-emerald-900';
            styles.activeBorder = 'border-emerald-500';
            styles.activeText = 'text-emerald-600';
            break;
        case 'output': // Outputs (Red)
            styles.bg = isDark ? 'bg-[#450a0a]' : 'bg-rose-50'; 
            styles.border = isDark ? 'border-rose-700' : 'border-rose-600';
            styles.text = isDark ? 'text-rose-400' : 'text-rose-900';
            styles.activeBorder = 'border-rose-500';
            styles.activeText = 'text-rose-600';
            break;
        case 'memory': // Memory (Purple)
            styles.bg = isDark ? 'bg-[#2e1065]' : 'bg-violet-50';
            styles.border = isDark ? 'border-violet-700' : 'border-violet-600';
            styles.text = isDark ? 'text-violet-400' : 'text-violet-900';
            styles.activeBorder = 'border-violet-500';
            styles.activeText = 'text-violet-600';
            break;
        case 'complex': // ICs (Blue)
            styles.bg = isDark ? 'bg-[#172554]' : 'bg-blue-50';
            styles.border = isDark ? 'border-blue-700' : 'border-blue-600';
            styles.text = isDark ? 'text-blue-400' : 'text-blue-900';
            styles.activeBorder = 'border-blue-500';
            styles.activeText = 'text-blue-600';
            break;
        default: // Gates (Standard)
            styles.bg = isDark ? 'bg-zinc-900' : 'bg-white';
            styles.border = isDark ? 'border-zinc-600' : 'border-zinc-800';
            break;
    }
    return styles;
  };

  const getPortPosition = (node: CircuitNode, port: Port) => {
    const def = COMPONENT_DEFINITIONS[node.type];
    const cx = def.width / 2;
    const cy = def.height / 2;
    
    const ox = port.offsetX - cx;
    const oy = port.offsetY - cy;

    let rx = ox;
    let ry = oy;

    if (node.rotation === 90) { rx = -oy; ry = ox; }
    else if (node.rotation === 180) { rx = -ox; ry = -oy; }
    else if (node.rotation === 270) { rx = oy; ry = -ox; }

    return {
      x: node.x + cx + rx,
      y: node.y + cy + ry
    };
  };

  const getClientCoords = (e: React.MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - state.offset.x) / state.scale;
      const y = (e.clientY - rect.top - state.offset.y) / state.scale;
      return { x, y };
  };

  const getWirePath = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    if (wireStyle === 'curved') {
        const dist = Math.abs(p1.x - p2.x) * 0.5 + 50;
        return `M ${p1.x} ${p1.y} C ${p1.x + dist} ${p1.y}, ${p2.x - dist} ${p2.y}, ${p2.x} ${p2.y}`;
    } else {
        // Orthogonal (Manhattan) Routing
        const midX = (p1.x + p2.x) / 2;
        // If backtracking (target is left of source), push out a bit then go around
        if (p2.x < p1.x + 20) {
             const buffer = 40;
             return `M ${p1.x} ${p1.y} L ${p1.x + buffer} ${p1.y} L ${p1.x + buffer} ${(p1.y + p2.y)/2} L ${p2.x - buffer} ${(p1.y + p2.y)/2} L ${p2.x - buffer} ${p2.y} L ${p2.x} ${p2.y}`;
        }
        return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
    }
  };

  // --- Simulation Logic ---
  useEffect(() => {
    if (!isSimulating) return;
    
    // Simulation tick 100ms
    const interval = setInterval(() => {
      const newWires = [...state.wires];
      const newNodes = [...state.nodes];
      let changed = false;

      const nodeStates: Record<string, Record<string, boolean>> = {};

      // 1. Initialize Inputs
      newNodes.forEach(node => {
        if (!nodeStates[node.id]) nodeStates[node.id] = {};
        
        if (node.type === 'SWITCH' || node.type === 'BUTTON') {
           nodeStates[node.id]['out'] = !!node.data?.active;
        } else if (node.type === 'CLOCK') {
           const val = !node.data?.value;
           node.data = { ...node.data, value: val };
           nodeStates[node.id]['out'] = val;
           changed = true;
        } else if (['D_FF', 'JK_FF'].includes(node.type)) {
           nodeStates[node.id]['q'] = !!node.data?.q;
           nodeStates[node.id]['nq'] = !node.data?.q;
        } else {
             COMPONENT_DEFINITIONS[node.type].ports
                .filter(p => p.type === 'output')
                .forEach(p => nodeStates[node.id][p.id] = false);
        }
      });

      // 2. Propagate
      for (let i = 0; i < 5; i++) {
          newWires.forEach(wire => {
              const sourceVal = nodeStates[wire.sourceNodeId]?.[wire.sourcePortId] || false;
              if (wire.state !== sourceVal) {
                  wire.state = sourceVal;
                  changed = true;
              }
          });

          newNodes.forEach(node => {
              const getIn = (pid: string) => newWires.find(w => w.targetNodeId === node.id && w.targetPortId === pid)?.state || false;

              let outVal = false;
              
              if (node.type === 'AND') outVal = getIn('in1') && getIn('in2');
              else if (node.type === 'OR') outVal = getIn('in1') || getIn('in2');
              else if (node.type === 'XOR') outVal = getIn('in1') !== getIn('in2');
              else if (node.type === 'NAND') outVal = !(getIn('in1') && getIn('in2'));
              else if (node.type === 'NOR') outVal = !(getIn('in1') || getIn('in2'));
              else if (node.type === 'XNOR') outVal = getIn('in1') === getIn('in2');
              else if (node.type === 'NOT') outVal = !getIn('in');
              else if (node.type === 'MUX') {
                outVal = getIn('sel') ? getIn('d1') : getIn('d0');
              }
              
              if (['AND','OR','XOR','NAND','NOR','XNOR','NOT', 'MUX'].includes(node.type)) {
                  nodeStates[node.id]['out'] = outVal;
              }

              if (node.type === 'D_FF') {
                 const clk = getIn('clk');
                 const prevClk = node.data?.prevClk || false;
                 
                 if (clk && !prevClk) { // Rising Edge
                     const d = getIn('d');
                     node.data = { ...node.data, q: d };
                     nodeStates[node.id]['q'] = d;
                     nodeStates[node.id]['nq'] = !d;
                     changed = true;
                 }
                 node.data.prevClk = clk;
              }
              else if (node.type === 'JK_FF') {
                  const clk = getIn('clk');
                  const prevClk = node.data?.prevClk || false;
                  
                  if (clk && !prevClk) { // Rising Edge
                      const j = getIn('j');
                      const k = getIn('k');
                      let q = node.data?.q || false;
                      
                      if (j && !k) q = true;
                      else if (!j && k) q = false;
                      else if (j && k) q = !q; // Toggle
                      
                      node.data = { ...node.data, q };
                      nodeStates[node.id]['q'] = q;
                      nodeStates[node.id]['nq'] = !q;
                      changed = true;
                  }
                  node.data.prevClk = clk;
              }

              if (node.type === 'LED') {
                   const val = getIn('in');
                   if (node.data?.active !== val) { node.data = { ...node.data, active: val }; changed = true; }
              }
              if (node.type === 'HEX') {
                  const val = (getIn('in8')?8:0) + (getIn('in4')?4:0) + (getIn('in2')?2:0) + (getIn('in1')?1:0);
                  if (node.data?.value !== val) { node.data = { ...node.data, value: val }; changed = true; }
              }
          });
      }

      if (changed) onStateChange({ ...state, wires: newWires, nodes: newNodes });

    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, state, onStateChange]);

  // --- Event Handlers ---
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type || !containerRef.current) return;

    const def = COMPONENT_DEFINITIONS[type];
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left - state.offset.x) / state.scale;
    const rawY = (e.clientY - rect.top - state.offset.y) / state.scale;
    
    const x = Math.round((rawX - def.width/2) / GRID_SIZE) * GRID_SIZE;
    const y = Math.round((rawY - def.height/2) / GRID_SIZE) * GRID_SIZE;

    const newNode: CircuitNode = {
      id: `node_${Date.now()}`,
      type,
      x,
      y,
      rotation: 0,
      data: {}
    };

    onStateChange({ ...state, nodes: [...state.nodes, newNode], selectedId: newNode.id });
  };

  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (e.button === 2) { 
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
        return;
    }

    const node = state.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const coords = getClientCoords(e);
    setDraggingNode(nodeId);
    setDragOffset({ x: coords.x - node.x, y: coords.y - node.y });
    onStateChange({ ...state, selectedId: nodeId });
    setContextMenu(null);
  };

  const handleMouseDownPort = (e: React.MouseEvent, nodeId: string, portId: string) => {
    e.stopPropagation();
    const node = state.nodes.find(n => n.id === nodeId);
    const def = COMPONENT_DEFINITIONS[node!.type];
    const port = def.ports.find(p => p.id === portId);
    const pos = getPortPosition(node!, port!);
    
    setWiringStart({ nodeId, portId, x: pos.x, y: pos.y });
    setContextMenu(null);
  };

  const handleMouseUpPort = (e: React.MouseEvent, nodeId: string, portId: string) => {
    e.stopPropagation();
    if (!wiringStart) return;

    if (wiringStart.nodeId !== nodeId) { 
        const newWire: Wire = {
          id: `wire_${Date.now()}`,
          sourceNodeId: wiringStart.nodeId,
          sourcePortId: wiringStart.portId,
          targetNodeId: nodeId,
          targetPortId: portId,
          state: false
        };
        onStateChange({ ...state, wires: [...state.wires, newWire] });
    }
    setWiringStart(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getClientCoords(e);
    setMousePos(coords);

    if (draggingNode) {
      const newX = Math.round((coords.x - dragOffset.x) / GRID_SIZE) * GRID_SIZE;
      const newY = Math.round((coords.y - dragOffset.y) / GRID_SIZE) * GRID_SIZE;
      
      onStateChange({
        ...state,
        nodes: state.nodes.map(n => n.id === draggingNode ? { ...n, x: newX, y: newY } : n)
      });
    }

    if (panning) {
      onStateChange({
        ...state,
        offset: {
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        }
      });
    }
  };

  const deleteNode = (id: string) => {
      onStateChange({
          ...state,
          nodes: state.nodes.filter(n => n.id !== id),
          wires: state.wires.filter(w => w.sourceNodeId !== id && w.targetNodeId !== id),
          selectedId: null
      });
      setContextMenu(null);
  };

  const rotateNode = (id: string) => {
      onStateChange({
          ...state,
          nodes: state.nodes.map(n => n.id === id ? { ...n, rotation: (n.rotation + 90) % 360 } : n)
      });
      setContextMenu(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
      // Direct mouse wheel zooming (no modifier key required)
      e.preventDefault();
      const zoomSense = 0.001;
      // Reverse logic: Scroll UP (negative delta) zooms IN, Scroll DOWN zooms OUT
      const newScale = Math.min(Math.max(0.2, state.scale - e.deltaY * zoomSense), 3);
      onStateChange({ ...state, scale: newScale });
  };

  return (
    <div 
      className={`flex-1 relative overflow-hidden circuit-grid cursor-crosshair h-full select-none ${isDark ? 'bg-[#09090b]' : 'bg-white'}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onMouseDown={(e) => {
         if (e.button === 1 || e.button === 0) {
             if (!draggingNode && !wiringStart) {
                setPanning(true);
                setPanStart({ x: e.clientX - state.offset.x, y: e.clientY - state.offset.y });
                onStateChange({ ...state, selectedId: null });
                setContextMenu(null);
             }
         }
      }}
      onMouseUp={() => {
        setDraggingNode(null);
        setWiringStart(null);
        setPanning(false);
      }}
      ref={containerRef}
    >
      <div 
        className="absolute origin-top-left transition-transform duration-75 ease-linear will-change-transform"
        style={{
          transform: `translate(${state.offset.x}px, ${state.offset.y}px) scale(${state.scale})`
        }}
      >
        {/* Wires Layer */}
        <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible z-0">
          {state.wires.map(wire => {
            const sourceNode = state.nodes.find(n => n.id === wire.sourceNodeId);
            const targetNode = state.nodes.find(n => n.id === wire.targetNodeId);
            if (!sourceNode || !targetNode) return null;

            const sourceDef = COMPONENT_DEFINITIONS[sourceNode.type];
            const targetDef = COMPONENT_DEFINITIONS[targetNode.type];
            const sourcePort = sourceDef.ports.find(p => p.id === wire.sourcePortId);
            const targetPort = targetDef.ports.find(p => p.id === wire.targetPortId);
            
            if (!sourcePort || !targetPort) return null;

            const p1 = getPortPosition(sourceNode, sourcePort);
            const p2 = getPortPosition(targetNode, targetPort);

            const d = getWirePath(p1, p2);
            
            return (
              <g key={wire.id} className="pointer-events-auto" onClick={(e) => { e.stopPropagation(); onStateChange({...state, selectedId: wire.id}) }}>
                 {/* Selection Halo */}
                 {state.selectedId === wire.id && (
                    <path
                        d={d}
                        stroke={isDark ? "rgba(245, 158, 11, 0.2)" : "rgba(0,0,0,0.1)"}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                 )}
                 {/* Active Glow - ONLY IN DARK MODE */}
                 {wire.state && isDark && (
                     <path
                     d={d}
                     stroke={wireActiveColor}
                     strokeWidth="5"
                     fill="none"
                     opacity={0.15} 
                     filter="blur(1px)"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                 )}
                 {/* Core Wire */}
                <path
                  d={d}
                  stroke={wire.state ? wireActiveColor : wireInactiveColor} 
                  strokeWidth={wire.state ? 3 : 2}
                  fill="none"
                  className="transition-colors duration-200"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* New Wire Preview */}
          {wiringStart && (
            <path
              d={getWirePath(wiringStart, mousePos)}
              stroke={wireActiveColor}
              strokeWidth="2"
              strokeDasharray="4"
              fill="none"
              opacity={0.6}
            />
          )}
        </svg>

        {/* Nodes Layer */}
        {state.nodes.map(node => {
          const def = COMPONENT_DEFINITIONS[node.type];
          const isActive = node.data?.active;
          const isClockOn = node.type === 'CLOCK' && node.data?.value;
          const isSelected = state.selectedId === node.id;
          const displayVal = node.type === 'HEX' ? (node.data?.value || 0).toString(16).toUpperCase() : '';
          
          const styles = getNodeStyles(node.type);

          return (
            <div
              key={node.id}
              className={`absolute group z-10`}
              style={{
                left: node.x,
                top: node.y,
                width: def.width,
                height: def.height,
                transform: `rotate(${node.rotation}deg)`,
                transformOrigin: 'center center'
              }}
              onMouseDown={(e) => handleMouseDownNode(e, node.id)}
            >
              <div 
                className={`
                    w-full h-full 
                    border-[1.5px]
                    ${styles.bg} 
                    ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : styles.border}
                    ${isActive || isClockOn ? styles.activeBorder : ''}
                    rounded-lg transition-all duration-200 flex items-center justify-center relative ${styles.shadow}
                    ${isActive || isClockOn ? styles.glow : ''}
                `}
                onDoubleClick={() => {
                    if (node.type === 'SWITCH') onStateChange({...state, nodes: state.nodes.map(n => n.id === node.id ? {...n, data: {...n.data, active: !n.data.active}} : n)});
                    if (node.type === 'BUTTON') onStateChange({...state, nodes: state.nodes.map(n => n.id === node.id ? {...n, data: {...n.data, active: true}} : n)});
                }}
                onMouseUp={() => {
                     if (node.type === 'BUTTON') onStateChange({...state, nodes: state.nodes.map(n => n.id === node.id ? {...n, data: {...n.data, active: false}} : n)});
                }}
              >
                {node.type === 'HEX' ? (
                     <span className={`text-3xl font-mono ${styles.activeText} font-bold`}>
                         {displayVal}
                     </span>
                ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                        <span className={`text-[10px] font-bold font-mono tracking-wider ${isActive || isClockOn ? styles.activeText : styles.text}`}>
                            {def.name.split(' ')[0]}
                        </span>
                        {(node.type === 'D_FF' || node.type === 'JK_FF') && (
                            <span className={`text-[8px] font-mono mt-1 ${node.data?.q ? styles.activeText : styles.text}`}>
                                Q:{node.data?.q ? '1' : '0'}
                            </span>
                        )}
                    </div>
                )}

                {def.ports.map(port => {
                   const label = port.label || '';
                  return (
                    <div key={port.id}>
                        <div
                        className={`
                            absolute w-3 h-3 ${portBg} rounded-full 
                            hover:scale-150 ${isDark ? 'hover:border-amber-400 hover:bg-zinc-700' : 'hover:border-indigo-600 hover:bg-white'} transition-all cursor-pointer z-50
                        `}
                        style={{
                            left: port.offsetX - 6,
                            top: port.offsetY - 6,
                        }}
                        onMouseEnter={() => setHoveredPort({nodeId: node.id, portId: port.id})}
                        onMouseLeave={() => setHoveredPort(null)}
                        onMouseDown={(e) => handleMouseDownPort(e, node.id, port.id)}
                        onMouseUp={(e) => handleMouseUpPort(e, node.id, port.id)}
                        title={`${port.type} (${port.id})`}
                        >
                             <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-amber-400' : 'bg-indigo-600'} opacity-0 hover:opacity-50 ${isDark ? 'blur-sm' : ''} transition-opacity`} />
                        </div>
                        {label && (
                            <span 
                                className={`absolute text-[8px] font-mono pointer-events-none ${isDark ? 'text-zinc-400' : 'text-zinc-600 font-bold'}`}
                                style={{
                                    left: port.offsetX + (port.offsetX < def.width/2 ? 8 : -14),
                                    top: port.offsetY - 5,
                                    textAlign: port.offsetX < def.width/2 ? 'left' : 'right'
                                }}
                            >
                                {label}
                            </span>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {contextMenu && (
          <div 
            className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-1 w-32 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onMouseLeave={() => setContextMenu(null)}
          >
              <button 
                onClick={() => rotateNode(contextMenu.nodeId)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded w-full text-left"
              >
                  <RotateCw size={14} /> Rotate
              </button>
              <div className="h-px bg-zinc-800 w-full" />
              <button 
                onClick={() => deleteNode(contextMenu.nodeId)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 rounded w-full text-left"
              >
                  <Trash2 size={14} /> Delete
              </button>
          </div>
      )}

      <div className="absolute bottom-6 right-6 flex gap-2 pointer-events-none">
         <div className="bg-zinc-900/90 dark:bg-zinc-900/90 bg-white/90 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-500 text-[10px] font-mono shadow-xl uppercase tracking-widest">
             Scale: {Math.round(state.scale * 100)}% | X: {Math.round(state.offset.x)} Y: {Math.round(state.offset.y)}
         </div>
      </div>
    </div>
  );
};

export default Canvas;