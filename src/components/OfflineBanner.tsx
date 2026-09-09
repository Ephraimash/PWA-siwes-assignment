import React from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-status-banner"
      className="sticky top-0 z-50 flex items-center justify-between bg-amber-500 px-4 py-2.5 text-xs sm:text-sm font-medium text-amber-950 shadow-md transition-all"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        <WifiOff className="w-4 h-4 shrink-0 text-amber-950 animate-pulse" />
        <div className="flex-1 leading-tight">
          <span className="font-bold">Offline Mode:</span> You can browse all 5 restaurants, view menus, and build your cart. An internet connection is required to place simulated orders.
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] bg-amber-600/30 px-2 py-0.5 rounded-full border border-amber-900/20">
          <AlertCircle className="w-3 h-3" />
          <span>Local Cache Active</span>
        </div>
      </div>
    </div>
  );
};
