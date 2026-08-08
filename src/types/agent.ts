export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: 'API Integration' | 'Data Query' | 'Code Execution' | 'Search & Retrieval' | 'Communication' | 'Audit & Compliance';
}

export interface AIAgent {
  id: string;
  number: string; // e.g., "01", "02"
  name: string;
  role: string;
  title: string;
  description: string;
  avatarIcon: string; // Lucide icon name, e.g., "Cpu", "Shield", "Brain", "Workflow", "Zap", "Layers", "Code", "Sparkles"
  categoryTags: string[]; // e.g. ["Data Architecture", "Audit"]
  systemPrompt: string;
  temperature: number;
  model: string;
  hierarchyLevel: 'Lead / Supervisor' | 'Specialist' | 'Auditor / Reviewer' | 'Executor';
  tools: AgentTool[];
  inputSchema: string;
  outputSchema: string;
  memoryType: 'Short-term Context' | 'Vector DB Buffer' | 'Episodic Log' | 'State Machine';
  status: 'Idle' | 'Active' | 'Executing' | 'Standby';
}

export interface AgentCollective {
  id: string;
  title: string;
  missionOverview: string;
  orchestrationPattern: 'Hierarchical Supervisor' | 'Sequential Pipeline' | 'Peer Consensus' | 'Event-Driven Mesh';
  suggestedFirstTask: string;
  domainFocus: string;
  createdAt: string;
  agents: AIAgent[];
}

export interface CollectiveGenerationRequest {
  prompt: string;
  agentCount?: number;
  orchestrationStyle?: 'Hierarchical Supervisor' | 'Sequential Pipeline' | 'Peer Consensus' | 'Event-Driven Mesh';
  domainFocus?: string;
  temperature?: number;
}

export interface AgentChatRequest {
  agent: AIAgent;
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  userTask?: string;
}

export interface CollectiveSimulationStep {
  stepNumber: number;
  agentId: string;
  agentName: string;
  agentRole: string;
  actionType: 'Task Delegation' | 'Analysis & Synthesis' | 'Tool Execution' | 'Review & Audit' | 'Final Hand-off';
  thoughtProcess: string;
  output: string;
  timestamp: string;
}

export interface SimulationRequest {
  collective: AgentCollective;
  taskGoal: string;
}

export interface MissionPreset {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  prompt: string;
  agentCount: number;
}
