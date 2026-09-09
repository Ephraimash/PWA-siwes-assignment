import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          id="pwa-install-btn"
          onClick={install}
          className="flex items-center gap-1.5 rounded-full bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-700 active:scale-95 transition-all"
          title="Install FoodHub on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-xs hover:bg-stone-100 active:scale-95 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
          <span>Install PWA</span>
        </button>
      )}

      {showIOSGuide && (
        <div
          id="ios-install-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                  FH
                </div>
                <h3 className="text-base font-semibold text-stone-900">Install FoodHub on iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-stone-600">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                  1
                </span>
                <p>
                  In Safari, tap the <strong>Share</strong> button at the bottom of your screen (square with upward arrow).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                  2
                </span>
                <p>
                  Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                  3
                </span>
                <p>
                  Tap <strong>Add</strong> in the top-right corner to access FoodHub offline anytime!
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Includes offline menu browsing and instant loading.</span>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
