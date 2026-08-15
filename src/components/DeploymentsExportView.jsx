import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Terminal, Layers, FileCode } from 'lucide-react';

export const DeploymentsExportView = ({ collective }) => {
  const [exportFormat, setExportFormat] = useState('crewai');
  const [copied, setCopied] = useState(false);

  if (!collective || collective.agents.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 p-12 bg-white border border-gray-200 text-center flex flex-col items-center gap-4">
        <Code2 className="w-12 h-12 text-black" />
        <h2 className="text-xl font-bold uppercase tracking-wider">No Architecture to Export</h2>
        <p className="text-xs text-gray-500 font-light max-w-md">
          Synthesize an agent architecture first in the Drafts tab before exporting code blueprints.
        </p>
      </div>
    );
  }

  const generateCode = () => {
    if (exportFormat === 'crewai') {
      return generateCrewAICode(collective);
    } else if (exportFormat === 'langchain') {
      return generateLangChainCode(collective);
    } else if (exportFormat === 'genai-ts') {
      return generateGenAITsCode(collective);
    } else if (exportFormat === 'json') {
      return JSON.stringify(collective, null, 2);
    } else if (exportFormat === 'yaml') {
      return generateYAMLCode(collective);
    }
    return '';
  };

  const codeContent = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions = {
      crewai: 'py',
      langchain: 'py',
      'genai-ts': 'ts',
      json: 'json',
      yaml: 'yaml',
    };
    const ext = extensions[exportFormat] || 'txt';
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collective.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-collective.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-6 px-4 md:px-0">
      {/* Export Header */}
      <div className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">
            Code & Infrastructure Blueprint
          </span>
          <h2 className="text-xl font-bold uppercase tracking-wider text-black">
            Deploy {collective.title}
          </h2>
          <p className="text-xs text-gray-500 font-light">
            Export production-ready multi-agent orchestration code in your framework of choice.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-gray-100 text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2 border border-gray-200"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Blueprint</span>
          </button>
        </div>
      </div>

      {/* Format Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 text-xs font-bold uppercase tracking-widest">
        <button
          onClick={() => setExportFormat('crewai')}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            exportFormat === 'crewai'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-200 hover:border-black'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>CrewAI (Python)</span>
        </button>

        <button
          onClick={() => setExportFormat('langchain')}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            exportFormat === 'langchain'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-200 hover:border-black'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>LangChain / LangGraph</span>
        </button>

        <button
          onClick={() => setExportFormat('genai-ts')}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            exportFormat === 'genai-ts'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-200 hover:border-black'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Google GenAI SDK (TS)</span>
        </button>

        <button
          onClick={() => setExportFormat('json')}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            exportFormat === 'json'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-200 hover:border-black'
          }`}
        >
          <span>JSON Schema</span>
        </button>

        <button
          onClick={() => setExportFormat('yaml')}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            exportFormat === 'yaml'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-200 hover:border-black'
          }`}
        >
          <span>YAML Spec</span>
        </button>
      </div>

      {/* Code Editor Preview Window */}
      <div className="bg-[#111111] border border-black text-gray-100 p-6 font-mono text-xs shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <span>Target Architecture: {collective.title}</span>
          <span>
            {exportFormat.toUpperCase()} • {collective.agents.length} AGENTS BINDING
          </span>
        </div>

        <pre className="mt-4 overflow-x-auto whitespace-pre font-mono text-xs leading-relaxed text-emerald-400 max-h-[500px]">
          {codeContent}
        </pre>
      </div>
    </div>
  );
};

// Helper code generators
function generateCrewAICode(c) {
  const agentDefs = c.agents
    .map(
      (a) => `
# Agent ${a.number}: ${a.name}
${a.id.replace(/-/g, '_')} = Agent(
    role="${a.role}",
    goal="Execute tasks for ${c.title}",
    backstory="""${a.systemPrompt.replace(/"/g, '\\"')}""",
    verbose=True,
    allow_delegation=${a.hierarchyLevel === 'Lead / Supervisor' ? 'True' : 'False'},
    tools=[${a.tools.map((t) => `"${t.name}"`).join(', ')}]
)`
    )
    .join('\n');

  return `import os
from crewai import Agent, Task, Crew, Process

# Configure Gemini API key
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY", "your-gemini-key")

${agentDefs}

# Define Collective Workflow Task
mission_task = Task(
    description="${c.suggestedFirstTask}",
    expected_output="Verified operational artifact and compliance report.",
    agent=${c.agents[0]?.id.replace(/-/g, '_') || 'leader_agent'}
)

# Initialize Crew
axon_crew = Crew(
    agents=[${c.agents.map((a) => a.id.replace(/-/g, '_')).join(', ')}],
    tasks=[mission_task],
    process=Process.sequential
)

if __name__ == "__main__":
    result = axon_crew.kickoff()
    print("AXON Collective Execution Result:")
    print(result)
`;
}

function generateLangChainCode(c) {
  return `import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END

os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY", "")

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

# Define Agent Prompts
agents_config = {
${c.agents
  .map(
    (a) => `    "${a.id}": {
        "name": "${a.name}",
        "role": "${a.role}",
        "system_prompt": """${a.systemPrompt.replace(/"/g, '\\"')}"""
    }`
  )
  .join(',\n')}
}

print(f"Loaded {len(agents_config)} AXON agents for LangChain graph initialization.")
`;
}

function generateGenAITsCode(c) {
  return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const collectiveConfig = ${JSON.stringify(c, null, 2)};

export async function runAgentStep(agentId, inputPrompt) {
  const agent = collectiveConfig.agents.find(a => a.id === agentId);
  if (!agent) throw new Error(\`Agent \${agentId} not found\`);

  const response = await ai.models.generateContent({
    model: agent.model || 'gemini-2.5-flash',
    contents: inputPrompt,
    config: {
      systemInstruction: agent.systemPrompt,
      temperature: agent.temperature,
    }
  });

  return response.text;
}
`;
}

function generateYAMLCode(c) {
  return `title: "${c.title}"
missionOverview: "${c.missionOverview}"
orchestrationPattern: "${c.orchestrationPattern}"
suggestedFirstTask: "${c.suggestedFirstTask}"
domainFocus: "${c.domainFocus}"
agents:
${c.agents
  .map(
    (a) => `  - id: "${a.id}"
    number: "${a.number}"
    name: "${a.name}"
    role: "${a.role}"
    title: "${a.title}"
    hierarchyLevel: "${a.hierarchyLevel}"
    temperature: ${a.temperature}
    model: "${a.model}"
    tools:
${a.tools.map((t) => `      - name: "${t.name}"\n        category: "${t.category}"`).join('\n')}
`
  )
  .join('\n')}
`;
}
