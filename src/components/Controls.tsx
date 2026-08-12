import React from 'react';
import { SceneControlsState, ColorTheme, MaterialType } from '../types';
import { Sliders, RotateCw, Eye, Palette, Box, RefreshCw } from 'lucide-react';

interface ControlsProps {
  controls: SceneControlsState;
  onChange: (updated: Partial<SceneControlsState>) => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ controls, onChange, onReset }) => {
  const colorThemes: { id: ColorTheme; label: string; hex: string }[] = [
    { id: 'blue', label: 'Google Blue', hex: '#1A73E8' },
    { id: 'red', label: 'Google Red', hex: '#EA4335' },
    { id: 'yellow', label: 'Google Amber', hex: '#FBBC04' },
    { id: 'green', label: 'Google Emerald', hex: '#34A853' },
  ];

  const materialOptions: { id: MaterialType; label: string }[] = [
    { id: 'glass', label: 'Glass' },
    { id: 'metal', label: 'Chrome' },
    { id: 'standard', label: 'Matte' },
  ];

  const modelOptions: { id: 'quantum' | 'sphere' | 'torus'; label: string }[] = [
    { id: 'quantum', label: 'Quantum Prism' },
    { id: 'sphere', label: 'Geodesic' },
    { id: 'torus', label: 'Torus Ring' },
  ];

  return (
    <div
      aria-label="3D Scene Interactive Controls"
      className="google-glass rounded-2xl p-4 shadow-xl border border-gray-200/80 dark:border-gray-800 text-xs space-y-3.5 max-w-xs w-full transition-all duration-200"
    >
      {/* Header title & reset */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700/60 pb-2">
        <div className="flex items-center space-x-1.5 font-semibold text-gray-900 dark:text-gray-100">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>3D View Controls</span>
        </div>
        <button
          onClick={onReset}
          className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Reset Controls to Default"
          aria-label="Reset 3D Controls"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Geometry Model Selection */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <Box className="w-3 h-3 text-blue-500" /> Geometry Mesh
        </label>
        <div className="grid grid-cols-3 gap-1">
          {modelOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChange({ modelType: opt.id })}
              className={`py-1 px-2 rounded-lg font-medium transition-all ${
                controls.modelType === opt.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette Selector */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <Palette className="w-3 h-3 text-blue-500" /> Color Accent
        </label>
        <div className="flex items-center justify-between">
          {colorThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onChange({ colorTheme: theme.id })}
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform ${
                controls.colorTheme === theme.id
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: theme.hex }}
              aria-label={`Set color theme to ${theme.label}`}
              title={theme.label}
            />
          ))}
        </div>
      </div>

      {/* Material Finish */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400">Material Finish</label>
        <div className="grid grid-cols-3 gap-1">
          {materialOptions.map((mat) => (
            <button
              key={mat.id}
              onClick={() => onChange({ materialType: mat.id })}
              className={`py-1 px-1.5 rounded-lg text-center transition-all ${
                controls.materialType === mat.id
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {mat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation Speed Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-medium text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-blue-500" /> Rotation Speed
          </span>
          <span>{controls.rotationSpeed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={controls.rotationSpeed}
          onChange={(e) => onChange({ rotationSpeed: parseFloat(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"
          aria-label="3D Rotation Speed Slider"
        />
      </div>

      {/* Toggles (Wireframe & Auto Rotate) */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700/60">
        <label className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={controls.wireframe}
            onChange={(e) => onChange({ wireframe: e.target.checked })}
            className="rounded accent-blue-600 cursor-pointer focus:ring-blue-500"
          />
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-gray-500" /> Wireframe
          </span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={controls.autoRotate}
            onChange={(e) => onChange({ autoRotate: e.target.checked })}
            className="rounded accent-blue-600 cursor-pointer focus:ring-blue-500"
          />
          <span>Spin</span>
        </label>
      </div>
    </div>
  );
};

export default Controls;
