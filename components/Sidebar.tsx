import React, { useState } from 'react';
import { COMPONENT_DEFINITIONS } from '../constants';
import { Triangle, Component, ToggleLeft, Lightbulb, Clock, BoxSelect, CircleDot, MemoryStick, GitMerge, Cpu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const IconMap: Record<string, React.FC<any>> = {
  Triangle,
  Component,
  ToggleLeft,
  Lightbulb,
  Clock,
  BoxSelect,
  CircleDot,
  MemoryStick,
  GitMerge,
  Cpu
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [activeTab, setActiveTab] = useState<'gate' | 'memory' | 'source' | 'output' | 'complex'>('gate');

  const onDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const tabs = [
    { id: 'gate', label: 'Logic' },
    { id: 'memory', label: 'Mem' },
    { id: 'complex', label: 'IC' },
    { id: 'source', label: 'In' },
    { id: 'output', label: 'Out' },
  ];

  return (
    <aside 
      className={`
        bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-white/10 flex flex-col h-full pt-20 pb-6 relative z-40 shadow-xl dark:shadow-2xl transition-all duration-500 ease-in-out
        ${isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden border-none'}
      `}
    >
      <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-200' : 'opacity-0'}`}>
        {/* Tabs */}
        <div className="px-4 mb-6 whitespace-nowrap">
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-white/5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm dark:shadow-lg ring-1 ring-black/5 dark:ring-white/5' 
                    : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 flex-1 overflow-y-auto custom-scrollbar h-[calc(100vh-250px)]">
          <div className="grid grid-cols-2 gap-3 pb-20">
            {Object.values(COMPONENT_DEFINITIONS)
              .filter(c => c.category === activeTab)
              .map((component) => {
                const Icon = IconMap[component.icon] || Component;
                return (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, component.type)}
                    className="
                      group relative flex flex-col items-center justify-center gap-3 p-4 
                      bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-xl cursor-grab active:cursor-grabbing
                      hover:bg-indigo-50 dark:hover:bg-zinc-800/50 hover:border-indigo-500/30 dark:hover:border-amber-500/30 
                      hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]
                      transition-all duration-300
                    "
                  >
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/50 dark:group-hover:border-amber-500/50 transition-colors">
                      <Icon className="w-5 h-5 text-zinc-500 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-amber-400 transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 font-bold font-mono text-center truncate w-full">
                      {component.name}
                    </span>
                    
                    {/* Hover Tech lines */}
                    <div className="absolute top-0 left-0 w-2 h-[1px] bg-transparent group-hover:bg-indigo-500/50 dark:group-hover:bg-amber-500/50 transition-colors" />
                    <div className="absolute top-0 left-0 h-2 w-[1px] bg-transparent group-hover:bg-indigo-500/50 dark:group-hover:bg-amber-500/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-transparent group-hover:bg-indigo-500/50 dark:group-hover:bg-amber-500/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 h-2 w-[1px] bg-transparent group-hover:bg-indigo-500/50 dark:group-hover:bg-amber-500/50 transition-colors" />
                  </div>
                );
              })}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5">
            <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
               <span className="text-indigo-600 dark:text-amber-500">PRO TIP:</span> Toggle "ADHD/OCD Mode" in toolbar for neat 90° wires.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;