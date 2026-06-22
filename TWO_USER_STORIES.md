# 🎯 Two User Stories — Complete Implementation Guide

**Status:** ✅ BUILT & READY  
**Impact:** MASSIVE — Different experience for different audiences  
**Setup Time:** 10 minutes

---

## 🎨 The Concept

**Your portfolio detects who's visiting and shows them exactly what they need.**

```
Visitor arrives
    ↓
Choose: "Looking to hire?" or "Need freelance work?"
    ↓
Experience tailored to their needs
    ↓
Different windows, different metrics, different AI responses
    ↓
Hired or Booked ✅
```

---

## 📊 The Two Experiences

### 👤 FREELANCER VIEW
**For clients looking to hire for projects**

**What they see:**
- ✅ Rates & packages
- ✅ Portfolio (project delivery focus)
- ✅ Timeline view
- ✅ "Get a Quote" CTA
- ✅ AI responds about: speed, cost, custom solutions

**Key metrics:**
- Projects Delivered: 20+
- Avg Delivery: 4 weeks
- Client Satisfaction: 100%
- Cost Savings Delivered: $2.4M+

**Colors:** Emerald (action) + Cyan (modern)

---

### 🏢 RECRUITER VIEW
**For companies/recruiters looking to hire**

**What they see:**
- ✅ Professional background
- ✅ Skills & experience
- ✅ Portfolio (business impact focus)
- ✅ Metrics showcase
- ✅ "Schedule Interview" CTA
- ✅ AI responds about: reliability, systems thinking, leadership

**Key metrics:**
- Years Experience: 5+
- Companies: 3 Enterprise
- Systems Shipped: 20+
- Business Impact: 60%+ avg improvement

**Colors:** Blue (corporate) + Violet (premium)

---

## 📁 Files Created

### Core System
```
lib/userContext.ts                    ← User story definitions & storage
lib/userStoryPrompts.ts               ← AI prompts for each story
```

### Components
```
components/UserStorySelector.tsx      ← Modal to choose experience
components/windows/FreelanceRatesWindow.tsx      ← Rates & packages
components/windows/RecruiterProfileWindow.tsx    ← Background & skills
```

---

## 🚀 Integration Steps

### Step 1: Add UserStorySelector to Your Layout

In `app/page.tsx`, add this at the top of your return statement:

```typescript
import { UserStorySelector } from '@/components/UserStorySelector';

export default function DesktopCanvas() {
  return (
    <div className="relative w-screen h-screen">
      <UserStorySelector />  {/* ← ADD THIS */}
      
      <BackgroundImage />
      <DesktopBackground />
      <MenuBar onOpenAll={openAll} onCloseAll={closeAll} />
      
      {/* ... rest of layout ... */}
    </div>
  );
}
```

### Step 2: Conditionally Render Windows

Update `app/page.tsx` to render different windows based on user story:

```typescript
import { getUserStory } from '@/lib/userContext';
import { FreelanceRatesWindow } from '@/components/windows/FreelanceRatesWindow';
import { RecruiterProfileWindow } from '@/components/windows/RecruiterProfileWindow';

export default function DesktopCanvas() {
  const userStory = getUserStory();
  
  return (
    <div className="relative w-screen h-screen">
      {WINDOW_IDS.map((id) => {
        const win = windows[id];
        if (!win.isMounted) return null;
        const isVisible = win.isOpen && !win.isMinimized;
        const h = handlers[id];

        // Conditionally render based on user story
        let content = null;
        
        if (id === 'welcome') {
          // Same for both
          content = <WelcomeWindow ... />;
        } else if (id === 'projects') {
          // Same for both
          content = <ProjectsWindow ... />;
        } else if (id === 'rates') {
          // FREELANCER ONLY
          if (userStory === 'freelancer') {
            content = <FreelanceRatesWindow />;
          }
        } else if (id === 'background') {
          // RECRUITER ONLY
          if (userStory === 'recruiter') {
            content = <RecruiterProfileWindow />;
          }
        } else if (id === 'assistant') {
          // AI responds differently based on story
          content = <AIAssistantWindow />;
        }

        return (
          <SystemWindow
            key={id}
            win={win}
            isVisible={isVisible}
            onFocus={h.focus}
            onClose={h.close}
            onMinimize={h.minimize}
            onMove={h.move}
          >
            {content}
          </SystemWindow>
        );
      })}
    </div>
  );
}
```

### Step 3: Update AI Assistant

Update `app/api/assistant/route.ts` to use context-aware prompts:

```typescript
import { getUserStory } from '@/lib/userContext';
import { getContextAwarePrompt } from '@/lib/userStoryPrompts';

export async function POST(req: Request) {
  // ... existing code ...
  
  const userStory = getUserStory();  // Get from request header or fallback
  const systemPrompt = getContextAwarePrompt(userStory, contextBlock);
  
  // ... rest of your code using systemPrompt ...
}
```

### Step 4: Update Window IDs

Add new windows to `types/windows.ts`:

```typescript
export const WINDOW_IDS = [
  'welcome',
  'terminal',
  'projects',
  'certificates',
  'metrics',
  'contact',
  'assistant',
  'search',
  'timeline',
  'skills',
  'rates',        // ← NEW: Freelancer rates
  'background',   // ← NEW: Recruiter background
] as const;
```

### Step 5: Add Window Defaults

Update `lib/windowReducer.ts`:

```typescript
const WINDOW_DEFAULTS: Record<WindowId, WindowDef> = {
  // ... existing ...
  rates: {
    id: 'rates',
    title: '💰 Rates & Packages',
    zIndex: Z_BASE + 2,
    position: { x: 400, y: MENUBAR_HEIGHT + 100 },
    size: { w: 600, h: 'auto' },
  },
  background: {
    id: 'background',
    title: '👨‍💼 Professional Background',
    zIndex: Z_BASE + 2,
    position: { x: 350, y: MENUBAR_HEIGHT + 80 },
    size: { w: 500, h: 'auto' },
  },
};
```

---

## 🎯 What Happens

### First-Time Visitor Flow

```
Landing on portfolio
    ↓
Modal appears: "Choose your experience"
    ↓
Option 1: "💼 Looking for freelance work?" (Emerald theme)
    ↓
Selects → Freelancer experience loads
    ↓
Sees: Rates, Packages, Portfolio, Quick booking
    ↓
Different AI responses about: speed, cost, custom solutions
    ↓
Clicks "Get a Quote" → Booking flow
```

```
OR

Landing on portfolio
    ↓
Option 2: "🏢 Looking to hire?" (Blue theme)
    ↓
Selects → Recruiter experience loads
    ↓
Sees: Background, Skills, Experience, Metrics
    ↓
Different AI responses about: reliability, leadership, impact
    ↓
Clicks "Schedule Interview" → Interview booking
```

### Switching Stories

Button in top-left (next to theme switcher):
- Shows current selection: "💼 Freelancer" or "🏢 Recruiter"
- Click to switch
- Automatically reloads with new experience
- Selection saved to localStorage

---

## 💡 Design Decisions

### Why Two Stories?
```
Freelancers want:        Recruiters want:
- Rates                  - Background
- Availability           - Experience  
- Quick booking          - Technical skills
- Custom solutions       - Leadership ability
- Portfolio evidence     - Team fit
- Cost/timeline trade    - Reliability proof
```

Different needs = Different experience

### Why Conditional Rendering?
- **Cleaner UX** — Only show relevant windows
- **Focused message** — No confusion
- **Shorter decision path** — Less scrolling
- **Context-aware AI** — Answers what matters

### Why Different AI Prompts?

**Freelancer asks:** "How long? How much?"  
**AI responds:** "4 weeks, $7,500, includes..."

**Recruiter asks:** "How reliable is he?"  
**AI responds:** "Shipped 20+ systems, zero production failures..."

Same engineer, different framing.

---

## 🎨 Visual Design

### Freelancer Selection Card
```
┌─────────────────────────────┐
│ 💼 Hiring for a Project?    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Looking for a full-stack    │
│ engineer for custom work    │
│                             │
│ ✓ View rates & packages     │
│ ✓ Project portfolio         │
│ ✓ Quick booking             │
│ ✓ Availability              │
│                             │
│         Start →             │
└─────────────────────────────┘
```

### Recruiter Selection Card
```
┌─────────────────────────────┐
│ 🏢 Recruiting?              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Looking to hire a senior    │
│ full-stack AI engineer      │
│                             │
│ ✓ Full background & exp     │
│ ✓ Key projects & impact     │
│ ✓ Technical skills          │
│ ✓ Schedule interview        │
│                             │
│      View Profile →         │
└─────────────────────────────┘
```

---

## ✅ Checklist

- [ ] `lib/userContext.ts` created ✅
- [ ] `lib/userStoryPrompts.ts` created ✅
- [ ] `UserStorySelector.tsx` created ✅
- [ ] `FreelanceRatesWindow.tsx` created ✅
- [ ] `RecruiterProfileWindow.tsx` created ✅
- [ ] `types/windows.ts` updated with new window IDs
- [ ] `lib/windowReducer.ts` updated with window defaults
- [ ] `app/page.tsx` imports UserStorySelector
- [ ] `app/page.tsx` conditionally renders windows
- [ ] `app/api/assistant/route.ts` uses context-aware prompts
- [ ] Test locally: `npm run dev`
  - [ ] Visit site → Modal appears
  - [ ] Select "Freelancer" → See rates window
  - [ ] Select "Recruiter" → See background window
  - [ ] Switch using button → Reload with new experience
  - [ ] AI responds differently in each mode
- [ ] Deploy to production

---

## 🚀 Testing

### Test Freelancer Path
```bash
npm run dev
# 1. Visit http://localhost:3000
# 2. Click "💼 Hiring for a Project?"
# 3. Verify:
#    - Rates window appears in dock
#    - Projects shown with deliverables focus
#    - Metrics show delivery speed
#    - Contact CTA says "Get a Quote"
```

### Test Recruiter Path
```bash
# 1. Click user story selector (top-left)
# 2. Select "🏢 Recruiting?"
# 3. Verify:
#    - Background window appears in dock
#    - Skills prominently displayed
#    - Metrics show business impact
#    - Contact CTA says "Schedule Interview"
```

### Test Switching
```bash
# 1. Click user story button (shows current selection)
# 2. Switch from Freelancer → Recruiter
# 3. Verify: Page reloads with new experience
# 4. Check localStorage: user_story changed
```

---

## 📊 Impact

### For Freelance Clients
- ✅ Immediately know rates
- ✅ See relevant projects
- ✅ Easy booking path
- ✅ No recruiter stuff cluttering UI

### For Recruiters
- ✅ Immediately see background
- ✅ Skills & experience organized
- ✅ Clear hiring signal
- ✅ No freelance pricing confusing the offer

### For You
- ✅ Convert more freelance deals
- ✅ Get more interviews
- ✅ Eliminate friction for each audience
- ✅ Demonstrate design thinking (two personas!)

---

## 🎯 Next Level Thinking

This isn't just a portfolio anymore. It's:

✅ **Persona-Aware** — Different user types get different experiences  
✅ **Conversion Optimized** — Each path leads to action  
✅ **Design Sophisticated** — Proves you think about UX  
✅ **Strategic** — You understand your audiences  

**When hiring managers see this, they think:**
*"This person doesn't just build features. They build experiences. They think about their users' needs."*

---

## 🎉 Summary

**Files created:** 5 new files  
**Setup time:** 10 minutes  
**Implementation:** Clear steps above  
**Impact:** Massive  

**You now have:**
- ✅ Freelancer experience (rates, quick booking)
- ✅ Recruiter experience (background, skills)
- ✅ Context-aware AI (different responses)
- ✅ Easy switching (button in top-left)
- ✅ Persistent selection (localStorage)

---

## 🚀 Deploy

```bash
# 1. Implement the 5 integration steps above
# 2. Test locally (both paths)
# 3. Deploy
git add .
git commit -m "feat: add two user stories - freelancer and recruiter experiences"
git push origin main
# Vercel auto-deploys
```

---

**Ready to implement?** Follow the 5 integration steps above. Should take ~10 minutes.

**Want to level up even more?** Add analytics to track which path visitors choose. 📊

---

*Two different audiences. Two perfect experiences. One powerful portfolio.* 🎯
