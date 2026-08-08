import React from 'react';

export const FooterBar: React.FC = () => {
  return (
    <footer className="h-12 border-t border-gray-200 flex items-center justify-between px-6 lg:px-12 bg-white text-[10px] uppercase font-medium tracking-widest text-gray-400 select-none">
      <div className="flex items-center gap-2">
        <span>System Status:</span>
        <span className="inline-flex items-center gap-1.5 text-black font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Nominal
        </span>
      </div>
      <div className="hidden sm:block">Current Cluster: US-EAST-GEN-04</div>
      <div className="font-mono">AXON.OS v2.5.0</div>
    </footer>
  );
};
