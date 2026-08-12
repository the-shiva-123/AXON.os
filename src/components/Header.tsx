import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu, X, Sparkles, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToSection }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '3D Studio', sectionId: 'hero' },
    { label: 'Products', sectionId: 'products' },
    { label: 'Capabilities', sectionId: 'features' },
    { label: 'Interactive Demo', sectionId: 'showcase' },
    { label: 'Benchmarks', sectionId: 'stats' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Identifier */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onScrollToSection('hero')}
            className="flex items-center space-x-2.5 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 group"
            aria-label="Google Material 3D Home"
          >
            {/* Google-inspired 4-color dot icon */}
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] group-hover:scale-110 transition-transform"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] group-hover:scale-110 transition-transform"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05] group-hover:scale-110 transition-transform"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] group-hover:scale-110 transition-transform"></span>
            </div>
            <span className="font-medium text-lg tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              Google <span className="text-blue-600 dark:text-blue-400 font-normal">Material 3D</span>
            </span>
          </button>

          {/* Badge */}
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
            <Sparkles className="w-3 h-3 mr-1 text-blue-500" /> R3F WebGL 2.0
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => onScrollToSection(link.sectionId)}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
          >
            {resolvedTheme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onScrollToSection('products')}
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow-sm hover:shadow transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Explore Ecosystem
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => {
                onScrollToSection(link.sectionId);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onScrollToSection('products');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full shadow"
            >
              Explore Ecosystem
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
