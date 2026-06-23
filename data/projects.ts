// data/projects.ts
// Portfolio projects with live links and real project information, synced with Database

export const projects = [
  {
    id: 'd-scent-house',
    name: 'D Scent House',
    description: 'AI-powered e-commerce platform with custom job queue',
    longDescription: 'Full-stack e-commerce application for fragrance ordering with Next.js 14 and custom pg_notify job queue. Features include margin floor security, automated transactional emails, and Stripe payment integration.',
    impact: '$2,400/yr SaaS savings',
    tags: ['Next.js 14', 'React', 'PostgreSQL', 'Stripe', 'Node.js', 'pg_notify'],
    liveLink: 'https://d-scent-house.vercel.app',
    demoLink: 'https://d-scent-house.vercel.app',
    githubLink: 'https://github.com/Nitheesh0217/d-scent-house',
    metrics: [
      { label: 'Uptime', value: '99.9%' },
      { label: 'SaaS Saved', value: '$2.4k/yr' },
    ],
  },
  {
    id: 'coach-jake',
    name: 'Coach Jake',
    description: 'Role-based fitness coaching dashboard platform',
    longDescription: 'Comprehensive basketball coaching and fitness training platform with role-based access control. Implements head coach KPI dashboards, player conditioning logs, and NextAuth JWT claims optimization.',
    impact: '50% admin overhead reduction',
    tags: ['Next.js 16', 'TypeScript', 'PostgreSQL', 'NextAuth.js', 'TailwindCSS', 'Chart.js'],
    liveLink: 'https://coach-jake-app.vercel.app',
    demoLink: 'https://coach-jake-app.vercel.app',
    githubLink: 'https://github.com/Nitheesh0217/coach-jake-app',
    metrics: [
      { label: 'Admin Reduced', value: '50%' },
      { label: 'Avg Lookup', value: '< 1.2s' },
    ],
  },
  {
    id: 'unick-auto-detailing',
    name: 'Unick Auto Detailing',
    description: 'CRM + AI Service Recommendation booking funnel',
    longDescription: 'Goal-based booking system for mobile car detailing business. Utilizes OpenAI function calling to map customer goals to service packages, integrates Twilio SMS feedback, and automates rebooking reminders.',
    impact: '4.9★ Google rating sustained',
    tags: ['Next.js', 'PostgreSQL', 'OpenAI Function Calling', 'Twilio', 'TailwindCSS'],
    liveLink: 'https://unick-auto-detailing.vercel.app',
    demoLink: 'https://unick-auto-detailing.vercel.app',
    githubLink: 'https://github.com/Nitheesh0217/unick-auto-detailing',
    metrics: [
      { label: 'Google Rating', value: '4.9★' },
      { label: 'Reviews', value: '60+' },
    ],
  },
  {
    id: 'citrix-rag-knowledge-assistant',
    name: 'RAG Knowledge Assistant',
    description: 'Internal LangChain + Pinecone RAG with citation validation',
    longDescription: 'Enterprise Retrieval-Augmented Generation (RAG) system processing 40k knowledge base articles. Enforces strict regex-based post-generation citation validation to programmatically eliminate hallucinations.',
    impact: '60% support lookup reduction',
    tags: ['Python', 'LangChain', 'Pinecone', 'OpenAI', 'FastAPI', 'PostgreSQL', 'React'],
    liveLink: 'https://citrix.com',
    demoLink: 'https://citrix.com',
    githubLink: 'https://github.com/Nitheesh0217/ai-code-assistant',
    metrics: [
      { label: 'Lookup Reduced', value: '60%' },
      { label: 'KB Articles', value: '40K' },
    ],
  },
  {
    id: 'koreai-customer-service-agent',
    name: 'Customer Service AI Agent',
    description: 'Kore.ai bot intent retraining and webhook idempotency',
    longDescription: 'NLU retraining pipeline for enterprise chat bot combined with Spring Boot webhook idempotency middleware. Reduces duplicate support tickets and intent misclassifications under shadow deployment.',
    impact: '28% escalation rate reduction',
    tags: ['Kore.ai Platform', 'Java', 'Spring Boot', 'NLU', 'REST APIs', 'PostgreSQL'],
    liveLink: 'https://kore.ai',
    demoLink: 'https://kore.ai',
    githubLink: 'https://github.com/Nitheesh0217/prompt-eng',
    metrics: [
      { label: 'Escalations Down', value: '28%' },
      { label: 'Shadow Period', value: '60 days' },
    ],
  },
];

export type Project = typeof projects[0];
