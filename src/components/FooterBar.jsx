import React from 'react';

export const FooterBar = () => {
  return (
    <footer className="h-12 border-t border-[#23252d] flex items-center justify-between px-6 lg:px-12 bg-[#0b0c0e] text-[10px] uppercase font-medium tracking-widest text-gray-300 select-none">
      <div className="flex items-center gap-2 text-gray-300">
        <span>System Status:</span>
        <span className="inline-flex items-center gap-1.5 text-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Nominal
        </span>
      </div>
      <div className="hidden sm:block text-gray-400">Current Cluster: US-EAST-GEN-04</div>
      <div className="font-mono text-gray-400">AXON.OS v2.5.0</div>
    </footer>
  );
};
