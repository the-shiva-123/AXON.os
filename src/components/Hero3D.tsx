import React, { useState, Suspense, lazy, Component, ErrorInfo } from 'react';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SceneControlsState } from '../types';
import Controls from './Controls';
import FallbackHero from './FallbackHero';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

// Lazy-load R3F Canvas and Scene for performance code splitting
const CanvasWrapper = lazy(() => import('./CanvasWrapper'));

// React Error Boundary for 3D canvas context errors
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ThreeErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('3D Canvas Context Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackHero
          reason="3D rendering context encountered a device error. Switched to 2D Fallback."
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }
    return this.props.children;
  }
}

const defaultControls: SceneControlsState = {
  wireframe: false,
  rotationSpeed: 1.0,
  colorTheme: 'blue',
  particleDensity: 'medium',
  autoRotate: true,
  materialType: 'glass',
  modelType: 'quantum',
};

interface Hero3DProps {
  onExploreClick: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onExploreClick }) => {
  const { isSupported, reason } = useWebGLSupport();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [controls, setControls] = useState<SceneControlsState>(defaultControls);
  const [manualFallback, setManualFallback] = useState(false);

  const handleUpdateControls = (updated: Partial<SceneControlsState>) => {
    setControls((prev) => ({ ...prev, ...updated }));
  };

  const handleResetControls = () => {
    setControls(defaultControls);
  };

  return (
    <section
      id="hero"
      aria-label="Google Material 3D Hero Showcase"
      className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-gray-50/50 dark:from-[#141518] dark:via-[#121212] dark:to-[#181A1F] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Content Column (Left - 6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Next-Gen Google Material 3D Web Engine</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.12]">
              Spacious, Minimal &amp;{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Physically Interactive 3D
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience production-grade 3D graphics built with React Three Fiber, physical glass transmission shaders, and responsive Google Material UI tokens.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Explore Ecosystem
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => setManualFallback(!manualFallback)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Layers className="w-4 h-4 mr-2 text-blue-500" />
                {manualFallback ? 'Switch to 3D Scene' : 'Toggle 2D Fallback'}
              </button>
            </div>

            {/* Feature Badges */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div className="space-y-1">
                <div className="flex items-center text-xs font-semibold text-gray-900 dark:text-gray-200 gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> 60 FPS
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">GPU Accelerated</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-xs font-semibold text-gray-900 dark:text-gray-200 gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> WCAG AA
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Accessible UI</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-xs font-semibold text-gray-900 dark:text-gray-200 gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" /> &lt;250KB
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Code Splitted</p>
              </div>
            </div>
          </div>

          {/* 3D Scene Viewport Column (Right - 6 cols) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[460px] sm:min-h-[540px]">
            {!isSupported || manualFallback ? (
              <FallbackHero
                reason={
                  manualFallback
                    ? '2D Static View active by user selection.'
                    : reason || 'WebGL is disabled or unsupported on this hardware.'
                }
                onRetry={() => setManualFallback(false)}
              />
            ) : (
              <ThreeErrorBoundary>
                <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden bg-gradient-to-tr from-gray-900 via-gray-900 to-[#101524] shadow-2xl border border-gray-800">
                  {/* Lazy-loaded 3D Canvas */}
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white space-y-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 font-medium">Loading 3D Engine &amp; Shaders...</p>
                      </div>
                    }
                  >
                    <CanvasWrapper controls={controls} prefersReducedMotion={prefersReducedMotion} />
                  </Suspense>

                  {/* Floating Controls Overlay */}
                  <div className="absolute top-4 right-4 z-20">
                    <Controls
                      controls={controls}
                      onChange={handleUpdateControls}
                      onReset={handleResetControls}
                    />
                  </div>
                </div>
              </ThreeErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
