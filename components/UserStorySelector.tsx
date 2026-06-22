// components/UserStorySelector.tsx
// Modal to choose between Freelancer or Recruiter experience
'use client';

import { memo, useState, useEffect } from 'react';
import { Briefcase, Users, ArrowRight } from 'lucide-react';
import { setUserStory, getUserStory, UserStory } from '@/lib/userContext';

interface UserStorySelectorProps {
  onSelect?: (story: UserStory) => void;
}

export const UserStorySelector = memo(function UserStorySelector({ onSelect }: UserStorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<UserStory | null>(null);

  useEffect(() => {
    const saved = getUserStory();
    setSelected(saved);
    // Check if first visit (no user story saved yet)
    if (!localStorage.getItem('user_story')) {
      setIsOpen(true);
    }
  }, []);

  const handleSelect = (story: UserStory) => {
    setSelected(story);
    setUserStory(story);
    setIsOpen(false);
    onSelect?.(story);
    // Reload or update context
    window.location.reload();
  };

  return (
    <>
      {/* Selection Button (Top-Left, next to palette) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-8 left-8 z-[9999] px-4 py-2 rounded-full bg-white/[0.1] text-white/70 hover:bg-white/[0.15] hover:text-white transition-all text-sm font-medium flex items-center gap-2"
        >
          <span>
            {selected === 'freelancer' ? '💼 Freelancer' : '🏢 Recruiter'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-white/[0.95] backdrop-blur-xl rounded-2xl border border-white/[0.2] p-8 max-w-2xl w-full mx-4 shadow-2xl animate-in fade-in scale-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white/90 mb-2">
                Welcome to My Portfolio
              </h2>
              <p className="text-white/60">Choose your experience</p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Freelancer Option */}
              <button
                onClick={() => handleSelect('freelancer')}
                className="group relative overflow-hidden rounded-xl border-2 border-white/[0.1] hover:border-emerald-500/50 p-6 transition-all hover:bg-emerald-500/5"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all" />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                      <Briefcase className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white/90 mb-2">
                    💼 Hiring for a Project?
                  </h3>

                  <p className="text-white/60 text-sm mb-4">
                    Looking for a full-stack engineer for custom development work
                  </p>

                  {/* Details */}
                  <ul className="space-y-2 text-sm text-white/50 mb-4">
                    <li>✓ View rates & packages</li>
                    <li>✓ Project portfolio</li>
                    <li>✓ Quick booking</li>
                    <li>✓ Availability</li>
                  </ul>

                  <div className="text-emerald-400 text-sm font-semibold group-hover:text-emerald-300 transition-colors">
                    Start →
                  </div>
                </div>
              </button>

              {/* Recruiter Option */}
              <button
                onClick={() => handleSelect('recruiter')}
                className="group relative overflow-hidden rounded-xl border-2 border-white/[0.1] hover:border-blue-500/50 p-6 transition-all hover:bg-blue-500/5"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/5 transition-all" />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white/90 mb-2">
                    🏢 Recruiting?
                  </h3>

                  <p className="text-white/60 text-sm mb-4">
                    Looking to hire a senior full-stack AI engineer
                  </p>

                  {/* Details */}
                  <ul className="space-y-2 text-sm text-white/50 mb-4">
                    <li>✓ Full background & experience</li>
                    <li>✓ Key projects & impact</li>
                    <li>✓ Technical skills</li>
                    <li>✓ Schedule interview</li>
                  </ul>

                  <div className="text-blue-400 text-sm font-semibold group-hover:text-blue-300 transition-colors">
                    View Profile →
                  </div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-white/40 text-sm">
              <p>You can switch between these views anytime using the button in the top-left corner</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
