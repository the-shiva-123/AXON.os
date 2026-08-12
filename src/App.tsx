import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Hero3D from './components/Hero3D';
import FeatureGrid from './components/FeatureGrid';
import ProductCards from './components/ProductCards';
import InteractiveShowcase from './components/InteractiveShowcase';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';

export const AppContent: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Navigation Header */}
      <Header onScrollToSection={scrollToSection} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* 3D Hero Section */}
        <Hero3D onExploreClick={() => scrollToSection('products')} />

        {/* Feature Pillars Grid */}
        <FeatureGrid />

        {/* Product Ecosystem Cards */}
        <ProductCards />

        {/* Interactive Lab Showcase */}
        <InteractiveShowcase />

        {/* Performance Stats & Benchmarks */}
        <StatsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
