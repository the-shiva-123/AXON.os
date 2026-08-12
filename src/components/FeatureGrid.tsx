import React from 'react';
import { FeatureItem } from '../types';
import { Zap, Shield, Cpu, Sparkles, Globe, Layers } from 'lucide-react';

const featuresData: FeatureItem[] = [
  {
    id: 'f1',
    title: '60 FPS WebGL Engine',
    description: 'Hardware accelerated 3D glass transmission shaders with R3F & Drei, optimized for smooth frame budgets.',
    iconName: 'zap',
    accentColor: '#1A73E8',
  },
  {
    id: 'f2',
    title: 'Google Material 3 Tokens',
    description: 'Harmonious color palettes, subtle 8-16px elevation radii, and responsive Google Sans typography.',
    iconName: 'sparkles',
    accentColor: '#EA4335',
  },
  {
    id: 'f3',
    title: 'Enterprise Security & Isolation',
    description: 'End-to-end telemetry protection, sandboxed WebGL canvas execution, and zero-storage fallback paths.',
    iconName: 'shield',
    accentColor: '#34A853',
  },
  {
    id: 'f4',
    title: 'Quantum & TPU Acceleration',
    description: 'Built to interface seamlessly with Google Cloud TPU v5e clusters and Quantum AI compute backends.',
    iconName: 'cpu',
    accentColor: '#FBBC04',
  },
  {
    id: 'f5',
    title: 'WCAG 2.1 AA Accessibility',
    description: 'Strict keyboard navigation, visible focus rings, aria-live region announcements, and reduced motion settings.',
    iconName: 'globe',
    accentColor: '#1A73E8',
  },
  {
    id: 'f6',
    title: 'Progressive Fallback Architecture',
    description: 'Automatic WebGL feature detection with high-resolution static SVG/CSS prism renderers for low-end hardware.',
    iconName: 'layers',
    accentColor: '#EA4335',
  },
];

export const FeatureGrid: React.FC = () => {
  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'zap':
        return <Zap className="w-6 h-6" style={{ color }} />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" style={{ color }} />;
      case 'shield':
        return <Shield className="w-6 h-6" style={{ color }} />;
      case 'cpu':
        return <Cpu className="w-6 h-6" style={{ color }} />;
      case 'globe':
        return <Globe className="w-6 h-6" style={{ color }} />;
      default:
        return <Layers className="w-6 h-6" style={{ color }} />;
    }
  };

  return (
    <section
      id="features"
      aria-label="Core Engineering Capabilities"
      className="py-16 md:py-24 bg-white dark:bg-[#121212] border-t border-b border-gray-200/80 dark:border-gray-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Built Following Modern Web Standards
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Combining state-of-the-art WebGL graphics with uncompromised web accessibility and sub-second load times.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-lg transition-all duration-200 space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                {getIcon(feature.iconName, feature.accentColor)}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
