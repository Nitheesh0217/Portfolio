// app/visionos-portfolio.tsx
// Complete visionOS Aesthetic Portfolio with Boot Animation
'use client';

import { memo, useState, useCallback } from 'react';
import { SystemBoot } from '@/components/animations/SystemBoot';
import { StoryWindow } from '@/components/windows/StoryWindow';
import { ProjectsGalleryWindow } from '@/components/windows/ProjectsGalleryWindow';

export default memo(function VisionOSPortfolio() {
  const [bootComplete, setBootComplete] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#05050a] overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0">
        {/* Dot Grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Ambient Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* System Boot Animation */}
      {!bootComplete && <SystemBoot onBootComplete={handleBootComplete} />}

      {/* Main Workspace - Visible after boot */}
      {bootComplete && (
        <div className="relative w-full h-full animate-fade-in">
          {/* Story Window */}
          <StoryWindow />

          {/* Projects Gallery Window */}
          <ProjectsGalleryWindow />

          {/* Bottom Dock */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-xl bg-black/40 border-t border-white/10 flex items-center justify-center gap-4"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(20,20,35,0.2), rgba(10,10,20,0.6))',
            }}
          >
            <div className="flex gap-4">
              {[
                { icon: '💼', label: 'Projects' },
                { icon: '🎯', label: 'Skills' },
                { icon: '📚', label: 'Experience' },
                { icon: '✉️', label: 'Contact' },
                { icon: '📊', label: 'Analytics' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-16 h-16 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 hover:border-white/30 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Menu Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-16 backdrop-blur-xl bg-black/30 border-b border-white/10 flex items-center justify-between px-8"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(30,30,50,0.4), rgba(20,20,35,0.2))',
            }}
          >
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white">
                ✨ NITHEESH DONEPUDI
              </h1>
              <p className="text-xs text-violet-300/60 font-medium tracking-wide">
                FULL-STACK AI ENGINEER
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-xs text-emerald-300 font-semibold">AVAILABLE</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 12s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
});
