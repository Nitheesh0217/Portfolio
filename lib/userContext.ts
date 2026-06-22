// lib/userContext.ts
// Context-aware user stories: Freelancer vs Recruiter

export type UserStory = 'freelancer' | 'recruiter';

export interface UserStoryConfig {
  type: UserStory;
  title: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  ctaText: string;
  ctaSubtext: string;
  windowPriority: string[]; // Which windows to show first
  metrics: string[];
  projectFocus: 'deliverables' | 'impact'; // What to emphasize
}

export const USER_STORY_CONFIGS: Record<UserStory, UserStoryConfig> = {
  freelancer: {
    type: 'freelancer',
    title: '💼 Looking for Freelance Work?',
    description: 'Full-stack AI engineer available for custom projects',
    primaryColor: '#10b981', // Emerald (action-oriented)
    accentColor: '#06b6d4', // Cyan (modern, tech-focused)
    ctaText: 'Get a Quote',
    ctaSubtext: 'Let\'s build something custom',
    windowPriority: ['projects', 'rates', 'timeline', 'portfolio', 'contact', 'assistant'],
    metrics: ['Projects Shipped', 'Happy Clients', 'Avg Project Speed'],
    projectFocus: 'deliverables',
  },
  recruiter: {
    type: 'recruiter',
    title: '🏢 Looking to Hire?',
    description: 'Senior full-stack engineer with AI expertise',
    primaryColor: '#3b82f6', // Blue (corporate)
    accentColor: '#8b5cf6', // Violet (premium, leadership)
    ctaText: 'Schedule Interview',
    ctaSubtext: 'Let\'s talk about your team',
    windowPriority: ['background', 'experience', 'skills', 'metrics', 'assistant', 'contact'],
    metrics: ['Years Experience', 'Companies Built', 'Systems Shipped'],
    projectFocus: 'impact',
  },
};

// Default to recruiter view (hire vs freelance)
export const DEFAULT_USER_STORY: UserStory = 'recruiter';

// Get config by type
export function getUserStoryConfig(type: UserStory): UserStoryConfig {
  return USER_STORY_CONFIGS[type];
}

// Save to localStorage
export function setUserStory(type: UserStory): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_story', type);
  }
}

// Load from localStorage
export function getUserStory(): UserStory {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('user_story');
    return (saved as UserStory) || DEFAULT_USER_STORY;
  }
  return DEFAULT_USER_STORY;
}

// Clear selection
export function clearUserStory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_story');
  }
}
