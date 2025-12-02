import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Play, Sparkles, Wand2, Zap, ZoomIn, ZoomOut, Maximize, Table2, Save, Upload, HelpCircle, PanelLeftClose, PanelLeftOpen, Cable, GitCommitHorizontal, Sun, Moon, Palette, MoreVertical, Trash2, FileDown, FileUp, Settings, BookOpen, RotateCcw, RotateCw } from 'lucide-react';

interface TopBarProps {
  onGenerate: (prompt: string) => void;
  onExplain: () => void;
  onAnalyze: () => void;
  onSave: () => void;
  onLoad: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  isProcessing: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  wireStyle: 'curved' | 'straight';
  onToggleWireStyle: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  wireColor: string;
  onSetWireColor: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onGenerate, 
  onExplain, 
  onAnalyze,
  onSave,
  onLoad,
  onClear,
  isSimulating, 
  onToggleSimulation,
  isProcessing,
  onZoomIn,
  onZoomOut,
  onResetView,
  onOpenHelp,
  onOpenSettings,
  onOpenTemplates,
  isSidebarOpen,
  onToggleSidebar,
  wireStyle,
  onToggleWireStyle,
  theme,
  onToggleTheme,
  wireColor,
  onSetWireColor,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const [prompt, setPrompt] = useState('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const promptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const colors = [
    { name: 'Royal Gold', value: '#f59e0b' },
    { name: 'Cyber Cyan', value: '#06b6d4' },
    { name: 'Neon Purple', value: '#d946ef' },
    { name: 'Matrix Green', value: '#22c55e' },
    { name: 'Crimson Red', value: '#ef4444' },
    { name: 'Pure White', value: '#ffffff' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (promptRef.current && !promptRef.current.contains(event.target as Node)) {
        setIsPromptOpen(false);
      }
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setIsPaletteOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isPromptOpen || isPaletteOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (isPromptOpen) setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPromptOpen, isPaletteOpen, isMenuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      setIsPromptOpen(false);
      setPrompt('');
    }
  };

  return (
    <div className="h-16 border-b border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl flex items-center px-4 fixed top-0 left-0 right-0 z-50 shadow-sm dark:shadow-2xl transition-all duration-300">
      
      {/* Scrollable Container for Small Screens */}
      <div className="w-full flex items-center justify-between overflow-x-auto no-scrollbar gap-4 min-w-0">
        
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Sidebar Toggle */}
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
            title={isSidebarOpen ? "Collapse Sidebar (Focus Mode)" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={onOpenHelp}>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg blur opacity-0 dark:opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <Cpu className="text-indigo-600 dark:text-amber-500 w-5 h-5" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none font-mono">NEXUS</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono tracking-[0.2em] uppercase mt-1">Logic Architect 2.5</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-200 dark:border-white/5 flex-shrink-0">
          <button
            onClick={onToggleSimulation}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs tracking-wider uppercase transition-all duration-300
              ${isSimulating 
                ? 'bg-indigo-600 dark:bg-amber-600 text-white shadow-lg dark:shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:hover:text-white'}
            `}
          >
            {isSimulating ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSimulating ? 'Running' : 'Simulate'}</span>
          </button>

          <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>

          {/* Quick Actions (Undo/Redo/Clear) */}
          <div className="flex items-center gap-1">
            <button 
              onClick={onUndo} 
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${!canUndo ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:hover:text-white'}`}
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={onRedo}
              disabled={!canRedo} 
              className={`p-2 rounded-lg transition-colors ${!canRedo ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:hover:text-white'}`}
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button 
              onClick={onClear} 
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>

          {/* View Controls */}
          <div className="flex items-center">
             <button 
              onClick={onToggleWireStyle} 
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs font-bold
                ${wireStyle === 'straight' 
                  ? 'text-indigo-600 dark:text-amber-500 bg-indigo-50 dark:bg-zinc-800' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white'}
              `}
              title="Clean Wire Routing (Great for ADHD/OCD focus)"
            >
              {wireStyle === 'straight' ? <GitCommitHorizontal className="w-4 h-4" /> : <Cable className="w-4 h-4" />}
              <span className="hidden xl:inline">ADHD/OCD MODE</span>
            </button>
            
            <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>
            
            <button onClick={onZoomOut} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={onResetView} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
            <button onClick={onZoomIn} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplates}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-colors text-xs font-medium uppercase tracking-wide border border-transparent hover:border-indigo-500/30 dark:hover:border-amber-500/30"
              title="Circuit Examples Library"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-500" />
              <span className="hidden lg:inline">Templates</span>
            </button>

             <button
              onClick={onAnalyze}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-colors text-xs font-medium uppercase tracking-wide border border-transparent hover:border-indigo-500/30 dark:hover:border-amber-500/30"
            >
              <Table2 className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-500" />
              <span className="hidden lg:inline">Table</span>
            </button>

            <button
              onClick={onExplain}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-colors text-xs font-medium uppercase tracking-wide"
            >
              <span className="hidden lg:inline">Explain</span>
              <span className="lg:hidden">AI</span>
            </button>

            <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-800 mx-1"></div>

            <div className="relative" ref={promptRef}>
              {isPromptOpen ? (
                <form onSubmit={handleSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 w-72 md:w-96 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl flex p-1.5 animate-in fade-in slide-in-from-right-4 duration-200 z-50">
                  <input
                    ref={inputRef}
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe circuit..."
                    className="flex-1 bg-transparent border-none text-xs font-mono text-zinc-900 dark:text-white px-3 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600"
                  />
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="bg-indigo-600 dark:bg-amber-600 hover:bg-indigo-500 dark:hover:bg-amber-500 text-white p-2 rounded-lg transition-colors"
                  >
                    {isProcessing ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsPromptOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-500 text-zinc-900 dark:text-white transition-all text-xs font-medium uppercase tracking-wide shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-amber-500" />
                  <span className="hidden md:inline">AI Build</span>
                </button>
              )}
            </div>

          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
           {theme === 'dark' && (
              <div className="relative" ref={paletteRef}>
                  <button 
                    onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                    className="p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                     <Palette className="w-4 h-4" style={{ color: wireColor }} />
                  </button>
                  
                  {isPaletteOpen && (
                    <div className="fixed top-16 right-16 z-[100] bg-zinc-900 border border-zinc-700 p-2 rounded-xl shadow-2xl grid grid-cols-3 gap-2 w-32 animate-in fade-in zoom-in-95 duration-100">
                        {colors.map(c => (
                           <button
                             key={c.value}
                             onClick={() => { onSetWireColor(c.value); setIsPaletteOpen(false); }}
                             className="w-8 h-8 rounded-full border border-zinc-700 hover:scale-110 transition-transform"
                             style={{ backgroundColor: c.value, boxShadow: `0 0 10px ${c.value}40` }}
                             title={c.name}
                           />
                        ))}
                    </div>
                  )}
              </div>
           )}

           <button onClick={onToggleTheme} className="p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
               {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>
           
           <div className="relative" ref={menuRef}>
               <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ${isMenuOpen ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
               >
                  <MoreVertical className="w-4 h-4" />
               </button>

               {isMenuOpen && (
                   <div className="fixed top-16 right-4 z-[100] w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col p-1">
                       <button onClick={() => { onSave(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                           <FileDown className="w-4 h-4" /> Save Project
                       </button>
                       <label className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer">
                           <FileUp className="w-4 h-4" /> Load Project
                           <input type="file" accept=".json" onChange={(e) => { onLoad(e); setIsMenuOpen(false); }} className="hidden" />
                       </label>
                       <button onClick={() => { onOpenTemplates(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                           <BookOpen className="w-4 h-4" /> Library
                       </button>
                       <button onClick={() => { onOpenHelp(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                           <HelpCircle className="w-4 h-4" /> Help / Manual
                       </button>
                       <button onClick={() => { onOpenSettings(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                           <Settings className="w-4 h-4" /> Configuration
                       </button>
                   </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;