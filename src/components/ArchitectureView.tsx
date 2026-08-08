import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Brain,
  Workflow,
  Zap,
  Plus,
  Edit3,
  MessageSquare,
  Trash2,
  Terminal,
  Code2,
  Sliders,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { AgentCollective, AIAgent } from '../types/agent';

interface ArchitectureViewProps {
  collective: AgentCollective | null;
  onSelectAgent: (agent: AIAgent) => void;
  onAddAgent: () => void;
  onDeleteAgent: (agentId: string) => void;
  onTestAgentChat: (agent: AIAgent) => void;
  onRunCollective: () => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Cpu,
  Shield,
  Brain,
  Workflow,
  Zap,
  Layers,
  Code: Code2,
  Sparkles,
};

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  collective,
  onSelectAgent,
  onAddAgent,
  onDeleteAgent,
  onTestAgentChat,
  onRunCollective,
}) => {
  const [filterTag, setFilterTag] = useState<string>('ALL');

  if (!collective || !collective.agents || collective.agents.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 p-12 bg-white border border-gray-200 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-2 border-black flex items-center justify-center font-mono text-2xl font-bold">
          00
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-black">
            No Architecture Defined
          </h2>
          <p className="text-sm text-gray-500 font-light max-w-md">
            Generate an AI agent workforce in the Drafts tab or create custom agents manually to inspect system instructions and tool bindings.
          </p>
        </div>
        <button
          onClick={onAddAgent}
          className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Override — Create Agent</span>
        </button>
      </div>
    );
  }

  // Get unique tags for filtering
  const allTags = Array.from(
    new Set(collective.agents.flatMap((a) => a.categoryTags || []))
  );

  const filteredAgents =
    filterTag === 'ALL'
      ? collective.agents
      : collective.agents.filter((a) => (a.categoryTags || []).includes(filterTag));

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-6 px-4 md:px-0">
      {/* Collective Header Banner */}
      <section className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-black text-white text-[9px] uppercase font-bold tracking-widest font-mono">
              {collective.agents.length} AGENTS ACTIVE
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[9px] uppercase font-bold tracking-widest font-mono">
              {collective.orchestrationPattern}
            </span>
            <span className="text-[10px] uppercase font-mono text-gray-400">
              Domain: {collective.domainFocus}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 uppercase">
            {collective.title}
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed font-light">
            {collective.missionOverview}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={onRunCollective}
            className="w-full sm:w-auto px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Run Collective Simulation</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 text-[10px] uppercase font-bold tracking-widest text-gray-500">
          <span className="text-gray-400 mr-2 font-mono">Filter Tag:</span>
          <button
            onClick={() => setFilterTag('ALL')}
            className={`px-3 py-1 border transition-all ${
              filterTag === 'ALL'
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            All ({collective.agents.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 border transition-all ${
                filterTag === tag
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Agent Cards Grid matching Geometric Balance structure */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAgents.map((agent) => {
          const IconComponent = iconMap[agent.avatarIcon] || Cpu;

          return (
            <div
              key={agent.id}
              className="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-black transition-all group relative"
            >
              <div>
                {/* Top Number & Hierarchy Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white group-hover:bg-black group-hover:text-white transition-colors">
                    <span className="font-mono font-bold text-sm">{agent.number}</span>
                  </div>

                  <span className="text-[9px] uppercase font-mono font-bold text-gray-400">
                    {agent.hierarchyLevel}
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="font-bold text-sm uppercase tracking-wider mb-1 text-gray-900 group-hover:text-black">
                  {agent.name}
                </h3>
                <span className="block text-[11px] font-mono text-gray-500 mb-3 font-semibold">
                  {agent.role}
                </span>

                <p className="text-xs text-gray-500 leading-relaxed font-light mb-4 line-clamp-3">
                  {agent.description}
                </p>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(agent.categoryTags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-[9px] uppercase font-bold tracking-widest text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tools Count & Memory */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 uppercase font-mono mb-4">
                  <span>Tools: {agent.tools?.length || 0}</span>
                  <span>{agent.memoryType}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onSelectAgent(agent)}
                  className="flex-1 py-2 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                  title="Edit Agent Blueprint"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Config</span>
                </button>

                <button
                  onClick={() => onTestAgentChat(agent)}
                  className="px-2.5 py-2 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest transition-all"
                  title="Test Agent Chat"
                >
                  <MessageSquare className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onDeleteAgent(agent.id)}
                  className="px-2.5 py-2 bg-gray-50 hover:bg-red-600 hover:text-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-red-600 transition-all"
                  title="Remove Agent"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Manual Override Card - Geometric Balance standard element */}
        <div
          onClick={onAddAgent}
          className="bg-black border border-black p-6 flex flex-col justify-center items-center text-white text-center cursor-pointer hover:bg-gray-900 transition-all min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center mb-4 text-2xl font-light hover:scale-110 transition-transform">
            +
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white">
            Manual Override
          </span>
          <span className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">
            Add Custom Agent
          </span>
        </div>
      </section>

      {/* Suggested First Task Banner */}
      {collective.suggestedFirstTask && (
        <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                Suggested Collective Task
              </span>
              <p className="text-xs font-mono font-medium text-black">
                "{collective.suggestedFirstTask}"
              </p>
            </div>
          </div>

          <button
            onClick={onRunCollective}
            className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0"
          >
            Launch Task in Terminal →
          </button>
        </div>
      )}
    </div>
  );
};
