import React from 'react';
import { HeroFallbackProps } from '../types';
import { Sparkles, RefreshCw, Layers } from 'lucide-react';

export const FallbackHero: React.FC<HeroFallbackProps> = ({
  reason = 'WebGL acceleration is unavailable or reduced motion is active.',
  onRetry,
  ariaLabel = 'Interactive 2D Static Visual Prism Fallback',
}) => {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative w-full h-[480px] sm:h-[560px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-[#171A21] dark:via-[#1A1D24] dark:to-[#12141A] border border-gray-200/80 dark:border-gray-800 shadow-xl flex items-center justify-center p-6 transition-all"
    >
      {/* Background Animated Subtle Glow Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-red-400/15 dark:bg-red-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-green-400/15 dark:bg-green-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Fallback Core Graphics (SVG Google Material Crystal Mesh) */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md space-y-6">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#FBBC05] opacity-30 blur-md animate-spin-slow"></div>

          {/* Central 2D Polyhedron Glass Card */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-2xl flex flex-col items-center justify-center p-4">
            <svg
              viewBox="0 0 100 100"
              className="w-24 h-24 text-blue-600 dark:text-blue-400 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Octahedron Mesh Lines */}
              <polygon points="50,10 85,35 85,65 50,90 15,65 15,35" fill="url(#googleGradient)" fillOpacity="0.15" />
              <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="3 3" />
              <line x1="15" y1="35" x2="85" y2="65" />
              <line x1="85" y1="35" x2="15" y2="65" />
              <polygon points="50,25 70,40 70,60 50,75 30,60 30,40" stroke="#4285F4" strokeWidth="2" />

              <defs>
                <linearGradient id="googleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="33%" stopColor="#EA4335" />
                  <stop offset="66%" stopColor="#FBBC05" />
                  <stop offset="100%" stopColor="#34A853" />
                </linearGradient>
              </defs>
            </svg>

            <span className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Material Core 2D
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accessible Fallback Mode</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
            {reason}
          </p>
        </div>

        {/* Retry Button if WebGL available to re-attempt */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-full text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" />
            Re-initialize 3D Scene
          </button>
        )}
      </div>
    </div>
  );
};

export default FallbackHero;
