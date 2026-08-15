import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FooterBar } from './components/FooterBar';
import { DraftsGeneratorView } from './components/DraftsGeneratorView';
import { ArchitectureView } from './components/ArchitectureView';
import { WorkflowCanvasView } from './components/WorkflowCanvasView';
import { ExecutionsTerminalView } from './components/ExecutionsTerminalView';
import { DeploymentsExportView } from './components/DeploymentsExportView';
import { AgentDetailModal } from './components/AgentDetailModal';
import { LandingOverlay } from './components/LandingOverlay';

export default function App() {
  const [activeTab, setActiveTab] = useState('drafts');
  const [collective, setCollective] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [landingExiting, setLandingExiting] = useState(false);

  // Modal / Agent Edit state
  const [selectedAgentForModal, setSelectedAgentForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentForChat, setSelectedAgentForChat] = useState(null);

  // Initialize with a default collective on first load if none exists
  useEffect(() => {
    const saved = localStorage.getItem('axon_collective');
    if (saved) {
      try {
        setCollective(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved collective:', e);
      }
    }
  }, []);

  // Save collective to localStorage when changed
  useEffect(() => {
    if (collective) {
      localStorage.setItem('axon_collective', JSON.stringify(collective));
    }
  }, [collective]);

  // Handle generation call
  const handleGenerateCollective = async (req) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-collective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      const data = await res.json();
      setCollective(data);
      // Auto transition to architecture tab to view generated cards
      setActiveTab('architecture');
    } catch (err) {
      console.error('Failed to generate agent collective:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Agent Management Handlers
  const handleSelectAgentForEdit = (agent) => {
    setSelectedAgentForModal(agent);
    setIsModalOpen(true);
  };

  const handleAddCustomAgent = () => {
    const nextNum = String((collective?.agents?.length || 0) + 1).padStart(2, '0');
    const newAgent = {
      id: 'agent-' + Date.now(),
      number: nextNum,
      name: 'Custom Agent',
      role: 'Specialist',
      title: 'Autonomous Custom Operator',
      description: 'Executes user-defined operational domain workflows.',
      avatarIcon: 'Cpu',
      categoryTags: ['Manual Override', 'Custom'],
      systemPrompt: 'You are a specialized AI agent designed for domain execution.',
      temperature: 0.3,
      model: 'gemini-2.5-flash',
      hierarchyLevel: 'Specialist',
      tools: [
        {
          id: 'tool-custom-1',
          name: 'Custom Web Search',
          description: 'Queries live web context',
          category: 'Search & Retrieval',
        },
      ],
      inputSchema: '{"type": "object", "properties": {"prompt": {"type": "string"}}}',
      outputSchema: '{"type": "object", "properties": {"result": {"type": "string"}}}',
      memoryType: 'Short-term Context',
      status: 'Idle',
    };

    setSelectedAgentForModal(newAgent);
    setIsModalOpen(true);
  };

  const handleSaveAgent = (updatedAgent) => {
    if (!collective) {
      // Create fresh collective if none existed
      setCollective({
        id: 'coll-' + Date.now(),
        title: 'Custom Agent Collective',
        missionOverview: 'Manually synthesized AI agent workforce.',
        orchestrationPattern: 'Hierarchical Supervisor',
        suggestedFirstTask: 'Run operational audit on domain workflow.',
        domainFocus: 'Custom',
        createdAt: new Date().toISOString(),
        agents: [updatedAgent],
      });
      return;
    }

    const exists = collective.agents.some((a) => a.id === updatedAgent.id);
    let updatedAgents;

    if (exists) {
      updatedAgents = collective.agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a));
    } else {
      updatedAgents = [...collective.agents, updatedAgent];
    }

    setCollective({
      ...collective,
      agents: updatedAgents,
    });
  };

  const handleDeleteAgent = (agentId) => {
    if (!collective) return;
    setCollective({
      ...collective,
      agents: collective.agents.filter((a) => a.id !== agentId),
    });
  };

  const handleTestAgentChat = (agent) => {
    setSelectedAgentForChat(agent);
    setActiveTab('executions');
  };

  const handleRunCollectiveSimulation = () => {
    setActiveTab('executions');
  };

  const handleGetStarted = () => {
    setLandingExiting(true);
    window.setTimeout(() => setShowLanding(false), 340);
  };

  return (
    <div className="app-shell">
      {showLanding && (
        <LandingOverlay isExiting={landingExiting} onGetStarted={handleGetStarted} />
      )}

      <div className={`app-content ${showLanding ? 'app-content--blurred' : ''}`}>
        <div className="h-screen w-full flex flex-col bg-[#0b0c0e] text-[#e3e3e8] overflow-hidden select-none font-sans">
          {/* Top Geometric Navigation */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            agentCount={collective?.agents?.length || 0}
            onRunTerminalClick={() => setActiveTab('executions')}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12">
            {activeTab === 'drafts' && (
              <DraftsGeneratorView
                onGenerate={handleGenerateCollective}
                isGenerating={isGenerating}
                currentCollective={collective}
              />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureView
                collective={collective}
                onSelectAgent={handleSelectAgentForEdit}
                onAddAgent={handleAddCustomAgent}
                onDeleteAgent={handleDeleteAgent}
                onTestAgentChat={handleTestAgentChat}
                onRunCollective={handleRunCollectiveSimulation}
              />
            )}

            {activeTab === 'canvas' && (
              <WorkflowCanvasView
                collective={collective}
                onUpdateCollective={(updated) => setCollective(updated)}
                onRunSimulation={() => setActiveTab('executions')}
              />
            )}

            {activeTab === 'executions' && (
              <ExecutionsTerminalView
                collective={collective}
                initialAgentForChat={selectedAgentForChat}
              />
            )}

            {activeTab === 'deployments' && <DeploymentsExportView collective={collective} />}
          </main>

          {/* Bottom Status Footer */}
          <FooterBar />

          {/* Agent Detail Modal */}
          <AgentDetailModal
            agent={selectedAgentForModal}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSaveAgent={handleSaveAgent}
          />
        </div>
      </div>
    </div>
  );
}
