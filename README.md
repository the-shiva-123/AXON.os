# 🤖 AXON.OS — Autonomous Agent Generator

> **Build autonomous AI agent collectives with mission-driven design, live execution simulation, and production-ready code export**

AXON.OS is a web-based platform for synthesizing teams of specialized AI agents from natural language mission briefs. Generate multi-agent systems with Gemini API, architect agent workflows, test them live in an interactive terminal, and export deployable code for any framework.

---

## 🎯 What Problems Does It Solve?

- **Agent Synthesis at Scale**: Define a mission goal → automatically generate a cohesive team of specialized agents with distinct roles, prompts, and tooling.
- **Rapid Agent Prototyping**: Test agent behavior interactively without writing boilerplate code.
- **Production Readiness**: Export fully functional agent collectives as deployable Python, JavaScript, or Go modules.
- **Multi-Agent Architecture Visualization**: Inspect agent hierarchy, capabilities, memory models, and inter-agent communication patterns.

---

## 🏗️ Stack & Architecture

### Core Technologies
- **Language**: TypeScript
- **Frontend**: React 19 + Vite + Tailwind CSS 4
- **Backend**: Express.js + Node.js runtime
- **AI Engine**: Google Gemini 2.5 Flash API
- **UI Components**: Lucide React (icons) + Motion (animations)

### Key Libraries
- `@google/genai` — Gemini API integration
- `express` — HTTP server for agent API endpoints
- `react-markdown` — Rich text rendering for agent descriptions
- `@tailwindcss/vite` — Zero-config Tailwind integration
- `dotenv` — Runtime environment configuration

---

## 📂 How It's Organized

```
AXON.OS/
├── src/
│   ├── App.tsx                    # Main app shell, tab routing, agent lifecycle
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Tailwind directives
│   ├── components/
│   │   ├── DraftsGeneratorView    # Mission brief → agent generation UI
│   │   ├── ArchitectureView       # Agent cards, hierarchy, edit interface
│   │   ├── ExecutionsTerminalView # Live agent chat & simulation terminal
│   │   ├── DeploymentsExportView  # Multi-framework code export
│   │   ├── AgentDetailModal       # Agent editing (prompts, tools, memory)
│   │   ├── Navbar & FooterBar     # Navigation & status indicators
│   │   └── FormattedMarkdown      # Markdown renderer for agent descriptions
│   ├── server/
│   │   └── geminiService.ts       # Gemini API integration (generation, chat, simulation)
│   ├── types/
│   │   └── agent.ts               # TypeScript interfaces for agents & collectives
│   └── data/
│       └── (predefined templates, examples)
│
├── server.ts                      # Production Express server
├── vite.config.ts                 # Vite + custom API plugin for dev routing
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # TypeScript configuration
├── index.html                     # HTML root
├── metadata.json                  # AI Studio app metadata
├── .env.example                   # Environment template (GEMINI_API_KEY, APP_URL)
└── assets/                        # Static images & icons
```

### Data Flow

1. **Agent Generation** (Drafts tab):
   - User enters a mission brief and agent count
   - `DraftsGeneratorView` POSTs to `/api/generate-collective`
   - `geminiService` prompts Gemini to synthesize agent definitions (roles, tools, system prompts)
   - Collective saved to React state & localStorage

2. **Agent Architecture** (Architecture tab):
   - `ArchitectureView` displays each agent as an editable card
   - User can manually refine agent parameters via `AgentDetailModal`
   - Changes immediately reflect in collective state

3. **Live Execution** (Executions tab):
   - `ExecutionsTerminalView` provides a chat interface to test individual agents
   - `/api/agent-chat` sends user prompts to selected agents via Gemini
   - `/api/simulate-collective` orchestrates multi-agent workflows (e.g., sequential task handoff)
   - Terminal logs execution steps, agent outputs, and collaboration events

4. **Code Export** (Deployments tab):
   - `DeploymentsExportView` generates framework-specific boilerplate
   - Exports Python (FastAPI), JavaScript (Node.js), or Go (Chi) agent runners
   - Each agent's system prompt and tools embedded in generated code

---

## 🚀 How to Run It

### Prerequisites
- Node.js 18+ and Bun (or npm)
- Gemini API key ([create one here](https://aistudio.google.com/apikey))

### Local Development

1. **Clone & install**:
   ```bash
   git clone https://github.com/the-shiva-123/AXON.os.git
   cd AXON.os
   bun install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   export GEMINI_API_KEY="your-api-key-here"
   ```

3. **Start dev server** (with HMR):
   ```bash
   bun run dev
   ```
   Opens `http://localhost:3000` with hot-reload enabled.

4. **Lint & typecheck**:
   ```bash
   bun run lint
   ```

### Production Build & Deployment

```bash
# Build frontend + prepare server
bun run build

# Start production server
bun run start
```

Server runs on port 3000 (or `$PORT` env var) and serves the built React app from `./dist`.

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API authentication key |
| `APP_URL` | ✅ Yes (production) | Public URL of the deployed app; used for OAuth & self-referential links |
| `PORT` | ❌ No | Express server port (default: 3000) |
| `DISABLE_HMR` | ❌ No | Set to `'true'` to disable hot module reload in dev |

---

## 🧬 Core Agent Concepts

### Agent Definition
Each agent in a collective has:
- **Role** (e.g., "Research Analyst", "Code Reviewer")
- **System Prompt** — LLM behavior instructions
- **Temperature** — Creativity level (0 = deterministic, 1 = creative)
- **Model** — Gemini model identifier (default: `gemini-2.5-flash`)
- **Tools** — Capabilties (e.g., Web Search, Code Execution, Database Query)
- **Input/Output Schemas** — JSON schemas for structured I/O
- **Memory Type** — Short-term context or long-term persistence
- **Hierarchy Level** — Orchestrator, Specialist, or Worker

### Agent Collective
A collective is:
- A curated team of agents aligned to a shared mission
- An orchestration pattern (Hierarchical Supervisor, Peer-to-Peer, Sequential Pipeline)
- Metadata: mission overview, domain focus, suggested first task, creation timestamp

---

## 📖 API Endpoints

All endpoints accept POST requests with JSON bodies.

### `/api/generate-collective`
**Purpose**: Generate an autonomous agent team from a mission brief.

**Request**:
```json
{
  "missionBrief": "Build a customer support chatbot that handles inquiries, escalates to humans, and logs tickets.",
  "agentCount": 3,
  "domainFocus": "Customer Support"
}
```

**Response**:
```json
{
  "id": "coll-1725...",
  "title": "Customer Support Team",
  "missionOverview": "...",
  "orchestrationPattern": "Hierarchical Supervisor",
  "agents": [
    { "id": "agent-1", "name": "Support Lead", "role": "Orchestrator", "systemPrompt": "...", ... },
    { "id": "agent-2", "name": "Chat Handler", "role": "Specialist", ... },
    ...
  ]
}
```

### `/api/agent-chat`
**Purpose**: Send a message to a specific agent and receive a response.

**Request**:
```json
{
  "agentId": "agent-2",
  "message": "How do I reset my password?",
  "conversationHistory": [...]
}
```

**Response**:
```json
{
  "reply": "To reset your password, visit the login page and click 'Forgot Password?'..."
}
```

### `/api/simulate-collective`
**Purpose**: Execute a multi-agent workflow simulating collaboration on a task.

**Request**:
```json
{
  "collectiveId": "coll-1725...",
  "task": "Process a customer complaint and generate a support ticket.",
  "maxSteps": 5
}
```

**Response**:
```json
{
  "steps": [
    { "stepNumber": 1, "agentName": "Support Lead", "action": "Analyze complaint", "output": "..." },
    { "stepNumber": 2, "agentName": "Chat Handler", "action": "Draft response", "output": "..." },
    ...
  ]
}
```

---

## 🎮 Usage Example

### Step 1: Generate an Agent Collective
1. Open the **Drafts** tab
2. Enter a mission brief: *"Build an autonomous financial analysis team that can fetch market data, analyze trends, and recommend portfolio actions."*
3. Set agent count to 4
4. Click **Generate**

### Step 2: Review & Refine
1. Navigate to the **Architecture** tab
2. Inspect the generated agents (e.g., Data Fetcher, Analyst, Risk Assessor, Advisor)
3. Edit any agent: click its card → modify system prompt, tools, temperature
4. Add custom agents if needed

### Step 3: Test Live
1. Go to the **Executions** tab (or click **Run Terminal** from Architecture)
2. Select an agent from the dropdown
3. Type a prompt: *"What's the current trend in tech stocks?"*
4. Watch the agent respond with live output
5. Simulate multi-agent workflows: click **Run Collective Simulation**

### Step 4: Export for Production
1. Navigate to the **Deployments** tab
2. Choose a framework (Python FastAPI, Node.js, Go)
3. Download the generated project
4. Deploy using Docker, Kubernetes, or your preferred platform

---

## 🔧 Development Workflow

### Adding a New Component
1. Create a new file in `src/components/YourComponent.tsx`
2. Export from `App.tsx`
3. Add state management in `App.tsx` if needed
4. Changes auto-reload with Vite HMR

### Extending geminiService
1. Edit `src/server/geminiService.ts`
2. Add new service functions (e.g., `generateAgentTools()`)
3. Export from `server.ts` and/or `vite.config.ts` middleware
4. Test via API endpoints in dev or production server

### Updating Agent Types
1. Modify `src/types/agent.ts`
2. Update components using those types
3. Re-sync backend services if needed

---

## 🚢 Deployment

### Google Cloud Run (Recommended)
```bash
# Build image
gcloud builds submit --tag gcr.io/YOUR-PROJECT/axon-os

# Deploy
gcloud run deploy axon-os \
  --image gcr.io/YOUR-PROJECT/axon-os \
  --set-env-vars GEMINI_API_KEY="your-key",APP_URL="https://axon-os-*.run.app" \
  --memory 1Gi \
  --timeout 300
```

### Docker
```bash
docker build -t axon-os .
docker run -p 3000:3000 \
  -e GEMINI_API_KEY="your-key" \
  -e APP_URL="http://localhost:3000" \
  axon-os
```

### Environment Secrets
Use your platform's secrets manager to inject `GEMINI_API_KEY` and `APP_URL` at runtime.

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/server/geminiService.ts` | All Gemini API logic: generation, chat, simulation |
| `src/App.tsx` | App state, tab routing, agent lifecycle management |
| `src/components/DraftsGeneratorView.tsx` | Mission brief form & generation trigger |
| `src/components/ArchitectureView.tsx` | Agent card grid & visual hierarchy |
| `src/components/ExecutionsTerminalView.tsx` | Interactive agent chat & multi-agent simulation |
| `src/components/DeploymentsExportView.tsx` | Framework-specific code generation & export |
| `src/types/agent.ts` | TypeScript agent & collective type definitions |
| `vite.config.ts` | Custom API middleware for dev-time routing |
| `server.ts` | Production Express server setup |

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with clear messages
4. Push and open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔗 Resources

- **[Google Gemini API Docs](https://ai.google.dev/docs)**
- **[React 19 Documentation](https://react.dev)**
- **[Vite Guide](https://vitejs.dev)**
- **[Tailwind CSS](https://tailwindcss.com)**
- **[Express.js](https://expressjs.com)**

---

## 🆘 Support & Troubleshooting

### Agent generation returns empty response
- Check that `GEMINI_API_KEY` is set and valid
- Verify Gemini API is enabled in your Google Cloud project
- Check browser console for network errors

### Port 3000 already in use
- Change port: `bun run dev -- --port 3001`
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

### HMR not working
- Set `DISABLE_HMR=false` in `.env`
- Ensure browser has WebSocket access to dev server

### localStorage is cleared
- Collectives are auto-saved; check browser DevTools → Application → Local Storage
- Export collectives from Deployments tab before clearing storage

---

## 🌟 Roadmap

- [ ] Agent persistence (database backend)
- [ ] Multi-user collaboration & project sharing
- [ ] Advanced memory modes (vector DBs, RAG)
- [ ] Custom tool builder UI
- [ ] Agent performance analytics & monitoring
- [ ] Workflow visualization & debugging
- [ ] Integration with external LLMs (OpenAI, Anthropic)

---

**Built with ❤️ for autonomous intelligence by the AXON team.**
