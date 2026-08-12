import React from 'react';
import { Sparkles, Gauge, ShieldCheck, Cpu } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      label: 'Target Frame Rate',
      value: '60 FPS',
      subtext: 'GPU accelerated requestAnimationFrame budget',
      icon: <Gauge className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20',
    },
    {
      label: 'Initial Core JS Bundle',
      value: '< 250 KB',
      subtext: 'Gzipped code-splitted React Three Fiber chunk',
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      color: 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20',
    },
    {
      label: 'Accessibility Standard',
      value: 'WCAG AA',
      subtext: 'Passes screen reader, keyboard & contrast audits',
      icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
      color: 'border-red-500/20 bg-red-50/50 dark:bg-red-950/20',
    },
    {
      label: 'WebGL Compatibility',
      value: '99.9%',
      subtext: 'Seamless automatic 2D static visual fallback',
      icon: <Cpu className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20',
    },
  ];

  return (
    <section
      id="stats"
      aria-label="Performance and Quality Benchmarks"
      className="py-16 md:py-20 bg-white dark:bg-[#121212] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border ${stat.color} transition-transform hover:-translate-y-1 space-y-3 shadow-xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                {stat.icon}
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                {stat.value}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
