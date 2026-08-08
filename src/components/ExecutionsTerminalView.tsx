import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Cpu,
  Send,
  User,
  Bot,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { AgentCollective, AIAgent, CollectiveSimulationStep } from '../types/agent';

interface ExecutionsTerminalViewProps {
  collective: AgentCollective | null;
  initialAgentForChat?: AIAgent | null;
}

export const ExecutionsTerminalView: React.FC<ExecutionsTerminalViewProps> = ({
  collective,
  initialAgentForChat,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulation' | 'directChat'>('simulation');

  // Simulation state
  const [taskGoal, setTaskGoal] = useState<string>(
    collective?.suggestedFirstTask || 'Execute initial workflow audit and generate operational blueprint.'
  );
  const [simulationSteps, setSimulationSteps] = useState<CollectiveSimulationStep[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedStepIndex, setCopiedStepIndex] = useState<number | null>(null);

  // Direct Agent Chat state
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    initialAgentForChat?.id || collective?.agents[0]?.id || ''
  );
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      content: 'AXON Agent Playground active. Select an agent to test direct system prompt responses.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  const selectedAgent = collective?.agents.find((a) => a.id === selectedAgentId) || collective?.agents[0];

  // Run multi-agent simulation
  const handleRunSimulation = async () => {
    if (!collective || !taskGoal.trim() || isSimulating) return;

    setIsSimulating(true);
    setSimulationSteps([]);

    try {
      const res = await fetch('/api/simulate-collective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collective,
          taskGoal: taskGoal.trim(),
        }),
      });

      const data = await res.json();
      if (data.steps && Array.isArray(data.steps)) {
        // Stream steps with small delay for realistic terminal feel
        for (let i = 0; i < data.steps.length; i++) {
          await new Promise((r) => setTimeout(r, 400));
          setSimulationSteps((prev) => [...prev, data.steps[i]]);
        }
      }
    } catch (err) {
      console.error('Error running simulation:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Direct agent chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedAgent || isSendingChat) return;

    const userText = chatInput.trim();
    setChatInput('');

    const newMsgs = [
      ...chatMessages,
      { role: 'user' as const, content: userText, timestamp: new Date().toLocaleTimeString() },
    ];
    setChatMessages(newMsgs);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: selectedAgent,
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
          userTask: taskGoal,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || `[${selectedAgent.name}] Output generated successfully.`;

      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: replyText, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `[${selectedAgent.name}] Communication loop error. System operating under nominal offline specs.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStepIndex(index);
    setTimeout(() => setCopiedStepIndex(null), 2000);
  };

  if (!collective || collective.agents.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 p-12 bg-white border border-gray-200 text-center flex flex-col items-center gap-4">
        <Terminal className="w-12 h-12 text-black" />
        <h2 className="text-xl font-bold uppercase tracking-wider">Terminal Offline</h2>
        <p className="text-xs text-gray-500 font-light max-w-md">
          Synthesize an agent architecture first in the Drafts tab before starting multi-agent executions.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-6 px-4 md:px-0">
      {/* Sub-navigation bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('simulation')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeSubTab === 'simulation'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Multi-Agent Collective Simulation</span>
          </button>

          <button
            onClick={() => setActiveSubTab('directChat')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeSubTab === 'directChat'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>1-on-1 Agent Playground</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-gray-400 uppercase">
          Collective: <span className="font-bold text-black">{collective.title}</span>
        </div>
      </div>

      {/* VIEW 1: Collective Multi-Agent Simulation Terminal */}
      {activeSubTab === 'simulation' && (
        <div className="flex flex-col gap-6">
          {/* Simulation Launcher */}
          <div className="bg-white border border-gray-200 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-black" />
                Target Task Goal for Collective
              </label>
              <span className="text-[10px] font-mono text-gray-400 uppercase">
                Pattern: {collective.orchestrationPattern}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="text"
                value={taskGoal}
                onChange={(e) => setTaskGoal(e.target.value)}
                disabled={isSimulating}
                placeholder="Enter objective for the agent workforce..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 text-xs font-mono text-gray-900 focus:border-black focus:outline-none"
              />

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating || !taskGoal.trim()}
                className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-60"
              >
                {isSimulating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Trace...</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="bg-[#111111] text-gray-100 border border-black p-6 font-mono text-xs flex flex-col gap-6 shadow-xl min-h-[420px]">
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  AXON.OS Executions Terminal — US-EAST-GEN-04
                </span>
              </div>

              {simulationSteps.length > 0 && (
                <button
                  onClick={() => setSimulationSteps([])}
                  className="text-[10px] uppercase text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Log</span>
                </button>
              )}
            </div>

            {/* Empty State */}
            {simulationSteps.length === 0 && !isSimulating && (
              <div className="flex flex-col items-center justify-center my-16 text-center text-gray-600 gap-3">
                <Terminal className="w-10 h-10 opacity-30" />
                <p className="text-xs uppercase tracking-widest">
                  Ready to execute. Enter a goal above and click "Run Simulation".
                </p>
              </div>
            )}

            {/* Live Streaming Steps */}
            <div className="flex flex-col gap-6">
              {simulationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 p-4 bg-[#181818] border-l-2 border-white/80 animate-fadeIn"
                >
                  {/* Step Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400 border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white text-black font-bold">
                        STEP {String(step.stepNumber).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-white uppercase tracking-wider">
                        {step.agentName}
                      </span>
                      <span className="text-gray-500 font-normal">({step.agentRole})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-300 uppercase tracking-wider">
                        {step.actionType}
                      </span>
                      <span className="text-gray-600 font-mono">{step.timestamp}</span>
                    </div>
                  </div>

                  {/* Thought Process / CoT */}
                  <div className="text-[11px] text-amber-300/90 italic font-mono bg-black/40 p-2.5 border border-gray-800/60">
                    <span className="text-amber-500 font-bold not-italic mr-1">
                      [Chain-of-Thought]:
                    </span>
                    {step.thoughtProcess}
                  </div>

                  {/* Step Output */}
                  <div className="relative group">
                    <pre className="text-xs text-gray-200 whitespace-pre-wrap font-mono leading-relaxed bg-black p-3.5 border border-gray-800 overflow-x-auto">
                      {step.output}
                    </pre>

                    <button
                      onClick={() => copyToClipboard(step.output, idx)}
                      className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-gray-300 text-[9px] uppercase font-bold tracking-wider hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                    >
                      {copiedStepIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {isSimulating && (
                <div className="flex items-center gap-3 p-4 bg-[#181818] text-gray-400 text-xs font-mono animate-pulse">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  <span>Agents interacting... Processing workflow pipeline...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 1-on-1 Direct Agent Playground */}
      {activeSubTab === 'directChat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selector Sidebar */}
          <div className="bg-white border border-gray-200 p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Select Agent
            </span>

            <div className="flex flex-col gap-2">
              {collective.agents.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgentId(ag.id)}
                  className={`p-3 text-left border transition-all flex flex-col gap-1 ${
                    selectedAgentId === ag.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] opacity-70">{ag.number}</span>
                    <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">
                      {ag.hierarchyLevel}
                    </span>
                  </div>

                  <span className="font-bold text-xs uppercase tracking-wider">{ag.name}</span>
                  <span className="text-[10px] opacity-75 line-clamp-1">{ag.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Playground Chat Area */}
          <div className="lg:col-span-3 bg-white border border-gray-200 flex flex-col h-[560px]">
            {/* Agent Header */}
            {selectedAgent && (
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-mono font-bold text-xs bg-white">
                    {selectedAgent.number}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm uppercase text-black">
                      {selectedAgent.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {selectedAgent.role} | Model: {selectedAgent.model} | Temp: {selectedAgent.temperature}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold tracking-widest font-mono">
                  Online
                </span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-[#FAFAFA]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[9px] font-mono text-gray-400 uppercase">
                    <span>{msg.role === 'user' ? 'You' : selectedAgent?.name}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 text-xs leading-relaxed font-mono ${
                      msg.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isSendingChat && (
                <div className="mr-auto p-3 bg-white border border-gray-200 text-xs font-mono text-gray-400 animate-pulse flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-black animate-spin" />
                  <span>{selectedAgent?.name} is analyzing query...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="p-4 border-t border-gray-200 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Send directive to ${selectedAgent?.name}...`}
                disabled={isSendingChat}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 text-xs font-mono text-black focus:border-black focus:outline-none"
              />

              <button
                type="submit"
                disabled={isSendingChat || !chatInput.trim()}
                className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
