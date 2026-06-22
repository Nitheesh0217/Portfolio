// components/animations/SystemBoot.tsx
// visionOS System Boot Sequence Animation
'use client';

import { memo, useEffect, useState } from 'react';

interface SystemBootProps {
  onBootComplete: () => void;
}

export const SystemBoot = memo(function SystemBoot({ onBootComplete }: SystemBootProps) {
  const [bootStage, setBootStage] = useState<'init' | 'ring' | 'canvas' | 'dock' | 'window'>('init');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeline = [
      { stage: 'init', delay: 0 },
      { stage: 'ring', delay: 300 },
      { stage: 'canvas', delay: 1200 },
      { stage: 'dock', delay: 1800 },
      { stage: 'window', delay: 2400 },
    ];

    const timers = timeline.map((item) =>
      setTimeout(() => {
        setBootStage(item.stage as any);
        if (item.stage === 'window') {
          setTimeout(() => {
            setIsVisible(false);
            onBootComplete();
          }, 800);
        }
      }, item.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onBootComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-[#05050a] z-50 flex items-center justify-center pointer-events-none"
      style={{ opacity: bootStage === 'window' ? 0 : 1, transition: 'opacity 0.8s ease-out' }}
    >
      {/* Deep Space Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dot Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Ambient Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Initialization Ring */}
      {(bootStage === 'ring' || bootStage === 'canvas' || bootStage === 'dock' || bootStage === 'window') && (
        <div className="absolute">
          <div
            className="w-32 h-32 rounded-full border-2 border-violet-400/40"
            style={{
              animation: bootStage === 'ring' ? 'boot-ring 2s ease-out' : 'none',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
            }}
          />
        </div>
      )}

      {/* Canvas Fade In */}
      {(bootStage === 'canvas' || bootStage === 'dock' || bootStage === 'window') && (
        <div
          className="absolute inset-0 animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.8), rgba(30, 30, 50, 0.8))',
            opacity: bootStage === 'canvas' ? 0.3 : 0.1,
            transition: 'opacity 0.8s ease-out',
          }}
        />
      )}

      {/* Boot Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        {bootStage === 'init' && (
          <div className="text-sm text-violet-300/40 tracking-widest animate-fade-in">
            INITIALIZING...
          </div>
        )}
        {bootStage === 'ring' && (
          <div className="text-sm text-violet-300/60 tracking-widest animate-fade-in">
            SYSTEM BOOT
          </div>
        )}
        {bootStage === 'canvas' && (
          <div className="text-sm text-violet-300/40 tracking-widest animate-fade-in">
            LOADING WORKSPACE
          </div>
        )}
        {bootStage === 'dock' && (
          <div className="text-sm text-violet-300/40 tracking-widest animate-fade-in">
            READY
          </div>
        )}
      </div>

      {/* Dock Slide Up */}
      {(bootStage === 'dock' || bootStage === 'window') && (
        <div
          className="absolute bottom-0 left-0 right-0 h-24 animate-slide-up"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(20, 20, 35, 0.6))',
            backdropFilter: 'blur(10px)',
            opacity: bootStage === 'dock' ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes boot-ring {
          0% {
            transform: scale(0.5);
            opacity: 0;
            filter: blur(10px);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          }
          100% {
            transform: scale(2);
            opacity: 0;
            filter: blur(20px);
            box-shadow: 0 0 60px rgba(139, 92, 246, 0.2);
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-boot-ring {
          animation: boot-ring 2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});
