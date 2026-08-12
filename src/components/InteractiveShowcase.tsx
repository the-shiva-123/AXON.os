import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Sliders, Activity, Copy, Check, Play } from 'lucide-react';

export const InteractiveShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'material' | 'telemetry'>('prompt');
  const [promptText, setPromptText] = useState('Generate a responsive Google Material 3D glass prism scene in React Three Fiber.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Material Shader State Demo
  const [transmission, setTransmission] = useState(0.85);
  const [roughness, setRoughness] = useState(0.1);
  const [clearcoat, setClearcoat] = useState(1.0);
  const [color, setColor] = useState('#1A73E8');

  const handleSimulateAi = () => {
    setIsGenerating(true);
    setAiOutput(null);
    setTimeout(() => {
      setAiOutput(
        `<MeshPhysicalMaterial\n  color="${color}"\n  transmission={${transmission}}\n  roughness={${roughness}}\n  clearcoat={${clearcoat}}\n  ior={1.5}\n  thickness={1.2}\n/>`
      );
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    if (!aiOutput) return;
    navigator.clipboard?.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="showcase"
      aria-label="Interactive Google AI & 3D Lab"
      className="py-16 md:py-24 bg-gray-50/50 dark:bg-[#15161A] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive Studio Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Experience Google AI &amp; 3D Real-Time
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Test procedural code generation, live physical shader parameters, and rendering telemetry in real time.
          </p>
        </div>

        {/* Studio Window Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Top Window Bar with Tabs */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-xs font-mono text-gray-500 ml-2">google-material-3d-lab.tsx</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-gray-200/60 dark:bg-gray-800 p-1 rounded-full text-xs">
              <button
                onClick={() => setActiveTab('prompt')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'prompt'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                AI Code Synthesizer
              </button>

              <button
                onClick={() => setActiveTab('material')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'material'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                Shader Lab
              </button>

              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'telemetry'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                Telemetry
              </button>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'prompt' && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-blue-500" /> Enter Prompt Instruction
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        className="flex-1 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={handleSimulateAi}
                        disabled={isGenerating}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" /> Synthesize
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Output Terminal */}
                  <div className="relative rounded-2xl bg-gray-900 p-4 font-mono text-xs text-green-400 overflow-x-auto border border-gray-800 shadow-inner min-h-[140px] flex items-center justify-between">
                    {aiOutput ? (
                      <pre className="text-blue-300">{aiOutput}</pre>
                    ) : (
                      <p className="text-gray-500 italic">Click "Synthesize" to generate R3F shader parameters...</p>
                    )}

                    {aiOutput && (
                      <button
                        onClick={handleCopy}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white transition-colors"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'material' && (
                <motion.div
                  key="material"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Physical Transmission Shader Parameters
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <span>Transmission (Glass Transparency): {transmission.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={transmission}
                          onChange={(e) => setTransmission(parseFloat(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <span>Roughness: {roughness.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={roughness}
                          onChange={(e) => setRoughness(parseFloat(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-medium text-gray-700 dark:text-gray-300 mb-1">
                          <span>Clearcoat Gloss: {clearcoat.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={clearcoat}
                          onChange={(e) => setClearcoat(parseFloat(e.target.value))}
                          className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"
                        />
                      </div>

                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Base Color</span>
                        <div className="flex gap-2">
                          {['#1A73E8', '#EA4335', '#FBBC04', '#34A853', '#A142F4'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setColor(c)}
                              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                                color === c ? 'scale-110 border-gray-900 dark:border-white' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2D Render Preview Box */}
                  <div className="h-48 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 shadow-inner">
                    <div
                      className="w-28 h-28 rounded-full border border-white/40 shadow-2xl transition-all duration-300"
                      style={{
                        backgroundColor: color,
                        opacity: transmission > 0.3 ? transmission : 0.9,
                        backdropFilter: `blur(${10 - roughness * 10}px)`,
                        boxShadow: `0 0 30px ${color}80`,
                      }}
                    />
                    <span className="absolute bottom-3 text-[11px] font-mono text-gray-400">
                      Live Physical Material Render
                    </span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'telemetry' && (
                <motion.div
                  key="telemetry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Render Latency</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">16.6 ms</span>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Triangle Count</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,048</span>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">GPU Memory</span>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">14.2 MB</span>
                    </div>
                  </div>

                  {/* Simulated Frame Time Graph */}
                  <div className="h-24 bg-gray-900 rounded-xl p-3 flex items-end justify-between gap-1 border border-gray-800">
                    {[60, 59, 60, 60, 58, 60, 60, 59, 60, 60, 60, 59, 60, 60, 60, 58, 60, 60, 60, 60].map((fps, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-green-500/80 rounded-t transition-all hover:bg-green-400"
                        style={{ height: `${(fps / 60) * 100}%` }}
                        title={`${fps} FPS`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Stable 60 FPS Target Frame Rate Monitor across 20 consecutive sampling windows
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
