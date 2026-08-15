import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  buildGraphFromCollective,
  WORKFLOW_TEMPLATES,
} from '../data/workflowTemplates';
import {
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Bot,
  Wrench,
  Zap,
  GitFork,
  CheckCircle2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Settings,
  X,
  Code2,
  ArrowRight,
  Terminal,
  Save,
  Check,
  Copy,
} from 'lucide-react';
import { FormattedMarkdown } from './FormattedMarkdown';

export const WorkflowCanvasView = ({
  collective,
  onUpdateCollective,
  onRunSimulation,
}) => {
  // Graph state initialized from collective or default template
  const [graph, setGraph] = useState(() =>
    buildGraphFromCollective(collective)
  );

  // Sync graph if collective changes externally and graph is empty
  useEffect(() => {
    if (collective && collective.agents && collective.agents.length > 0 && graph.nodes.length <= 4) {
      setGraph(buildGraphFromCollective(collective));
    }
  }, [collective]);

  // Canvas Viewport Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Selected Node for Right Inspector
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Node Dragging State
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Wiring / Edge Creation state
  const [connectingSourceId, setConnectingSourceId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeExecutingNodeId, setActiveExecutingNodeId] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [hasCompiledAlert, setHasCompiledAlert] = useState(false);

  // Canvas Container Ref
  const canvasRef = useRef(null);

  // Helper to handle window / mouse pan
  const handleMouseDownCanvas = (e) => {
    if (e.target.closest('.node-card')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Calculate mouse position relative to zoom canvas
      const canvasX = (e.clientX - rect.left - pan.x) / zoom;
      const canvasY = (e.clientY - rect.top - pan.y) / zoom;
      setMousePos({ x: canvasX, y: canvasY });
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }

    if (draggedNodeId) {
      setGraph((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => {
          if (node.id === draggedNodeId) {
            return {
              ...node,
              x: Math.max(20, Math.round((e.clientX - dragOffset.x - pan.x) / zoom)),
              y: Math.max(20, Math.round((e.clientY - dragOffset.y - pan.y) / zoom)),
            };
          }
          return node;
        }),
      }));
    }
  };

  const handleMouseUpCanvas = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  // Node Mouse Down for Dragging
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggedNodeId(nodeId);

    const node = graph.nodes.find((n) => n.id === nodeId);
    if (node) {
      setDragOffset({
        x: e.clientX - (node.x * zoom + pan.x),
        y: e.clientY - (node.y * zoom + pan.y),
      });
    }
  };

  // Connection Port Wiring Logic
  const handlePortMouseDown = (e, nodeId, isOutput) => {
    e.stopPropagation();
    if (isOutput) {
      setConnectingSourceId(nodeId);
    } else if (connectingSourceId && connectingSourceId !== nodeId) {
      // Connect source to target
      const newEdge = {
        id: `e-${connectingSourceId}-${nodeId}-${Date.now()}`,
        sourceNodeId: connectingSourceId,
        targetNodeId: nodeId,
        animated: true,
      };

      // Avoid duplicate edges
      if (!graph.edges.some((e) => e.sourceNodeId === connectingSourceId && e.targetNodeId === nodeId)) {
        setGraph((prev) => ({
          ...prev,
          edges: [...prev.edges, newEdge],
        }));
      }
      setConnectingSourceId(null);
    }
  };

  // Remove Edge
  const handleDeleteEdge = (edgeId) => {
    setGraph((prev) => ({
      ...prev,
      edges: prev.edges.filter((e) => e.id !== edgeId),
    }));
  };

  // Add New Node
  const handleAddNode = (type) => {
    const id = `node-${type}-${Date.now()}`;
    let label = 'New Agent';
    let data = { model: 'gemini-2.5-flash', temperature: 0.3 };

    if (type === 'agent') {
      label = `Specialist Agent #${graph.nodes.filter((n) => n.type === 'agent').length + 1}`;
      data = {
        agentName: label,
        agentRole: 'Domain Specialist',
        model: 'gemini-2.5-flash',
        systemPrompt: 'You execute assigned subtasks with precision.',
        temperature: 0.3,
        hierarchyLevel: 'Specialist',
      };
    } else if (type === 'tool') {
      label = 'Custom Tool';
      data = {
        toolName: 'Code Sandbox Tool',
        toolCategory: 'Code Execution',
        toolDescription: 'Executes isolated JS/Python code snippets.',
      };
    } else if (type === 'router') {
      label = 'Logic Router';
      data = {
        conditionPrompt: 'Route task based on sentiment / complexity classification.',
      };
    } else if (type === 'trigger') {
      label = 'API Webhook Trigger';
      data = {
        triggerPrompt: 'Execute incoming JSON payload task request.',
      };
    } else if (type === 'output') {
      label = 'Pipeline Output';
      data = {
        outputFormat: 'JSON / Structured Summary',
      };
    }

    const newNode = {
      id,
      type,
      label,
      x: Math.round((300 - pan.x) / zoom) + Math.random() * 40,
      y: Math.round((200 - pan.y) / zoom) + Math.random() * 40,
      data,
    };

    setGraph((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setSelectedNodeId(id);
  };

  // Delete Node
  const handleDeleteNode = (nodeId) => {
    setGraph((prev) => ({
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId),
    }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  // Update Node Data
  const handleUpdateNode = (updatedNode) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)),
    }));
  };

  // Compile Visual Workflow Canvas back into Collective State
  const handleCompileToCollective = () => {
    const agentNodes = graph.nodes.filter((n) => n.type === 'agent');

    if (agentNodes.length === 0) {
      alert('Please add at least one AI Agent node to compile the workforce!');
      return;
    }

    const compiledAgents = agentNodes.map((n, idx) => {
      const numStr = String(idx + 1).padStart(2, '0');
      // Find connected tools
      const connectedToolEdges = graph.edges.filter((e) => e.sourceNodeId === n.id);
      const connectedToolNodeIds = connectedToolEdges.map((e) => e.targetNodeId);
      const toolNodes = graph.nodes.filter(
        (tn) => tn.type === 'tool' && connectedToolNodeIds.includes(tn.id)
      );

      const tools = toolNodes.map((tn, tIdx) => ({
        id: `tool-${tn.id}`,
        name: tn.data.toolName || tn.label,
        description: tn.data.toolDescription || 'Custom workflow tool',
        category: tn.data.toolCategory || 'Search & Retrieval',
      }));

      return {
        id: n.agentId || `compiled-agent-${n.id}`,
        number: numStr,
        name: n.data.agentName || n.label,
        role: n.data.agentRole || 'Specialist Operator',
        title: `${n.data.agentRole || 'Specialist'} Node`,
        description: n.data.systemPrompt || 'Executes workflow graph subtasks.',
        avatarIcon: 'Cpu',
        categoryTags: ['Visual Workflow', n.data.hierarchyLevel || 'Specialist'],
        systemPrompt: n.data.systemPrompt || 'You are an autonomous AI agent in the visual pipeline.',
        temperature: n.data.temperature || 0.3,
        model: n.data.model || 'gemini-2.5-flash',
        hierarchyLevel: n.data.hierarchyLevel || 'Specialist',
        tools: tools.length > 0 ? tools : [{ id: 't-default', name: 'Web Search', description: 'Search context', category: 'Search & Retrieval' }],
        inputSchema: '{"type": "object"}',
        outputSchema: '{"type": "object"}',
        memoryType: 'Short-term Context',
        status: 'Idle',
      };
    });

    const triggerNode = graph.nodes.find((n) => n.type === 'trigger');

    const newCollective = {
      id: collective?.id || `coll-visual-${Date.now()}`,
      title: collective?.title || 'Visual Workflow Collective',
      missionOverview: 'Agent workforce assembled via interactive Visual Workflow Canvas.',
      orchestrationPattern: 'Hierarchical Supervisor',
      suggestedFirstTask: triggerNode?.data.triggerPrompt || 'Execute visual node pipeline workflow',
      domainFocus: collective?.domainFocus || 'Visual Workflow Architecture',
      createdAt: new Date().toISOString(),
      agents: compiledAgents,
    };

    onUpdateCollective(newCollective);
    setHasCompiledAlert(true);
    setTimeout(() => setHasCompiledAlert(false), 3000);
  };

  // Run Visual Flow Simulation
  const handleRunVisualSimulation = async () => {
    if (graph.nodes.length === 0) return;
    setIsSimulating(true);
    setExecutionLogs([]);

    const triggerNode = graph.nodes.find((n) => n.type === 'trigger');
    const goalText = triggerNode?.data.triggerPrompt || 'Executing visual workflow pipeline...';

    setExecutionLogs((prev) => [...prev, `[CANVAS RUNTIME] Starting execution for pipeline goal: "${goalText}"`]);

    // Step through graph nodes in topological order or x-coordinate sequence
    const sortedNodes = [...graph.nodes].sort((a, b) => a.x - b.x);

    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      setActiveExecutingNodeId(node.id);

      let logMsg = '';
      if (node.type === 'trigger') {
        logMsg = `⚡ [TRIGGER] Fired payload: "${node.data.triggerPrompt || 'Task payload'}"`;
      } else if (node.type === 'agent') {
        logMsg = `🤖 [AGENT ${node.data.agentName || node.label}] Processing with model ${node.data.model || 'gemini-2.5-flash'} (temp: ${node.data.temperature || 0.3}). Generating chain-of-thought...`;
      } else if (node.type === 'tool') {
        logMsg = `🛠️ [TOOL EXECUTED] ${node.data.toolName || node.label} — Executed query safely.`;
      } else if (node.type === 'router') {
        logMsg = `🔀 [ROUTER DECISION] Passed condition evaluation (${node.data.conditionPrompt || 'Confidence > 80%'}).`;
      } else if (node.type === 'output') {
        logMsg = `📊 [PIPELINE OUTPUT] Successfully aggregated final result in ${node.data.outputFormat || 'Structured Markdown'}.`;
      }

      setExecutionLogs((prev) => [...prev, logMsg]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setActiveExecutingNodeId(null);
    setExecutionLogs((prev) => [...prev, `✅ [CANVAS RUNTIME] Workflow pipeline completed execution successfully.`]);
    setIsSimulating(false);
  };

  // Selected Node Object
  const selectedNode = graph.nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col bg-[#0b0c0f] text-gray-200 overflow-hidden relative border border-[#23252d] rounded-2xl shadow-2xl">
      {/* Top Controls Header */}
      <div className="h-14 bg-[#131418] border-b border-[#23252d] px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
        {/* Left Title & Preset Load */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm tracking-wide text-white">Visual Workflow Builder</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Interactive Canvas
            </span>
          </div>

          {/* Template Selector */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-mono text-gray-400">Load Blueprint:</span>
            <select
              onChange={(e) => {
                const tmpl = WORKFLOW_TEMPLATES.find((t) => t.id === e.target.value);
                if (tmpl) setGraph(tmpl.graph);
              }}
              className="px-2.5 py-1 bg-[#181a20] border border-[#282a36] text-xs font-mono text-gray-200 rounded focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose preset flow...</option>
              {WORKFLOW_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-3">
          {hasCompiledAlert && (
            <span className="text-xs font-mono text-emerald-400 animate-fadeIn flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Collective Updated!
            </span>
          )}

          <button
            onClick={handleCompileToCollective}
            className="px-3.5 py-1.5 bg-[#1f222e] hover:bg-blue-600/20 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            title="Compile visual node graph into collective architecture"
          >
            <Save className="w-3.5 h-3.5 text-blue-400" />
            <span>Sync to Collective</span>
          </button>

          <button
            onClick={handleRunVisualSimulation}
            disabled={isSimulating}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Executing Pipeline...' : 'Run Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Palette + Canvas + Right Inspector */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Palette Toolbar */}
        <div className="w-14 md:w-52 bg-[#131418] border-r border-[#23252d] p-3 flex flex-col gap-4 z-20 shrink-0">
          <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
            Node Components
          </span>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAddNode('agent')}
              className="p-2.5 md:px-3 md:py-2.5 bg-[#181a20] hover:bg-blue-600/20 text-gray-300 hover:text-white border border-[#282a36] hover:border-blue-500/40 rounded-xl transition-all flex items-center gap-2.5 text-xs font-semibold group shadow-sm"
              title="Add AI Agent Node"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline">AI Agent Node</span>
            </button>

            <button
              onClick={() => handleAddNode('tool')}
              className="p-2.5 md:px-3 md:py-2.5 bg-[#181a20] hover:bg-amber-600/20 text-gray-300 hover:text-white border border-[#282a36] hover:border-amber-500/40 rounded-xl transition-all flex items-center gap-2.5 text-xs font-semibold group shadow-sm"
              title="Add Tool Integration Node"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline">Tool Node</span>
            </button>

            <button
              onClick={() => handleAddNode('trigger')}
              className="p-2.5 md:px-3 md:py-2.5 bg-[#181a20] hover:bg-emerald-600/20 text-gray-300 hover:text-white border border-[#282a36] hover:border-emerald-500/40 rounded-xl transition-all flex items-center gap-2.5 text-xs font-semibold group shadow-sm"
              title="Add Trigger Node"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline">Trigger Node</span>
            </button>

            <button
              onClick={() => handleAddNode('router')}
              className="p-2.5 md:px-3 md:py-2.5 bg-[#181a20] hover:bg-purple-600/20 text-gray-300 hover:text-white border border-[#282a36] hover:border-purple-500/40 rounded-xl transition-all flex items-center gap-2.5 text-xs font-semibold group shadow-sm"
              title="Add Router Logic Node"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <GitFork className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline">Router Node</span>
            </button>

            <button
              onClick={() => handleAddNode('output')}
              className="p-2.5 md:px-3 md:py-2.5 bg-[#181a20] hover:bg-indigo-600/20 text-gray-300 hover:text-white border border-[#282a36] hover:border-indigo-500/40 rounded-xl transition-all flex items-center gap-2.5 text-xs font-semibold group shadow-sm"
              title="Add Output Aggregator Node"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline">Output Node</span>
            </button>
          </div>

          <hr className="border-[#23252d] my-1" />

          {/* Canvas Controls */}
          <div className="flex flex-col gap-2 mt-auto">
            <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
              Viewport
            </span>
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                className="p-2 bg-[#181a20] hover:bg-[#232530] text-gray-300 rounded-lg border border-[#282a36] transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="hidden md:inline text-[10px] font-mono text-gray-400">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="p-2 bg-[#181a20] hover:bg-[#232530] text-gray-300 rounded-lg border border-[#282a36] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="p-2 bg-[#181a20] hover:bg-[#232530] text-gray-300 rounded-lg border border-[#282a36] transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Canvas Area */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className="flex-1 h-full bg-[#0e0f13] relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        >
          {/* Zoom & Pan Scaled Group Container */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {/* SVG Layer for Connections & Wires */}
            <svg className="w-full h-full absolute inset-0 pointer-events-none z-0">
              <defs>
                <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                </linearGradient>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
              </defs>

              {/* Render Existing Edges */}
              {graph.edges.map((edge) => {
                const sourceNode = graph.nodes.find((n) => n.id === edge.sourceNodeId);
                const targetNode = graph.nodes.find((n) => n.id === edge.targetNodeId);
                if (!sourceNode || !targetNode) return null;

                // Port calculations (Right of source -> Left of target)
                const x1 = sourceNode.x + 240;
                const y1 = sourceNode.y + 60;
                const x2 = targetNode.x;
                const y2 = targetNode.y + 60;

                const dx = Math.abs(x2 - x1) * 0.5;
                const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                const isExecutingEdge =
                  activeExecutingNodeId === sourceNode.id ||
                  activeExecutingNodeId === targetNode.id;

                return (
                  <g key={edge.id} className="pointer-events-auto">
                    {/* Clickable thicker background path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      className="cursor-pointer hover:stroke-red-500/20 transition-colors"
                      onClick={() => handleDeleteEdge(edge.id)}
                    />
                    {/* Visible Bézier Wire */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isExecutingEdge ? '#60a5fa' : 'url(#wireGradient)'}
                      strokeWidth={isExecutingEdge ? 3.5 : 2}
                      strokeDasharray={edge.animated || isExecutingEdge ? '6,6' : 'none'}
                      className={isExecutingEdge ? 'animate-pulse' : ''}
                      markerEnd="url(#arrow)"
                    />
                  </g>
                );
              })}

              {/* Active Connection Wire being drawn */}
              {connectingSourceId && (() => {
                const sourceNode = graph.nodes.find((n) => n.id === connectingSourceId);
                if (!sourceNode) return null;

                const x1 = sourceNode.x + 240;
                const y1 = sourceNode.y + 60;
                const x2 = mousePos.x;
                const y2 = mousePos.y;
                const dx = Math.abs(x2 - x1) * 0.5;
                const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                return (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                );
              })()}
            </svg>

            {/* Render Nodes */}
            {graph.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isExecuting = activeExecutingNodeId === node.id;

              let icon = <Bot className="w-4 h-4 text-blue-400" />;
              let badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';

              if (node.type === 'tool') {
                icon = <Wrench className="w-4 h-4 text-amber-400" />;
                badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              } else if (node.type === 'trigger') {
                icon = <Zap className="w-4 h-4 text-emerald-400" />;
                badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
              } else if (node.type === 'router') {
                icon = <GitFork className="w-4 h-4 text-purple-400" />;
                badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
              } else if (node.type === 'output') {
                icon = <CheckCircle2 className="w-4 h-4 text-indigo-400" />;
                badgeBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
              }

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  className={`node-card w-60 bg-[#131418] border rounded-2xl p-4 shadow-xl transition-shadow flex flex-col gap-3 group relative ${
                    isExecuting
                      ? 'border-blue-500 shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/50'
                      : isSelected
                      ? 'border-blue-500/80 shadow-md shadow-blue-500/20'
                      : 'border-[#23252d] hover:border-gray-500'
                  }`}
                >
                  {/* Left Input Port Handle */}
                  <div
                    onMouseDown={(e) => handlePortMouseDown(e, node.id, false)}
                    className="w-4 h-4 rounded-full bg-[#181a20] border-2 border-blue-400 absolute -left-2 top-1/2 -translate-y-1/2 cursor-crosshair hover:scale-125 hover:bg-blue-500 transition-all z-30 shadow-sm"
                    title="Input Port (Click to connect)"
                  />

                  {/* Right Output Port Handle */}
                  <div
                    onMouseDown={(e) => handlePortMouseDown(e, node.id, true)}
                    className="w-4 h-4 rounded-full bg-[#181a20] border-2 border-indigo-400 absolute -right-2 top-1/2 -translate-y-1/2 cursor-crosshair hover:scale-125 hover:bg-indigo-500 transition-all z-30 shadow-sm"
                    title="Output Port (Drag to connect)"
                  />

                  {/* Node Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#23252d]">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${badgeBg}`}>{icon}</div>
                      <span className="font-bold text-xs text-white truncate max-w-[130px]">
                        {node.label}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Node Body Details */}
                  <div className="flex flex-col gap-1.5 text-[11px] font-mono text-gray-400">
                    {node.type === 'agent' && (
                      <>
                        <div className="flex justify-between items-center text-gray-300">
                          <span>Role:</span>
                          <span className="text-blue-400 font-semibold">{node.data.agentRole || 'Specialist'}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-400">
                          <span>Model:</span>
                          <span className="text-gray-200">{node.data.model || 'gemini-2.5-flash'}</span>
                        </div>
                      </>
                    )}

                    {node.type === 'tool' && (
                      <p className="text-xs text-amber-300/80 line-clamp-2">
                        {node.data.toolDescription || 'Custom tool capability'}
                      </p>
                    )}

                    {node.type === 'trigger' && (
                      <p className="text-xs text-emerald-300/80 line-clamp-2">
                        "{node.data.triggerPrompt || 'Workflow trigger payload'}"
                      </p>
                    )}

                    {node.type === 'router' && (
                      <p className="text-xs text-purple-300/80 line-clamp-2">
                        Condition: {node.data.conditionPrompt || 'Filter evaluation'}
                      </p>
                    )}

                    {node.type === 'output' && (
                      <p className="text-xs text-indigo-300/80">
                        Format: {node.data.outputFormat || 'Structured Markdown'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Drawer (if selected) */}
        {selectedNode && (
          <div className="w-80 bg-[#131418] border-l border-[#23252d] p-5 flex flex-col gap-5 z-20 overflow-y-auto animate-fadeIn shrink-0 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#23252d]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-xs tracking-wide text-white uppercase font-mono">
                  Node Config Inspector
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Config Form Fields */}
            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-semibold">Node Label Title</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) =>
                    handleUpdateNode({ ...selectedNode, label: e.target.value })
                  }
                  className="p-2.5 bg-[#181a20] border border-[#282a36] text-white rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {selectedNode.type === 'agent' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-semibold">Agent Role Title</label>
                    <input
                      type="text"
                      value={selectedNode.data.agentRole || ''}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, agentRole: e.target.value },
                        })
                      }
                      className="p-2.5 bg-[#181a20] border border-[#282a36] text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-semibold">LLM Model Backbone</label>
                    <select
                      value={selectedNode.data.model || 'gemini-2.5-flash'}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, model: e.target.value },
                        })
                      }
                      className="p-2.5 bg-[#181a20] border border-[#282a36] text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                      <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-400 font-semibold">Temperature</label>
                      <span className="text-blue-400">{selectedNode.data.temperature || 0.3}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.1"
                      value={selectedNode.data.temperature || 0.3}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: {
                            ...selectedNode.data,
                            temperature: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="accent-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-semibold">System Directive Prompt</label>
                    <textarea
                      value={selectedNode.data.systemPrompt || ''}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, systemPrompt: e.target.value },
                        })
                      }
                      rows={5}
                      className="p-2.5 bg-[#0c0d12] text-blue-300 border border-[#282a36] rounded-lg focus:border-blue-500 focus:outline-none leading-relaxed text-xs font-mono"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'tool' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-semibold">Tool Name</label>
                    <input
                      type="text"
                      value={selectedNode.data.toolName || ''}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, toolName: e.target.value },
                        })
                      }
                      className="p-2.5 bg-[#181a20] border border-[#282a36] text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-semibold">Tool Category</label>
                    <select
                      value={selectedNode.data.toolCategory || 'Search & Retrieval'}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, toolCategory: e.target.value },
                        })
                      }
                      className="p-2.5 bg-[#181a20] border border-[#282a36] text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Search & Retrieval">Search & Retrieval</option>
                      <option value="Code Execution">Code Execution</option>
                      <option value="API Integration">API Integration</option>
                      <option value="Data Query">Data Query</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-semibold">Tool Description</label>
                    <textarea
                      value={selectedNode.data.toolDescription || ''}
                      onChange={(e) =>
                        handleUpdateNode({
                          ...selectedNode,
                          data: { ...selectedNode.data, toolDescription: e.target.value },
                        })
                      }
                      rows={3}
                      className="p-2.5 bg-[#181a20] text-gray-200 border border-[#282a36] rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'trigger' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 font-semibold">Pipeline Task Goal Prompt</label>
                  <textarea
                    value={selectedNode.data.triggerPrompt || ''}
                    onChange={(e) =>
                      handleUpdateNode({
                        ...selectedNode,
                        data: { ...selectedNode.data, triggerPrompt: e.target.value },
                      })
                    }
                    rows={4}
                    className="p-2.5 bg-[#181a20] text-gray-200 border border-[#282a36] rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="mt-4 p-2.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Node</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Runtime Simulation Log Bar */}
      {executionLogs.length > 0 && (
        <div className="bg-[#0b0c0f] border-t border-[#23252d] p-3 max-h-36 overflow-y-auto font-mono text-[11px] text-gray-300 flex flex-col gap-1 shrink-0 z-20">
          <div className="flex items-center justify-between pb-1 text-gray-500 border-b border-[#1b1d24]">
            <span className="font-bold uppercase tracking-wider text-[10px] text-blue-400">
              Live Canvas Execution Terminal
            </span>
            <button
              onClick={() => setExecutionLogs([])}
              className="text-[10px] hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
          {executionLogs.map((log, idx) => (
            <div key={idx} className="animate-fadeIn">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
