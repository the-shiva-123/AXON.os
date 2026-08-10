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
      <div className="w-full max-w-4xl mx-auto my-12 p-12 bg-[#131418] border border-[#23252d] rounded-2xl text-center flex flex-col items-center gap-6 shadow-xl">
        <div className="w-16 h-16 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center font-mono text-2xl font-bold text-blue-400">
          00
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            No Architecture Defined
          </h2>
          <p className="text-sm text-gray-400 font-light max-w-md">
            Generate an AI agent workforce in the Prompt Synthesizer tab or create custom agents manually to inspect system instructions and tool bindings.
          </p>
        </div>
        <button
          onClick={onAddAgent}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
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
      <section className="bg-[#131418] border border-[#23252d] p-6 md:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] font-mono font-semibold tracking-wider uppercase">
              {collective.agents.length} AGENTS ACTIVE
            </span>
            <span className="px-2.5 py-1 bg-[#1b1d24] text-gray-300 border border-[#2a2c38] rounded-md text-[10px] font-mono font-medium tracking-wider uppercase">
              {collective.orchestrationPattern}
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              Domain: <span className="text-gray-200">{collective.domainFocus}</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {collective.title}
          </h1>

          <p className="text-xs text-gray-400 leading-relaxed font-light">
            {collective.missionOverview}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={onRunCollective}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4 text-blue-200" />
            <span>Run Collective Simulation</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#23252d] text-[11px] font-mono text-gray-400">
          <span className="text-gray-500 mr-1 font-mono">Filter Tag:</span>
          <button
            onClick={() => setFilterTag('ALL')}
            className={`px-3 py-1 rounded-lg border transition-all ${
              filterTag === 'ALL'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20 font-semibold'
                : 'bg-[#131418] text-gray-300 border-[#23252d] hover:border-gray-500'
            }`}
          >
            All ({collective.agents.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                filterTag === tag
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20 font-semibold'
                  : 'bg-[#131418] text-gray-300 border-[#23252d] hover:border-gray-500'
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
              className="bg-[#131418] border border-[#23252d] p-5 rounded-xl flex flex-col justify-between hover:border-blue-500/40 transition-all group relative shadow-sm hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div>
                {/* Top Number & Hierarchy Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                    <span className="font-mono font-bold text-xs">{agent.number}</span>
                  </div>

                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#1b1d24] text-gray-400 border border-[#282a36]">
                    {agent.hierarchyLevel}
                  </span>
                </div>

                {/* Name & Role */}
                <h3 className="font-bold text-sm tracking-wide text-white group-hover:text-blue-300 transition-colors mb-1">
                  {agent.name}
                </h3>
                <span className="block text-[11px] font-mono text-blue-400 mb-3 font-medium">
                  {agent.role}
                </span>

                <p className="text-xs text-gray-400 leading-relaxed font-light mb-4 line-clamp-3">
                  {agent.description}
                </p>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(agent.categoryTags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[#1a1c24] border border-[#282a3b] text-[9px] uppercase font-mono font-semibold tracking-wider text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tools Count & Memory */}
                <div className="pt-3 border-t border-[#1e2029] flex items-center justify-between text-[10px] text-gray-500 font-mono mb-4">
                  <span>Tools: <strong className="text-gray-300">{agent.tools?.length || 0}</strong></span>
                  <span className="text-gray-400">{agent.memoryType}</span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-[#1e2029]">
                <button
                  onClick={() => onSelectAgent(agent)}
                  className="flex-1 py-2 bg-[#1a1c24] hover:bg-blue-600 text-gray-300 hover:text-white border border-[#282a3b] hover:border-blue-500 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  title="Edit Agent Blueprint"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Config</span>
                </button>

                <button
                  onClick={() => onTestAgentChat(agent)}
                  className="px-3 py-2 bg-[#1a1c24] hover:bg-blue-600 text-gray-300 hover:text-white border border-[#282a3b] hover:border-blue-500 rounded-lg text-[10px] font-semibold transition-all"
                  title="Test Agent Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteAgent(agent.id)}
                  className="px-3 py-2 bg-[#1a1c24] hover:bg-red-600/20 text-gray-500 hover:text-red-400 border border-[#282a3b] hover:border-red-500/40 rounded-lg text-[10px] font-semibold transition-all"
                  title="Remove Agent"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Manual Override Card */}
        <div
          onClick={onAddAgent}
          className="bg-[#131418] border border-dashed border-blue-500/30 p-6 rounded-xl flex flex-col justify-center items-center text-white text-center cursor-pointer hover:bg-[#181a20] hover:border-blue-500/60 transition-all min-h-[280px] group shadow-sm"
        >
          <div className="w-12 h-12 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center mb-3 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-white">
            Manual Override
          </span>
          <span className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-wider">
            Add Custom Agent
          </span>
        </div>
      </section>

      {/* Suggested First Task Banner */}
      {collective.suggestedFirstTask && (
        <div className="bg-[#131418] border border-[#23252d] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                Suggested Collective Task
              </span>
              <p className="text-xs font-mono font-medium text-gray-200">
                "{collective.suggestedFirstTask}"
              </p>
            </div>
          </div>

          <button
            onClick={onRunCollective}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-blue-500/20 shrink-0"
          >
            Launch Task in Playground →
          </button>
        </div>
      )}
    </div>
  );
};
