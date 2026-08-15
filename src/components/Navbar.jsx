import React from 'react';
import { Terminal, Cpu, Layers, Play, Code2, Sparkles, GitFork } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  agentCount,
  onRunTerminalClick,
}) => {
  return (
    <nav className="h-16 border-b border-[#23252d] flex items-center justify-between px-4 lg:px-8 bg-[#131418] select-none transition-all">
      {/* Brand Logo & Studio Identifier */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('drafts')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#131418] rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white leading-none">
                AXON STUDIO
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI Studio
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-0.5">
              Multi-Agent Builder
            </span>
          </div>
        </div>

        {/* Model Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1b1d24] border border-[#2b2d38] text-[11px] text-gray-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>gemini-2.5-flash</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-1 md:gap-2 text-xs font-medium text-gray-400">
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'drafts'
              ? 'bg-[#22242e] text-white font-semibold shadow-inner border border-blue-500/30'
              : 'hover:bg-[#1a1c23] hover:text-gray-200'
          }`}
        >
          <Cpu className={`w-3.5 h-3.5 ${activeTab === 'drafts' ? 'text-blue-400' : ''}`} />
          <span>Prompt Synthesizer</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'architecture'
              ? 'bg-[#22242e] text-white font-semibold shadow-inner border border-blue-500/30'
              : 'hover:bg-[#1a1c23] hover:text-gray-200'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 ${activeTab === 'architecture' ? 'text-blue-400' : ''}`} />
          <span>Architecture</span>
          {agentCount > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-full font-mono border border-blue-500/30">
              {agentCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'canvas'
              ? 'bg-[#22242e] text-white font-semibold shadow-inner border border-blue-500/30'
              : 'hover:bg-[#1a1c23] hover:text-gray-200'
          }`}
        >
          <GitFork className={`w-3.5 h-3.5 ${activeTab === 'canvas' ? 'text-blue-400' : ''}`} />
          <span>Visual Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('executions')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'executions'
              ? 'bg-[#22242e] text-white font-semibold shadow-inner border border-blue-500/30'
              : 'hover:bg-[#1a1c23] hover:text-gray-200'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${activeTab === 'executions' ? 'text-blue-400' : ''}`} />
          <span>Playground</span>
        </button>

        <button
          onClick={() => setActiveTab('deployments')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'deployments'
              ? 'bg-[#22242e] text-white font-semibold shadow-inner border border-blue-500/30'
              : 'hover:bg-[#1a1c23] hover:text-gray-200'
          }`}
        >
          <Code2 className={`w-3.5 h-3.5 ${activeTab === 'deployments' ? 'text-blue-400' : ''}`} />
          <span>API & Code</span>
        </button>
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRunTerminalClick || (() => setActiveTab('executions'))}
          className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-blue-500/10 active:scale-95"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Run Simulation</span>
        </button>
      </div>
    </nav>
  );
};
