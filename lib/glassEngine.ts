// lib/glassEngine.ts
// Unified Glass Morphism Design System for visionOS

export const GLASS_ENGINE = {
  // Window States
  focused: {
    backdrop: 'backdrop-blur-2xl',
    bg: 'bg-white/[0.03]',
    ring: 'ring-1 ring-white/20',
    shadow: 'shadow-2xl',
    transform: 'scale-100',
    combined: 'backdrop-blur-2xl bg-white/[0.03] ring-1 ring-white/20 shadow-2xl scale-100 transition-all duration-300',
  },

  inactive: {
    backdrop: 'backdrop-blur-md',
    bg: 'bg-white/[0.02]',
    ring: 'ring-1 ring-white/10',
    shadow: 'shadow-lg',
    transform: 'scale-[0.98]',
    opacity: 'opacity-60',
    combined: 'backdrop-blur-md bg-white/[0.02] ring-1 ring-white/10 shadow-lg scale-[0.98] opacity-60 transition-all duration-300',
  },

  // Interactive States
  hover: {
    bg: 'bg-white/[0.05]',
    ring: 'ring-white/30',
    transform: 'scale-[1.02]',
    shadow: 'shadow-2xl',
  },

  active: {
    bg: 'bg-white/[0.08]',
    ring: 'ring-white/40',
    shadow: 'shadow-2xl',
  },

  // Subtle Effects
  shimmer: 'before:absolute before:inset-0 before:rounded-2xl before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:pointer-events-none before:transition-opacity before:duration-300 before:-skew-x-12',

  dotGrid: 'bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]',

  ambientGlow: {
    violet: 'bg-gradient-to-br from-violet-500/20 via-transparent to-transparent',
    blue: 'bg-gradient-to-br from-blue-500/15 via-transparent to-transparent',
    combined: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-violet-500/10 before:via-blue-500/5 before:to-transparent before:pointer-events-none',
  },

  // Typography
  typography: {
    hero: 'text-5xl font-black tracking-tighter',
    title: 'text-3xl font-bold tracking-tight',
    subtitle: 'text-lg font-semibold tracking-tight',
    body: 'text-base font-medium tracking-tight',
    caption: 'text-sm font-medium tracking-tight opacity-70',
  },

  // Transitions
  transitions: {
    smooth: 'transition-all duration-300 ease-out',
    spring: 'transition-all duration-500 ease-out cubic-bezier(0.34, 1.56, 0.64, 1)',
    snappy: 'transition-all duration-200 ease-out',
  },

  // Animations
  animations: {
    'pulse-glow': 'animate-pulse shadow-lg shadow-violet-500/50',
    'shimmer': 'animate-shimmer',
    'float': 'animate-float',
  },
};

// CSS for custom animations
export const GLASS_ANIMATIONS = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    50% {
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 10px 50px rgba(0, 0, 0, 0.4);
    }
  }

  @keyframes boot-ring {
    0% {
      transform: scale(0.5);
      opacity: 0;
      filter: blur(10px);
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
      filter: blur(20px);
    }
  }

  @keyframes slide-up {
    0% {
      transform: translateY(100px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .animate-shimmer {
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-boot-ring {
    animation: boot-ring 2s ease-out;
  }

  .animate-slide-up {
    animation: slide-up 0.8s ease-out cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .animate-fade-in {
    animation: fade-in 1s ease-out;
  }
`;

// Cursor-following shimmer effect
export function createShimmerEffect(e: React.MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return {
    x: (x / rect.width) * 100,
    y: (y / rect.height) * 100,
  };
}
