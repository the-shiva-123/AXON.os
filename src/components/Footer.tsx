import React from 'react';
import { Globe, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0E0E0E] text-gray-600 dark:text-gray-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Google 3D Tech
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  R3F Quantum Model
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Material Physical Shaders
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Procedural Geometry
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  WebGL 2.0 Benchmarks
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Design Systems
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://m3.material.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
                >
                  Material Design 3 <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://fonts.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
                >
                  Google Sans Typography <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  WCAG AA Guidelines
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Ecosystem
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Google Cloud AI
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pixel Hardware Core
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Workspace Intelligence
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Accessibility & Safety
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
              Built with keyboard navigation, aria-live region support, and reduced motion adaptations.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-200/60 dark:bg-gray-800/60 text-xs text-gray-700 dark:text-gray-300">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>English (United States)</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700 dark:text-gray-400">Google Material 3D Showcase</span>
            <span>•</span>
            <span>Inspired by Google UI Design System</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#privacy" className="hover:underline">
              Privacy
            </a>
            <a href="#terms" className="hover:underline">
              Terms
            </a>
            <a href="#about" className="hover:underline flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for R3F
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
