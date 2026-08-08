import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Sliders, Cpu, Wrench } from 'lucide-react';
import { AIAgent, AgentTool } from '../types/agent';

interface AgentDetailModalProps {
  agent: AIAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAgent: (updatedAgent: AIAgent) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSaveAgent,
}) => {
  if (!isOpen || !agent) return null;

  const [formData, setFormData] = useState<AIAgent>({ ...agent });
  const [newToolName, setNewToolName] = useState('');
  const [newToolDesc, setNewToolDesc] = useState('');
  const [newToolCategory, setNewToolCategory] = useState<AgentTool['category']>('API Integration');

  const handleAddTool = () => {
    if (!newToolName.trim()) return;
    const tool: AgentTool = {
      id: 'tool-' + Date.now(),
      name: newToolName.trim(),
      description: newToolDesc.trim() || 'Custom agent capability',
      category: newToolCategory,
    };
    setFormData({
      ...formData,
      tools: [...(formData.tools || []), tool],
    });
    setNewToolName('');
    setNewToolDesc('');
  };

  const handleRemoveTool = (toolId: string) => {
    setFormData({
      ...formData,
      tools: (formData.tools || []).filter((t) => t.id !== toolId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAgent(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-gray-300 w-full max-w-3xl my-8 p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black flex items-center justify-center font-mono font-bold text-sm bg-black text-white">
              {formData.number || '00'}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                Agent Blueprint Configuration
              </span>
              <h2 className="text-xl font-bold uppercase tracking-wider text-black">
                {formData.name || 'New Custom Agent'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Agent Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold text-black focus:border-black focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Functional Role Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="p-2.5 bg-gray-50 border border-gray-200 text-xs font-semibold text-black focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Hierarchy & Model & Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Hierarchy Level
              </label>
              <select
                value={formData.hierarchyLevel}
                onChange={(e) => setFormData({ ...formData, hierarchyLevel: e.target.value as any })}
                className="p-2.5 bg-gray-50 border border-gray-200 text-xs font-medium text-black focus:border-black focus:outline-none"
              >
                <option value="Lead / Supervisor">Lead / Supervisor</option>
                <option value="Specialist">Specialist</option>
                <option value="Auditor / Reviewer">Auditor / Reviewer</option>
                <option value="Executor">Executor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                LLM Backbone Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="p-2.5 bg-gray-50 border border-gray-200 text-xs font-mono font-medium text-black focus:border-black focus:outline-none"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Temperature
                </label>
                <span className="text-xs font-mono font-bold text-black">{formData.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="mt-2 accent-black cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Role Description Overview
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-2.5 bg-gray-50 border border-gray-200 text-xs text-black focus:border-black focus:outline-none"
            />
          </div>

          {/* System Prompt Instruction */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex justify-between">
              <span>System Instruction Prompt</span>
              <span className="font-mono text-gray-400">{formData.systemPrompt?.length || 0} chars</span>
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={6}
              className="p-3 bg-[#111111] text-emerald-400 font-mono text-xs border border-gray-800 focus:border-black focus:outline-none leading-relaxed"
            />
          </div>

          {/* Tools Configurator */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Bound Tools ({formData.tools?.length || 0})
            </span>

            {/* List of current tools */}
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
              {(formData.tools || []).map((tool) => (
                <div
                  key={tool.id}
                  className="p-2.5 bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black text-white text-[9px] font-mono font-bold uppercase">
                      {tool.category}
                    </span>
                    <span className="font-bold text-black">{tool.name}</span>
                    <span className="text-gray-400 text-[11px]">— {tool.description}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Tool Sub-form */}
            <div className="p-3 bg-gray-100/70 border border-gray-200 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Tool Name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                className="w-full sm:w-1/3 p-2 bg-white border border-gray-300 text-xs text-black"
              />
              <input
                type="text"
                placeholder="Description"
                value={newToolDesc}
                onChange={(e) => setNewToolDesc(e.target.value)}
                className="w-full sm:w-1/2 p-2 bg-white border border-gray-300 text-xs text-black"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0"
              >
                + Tool
              </button>
            </div>
          </div>

          {/* Modal Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-widest text-gray-700 hover:border-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Agent Blueprint</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
