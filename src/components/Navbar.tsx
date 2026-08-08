import React from 'react';
import { Terminal, Cpu, Layers, Play, Code2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'drafts' | 'architecture' | 'executions' | 'deployments';
  setActiveTab: (tab: 'drafts' | 'architecture' | 'executions' | 'deployments') => void;
  agentCount: number;
  onRunTerminalClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  agentCount,
  onRunTerminalClick,
}) => {
  return (
    <nav className="h-20 border-b border-gray-200 flex items-center justify-between px-6 lg:px-12 bg-white select-none transition-all">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-3.5 cursor-pointer group"
        onClick={() => setActiveTab('drafts')}
      >
        <div className="w-8 h-8 bg-black rounded-sm rotate-45 flex items-center justify-center transition-transform group-hover:rotate-90 duration-300">
          <div className="w-2.5 h-2.5 bg-white -rotate-45" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tighter text-black leading-none">
            AXON.OS
          </span>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono mt-0.5">
            Agent Synthesis v2.5
          </span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
            activeTab === 'drafts'
              ? 'border-black text-black font-bold'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Drafts</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
            activeTab === 'architecture'
              ? 'border-black text-black font-bold'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Architecture</span>
          {agentCount > 0 && (
            <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-bold rounded-none font-mono">
              {agentCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('executions')}
          className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
            activeTab === 'executions'
              ? 'border-black text-black font-bold'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Executions</span>
        </button>

        <button
          onClick={() => setActiveTab('deployments')}
          className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
            activeTab === 'deployments'
              ? 'border-black text-black font-bold'
              : 'border-transparent hover:text-black'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Deployments</span>
        </button>
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRunTerminalClick || (() => setActiveTab('executions'))}
          className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm active:translate-y-0.5"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Terminal</span>
        </button>
      </div>
    </nav>
  );
};
