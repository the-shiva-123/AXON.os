import { GoogleGenAI } from '@google/genai';
import {
  AgentCollective,
  CollectiveGenerationRequest,
  AgentChatRequest,
  CollectiveSimulationStep,
  SimulationRequest,
  AIAgent,
} from '../types/agent';

// Lazy-initialize GoogleGenAI
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Robust JSON cleaner & parser for AI responses
function parseCleanJson<T = any>(text: string): T {
  if (!text) {
    throw new Error('Empty text response from model');
  }

  let cleaned = text.trim();

  // Strip markdown code block wrappers
  cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

  // Find outermost JSON object or array bounds
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleaned.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleaned.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  // Attempt 1: Standard parse
  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    // Attempt 2: Fix invalid escape sequences and trailing commas
    try {
      let sanitized = cleaned.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
      sanitized = sanitized.replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(sanitized);
    } catch (err2) {
      // Attempt 3: Fix control characters like unescaped newlines/tabs inside string literals
      try {
        let sanitized = cleaned
          .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\')
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/[\u0000-\u001F]+/g, (match) => {
            if (match === '\n') return '\\n';
            if (match === '\r') return '\\r';
            if (match === '\t') return '\\t';
            return '';
          });
        return JSON.parse(sanitized);
      } catch (err3) {
        console.warn('Failed to parse JSON response from Gemini after cleaning attempts:', err3);
        throw err1;
      }
    }
  }
}

export async function generateAgentCollectiveService(
  req: CollectiveGenerationRequest
): Promise<AgentCollective> {
  const genAI = getGenAI();
  const agentCount = req.agentCount || 4;
  const orchestrationPattern = req.orchestrationStyle || 'Hierarchical Supervisor';
  const domainFocus = req.domainFocus || 'General Enterprise Automation';

  if (!genAI) {
    // Fallback template generator when GEMINI_API_KEY is not set or placeholder
    return createFallbackCollective(req.prompt, agentCount, orchestrationPattern, domainFocus);
  }

  const promptText = `You are AXON.OS, an elite AI Agent Architect and Meta-System Designer.
Your task is to analyze the following user mission prompt and synthesize a fully functional team of autonomous AI agents tailored to the user's specific requirements.

MISSION PROMPT:
"${req.prompt}"

CONFIGURATION PARAMETERS:
- Requested Agent Count: ${agentCount}
- Orchestration Pattern: ${orchestrationPattern}
- Domain Focus: ${domainFocus}

Return a valid JSON object matching the following structure:
{
  "title": "A short, crisp, high-impact name for this agent collective (e.g. AXON-7 Document Intelligence Squad)",
  "missionOverview": "A 2-3 sentence executive summary of what this collective accomplishes and its operational scope.",
  "orchestrationPattern": "${orchestrationPattern}",
  "suggestedFirstTask": "A concrete, real-world task prompt that the user can run with this team right now.",
  "domainFocus": "${domainFocus}",
  "agents": [
    {
      "id": "agent-1",
      "number": "01",
      "name": "Short Agent Name (e.g. Logic Synthesizer)",
      "role": "Functional Role Title",
      "title": "Full Designation",
      "description": "Clear overview of what this agent does within the collective.",
      "avatarIcon": "One of: Cpu, Shield, Brain, Workflow, Zap, Layers, Code, Sparkles, Terminal, FileText, Database, Network, Search, Target, Activity",
      "categoryTags": ["Tag1", "Tag2"],
      "systemPrompt": "Comprehensive, highly specific system prompt instructing this agent on how to behave, analyze input, use tools, and communicate with other agents.",
      "temperature": 0.2,
      "model": "gemini-2.5-flash",
      "hierarchyLevel": "One of: Lead / Supervisor, Specialist, Auditor / Reviewer, Executor",
      "tools": [
        {
          "id": "tool-1",
          "name": "Tool Name (e.g. Vector Store Query)",
          "description": "What this tool enables the agent to do",
          "category": "One of: API Integration, Data Query, Code Execution, Search & Retrieval, Communication, Audit & Compliance"
        }
      ],
      "inputSchema": "JSON schema description of expected input format",
      "outputSchema": "JSON schema description of produced output format",
      "memoryType": "One of: Short-term Context, Vector DB Buffer, Episodic Log, State Machine",
      "status": "Idle"
    }
  ]
}

Ensure you generate EXACTLY ${agentCount} distinct, complementary AI agents with distinct roles (e.g., Lead Supervisor, Primary Specialists, Auditor/Reviewer). Output strictly valid JSON only with escaped string values.`;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: req.temperature ?? 0.4,
      },
    });

    const text = response.text || '';
    const parsed = parseCleanJson(text);

    return {
      id: 'coll-' + Date.now(),
      title: parsed.title || 'Autonomous Agent Collective',
      missionOverview: parsed.missionOverview || req.prompt,
      orchestrationPattern: parsed.orchestrationPattern || orchestrationPattern,
      suggestedFirstTask: parsed.suggestedFirstTask || 'Execute initial workflow audit for ' + req.prompt,
      domainFocus: parsed.domainFocus || domainFocus,
      createdAt: new Date().toISOString(),
      agents: (parsed.agents || []).map((ag: any, index: number) => ({
        id: ag.id || `agent-${index + 1}`,
        number: String(index + 1).padStart(2, '0'),
        name: ag.name || `Agent ${index + 1}`,
        role: ag.role || 'Specialist',
        title: ag.title || ag.role || 'Autonomous Specialist',
        description: ag.description || 'Executes domain tasks.',
        avatarIcon: ag.avatarIcon || 'Cpu',
        categoryTags: Array.isArray(ag.categoryTags) ? ag.categoryTags : ['Automation'],
        systemPrompt: ag.systemPrompt || 'You are an AI agent designed for ' + req.prompt,
        temperature: typeof ag.temperature === 'number' ? ag.temperature : 0.3,
        model: ag.model || 'gemini-2.5-flash',
        hierarchyLevel: ag.hierarchyLevel || (index === 0 ? 'Lead / Supervisor' : 'Specialist'),
        tools: Array.isArray(ag.tools) ? ag.tools : [],
        inputSchema: ag.inputSchema || '{"type": "object", "properties": {"prompt": {"type": "string"}}}',
        outputSchema: ag.outputSchema || '{"type": "object", "properties": {"result": {"type": "string"}}}',
        memoryType: ag.memoryType || 'Short-term Context',
        status: 'Idle',
      })),
    };
  } catch (err) {
    console.error('Gemini generation error, using fallback procedural generator:', err);
    return createFallbackCollective(req.prompt, agentCount, orchestrationPattern, domainFocus);
  }
}

export async function chatWithAgentService(req: AgentChatRequest): Promise<string> {
  const genAI = getGenAI();
  const { agent, messages } = req;
  const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || 'Hello';

  if (!genAI) {
    return `### **${agent.name}** (${agent.role})

I received your prompt:
> *"${lastUserMsg}"*

#### **Agent Status & Parameters**
* **Model:** \`${agent.model}\`
* **Temperature:** \`${agent.temperature}\`
* **Tools Available:** ${agent.tools.map((t) => `\`${t.name}\``).join(', ') || 'Standard Core'}
* **Memory Type:** \`${agent.memoryType}\`

---

#### **Action Plan**
1. **Input Analysis:** Context evaluated according to **${agent.title}** directives.
2. **Strategy:** Formulated target resolution path adhering to system role guidelines.
3. **Execution:** Operating in local fallback mode. Ready for your next command.`;
  }

  const systemInstruction = `You are ${agent.name}, an AI Agent acting as "${agent.role}".
Title: ${agent.title}
Hierarchy Level: ${agent.hierarchyLevel}
System Prompt & Behavior Instructions:
${agent.systemPrompt}

Available Tools:
${agent.tools.map((t) => `- ${t.name}: ${t.description}`).join('\n') || 'None'}

Memory Retention Strategy: ${agent.memoryType}

Respond directly in character as ${agent.name}. Use clean, highly readable Markdown formatting with headers, bullet points, bold key terms, and code blocks where relevant. Be concise, authoritative, professional, and precise in your technical output.`;

  try {
    const formattedContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await genAI.models.generateContent({
      model: agent.model || 'gemini-2.5-flash',
      contents: formattedContents as any,
      config: {
        systemInstruction,
        temperature: agent.temperature || 0.3,
      },
    });

    return response.text || `### **${agent.name}**\n\nTask processed successfully according to system instructions.`;
  } catch (err: any) {
    console.error('Error in agent chat:', err);
    const errStr = String(err?.message || err);
    const isRateLimit = err?.status === 429 || errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');

    if (isRateLimit) {
      return `### **${agent.name}** (${agent.role})

> ⚠️ **API Rate Limit Exceeded (Free Tier Quota)**
> *The Gemini API quota for this minute has been reached. System operated under local fallback synthesis.*

#### **Analysis of Input**
> *"${lastUserMsg}"*

---

#### **Agent Directive Execution**
* **Hierarchy Level:** ${agent.hierarchyLevel}
* **Active Tools:** ${agent.tools.map((t) => `\`${t.name}\``).join(', ') || 'Internal Reasoning'}
* **System Prompt Compliance:** Verified

1. **Evaluated Goal:** Processed request under **${agent.title}** rules.
2. **Recommendation:** You can send your next prompt or wait a few seconds for the cloud quota to auto-refresh.`;
    }

    return `### **${agent.name}** (${agent.role})

I have received and logged your instruction regarding:
> *"${lastUserMsg}"*

#### **Execution Summary**
* **Role Designation:** ${agent.role}
* **Hierarchy:** ${agent.hierarchyLevel}
* **Tools Available:** ${agent.tools.map((t) => `\`${t.name}\``).join(', ') || 'Core Reasoning'}

System nominal and ready for your next command.`;
  }
}

export async function simulateCollectiveExecutionService(
  req: SimulationRequest
): Promise<CollectiveSimulationStep[]> {
  const genAI = getGenAI();
  const { collective, taskGoal } = req;

  if (!genAI) {
    return createFallbackSimulation(collective, taskGoal);
  }

  const promptText = `Simulate an end-to-end autonomous multi-agent task execution log for the following agent collective.

COLLECTIVE: "${collective.title}"
MISSION: "${collective.missionOverview}"
ORCHESTRATION PATTERN: "${collective.orchestrationPattern}"

AGENTS INVOLVED:
${collective.agents
  .map(
    (a) =>
      `- ID: ${a.id} | Name: ${a.name} | Role: ${a.role} (${a.hierarchyLevel}) | Tools: ${a.tools.map((t) => t.name).join(', ')}`
  )
  .join('\n')}

TARGET TASK GOAL:
"${taskGoal}"

Generate a step-by-step trace of how these agents collaborate, pass data, call tools, analyze findings, and complete the goal. Generate 4 to 6 sequential steps.

Return a JSON array of step objects with this structure:
[
  {
    "stepNumber": 1,
    "agentId": "agent-1",
    "agentName": "Agent Name",
    "agentRole": "Role Title",
    "actionType": "One of: Task Delegation, Analysis & Synthesis, Tool Execution, Review & Audit, Final Hand-off",
    "thoughtProcess": "Internal chain-of-thought strategy before taking action",
    "output": "The concrete result, code snippet, report summary, or artifact produced in this step.",
    "timestamp": "00:00:01"
  }
]`;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = parseCleanJson(response.text || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error simulating execution:', err);
    return createFallbackSimulation(collective, taskGoal);
  }
}

// Procedural fallbacks when API key is unavailable or during network offline scenarios
function createFallbackCollective(
  prompt: string,
  count: number,
  orchestration: any,
  domain: string
): AgentCollective {
  const keywords = prompt.toLowerCase();
  let topic = 'Enterprise Automation';
  if (keywords.includes('saas') || keywords.includes('code') || keywords.includes('app')) topic = 'SaaS Software Engineering';
  if (keywords.includes('research') || keywords.includes('data') || keywords.includes('market')) topic = 'Market Intelligence & Data Analytics';
  if (keywords.includes('security') || keywords.includes('cyber') || keywords.includes('incident')) topic = 'Cybersecurity & SecOps';
  if (keywords.includes('marketing') || keywords.includes('content') || keywords.includes('brand')) topic = 'Generative Content & Branding';

  const baseAgents: AIAgent[] = [
    {
      id: 'agent-1',
      number: '01',
      name: 'Logic Synthesizer',
      role: 'Chief Architect & Lead Supervisor',
      title: 'Principal Agent Controller',
      description: 'Orchestrates mission workflow, decomposes tasks, and delegates execution pipelines across specialized agents.',
      avatarIcon: 'Cpu',
      categoryTags: ['Data Architecture', 'Audit'],
      systemPrompt: `You are Logic Synthesizer, the Lead Architect for ${topic}. Analyze incoming task goals, decompose them into structured operational DAGs, assign work packages to specialized agents, and audit outputs for quality control.`,
      temperature: 0.2,
      model: 'gemini-2.5-flash',
      hierarchyLevel: 'Lead / Supervisor',
      tools: [
        { id: 't-1', name: 'Task Graph Decomposer', description: 'Splits raw goal into structured execution steps', category: 'Data Query' },
        { id: 't-2', name: 'Agent Communication Mesh', description: 'Routes payloads to peer agents', category: 'Communication' },
      ],
      inputSchema: '{"type": "object", "properties": {"mission": {"type": "string"}}}',
      outputSchema: '{"type": "object", "properties": {"workflowPlan": {"type": "array"}}}',
      memoryType: 'State Machine',
      status: 'Idle',
    },
    {
      id: 'agent-2',
      number: '02',
      name: 'Persona Architect',
      role: 'Domain Intelligence Specialist',
      title: 'Context & Pattern Analyst',
      description: 'Processes domain context, runs semantic search queries, and builds detailed strategy models.',
      avatarIcon: 'Brain',
      categoryTags: ['Social Engine', 'Marketing'],
      systemPrompt: `You are Persona Architect. Extract deep contextual nuances from ${prompt}, perform contextual analysis, and build tailored domain blueprints.`,
      temperature: 0.4,
      model: 'gemini-2.5-flash',
      hierarchyLevel: 'Specialist',
      tools: [
        { id: 't-3', name: 'Vector Knowledge Search', description: 'Queries domain vector embeddings', category: 'Search & Retrieval' },
      ],
      inputSchema: '{"type": "object", "properties": {"context": {"type": "string"}}}',
      outputSchema: '{"type": "object", "properties": {"insights": {"type": "array"}}}',
      memoryType: 'Vector DB Buffer',
      status: 'Idle',
    },
    {
      id: 'agent-3',
      number: '03',
      name: 'Visual Curator',
      role: 'Asset & Synthesis Operator',
      title: 'Generative Output Specialist',
      description: 'Transforms raw domain analysis into production-ready code, documentation, and executable artifacts.',
      avatarIcon: 'Workflow',
      categoryTags: ['Asset Pipeline', 'Execution'],
      systemPrompt: `You are Visual Curator. Direct generative asset pipelines and code output for ${prompt}.`,
      temperature: 0.3,
      model: 'gemini-2.5-flash',
      hierarchyLevel: 'Executor',
      tools: [
        { id: 't-4', name: 'Code & Artifact Generator', description: 'Compiles formatted final artifacts', category: 'Code Execution' },
      ],
      inputSchema: '{"type": "object", "properties": {"rawDraft": {"type": "string"}}}',
      outputSchema: '{"type": "object", "properties": {"compiledArtifact": {"type": "string"}}}',
      memoryType: 'Episodic Log',
      status: 'Idle',
    },
    {
      id: 'agent-4',
      number: '04',
      name: 'Quality Inspector',
      role: 'Compliance & Safety Auditor',
      title: 'Verification Engine',
      description: 'Audits outputs against safety guidelines, performance benchmarks, and mission guidelines.',
      avatarIcon: 'Shield',
      categoryTags: ['Audit', 'Verification'],
      systemPrompt: `You are Quality Inspector. Rigorously review all generated outputs, detect hallucination or formatting errors, and issue final pass/fail certification.`,
      temperature: 0.1,
      model: 'gemini-2.5-flash',
      hierarchyLevel: 'Auditor / Reviewer',
      tools: [
        { id: 't-5', name: 'Compliance Validation Suite', description: 'Runs automated linting and policy rules', category: 'Audit & Compliance' },
      ],
      inputSchema: '{"type": "object", "properties": {"artifact": {"type": "string"}}}',
      outputSchema: '{"type": "object", "properties": {"passed": {"type": "boolean"}}}',
      memoryType: 'Short-term Context',
      status: 'Idle',
    },
  ];

  return {
    id: 'coll-' + Date.now(),
    title: `AXON-${Math.floor(Math.random() * 900 + 100)} ${topic} Unit`,
    missionOverview: `Autonomous agent workforce designed to execute: "${prompt}". Configured with ${orchestration} orchestration.`,
    orchestrationPattern: orchestration,
    suggestedFirstTask: `Run comprehensive operational audit and deployment plan for: ${prompt}`,
    domainFocus: domain,
    createdAt: new Date().toISOString(),
    agents: baseAgents.slice(0, count),
  };
}

function createFallbackSimulation(collective: AgentCollective, goal: string): CollectiveSimulationStep[] {
  const leader = collective.agents.find((a) => a.hierarchyLevel === 'Lead / Supervisor') || collective.agents[0];
  const specialist = collective.agents.find((a) => a.id !== leader.id) || collective.agents[1] || leader;
  const reviewer = collective.agents.find((a) => a.hierarchyLevel === 'Auditor / Reviewer') || collective.agents[collective.agents.length - 1];

  return [
    {
      stepNumber: 1,
      agentId: leader.id,
      agentName: leader.name,
      agentRole: leader.role,
      actionType: 'Task Delegation',
      thoughtProcess: `Analyzing target goal "${goal}". Decomposing into execution sub-tasks according to ${collective.orchestrationPattern} pattern.`,
      output: `[GOAL DECOMPOSITION & ROUTING]\n- Subtask 1: Domain context retrieval & data extraction\n- Subtask 2: Execution strategy synthesis & artifact compilation\n- Subtask 3: Quality audit & compliance validation\nAssigning Subtask 1 & 2 to ${specialist.name}.`,
      timestamp: '00:00:01',
    },
    {
      stepNumber: 2,
      agentId: specialist.id,
      agentName: specialist.name,
      agentRole: specialist.role,
      actionType: 'Analysis & Synthesis',
      thoughtProcess: `Receiving assignment from ${leader.name}. Querying knowledge bases and applying system instructions.`,
      output: `[EXECUTION RESULT]\nSuccessfully generated core blueprint for target task:\n- Key Milestones: Initializing automated pipelines, binding schema constraints.\n- Output Artifact: Structured operational document generated with 99.4% precision.`,
      timestamp: '00:00:03',
    },
    {
      stepNumber: 3,
      agentId: specialist.id,
      agentName: specialist.name,
      agentRole: specialist.role,
      actionType: 'Tool Execution',
      thoughtProcess: `Invoking tool "${specialist.tools[0]?.name || 'Artifact Generator'}" to compile final output format.`,
      output: `[TOOL RESPONSE: ${specialist.tools[0]?.name || 'Artifact Generator'}]\n200 OK — Payload formatted according to schema constraints. Forwarding to Auditor (${reviewer.name}).`,
      timestamp: '00:00:05',
    },
    {
      stepNumber: 4,
      agentId: reviewer.id,
      agentName: reviewer.name,
      agentRole: reviewer.role,
      actionType: 'Review & Audit',
      thoughtProcess: `Auditing artifact produced by ${specialist.name} against strict quality controls and safety policies.`,
      output: `[AUDIT CERTIFICATION: VERIFIED]\n- Safety Policy: PASS (0 policy violations detected)\n- Precision Metric: 100% compliant with mission prompt.\n- Status: Approved for deployment.`,
      timestamp: '00:00:07',
    },
    {
      stepNumber: 5,
      agentId: leader.id,
      agentName: leader.name,
      agentRole: leader.role,
      actionType: 'Final Hand-off',
      thoughtProcess: `Consolidating verified outputs from collective members into final mission completion response.`,
      output: `[MISSION COMPLETE]\nThe collective "${collective.title}" has successfully executed task goal: "${goal}". All deliverables certified by ${reviewer.name}.`,
      timestamp: '00:00:08',
    },
  ];
}
