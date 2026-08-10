import { AgentCollective, AIAgent } from '../types/agent';
import { WorkflowGraph, WorkflowNode, WorkflowEdge, WorkflowTemplate } from '../types/workflow';

/**
 * Converts an AgentCollective into an interactive WorkflowGraph with smart coordinates and connections
 */
export function buildGraphFromCollective(collective: AgentCollective | null): WorkflowGraph {
  if (!collective || !collective.agents || collective.agents.length === 0) {
    // Default starter graph
    return {
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          label: 'User Goal Input',
          x: 100,
          y: 220,
          data: {
            triggerPrompt: 'Analyze system telemetry logs and detect anomalies',
          },
        },
        {
          id: 'agent-starter-1',
          type: 'agent',
          label: 'Supervisor Agent',
          x: 420,
          y: 180,
          agentId: 'starter-1',
          data: {
            agentName: 'Orchestrator Alpha',
            agentRole: 'Lead / Supervisor',
            model: 'gemini-2.5-flash',
            systemPrompt: 'Coordinates agent team tasks.',
            temperature: 0.2,
            hierarchyLevel: 'Lead / Supervisor',
          },
        },
        {
          id: 'tool-starter-1',
          type: 'tool',
          label: 'Web Search API',
          x: 750,
          y: 120,
          data: {
            toolName: 'Google Search API',
            toolCategory: 'Search & Retrieval',
            toolDescription: 'Live web context search',
          },
        },
        {
          id: 'output-1',
          type: 'output',
          label: 'Final Response Aggregator',
          x: 1050,
          y: 220,
          data: {
            outputFormat: 'Structured JSON / Markdown Executive Report',
          },
        },
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'trigger-1', targetNodeId: 'agent-starter-1', label: 'Task Payload' },
        { id: 'e2', sourceNodeId: 'agent-starter-1', targetNodeId: 'tool-starter-1', label: 'Query Request' },
        { id: 'e3', sourceNodeId: 'agent-starter-1', targetNodeId: 'output-1', label: 'Synthesized Report' },
      ],
    };
  }

  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];

  // Add Trigger Node at start
  const triggerNodeId = 'trigger-root';
  nodes.push({
    id: triggerNodeId,
    type: 'trigger',
    label: 'Workflow Trigger',
    x: 80,
    y: 280,
    data: {
      triggerPrompt: collective.suggestedFirstTask || 'Execute operational pipeline task',
    },
  });

  // Group agents by hierarchy / role for grid layout calculation
  const supervisors = collective.agents.filter((a) => a.hierarchyLevel === 'Lead / Supervisor');
  const specialists = collective.agents.filter((a) => a.hierarchyLevel === 'Specialist' || a.hierarchyLevel === 'Executor');
  const auditors = collective.agents.filter((a) => a.hierarchyLevel === 'Auditor / Reviewer');
  const remaining = collective.agents.filter(
    (a) => !supervisors.includes(a) && !specialists.includes(a) && !auditors.includes(a)
  );

  const orderedAgents = [...supervisors, ...specialists, ...remaining, ...auditors];

  // Column X offsets
  const colWidth = 320;
  const startX = 400;

  let supervisorNodeId: string | null = null;
  let toolNodeCounter = 1;

  orderedAgents.forEach((agent, index) => {
    const nodeX = startX + (index % 3) * colWidth;
    const nodeY = 120 + Math.floor(index / 3) * 260 + (index % 2) * 40;
    const agentNodeId = `node-agent-${agent.id}`;

    nodes.push({
      id: agentNodeId,
      type: 'agent',
      label: agent.name,
      x: nodeX,
      y: nodeY,
      agentId: agent.id,
      data: {
        agentName: agent.name,
        agentRole: agent.role,
        model: agent.model,
        systemPrompt: agent.systemPrompt,
        temperature: agent.temperature,
        hierarchyLevel: agent.hierarchyLevel,
      },
    });

    if (agent.hierarchyLevel === 'Lead / Supervisor' && !supervisorNodeId) {
      supervisorNodeId = agentNodeId;
    }

    // Connect trigger to first agent or supervisor
    if (index === 0) {
      edges.push({
        id: `edge-trig-${agentNodeId}`,
        sourceNodeId: triggerNodeId,
        targetNodeId: agentNodeId,
        label: 'Task Input',
        animated: true,
      });
    } else if (supervisorNodeId && agentNodeId !== supervisorNodeId) {
      // Connect supervisor to child agents
      edges.push({
        id: `edge-sup-${agentNodeId}`,
        sourceNodeId: supervisorNodeId,
        targetNodeId: agentNodeId,
        label: 'Delegate Subtask',
        animated: true,
      });
    }

    // Add Tool Nodes for agent tools
    (agent.tools || []).forEach((tool, tIdx) => {
      const toolNodeId = `node-tool-${agent.id}-${tool.id || tIdx}`;
      const toolX = nodeX + 160 + (tIdx % 2) * 120;
      const toolY = nodeY - 100 + tIdx * 110;

      nodes.push({
        id: toolNodeId,
        type: 'tool',
        label: tool.name,
        x: toolX,
        y: toolY,
        data: {
          toolName: tool.name,
          toolCategory: tool.category,
          toolDescription: tool.description,
        },
      });

      edges.push({
        id: `edge-tool-${agentNodeId}-${toolNodeId}`,
        sourceNodeId: agentNodeId,
        targetNodeId: toolNodeId,
        label: 'Tool Call',
      });
      toolNodeCounter++;
    });
  });

  // Output Aggregator Node at end
  const outputNodeId = 'output-final';
  const maxNodeX = Math.max(...nodes.map((n) => n.x)) + 340;
  nodes.push({
    id: outputNodeId,
    type: 'output',
    label: 'Pipeline Output',
    x: maxNodeX,
    y: 280,
    data: {
      outputFormat: 'Unified Multi-Agent Execution Summary',
    },
  });

  // Connect last agent or auditor to output
  const lastAgentNode = nodes.filter((n) => n.type === 'agent').pop();
  if (lastAgentNode) {
    edges.push({
      id: `edge-out-${lastAgentNode.id}`,
      sourceNodeId: lastAgentNode.id,
      targetNodeId: outputNodeId,
      label: 'Deliver Output',
      animated: true,
    });
  }

  return { nodes, edges };
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tmpl-research',
    name: 'Autonomous Market Research Engine',
    description: '4-node pipeline with Lead Analyst, Web Search Tool, Data Synthesizer, and Executive Audit.',
    graph: {
      nodes: [
        {
          id: 'node-trig-1',
          type: 'trigger',
          label: 'Market Query Trigger',
          x: 80,
          y: 240,
          data: { triggerPrompt: 'Research competitor AI chip architectures and market share trends 2026' },
        },
        {
          id: 'node-ag-1',
          type: 'agent',
          label: 'Chief Research Officer',
          x: 380,
          y: 180,
          data: {
            agentName: 'Chief Research Officer',
            agentRole: 'Lead / Supervisor',
            model: 'gemini-2.5-pro',
            systemPrompt: 'Deconstructs research query into web queries and delegates data gathering.',
            temperature: 0.2,
            hierarchyLevel: 'Lead / Supervisor',
          },
        },
        {
          id: 'node-tool-1',
          type: 'tool',
          label: 'Live Web RAG Tool',
          x: 700,
          y: 100,
          data: {
            toolName: 'Google Search & RAG',
            toolCategory: 'Search & Retrieval',
            toolDescription: 'Fetches web articles, market reports, and data benchmarks.',
          },
        },
        {
          id: 'node-ag-2',
          type: 'agent',
          label: 'Financial Data Synthesizer',
          x: 700,
          y: 280,
          data: {
            agentName: 'Financial Data Synthesizer',
            agentRole: 'Specialist',
            model: 'gemini-2.5-flash',
            systemPrompt: 'Extracts metrics, charts, tables, and quantitative forecast stats.',
            temperature: 0.3,
            hierarchyLevel: 'Specialist',
          },
        },
        {
          id: 'node-router-1',
          type: 'router',
          label: 'Quality Control Gate',
          x: 1020,
          y: 220,
          data: {
            conditionPrompt: 'Verify confidence score > 85% and citation accuracy before release.',
          },
        },
        {
          id: 'node-out-1',
          type: 'output',
          label: 'Executive Briefing Memo',
          x: 1320,
          y: 220,
          data: {
            outputFormat: 'Markdown Briefing + Data Metrics + Next Action Plan',
          },
        },
      ],
      edges: [
        { id: 'e1', sourceNodeId: 'node-trig-1', targetNodeId: 'node-ag-1', label: 'User Objective', animated: true },
        { id: 'e2', sourceNodeId: 'node-ag-1', targetNodeId: 'node-tool-1', label: 'Query Search' },
        { id: 'e3', sourceNodeId: 'node-ag-1', targetNodeId: 'node-ag-2', label: 'Raw Data' },
        { id: 'e4', sourceNodeId: 'node-ag-2', targetNodeId: 'node-router-1', label: 'Draft Synthesis' },
        { id: 'e5', sourceNodeId: 'node-router-1', targetNodeId: 'node-out-1', label: 'Validated Brief', animated: true },
      ],
    },
  },
  {
    id: 'tmpl-code-review',
    name: 'Multi-Agent Code Audit & Refactoring Mesh',
    description: 'Security Scanner, Code Refactorer, and Automated Test Suite Generator working in sync.',
    graph: {
      nodes: [
        {
          id: 'c-trig',
          type: 'trigger',
          label: 'Git Commit Webhook',
          x: 80,
          y: 220,
          data: { triggerPrompt: 'Scan pull request #142 for OWASP vulnerabilities and refactor bottlenecks' },
        },
        {
          id: 'c-ag-1',
          type: 'agent',
          label: 'SecOps Audit Lead',
          x: 360,
          y: 140,
          data: {
            agentName: 'SecOps Audit Lead',
            agentRole: 'Lead / Supervisor',
            model: 'gemini-2.5-pro',
            systemPrompt: 'Analyzes AST and dependencies for CVE vulnerabilities.',
            temperature: 0.1,
            hierarchyLevel: 'Lead / Supervisor',
          },
        },
        {
          id: 'c-tool-1',
          type: 'tool',
          label: 'AST Static Analyzer',
          x: 680,
          y: 80,
          data: {
            toolName: 'AST Parser',
            toolCategory: 'Code Execution',
            toolDescription: 'Parses TypeScript AST for memory leaks and injection vectors.',
          },
        },
        {
          id: 'c-ag-2',
          type: 'agent',
          label: 'Refactoring Specialist',
          x: 680,
          y: 280,
          data: {
            agentName: 'Refactoring Specialist',
            agentRole: 'Specialist',
            model: 'gemini-2.5-flash',
            systemPrompt: 'Rewrites code for performance, modularity, and clean type safety.',
            temperature: 0.3,
            hierarchyLevel: 'Specialist',
          },
        },
        {
          id: 'c-out',
          type: 'output',
          label: 'Automated PR Review Summary',
          x: 1000,
          y: 200,
          data: {
            outputFormat: 'GitHub Pull Request Markdown Comment + Inline Code Diffs',
          },
        },
      ],
      edges: [
        { id: 'ce1', sourceNodeId: 'c-trig', targetNodeId: 'c-ag-1', label: 'Code Payload', animated: true },
        { id: 'ce2', sourceNodeId: 'c-ag-1', targetNodeId: 'c-tool-1', label: 'AST Scan' },
        { id: 'ce3', sourceNodeId: 'c-ag-1', targetNodeId: 'c-ag-2', label: 'Refactor Plan' },
        { id: 'ce4', sourceNodeId: 'c-ag-2', targetNodeId: 'c-out', label: 'PR Comments', animated: true },
      ],
    },
  },
];
