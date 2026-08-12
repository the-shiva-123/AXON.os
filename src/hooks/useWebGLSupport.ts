import { useState, useEffect } from 'react';

export interface WebGLSupportResult {
  isSupported: boolean;
  version: 1 | 2 | 0;
  reason?: string;
}

/**
 * Custom hook to verify runtime WebGL support and monitor context loss.
 * Enables graceful fallback to accessible static image/canvas for non-WebGL environments.
 */
export function useWebGLSupport(): WebGLSupportResult {
  const [supportStatus, setSupportStatus] = useState<WebGLSupportResult>(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return { isSupported: false, version: 0, reason: 'SSR / Non-browser environment' };
    }

    try {
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      if (gl2) {
        return { isSupported: true, version: 2 };
      }

      const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl1) {
        return { isSupported: true, version: 1 };
      }

      return {
        isSupported: false,
        version: 0,
        reason: 'WebGL context initialization returned null',
      };
    } catch (e: any) {
      return {
        isSupported: false,
        version: 0,
        reason: e?.message || 'WebGL hardware acceleration disabled or unavailable',
      };
    }
  });

  useEffect(() => {
    // Canvas context lost event listener setup if needed
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setSupportStatus({
        isSupported: false,
        version: 0,
        reason: 'WebGL Context Lost',
      });
    };

    window.addEventListener('webglcontextlost', handleContextLost, false);
    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, []);

  return supportStatus;
}

export default useWebGLSupport;
