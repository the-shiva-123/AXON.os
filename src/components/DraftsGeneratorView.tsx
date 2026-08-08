import React, { useState } from 'react';
import { Sparkles, ArrowRight, Sliders, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import { MISSION_PRESETS } from '../data/presets';
import { CollectiveGenerationRequest, AgentCollective } from '../types/agent';

interface DraftsGeneratorViewProps {
  onGenerate: (req: CollectiveGenerationRequest) => Promise<void>;
  isGenerating: boolean;
  currentCollective: AgentCollective | null;
  onSelectPresetPrompt?: (prompt: string, count: number) => void;
}

export const DraftsGeneratorView: React.FC<DraftsGeneratorViewProps> = ({
  onGenerate,
  isGenerating,
  currentCollective,
}) => {
  const [prompt, setPrompt] = useState(
    'Build a 4-agent autonomous startup workforce to launch an AI document analysis SaaS: 1 Lead Product Architect, 1 Full-Stack Backend Engineer, 1 Growth Marketing Specialist, and 1 QA/Security Compliance Auditor.'
  );
  const [agentCount, setAgentCount] = useState<number>(4);
  const [orchestrationStyle, setOrchestrationStyle] = useState<
    'Hierarchical Supervisor' | 'Sequential Pipeline' | 'Peer Consensus' | 'Event-Driven Mesh'
  >('Hierarchical Supervisor');
  const [domainFocus, setDomainFocus] = useState('Enterprise Automation & SaaS');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [showParameters, setShowParameters] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  const tokenCount = Math.min(1000, Math.floor(prompt.length * 1.3));

  const handlePresetClick = (presetPrompt: string, count: number) => {
    setPrompt(presetPrompt);
    setAgentCount(count);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    // Simulate animated generation steps
    setGenerationStep(1);
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 600);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 1200);

    try {
      await onGenerate({
        prompt: prompt.trim(),
        agentCount,
        orchestrationStyle,
        domainFocus,
        temperature,
      });
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGenerationStep(0);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-6 px-4 md:px-0">
      {/* Hero Header */}
      <section className="w-full flex flex-col gap-3 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-black text-white text-[10px] uppercase font-bold tracking-widest mx-auto">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>AXON Agent Synthesizer Engine</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 leading-tight">
          Define your <span className="font-bold">Autonomous Collective</span>
        </h1>
        <p className="text-sm text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
          Describe the mission objectives or workflow requirements. AXON decomposes your goal into tailored, specialized AI agent roles with custom system instructions, tool schemas, and operational parameters.
        </p>
      </section>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="relative group bg-white border border-gray-300 focus-within:border-black transition-all shadow-sm">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            rows={5}
            className="w-full p-6 text-base md:text-lg bg-transparent border-0 focus:ring-0 resize-none placeholder-gray-400 font-light text-gray-900 outline-none leading-relaxed"
            placeholder="Describe the mission requirements for your AI workforce..."
          />

          {/* Bottom Bar inside Textarea container */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-400 font-mono">
              <span>{tokenCount} / 1000 Tokens</span>
              <button
                type="button"
                onClick={() => setShowParameters(!showParameters)}
                className="flex items-center gap-1.5 text-black hover:underline font-bold transition-all"
              >
                <Sliders className="w-3 h-3" />
                <span>{showParameters ? 'Hide Controls' : 'System Parameters'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className={`px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm ${
                  isGenerating ? 'opacity-70 cursor-not-allowed' : 'active:translate-y-0.5'
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Agents...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Agents</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible System Parameter Controls */}
        {showParameters && (
          <div className="bg-white border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
            {/* Agent Count */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Agent Collective Size
              </label>
              <div className="flex items-center gap-1">
                {[2, 3, 4, 5, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setAgentCount(num)}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold border transition-all ${
                      agentCount === num
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Orchestration Style */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Orchestration Pattern
              </label>
              <select
                value={orchestrationStyle}
                onChange={(e) => setOrchestrationStyle(e.target.value as any)}
                className="w-full py-1.5 px-3 border border-gray-200 bg-white text-xs font-medium text-gray-900 focus:border-black focus:outline-none"
              >
                <option value="Hierarchical Supervisor">Hierarchical Supervisor</option>
                <option value="Sequential Pipeline">Sequential Pipeline</option>
                <option value="Peer Consensus">Peer Consensus Mesh</option>
                <option value="Event-Driven Mesh">Event-Driven Mesh</option>
              </select>
            </div>

            {/* Domain Focus */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Domain Focus
              </label>
              <input
                type="text"
                value={domainFocus}
                onChange={(e) => setDomainFocus(e.target.value)}
                placeholder="e.g. Fintech, Logistics, SecOps"
                className="w-full py-1.5 px-3 border border-gray-200 bg-white text-xs font-medium text-gray-900 focus:border-black focus:outline-none"
              />
            </div>

            {/* Temperature Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                  Model Creativity
                </label>
                <span className="text-xs font-mono font-bold text-black">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>
        )}
      </form>

      {/* Generation Progress Indicator */}
      {isGenerating && (
        <div className="w-full bg-white border border-gray-200 p-6 flex flex-col gap-4 animate-pulse">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black rounded-sm rotate-45 animate-spin" />
              Synthesizing Autonomous Agent Architecture
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase">
              AXON-GEN-2.5-FLASH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div
              className={`p-3 border flex items-center gap-2 ${
                generationStep >= 1
                  ? 'border-black bg-gray-50 font-bold text-black'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>1. Mission Context Decomposition</span>
            </div>

            <div
              className={`p-3 border flex items-center gap-2 ${
                generationStep >= 2
                  ? 'border-black bg-gray-50 font-bold text-black'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>2. Role Taxonomy & Tool Binding</span>
            </div>

            <div
              className={`p-3 border flex items-center gap-2 ${
                generationStep >= 3
                  ? 'border-black bg-gray-50 font-bold text-black'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>3. System Instruction Synthesis</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Mission Presets */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Or Select Mission Blueprint Preset
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-mono">
            {MISSION_PRESETS.length} Curated Archetypes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MISSION_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handlePresetClick(preset.prompt, preset.agentCount)}
              className="bg-white border border-gray-200 p-5 flex flex-col justify-between hover:border-black transition-all cursor-pointer group hover:shadow-md"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-gray-100 text-[9px] uppercase font-bold tracking-widest text-gray-700">
                    {preset.badge}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {preset.agentCount} Agents
                  </span>
                </div>

                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 group-hover:text-black">
                  {preset.title}
                </h3>

                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {preset.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-black transition-colors">
                <span>Load Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Previously Synthesized Collective Banner if available */}
      {currentCollective && !isGenerating && (
        <div className="bg-black text-white p-6 border border-black flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
              Active Architecture Ready
            </span>
            <h4 className="text-lg font-bold uppercase tracking-wider">
              {currentCollective.title} ({currentCollective.agents.length} Agents)
            </h4>
            <p className="text-xs text-gray-400 font-light max-w-xl line-clamp-1">
              {currentCollective.missionOverview}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="px-4 py-2 border border-gray-700 text-white text-xs font-bold uppercase tracking-widest hover:border-white transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
