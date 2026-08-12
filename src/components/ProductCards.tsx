import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductItem } from '../types';
import { Sparkles, ArrowUpRight, Search, CheckCircle2, X, ExternalLink, Cpu, Shield, Smartphone, Globe, Layers } from 'lucide-react';

const productsData: ProductItem[] = [
  {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro',
    category: 'Cloud AI',
    description: 'Google’s multimodal flagship AI model capable of processing up to 2 million tokens of context across video, audio, and code.',
    features: ['2M Token Context Window', 'Multimodal Vision & Audio', 'Low Latency Inference'],
    icon: 'sparkles',
    badge: 'Flagship AI',
    metrics: '99.99% Uptime',
    link: 'https://deepmind.google/technologies/gemini/',
  },
  {
    id: 'pixel-9-pro',
    name: 'Pixel 9 Pro Tensor G4',
    category: 'Pixel',
    description: 'Custom Google silicon engineered for on-device generative AI, spatial photography, and hardware-level Titan M2 security.',
    features: ['Tensor G4 NPU Engine', 'Titan M2 Security Chip', '7 Years OS Updates'],
    icon: 'smartphone',
    badge: 'Hardware',
    metrics: '48 TOPS AI Performance',
    link: 'https://store.google.com/',
  },
  {
    id: 'quantum-sycamore',
    name: 'Quantum Sycamore Core',
    category: 'Quantum',
    description: 'Superconducting quantum processor carrying out quantum error correction algorithms beyond classical supercomputers.',
    features: ['70+ Superconducting Qubits', 'Surface Code Error Correction', 'Sub-microsecond Gate Fidelity'],
    icon: 'cpu',
    badge: 'Research',
    metrics: 'Beyond Classical Speedup',
    link: 'https://quantumai.google/',
  },
  {
    id: 'workspace-duet',
    name: 'Workspace Gemini Agent',
    category: 'Workspace',
    description: 'Intelligent real-time collaborator embedded in Docs, Sheets, Slides, and Meet for generative drafting and data insights.',
    features: ['Real-time Co-authoring', 'Automated Sheets Formulae', 'Live Captions & Translation'],
    icon: 'globe',
    badge: 'Productivity',
    metrics: '10B+ Daily Prompts',
    link: 'https://workspace.google.com/',
  },
  {
    id: 'android-15-core',
    name: 'Android 15 Material 3 Express',
    category: 'Android',
    description: 'Modern mobile OS platform featuring dynamic color extraction, private space data isolation, and hardware-accelerated Vulkan 3D.',
    features: ['Material 3 Dynamic Themes', 'Private Space Data Vault', 'Vulkan 1.3 Graphics Pipeline'],
    icon: 'layers',
    badge: 'Platform',
    metrics: '3B+ Active Devices',
    link: 'https://developer.android.com/',
  },
  {
    id: 'cloud-vertex',
    name: 'Vertex AI Studio Engine',
    category: 'Cloud AI',
    description: 'Unified MLOps platform for training, tuning, and deploying customized generative foundation models at global cloud scale.',
    features: ['AutoML & Custom Pipeline', 'Model Monitoring & Guardrails', 'Zero-Egress Security Perimeter'],
    icon: 'shield',
    badge: 'Enterprise',
    metrics: '100+ Pre-trained Models',
    link: 'https://cloud.google.com/vertex-ai',
  },
];

export const ProductCards: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);

  const categories = ['All', 'Cloud AI', 'Pixel', 'Quantum', 'Workspace', 'Android'];

  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'smartphone':
        return <Smartphone className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <section
      id="products"
      aria-label="Google Product Ecosystem Showcase"
      className="py-16 md:py-24 bg-gray-50/70 dark:bg-[#121212] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Google Product Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Designed for Scale, Precision &amp; Elegance
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Explore how Google Material principles unite hardware, software, and AI supercomputing into a single harmonious experience.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs text-gray-900 dark:text-white"
              aria-label="Search product list"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Category Filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                  : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar (Icon + Badge) */}
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                      {getIconComponent(product.icon)}
                    </div>
                    {product.badge && (
                      <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1.5 pt-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {product.metrics}
                  </span>
                  <button
                    onClick={() => setActiveModalProduct(product)}
                    className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
                  >
                    View Specs
                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-base text-gray-600 dark:text-gray-400">No products found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Accessible Product Details Modal */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/40">
                {getIconComponent(activeModalProduct.icon)}
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {activeModalProduct.category}
                </span>
                <h3 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeModalProduct.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {activeModalProduct.description}
            </p>

            <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
              <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-200 uppercase">
                Technical Highlights
              </h4>
              <ul className="space-y-2">
                {activeModalProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Metric: {activeModalProduct.metrics}
              </span>
              <a
                href={activeModalProduct.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow transition-colors"
              >
                Official Docs <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductCards;
