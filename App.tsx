import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import { CircuitState, TruthTableRow } from './types';
import { generateCircuit, explainCircuit, validateConnection } from './services/geminiService';
import { COMPONENT_DEFINITIONS, CIRCUIT_EXAMPLES } from './constants';
import { X, MousePointer2, Move, RotateCw, Keyboard, GitCommitHorizontal, Cable, AlertTriangle, Key, CheckCircle2, XCircle, ShieldCheck, Server, BookOpen, ChevronRight, LayoutTemplate, History, Clock } from 'lucide-react';

// Default "Wow" Circuit for First-Time Users
const DEFAULT_CIRCUIT: CircuitState = {
  nodes: [
    { id: 'master_clk', type: 'CLOCK', x: 60, y: 320, rotation: 0, data: {}, label: 'SYS_CLK' },
    { id: 'vcc_source', type: 'SWITCH', x: 400, y: 60, rotation: 0, data: { active: true }, label: 'VCC_5V' },
    { id: 'ff_bit0', type: 'JK_FF', x: 200, y: 220, rotation: 0, data: { q: false }, label: 'BIT_0' },
    { id: 'ff_bit1', type: 'JK_FF', x: 360, y: 220, rotation: 0, data: { q: false }, label: 'BIT_1' },
    { id: 'ff_bit2', type: 'JK_FF', x: 520, y: 220, rotation: 0, data: { q: false }, label: 'BIT_2' },
    { id: 'ff_bit3', type: 'JK_FF', x: 680, y: 220, rotation: 0, data: { q: false }, label: 'BIT_3' },
    { id: 'logic_and', type: 'AND', x: 360, y: 440, rotation: 0, data: {}, label: 'SYNC_CHK' },
    { id: 'logic_xor', type: 'XOR', x: 520, y: 440, rotation: 0, data: {}, label: 'PARITY' },
    { id: 'logic_not', type: 'NOT', x: 200, y: 440, rotation: 0, data: {}, label: 'INV' },
    { id: 'hex_disp', type: 'HEX', x: 880, y: 200, rotation: 0, data: { value: 0 }, label: 'HEX_MON' },
    { id: 'led_sync', type: 'LED', x: 460, y: 450, rotation: 0, data: { active: false }, label: 'SYNC' },
    { id: 'led_pari', type: 'LED', x: 620, y: 450, rotation: 0, data: { active: false }, label: 'PARITY' },
    { id: 'led_beat', type: 'LED', x: 60, y: 440, rotation: 0, data: { active: false }, label: 'BEAT' },
  ],
  wires: [
    { id: 'wp_1', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit0', targetPortId: 'j', state: true },
    { id: 'wp_2', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit0', targetPortId: 'k', state: true },
    { id: 'wp_3', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit1', targetPortId: 'j', state: true },
    { id: 'wp_4', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit1', targetPortId: 'k', state: true },
    { id: 'wp_5', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit2', targetPortId: 'j', state: true },
    { id: 'wp_6', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit2', targetPortId: 'k', state: true },
    { id: 'wp_7', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit3', targetPortId: 'j', state: true },
    { id: 'wp_8', sourceNodeId: 'vcc_source', sourcePortId: 'out', targetNodeId: 'ff_bit3', targetPortId: 'k', state: true },
    { id: 'wc_0', sourceNodeId: 'master_clk', sourcePortId: 'out', targetNodeId: 'ff_bit0', targetPortId: 'clk', state: false },
    { id: 'wc_1', sourceNodeId: 'ff_bit0', sourcePortId: 'nq', targetNodeId: 'ff_bit1', targetPortId: 'clk', state: false },
    { id: 'wc_2', sourceNodeId: 'ff_bit1', sourcePortId: 'nq', targetNodeId: 'ff_bit2', targetPortId: 'clk', state: false },
    { id: 'wc_3', sourceNodeId: 'ff_bit2', sourcePortId: 'nq', targetNodeId: 'ff_bit3', targetPortId: 'clk', state: false },
    { id: 'wh_1', sourceNodeId: 'ff_bit0', sourcePortId: 'q', targetNodeId: 'hex_disp', targetPortId: 'in1', state: false },
    { id: 'wh_2', sourceNodeId: 'ff_bit1', sourcePortId: 'q', targetNodeId: 'hex_disp', targetPortId: 'in2', state: false },
    { id: 'wh_3', sourceNodeId: 'ff_bit2', sourcePortId: 'q', targetNodeId: 'hex_disp', targetPortId: 'in4', state: false },
    { id: 'wh_4', sourceNodeId: 'ff_bit3', sourcePortId: 'q', targetNodeId: 'hex_disp', targetPortId: 'in8', state: false },
    { id: 'wl_0', sourceNodeId: 'master_clk', sourcePortId: 'out', targetNodeId: 'logic_not', targetPortId: 'in', state: false },
    { id: 'wl_1', sourceNodeId: 'logic_not', sourcePortId: 'out', targetNodeId: 'led_beat', targetPortId: 'in', state: false },
    { id: 'wl_2', sourceNodeId: 'ff_bit0', sourcePortId: 'q', targetNodeId: 'logic_and', targetPortId: 'in1', state: false },
    { id: 'wl_3', sourceNodeId: 'ff_bit2', sourcePortId: 'q', targetNodeId: 'logic_and', targetPortId: 'in2', state: false },
    { id: 'wl_4', sourceNodeId: 'logic_and', sourcePortId: 'out', targetNodeId: 'led_sync', targetPortId: 'in', state: false },
    { id: 'wl_5', sourceNodeId: 'ff_bit1', sourcePortId: 'q', targetNodeId: 'logic_xor', targetPortId: 'in1', state: false },
    { id: 'wl_6', sourceNodeId: 'ff_bit3', sourcePortId: 'q', targetNodeId: 'logic_xor', targetPortId: 'in2', state: false },
    { id: 'wl_7', sourceNodeId: 'logic_xor', sourcePortId: 'out', targetNodeId: 'led_pari', targetPortId: 'in', state: false },
  ],
  scale: 0.85, 
  offset: { x: 50, y: 50 },
  selectedId: null
};

const EMPTY_CIRCUIT: CircuitState = {
    nodes: [],
    wires: [],
    scale: 1,
    offset: { x: 50, y: 50 },
    selectedId: null
};

interface ArchivedSession {
    id: number;
    timestamp: number;
    preview: string;
    state: CircuitState;
}

const App: React.FC = () => {
  const [circuitState, setCircuitState] = useState<CircuitState>(EMPTY_CIRCUIT);
  const [history, setHistory] = useState<CircuitState[]>([]);
  const [future, setFuture] = useState<CircuitState[]>([]);
  const [archivedSessions, setArchivedSessions] = useState<ArchivedSession[]>([]);
  
  const [isSimulating, setIsSimulating] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [truthTable, setTruthTable] = useState<TruthTableRow[] | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [wireStyle, setWireStyle] = useState<'curved' | 'straight'>('curved');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [wireColor, setWireColor] = useState<string>('#f59e0b');
  
  // Modals & Keys
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState('');
  const [keyStatus, setKeyStatus] = useState<'none' | 'validating' | 'valid' | 'invalid'>('none');

  // Initialization Logic
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // 1. Load API Key
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        setApiKey(storedKey);
        setTempKey(storedKey);
        setKeyStatus('valid'); 
    }

    // 2. Load Session History
    const storedHistory = localStorage.getItem('nexus_session_archives');
    if (storedHistory) {
        try {
            setArchivedSessions(JSON.parse(storedHistory));
        } catch (e) { console.error("History parse error", e); }
    }

    // 3. Smart Load Strategy
    const hasVisited = localStorage.getItem('nexus_has_visited');
    const autoSaved = localStorage.getItem('nexus_autosave');

    if (autoSaved) {
        // Returning user with unsaved work -> Restore it
        try {
            setCircuitState(JSON.parse(autoSaved));
            setAiMessage("Session Restored from Auto-Save.");
            setTimeout(() => setAiMessage(null), 3000);
        } catch (e) {
            setCircuitState(EMPTY_CIRCUIT);
        }
    } else if (!hasVisited) {
        // First time ever -> Show WOW circuit
        setCircuitState(DEFAULT_CIRCUIT);
        localStorage.setItem('nexus_has_visited', 'true');
    } else {
        // Returning user, no auto-save -> Clean Slate
        setCircuitState(EMPTY_CIRCUIT);
    }
  }, []);

  // Auto-Save Logic
  useEffect(() => {
      const timer = setTimeout(() => {
          if (circuitState.nodes.length > 0) {
            localStorage.setItem('nexus_autosave', JSON.stringify(circuitState));
          }
      }, 1000); // Debounce 1s
      return () => clearTimeout(timer);
  }, [circuitState]);

  // --- Undo / Redo Logic ---
  const commitState = () => {
    setHistory(prev => [...prev, circuitState]);
    setFuture([]); 
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture(prev => [circuitState, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    setCircuitState(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(prev => [...prev, circuitState]);
    setFuture(prev => prev.slice(1));
    setCircuitState(next);
  };

  const isValidKeyFormat = (key: string) => {
      const trimmed = key.trim();
      return trimmed.length > 20 && (trimmed.startsWith('AIza') || trimmed.startsWith('sk-'));
  };

  const testConnection = async () => {
      if (!isValidKeyFormat(tempKey)) {
          setKeyStatus('invalid');
          return;
      }
      setKeyStatus('validating');
      const isValid = await validateConnection(tempKey);
      setKeyStatus(isValid ? 'valid' : 'invalid');
      if (isValid) {
          localStorage.setItem('gemini_api_key', tempKey);
          setApiKey(tempKey);
      }
  };

  const saveApiKey = () => {
      localStorage.setItem('gemini_api_key', tempKey);
      setApiKey(tempKey);
      setShowApiKeyModal(false);
  };

  const clearApiKey = () => {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
      setTempKey('');
      setKeyStatus('none');
  };

  // Archive current session before destroying it
  const archiveSession = () => {
      if (circuitState.nodes.length === 0) return; // Don't archive empty

      const newArchive: ArchivedSession = {
          id: Date.now(),
          timestamp: Date.now(),
          preview: `${circuitState.nodes.length} Components, ${circuitState.wires.length} Wires`,
          state: circuitState
      };
      
      const updatedArchives = [newArchive, ...archivedSessions].slice(0, 3); // Keep last 3
      setArchivedSessions(updatedArchives);
      localStorage.setItem('nexus_session_archives', JSON.stringify(updatedArchives));
  };

  const loadTemplate = (templateKey: string) => {
      archiveSession(); // Safety save
      commitState(); // Undo save
      const template = CIRCUIT_EXAMPLES[templateKey];
      if (template) {
          setCircuitState(template.state);
          setShowTemplatesModal(false);
          setWireStyle('straight');
          setAiMessage(`Library Module Loaded: ${template.name}`);
          setTimeout(() => setAiMessage(null), 3000);
      }
  };

  const restoreSession = (session: ArchivedSession) => {
      archiveSession(); // Save current before restoring old
      commitState();
      setCircuitState(session.state);
      setShowHistoryModal(false);
      setAiMessage("Historical Session Restored.");
      setTimeout(() => setAiMessage(null), 3000);
  }

  const toggleTheme = () => {
      if (theme === 'dark') {
          setTheme('light');
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
      } else {
          setTheme('dark');
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
      }
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

          // Undo: Ctrl+Z
          if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
             e.preventDefault();
             handleUndo();
          }
          // Redo: Ctrl+Y or Ctrl+Shift+Z
          if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
             e.preventDefault();
             handleRedo();
          }

          if ((e.key === 'Delete' || e.key === 'Backspace') && circuitState.selectedId) {
              commitState();
              setCircuitState(prev => ({
                  ...prev,
                  nodes: prev.nodes.filter(n => n.id !== prev.selectedId),
                  wires: prev.wires.filter(w => w.id !== prev.selectedId && w.sourceNodeId !== prev.selectedId && w.targetNodeId !== prev.selectedId),
                  selectedId: null
              }));
          }

          if ((e.key === 'r' || e.key === 'R') && circuitState.selectedId) {
             commitState();
             setCircuitState(prev => ({
                 ...prev,
                 nodes: prev.nodes.map(n => n.id === prev.selectedId ? { ...n, rotation: (n.rotation + 90) % 360 } : n)
             }));
          }

          if (e.key === ' ') {
              e.preventDefault(); 
              setIsSimulating(prev => !prev);
          }

          if (e.key === 'Escape') {
             setCircuitState(prev => ({ ...prev, selectedId: null }));
             setShowApiKeyModal(false);
             setShowHelp(false);
             setShowTemplatesModal(false);
             setTruthTable(null);
             setShowClearConfirm(false);
             setShowHistoryModal(false);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [circuitState.selectedId, history, future, circuitState]);

  const handleGenerate = async (prompt: string) => {
    if (!apiKey && !process.env.API_KEY) {
        setShowApiKeyModal(true);
        return;
    }
    commitState();
    setIsProcessing(true);
    setAiMessage("Architecting system logic...");
    try {
      const result = await generateCircuit(prompt, apiKey);
      if (result) {
        setCircuitState(prev => ({
          ...prev,
          nodes: result.nodes.map(n => ({...n, rotation: 0, data: {}})),
          wires: result.wires.map(w => ({...w, state: false})),
          offset: { x: 100, y: 100 },
          scale: 1
        }));
        setAiMessage(`Blueprint generated: ${result.description}`);
      }
    } catch (error) {
      setAiMessage("System Error: Could not generate circuit. Check API Key.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setAiMessage(null), 5000);
    }
  };

  const handleExplain = async () => {
    if (circuitState.nodes.length === 0) {
        setAiMessage("Void Canvas: Initialize components to begin analysis.");
        setTimeout(() => setAiMessage(null), 3000);
        return;
    }
    if (!apiKey && !process.env.API_KEY) {
        setShowApiKeyModal(true);
        return;
    }
    setIsProcessing(true);
    setAiMessage("Running logic diagnostics...");
    try {
      const explanation = await explainCircuit(circuitState, apiKey);
      setAiMessage(null); 
      alert(explanation); 
    } catch (error) {
      setAiMessage("Analysis Failed. Verify Key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = () => {
    const inputs = circuitState.nodes.filter(n => n.type === 'SWITCH');
    const outputs = circuitState.nodes.filter(n => ['LED', 'HEX'].includes(n.type));
    const memory = circuitState.nodes.filter(n => ['D_FF', 'JK_FF'].includes(n.type));

    if (memory.length > 0) {
        setAiMessage("Simulation Only: Truth Table is not available for Memory/Flip-Flops circuits.");
        setTimeout(() => setAiMessage(null), 5000);
        return;
    }
    if (inputs.length === 0 || outputs.length === 0) {
        setAiMessage("Incomplete Circuit: Add a Switch and an LED to generate data.");
        setTimeout(() => setAiMessage(null), 4000);
        return;
    }
    if (inputs.length > 6) {
         setAiMessage("Warning: High complexity. Input limit (>6) exceeded for auto-analysis.");
         setTimeout(() => setAiMessage(null), 4000);
         return;
    }

    setIsProcessing(true);
    setAiMessage(`Computing ${Math.pow(2, inputs.length)} logic states...`);

    setTimeout(() => {
        const rows: TruthTableRow[] = [];
        const combinations = Math.pow(2, inputs.length);
        for (let i = 0; i < combinations; i++) {
            const inputState: Record<string, boolean> = {};
            inputs.forEach((input, index) => {
                const isOn = ((i >> index) & 1) === 1;
                inputState[input.id] = isOn;
            });
            const nodeStates: Record<string, Record<string, boolean>> = {};
            circuitState.nodes.forEach(node => {
                if(!nodeStates[node.id]) nodeStates[node.id] = {};
                if(inputState[node.id] !== undefined) nodeStates[node.id]['out'] = inputState[node.id];
            });
            for(let step=0; step<10; step++) {
                 circuitState.nodes.forEach(node => {
                    const getIn = (pid: string) => {
                         const wire = circuitState.wires.find(w => w.targetNodeId === node.id && w.targetPortId === pid);
                         if(!wire) return false;
                         return nodeStates[wire.sourceNodeId]?.[wire.sourcePortId] || false;
                    };
                    let outVal = false;
                    if (node.type === 'AND') outVal = getIn('in1') && getIn('in2');
                    else if (node.type === 'OR') outVal = getIn('in1') || getIn('in2');
                    else if (node.type === 'XOR') outVal = getIn('in1') !== getIn('in2');
                    else if (node.type === 'NAND') outVal = !(getIn('in1') && getIn('in2'));
                    else if (node.type === 'NOR') outVal = !(getIn('in1') || getIn('in2'));
                    else if (node.type === 'XNOR') outVal = getIn('in1') === getIn('in2');
                    else if (node.type === 'NOT') outVal = !getIn('in');
                    else if (node.type === 'MUX') outVal = getIn('sel') ? getIn('d1') : getIn('d0');

                    if(['AND','OR','XOR','NAND','NOR','XNOR','NOT','MUX'].includes(node.type)) {
                        nodeStates[node.id]['out'] = outVal;
                    }
                    if(node.type === 'LED') nodeStates[node.id]['active'] = getIn('in');
                 });
            }
            const outputState: Record<string, boolean> = {};
            outputs.forEach(out => {
                if(out.type === 'LED') outputState[out.id] = nodeStates[out.id]['active'];
            });
            rows.push({ inputs: inputState, outputs: outputState });
        }
        setTruthTable(rows);
        setIsProcessing(false);
        setAiMessage(null);
    }, 100);
  };

  const handleSave = () => {
      const data = JSON.stringify(circuitState);
      const blob = new Blob([data], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_circuit_${Date.now()}.json`;
      a.click();
      setAiMessage("Project Saved to Local Drive.");
      setTimeout(() => setAiMessage(null), 3000);
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      archiveSession(); // Archive before overwrite
      const reader = new FileReader();
      reader.onload = (ev) => {
          try {
              const state = JSON.parse(ev.target?.result as string);
              commitState();
              setCircuitState(state);
              setAiMessage("Project Loaded Successfully.");
          } catch(err) {
              setAiMessage("Error: Corrupt project file.");
          }
          setTimeout(() => setAiMessage(null), 3000);
      };
      reader.readAsText(file);
  };

  const confirmClear = () => {
     archiveSession(); // Archive before clear
     commitState();
     setCircuitState(EMPTY_CIRCUIT);
     // Clear the autosave too since user explicitly wanted empty
     localStorage.removeItem('nexus_autosave');
     setShowClearConfirm(false);
     setAiMessage("Canvas Purged. Previous state archived.");
     setTimeout(() => setAiMessage(null), 3000);
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans selection:bg-amber-500/30 ${theme === 'dark' ? 'bg-[#09090b] text-zinc-200' : 'bg-white text-zinc-900'}`}>
      <TopBar 
        onGenerate={handleGenerate} 
        onExplain={handleExplain}
        onAnalyze={handleAnalyze}
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={() => setShowClearConfirm(true)}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        isProcessing={isProcessing}
        onZoomIn={() => setCircuitState(s => ({...s, scale: Math.min(s.scale + 0.1, 3)}))}
        onZoomOut={() => setCircuitState(s => ({...s, scale: Math.max(s.scale - 0.1, 0.2)}))}
        onResetView={() => setCircuitState(s => ({...s, scale: 1, offset: {x: 50, y: 50}}))}
        onOpenHelp={() => setShowHelp(true)}
        onOpenSettings={() => setShowApiKeyModal(true)}
        onOpenTemplates={() => setShowTemplatesModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        wireStyle={wireStyle}
        onToggleWireStyle={() => setWireStyle(prev => prev === 'curved' ? 'straight' : 'curved')}
        theme={theme}
        onToggleTheme={toggleTheme}
        wireColor={wireColor}
        onSetWireColor={setWireColor}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
      />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 relative overflow-hidden flex flex-col shadow-inner shadow-black/10 dark:shadow-black/50">
            <Canvas 
                state={circuitState} 
                onStateChange={setCircuitState}
                isSimulating={isSimulating}
                wireStyle={wireStyle}
                theme={theme}
                wireColor={wireColor}
                onCommit={commitState}
            />
            
            {aiMessage && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-xl w-full px-4 z-50 pointer-events-none">
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-200 p-4 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-amber-500 animate-pulse shadow-sm" />
                        <span className="text-xs font-mono tracking-wide uppercase text-zinc-500 dark:text-zinc-400">System:</span>
                        <div className="text-sm font-medium leading-relaxed">
                            {aiMessage}
                        </div>
                    </div>
                </div>
            )}

            {showClearConfirm && (
                 <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#09090b] border border-red-200 dark:border-red-900/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 bg-red-50 dark:bg-red-900/10 flex items-center gap-4 border-b border-red-100 dark:border-red-900/30">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-900 dark:text-red-500">System Purge</h3>
                                <p className="text-xs text-red-700 dark:text-red-400">Irreversible Action</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                                Are you sure you want to delete all components and wires? 
                                <br/><br/>
                                <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 p-1 rounded text-zinc-500">Note: A backup snapshot will be saved to History.</span>
                            </p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={confirmClear} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-colors">
                                    Confirm Purge
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {showHistoryModal && (
                 <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-full">
                         <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                             <h2 className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-2">
                                <History className="text-indigo-600 dark:text-amber-500 w-5 h-5" />
                                SESSION ARCHIVES
                             </h2>
                             <button onClick={() => setShowHistoryModal(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                 <X size={20} />
                             </button>
                         </div>
                         <div className="p-6 overflow-y-auto space-y-4">
                             {archivedSessions.length === 0 ? (
                                 <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 font-mono text-sm">
                                     No archival history found.
                                 </div>
                             ) : (
                                 archivedSessions.map((session) => (
                                     <div key={session.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-indigo-500 dark:hover:border-amber-500 transition-colors">
                                         <div>
                                             <div className="flex items-center gap-2 mb-1">
                                                 <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-amber-500" />
                                                 <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                                                     {new Date(session.timestamp).toLocaleString()}
                                                 </span>
                                             </div>
                                             <div className="text-sm font-bold text-zinc-900 dark:text-white">
                                                 {session.preview}
                                             </div>
                                         </div>
                                         <button 
                                            onClick={() => restoreSession(session)}
                                            className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium hover:bg-indigo-50 dark:hover:bg-amber-900/20 text-indigo-600 dark:text-amber-500 transition-colors"
                                         >
                                             Restore
                                         </button>
                                     </div>
                                 ))
                             )}
                         </div>
                         <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 font-mono text-center">
                             Stores last 3 cleared sessions automatically.
                         </div>
                    </div>
                 </div>
            )}

            {showTemplatesModal && (
                 <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-full">
                         <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                             <h2 className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="text-indigo-600 dark:text-amber-500 w-5 h-5" />
                                SCHEMATICS LIBRARY
                             </h2>
                             <button onClick={() => setShowTemplatesModal(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                 <X size={20} />
                             </button>
                         </div>
                         <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                             {Object.entries(CIRCUIT_EXAMPLES).map(([key, template]) => (
                                 <div 
                                    key={key}
                                    onClick={() => loadTemplate(key)}
                                    className="group relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 cursor-pointer hover:border-indigo-500 dark:hover:border-amber-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                 >
                                     <div className="flex justify-between items-start mb-2">
                                         <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-amber-900/30 transition-colors">
                                            <LayoutTemplate className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-amber-500" />
                                         </div>
                                         <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-500 dark:group-hover:text-amber-500 transition-colors" />
                                     </div>
                                     <h3 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">{template.name}</h3>
                                     <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{template.description}</p>
                                 </div>
                             ))}
                         </div>
                    </div>
                 </div>
            )}

            {showApiKeyModal && (
                 <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative">
                         <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                             <h2 className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-2">
                                <Server className="text-indigo-600 dark:text-amber-500 w-5 h-5" />
                                CLOUD CONNECTION MANAGER
                             </h2>
                             <button onClick={() => setShowApiKeyModal(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                 <X size={20} />
                             </button>
                         </div>
                         <div className="p-8">
                             <div className="grid grid-cols-2 gap-4 mb-6">
                                 <div>
                                     <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Provider</label>
                                     <div className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium flex items-center justify-between cursor-not-allowed opacity-75">
                                         Google Gemini (Recommended)
                                         <ShieldCheck className="w-4 h-4 text-green-500" />
                                     </div>
                                 </div>
                                 <div>
                                     <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Model Version</label>
                                     <div className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium cursor-not-allowed opacity-75">
                                         gemini-2.5-flash
                                     </div>
                                 </div>
                             </div>

                             <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">API Credential Key</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="password" 
                                            value={tempKey}
                                            onChange={(e) => { setTempKey(e.target.value); setKeyStatus('none'); }}
                                            placeholder={apiKey ? "••••••••••••••••" : "AIza... or sk-..."}
                                            className="flex-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-500"
                                        />
                                        <button 
                                            onClick={testConnection}
                                            disabled={!tempKey || keyStatus === 'validating'}
                                            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors whitespace-nowrap"
                                        >
                                            {keyStatus === 'validating' ? 'Checking...' : 'Verify'}
                                        </button>
                                    </div>
                                    {keyStatus === 'valid' && (
                                        <div className="flex items-center gap-2 mt-2 text-xs text-green-600 dark:text-green-500 font-medium animate-in slide-in-from-top-1">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Connection Verified • Ready for Transmission
                                        </div>
                                    )}
                                    {keyStatus === 'invalid' && (
                                        <div className="flex items-center gap-2 mt-2 text-xs text-red-600 dark:text-red-500 font-medium animate-in slide-in-from-top-1">
                                            <XCircle className="w-3.5 h-3.5" /> Invalid Key Format (Check AIza... or sk-...)
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                    <strong>Why Gemini?</strong> NEXUS is optimized for Gemini's structured output. It offers a generous <strong>Free Tier</strong> (15 req/min) ideal for students.
                                    <br/>
                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-amber-500 hover:underline block mt-1">
                                        → Generate Free Key at Google AI Studio
                                    </a>
                                </div>
                             </div>

                             <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                {apiKey && (
                                    <button 
                                        onClick={clearApiKey}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mr-auto"
                                    >
                                        Disconnect
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowApiKeyModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={saveApiKey}
                                    disabled={!tempKey || keyStatus !== 'valid'}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 dark:bg-amber-600 hover:bg-indigo-700 dark:hover:bg-amber-700 text-white shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Configuration
                                </button>
                             </div>
                         </div>
                    </div>
                 </div>
            )}

            {showHelp && (
                 <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative">
                         <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                             <h2 className="text-lg font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-2">
                                <Keyboard className="text-indigo-600 dark:text-amber-500 w-5 h-5" />
                                OPERATIONS MANUAL
                             </h2>
                             <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                 <X size={20} />
                             </button>
                         </div>
                         <div className="p-8 grid grid-cols-2 gap-8 text-sm">
                             <div className="space-y-4">
                                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Mouse Controls</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                        <MousePointer2 className="w-5 h-5 text-zinc-700 dark:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-zinc-900 dark:text-white font-medium">Drag & Drop</div>
                                        <div className="text-zinc-500 text-xs">Drag components from sidebar</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                        <GitCommitHorizontal className="w-5 h-5 text-zinc-700 dark:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-zinc-900 dark:text-white font-medium">ADHD/OCD Mode</div>
                                        <div className="text-zinc-500 text-xs">Toggle Clean/Curved wires</div>
                                    </div>
                                </div>
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                        <Move className="w-5 h-5 text-zinc-700 dark:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-zinc-900 dark:text-white font-medium">Pan & Zoom</div>
                                        <div className="text-zinc-500 text-xs">Middle-click to pan, Scroll to zoom</div>
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Keyboard Shortcuts</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                     <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                         <span className="text-zinc-500">Rotate</span>
                                         <kbd className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white">R</kbd>
                                     </div>
                                     <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                         <span className="text-zinc-500">Delete</span>
                                         <kbd className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white">Del</kbd>
                                     </div>
                                     <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                         <span className="text-zinc-500">Undo/Redo</span>
                                         <kbd className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white">Ctrl+Z</kbd>
                                     </div>
                                     <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                                         <span className="text-zinc-500">Simulate</span>
                                         <kbd className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono text-zinc-900 dark:text-white">Spc</kbd>
                                     </div>
                                </div>
                                
                                <div className="mt-8 p-4 bg-indigo-50 dark:bg-amber-500/10 border border-indigo-200 dark:border-amber-500/20 rounded-lg">
                                    <p className="text-[10px] text-indigo-600 dark:text-amber-500 font-mono text-center">
                                        NEXUS | LOGIC ARCHITECT v2.5
                                        <br/>
                                        Open Source Educational Tool
                                    </p>
                                </div>
                             </div>
                         </div>
                    </div>
                 </div>
            )}

            {truthTable && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-700 w-full max-w-4xl max-h-full rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
                         <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                             <div>
                                <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-white flex items-center gap-3">
                                    <div className="w-2 h-2 bg-indigo-500 dark:bg-amber-500 rounded-full shadow-sm" />
                                    LOGIC ANALYSIS TERMINAL
                                </h2>
                                <p className="text-xs text-zinc-500 font-mono mt-1 uppercase tracking-widest">Combinatorial Truth Table</p>
                             </div>
                             <button onClick={() => setTruthTable(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                 <X size={20} />
                             </button>
                         </div>
                         <div className="flex-1 overflow-auto p-6 dark:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:bg-opacity-20 bg-white">
                             <table className="w-full text-left border-collapse font-mono text-sm">
                                 <thead>
                                     <tr className="border-b border-zinc-200 dark:border-zinc-700">
                                         {Object.keys(truthTable[0].inputs).map((id, idx) => (
                                             <th key={id} className="pb-4 text-zinc-500 dark:text-zinc-400 font-medium">
                                                 INPUT {idx} 
                                                 <span className="text-[10px] ml-1 text-zinc-400 dark:text-zinc-600 block">ID: {id.slice(-4)}</span>
                                             </th>
                                         ))}
                                         <th className="w-8 border-r border-zinc-200 dark:border-zinc-800"></th>
                                         <th className="w-8"></th>
                                         {Object.keys(truthTable[0].outputs).map((id, idx) => (
                                             <th key={id} className="pb-4 text-indigo-600 dark:text-amber-400 font-medium">
                                                 OUTPUT {idx}
                                                 <span className="text-[10px] ml-1 text-indigo-600/50 dark:text-amber-500/50 block">ID: {id.slice(-4)}</span>
                                             </th>
                                         ))}
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {truthTable.map((row, i) => (
                                         <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                             {Object.values(row.inputs).map((val, j) => (
                                                 <td key={j} className={`py-3 ${val ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                                     {val ? '1' : '0'}
                                                 </td>
                                             ))}
                                             <td className="border-r border-zinc-200 dark:border-zinc-800"></td>
                                             <td></td>
                                             {Object.values(row.outputs).map((val, j) => (
                                                 <td key={j} className={`py-3 ${val ? 'text-indigo-600 dark:text-amber-400 font-bold dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-zinc-500 dark:text-zinc-700'}`}>
                                                     {val ? 'HIGH' : 'LOW'}
                                                 </td>
                                             ))}
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                         <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 font-mono text-center">
                             GENERATED BY NEXUS ENGINE // {new Date().toLocaleTimeString()}
                         </div>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;