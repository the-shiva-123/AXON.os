import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Sliders, Cpu, Wrench } from 'lucide-react';

export const AgentDetailModal = ({
  agent,
  isOpen,
  onClose,
  onSaveAgent,
}) => {
  if (!isOpen || !agent) return null;

  const [formData, setFormData] = useState({ ...agent });
  const [newToolName, setNewToolName] = useState('');
  const [newToolDesc, setNewToolDesc] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('API Integration');

  const handleAddTool = () => {
    if (!newToolName.trim()) return;
    const tool = {
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

  const handleRemoveTool = (toolId) => {
    setFormData({
      ...formData,
      tools: (formData.tools || []).filter((t) => t.id !== toolId),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveAgent(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#131418] border border-[#23252d] w-full max-w-3xl my-8 p-6 md:p-8 flex flex-col gap-6 shadow-2xl rounded-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23252d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center font-mono font-bold text-sm text-blue-400">
              {formData.number || '00'}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                Agent Blueprint Configuration
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {formData.name || 'New Custom Agent'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#1b1d24] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                Agent Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="p-2.5 bg-[#181a20] border border-[#282a36] text-xs font-semibold text-white focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                Functional Role Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="p-2.5 bg-[#181a20] border border-[#282a36] text-xs font-semibold text-white focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
              />
            </div>
          </div>

          {/* Hierarchy & Model & Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                Hierarchy Level
              </label>
              <select
                value={formData.hierarchyLevel}
                onChange={(e) => setFormData({ ...formData, hierarchyLevel: e.target.value })}
                className="p-2.5 bg-[#181a20] border border-[#282a36] text-xs font-medium text-white focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
              >
                <option value="Lead / Supervisor">Lead / Supervisor</option>
                <option value="Specialist">Specialist</option>
                <option value="Auditor / Reviewer">Auditor / Reviewer</option>
                <option value="Executor">Executor</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                LLM Backbone Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="p-2.5 bg-[#181a20] border border-[#282a36] text-xs font-mono font-medium text-white focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
                  Temperature
                </label>
                <span className="text-xs font-mono font-bold text-blue-400">{formData.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                className="mt-2 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
              Role Description Overview
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-2.5 bg-[#181a20] border border-[#282a36] text-xs text-white focus:border-blue-500 focus:outline-none rounded-lg transition-colors"
            />
          </div>

          {/* System Prompt Instruction */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono flex justify-between">
              <span>System Instruction Prompt</span>
              <span className="font-mono text-gray-500">{formData.systemPrompt?.length || 0} chars</span>
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={6}
              className="p-3 bg-[#0c0d12] text-blue-300 font-mono text-xs border border-[#282a3b] focus:border-blue-500 focus:outline-none leading-relaxed rounded-lg"
            />
          </div>

          {/* Tools Configurator */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">
              Bound Tools ({formData.tools?.length || 0})
            </span>

            {/* List of current tools */}
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
              {(formData.tools || []).map((tool) => (
                <div
                  key={tool.id}
                  className="p-2.5 bg-[#181a20] border border-[#282a36] rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-mono font-bold uppercase rounded">
                      {tool.category}
                    </span>
                    <span className="font-bold text-white">{tool.name}</span>
                    <span className="text-gray-400 text-[11px]">— {tool.description}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Tool Sub-form */}
            <div className="p-3 bg-[#181a20] border border-[#282a36] rounded-lg flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Tool Name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                className="w-full sm:w-1/3 p-2 bg-[#131418] border border-[#282a36] text-xs text-white rounded focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Description"
                value={newToolDesc}
                onChange={(e) => setNewToolDesc(e.target.value)}
                className="w-full sm:w-1/2 p-2 bg-[#131418] border border-[#282a36] text-xs text-white rounded focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors shrink-0"
              >
                + Tool
              </button>
            </div>
          </div>

          {/* Modal Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#23252d]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-[#282a36] text-xs font-semibold text-gray-300 hover:border-gray-500 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
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
