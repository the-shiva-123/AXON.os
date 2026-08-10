export type WorkflowNodeType = 'trigger' | 'agent' | 'tool' | 'router' | 'output';

export interface WorkflowNodeData {
  agentName?: string;
  agentRole?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  hierarchyLevel?: 'Lead / Supervisor' | 'Specialist' | 'Auditor / Reviewer' | 'Executor';
  toolName?: string;
  toolCategory?: string;
  toolDescription?: string;
  conditionPrompt?: string;
  triggerPrompt?: string;
  outputFormat?: string;
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  x: number;
  y: number;
  agentId?: string;
  data: WorkflowNodeData;
  status?: 'idle' | 'active' | 'executing' | 'completed' | 'error';
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  animated?: boolean;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  graph: WorkflowGraph;
}
