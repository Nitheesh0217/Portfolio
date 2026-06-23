// components/desktop/BrowserToolbar.tsx
// Container B: detached horizontal pill above the main canvas.
// Refactored for visionOS-style physical glass design and full interactivity.
'use client';

import { memo, useState } from 'react';
import {
  ChevronLeft, ChevronRight, RotateCw, Plus, Share2, Lock, LayoutGrid, User, ChevronDown, Check,
} from 'lucide-react';
import type { WindowId } from '@/types/windows';

export interface BrowserToolbarProps {
  currentId: WindowId;
  onNavigate: (id: WindowId) => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  className?: string;
  customPath?: string;
}

const PATH_MAP: Record<WindowId, string> = {
  welcome:      '',
  projects:     '/projects',
  certificates: '/certificates',
  metrics:      '/metrics',
  contact:      '/contact',
  assistant:    '/assistant',
  search:       '/search',
  timeline:     '/timeline',
  skills:       '/skills',
  terminal:     '/terminal',
  freelance:    '/services',
};

const PAGE_NAMES: Record<WindowId, string> = {
  welcome:      'Home',
  projects:     'Projects Gallery',
  certificates: 'Certificates & Awards',
  metrics:      'Performance Metrics',
  contact:      'Get In Touch',
  assistant:    'AI Sidekick Assistant',
  search:       'Universal Search',
  timeline:     'Professional Timeline',
  skills:       'Core Competencies',
  terminal:     'System Developer Shell',
  freelance:    'Freelance Services',
};

export const BrowserToolbar = memo(function BrowserToolbar({
  currentId,
  onNavigate,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  className,
  customPath,
}: BrowserToolbarProps) {
  const [showToast, setShowToast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleShare = () => {
    const url = `https://www.nitheesh.dev${PATH_MAP[currentId]}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Simulate refresh reload by spinning the icon
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <div
        className={className ?? "fixed top-6 left-1/2 -translate-x-1/2 z-[9997] flex items-center gap-3 px-4 py-2"}
        style={{
          background: 'rgba(5, 5, 5, 0.95)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '9999px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,255,255,0.06)',
          minWidth: 640,
        }}
      >
        {/* Left: Window controls (grid icon to go home, left/right arrows for history) */}
        <div className="flex items-center gap-3 text-white/60 pl-1.5">
          <span title="Go Home">
            <LayoutGrid
              onClick={() => onNavigate('welcome')}
              className="w-[15px] h-[15px] cursor-pointer hover:text-white transition-colors"
            />
          </span>
          <span className="w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span title="Go Back">
              <ChevronLeft
                onClick={onBack}
                className={`w-4 h-4 cursor-pointer transition-all ${
                  canGoBack ? 'hover:text-white text-white/80' : 'text-white/20 pointer-events-none'
                }`}
                strokeWidth={2.25}
              />
            </span>
            <span title="Go Forward">
              <ChevronRight
                onClick={onForward}
                className={`w-4 h-4 cursor-pointer transition-all ${
                  canGoForward ? 'hover:text-white text-white/80' : 'text-white/20 pointer-events-none'
                }`}
                strokeWidth={2.25}
              />
            </span>
          </div>
        </div>

        {/* Center: URL/Status indicator (interactive address dropdown) */}
        <div className="flex-1 relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between gap-2 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/[0.09] transition-all"
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
          >
            <div className="flex items-center gap-2 truncate">
              <Lock className="w-3.5 h-3.5 text-white/45" />
              <span className="text-[13px] text-white/85 tracking-tight font-medium select-none truncate">
                www.nitheesh.dev<span className="text-white/35">{customPath ?? PATH_MAP[currentId]}</span>
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-white/45 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Simulated address dropdown list */}
          {showDropdown && (
            <div
              className="absolute top-[125%] left-0 right-0 z-[9999] py-1.5 rounded-2xl border border-white/[0.08] shadow-2xl animate-stage-in max-h-[300px] overflow-y-auto"
              style={{
                background: 'rgba(10, 10, 15, 0.95)',
                backdropFilter: 'blur(30px)',
              }}
            >
              {(Object.keys(PATH_MAP) as WindowId[]).map((id) => (
                <div
                  key={id}
                  onClick={() => {
                    onNavigate(id);
                    setShowDropdown(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                    id === currentId
                      ? 'text-amber-300 bg-white/[0.05]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[11.5px]">{PAGE_NAMES[id]}</span>
                    <span className="text-[9.5px] text-white/35 font-mono">
                      /{id === 'welcome' ? '' : id}
                    </span>
                  </div>
                  {id === currentId && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Action icons (refresh, add, share, profile) */}
        <div className="flex items-center gap-3.5 pr-1.5 text-white/60">
          <span title="Refresh Page">
            <RotateCw
              onClick={handleRefresh}
              className={`w-4 h-4 cursor-pointer hover:text-white transition-colors ${
                isRefreshing ? 'animate-spin text-amber-300' : ''
              }`}
              strokeWidth={2.25}
            />
          </span>
          <span title="View Timeline">
            <Plus
              onClick={() => onNavigate('timeline')}
              className="w-4 h-4 cursor-pointer hover:text-white transition-colors"
              strokeWidth={2.25}
            />
          </span>
          <span title="Copy Page Link">
            <Share2
              onClick={handleShare}
              className="w-4 h-4 cursor-pointer hover:text-white transition-colors"
              strokeWidth={2.25}
            />
          </span>
          <span title="Contact Nitheesh">
            <User
              onClick={() => onNavigate('contact')}
              className="w-4 h-4 cursor-pointer hover:text-white transition-colors"
              strokeWidth={2.25}
            />
          </span>
        </div>
      </div>

      {/* Copy link alert toast */}
      {showToast && (
        <div
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[10000] px-5 py-2 text-xs font-bold text-emerald-300 rounded-full border border-emerald-500/20 shadow-2xl animate-fade-in"
          style={{
            background: 'rgba(5, 12, 5, 0.90)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          URL link copied to clipboard!
        </div>
      )}
    </>
  );
});
