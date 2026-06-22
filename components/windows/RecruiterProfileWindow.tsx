// components/windows/RecruiterProfileWindow.tsx
// Professional background and experience for recruiters
'use client';

import { memo } from 'react';
import { Award, Briefcase, BookOpen, Users } from 'lucide-react';

export const RecruiterProfileWindow = memo(function RecruiterProfileWindow() {
  const experience = [
    {
      company: 'Citrix Systems',
      role: 'Knowledge Systems Engineer',
      period: '2022-2023',
      details: 'Built internal RAG pipeline. 60% knowledge lookup reduction.',
      icon: Briefcase,
      highlight: true,
    },
    {
      company: 'Kore.ai',
      role: 'Enterprise AI Engineer',
      period: '2021-2022',
      details: 'Conversational AI NLU pipelines. 28% human escalation reduction.',
      icon: Briefcase,
    },
    {
      company: 'Cognizant',
      role: 'Software Engineer',
      period: '2020-2021',
      details: 'Enterprise full-stack. Java/Spring Boot. System integration.',
      icon: Briefcase,
    },
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'Java', 'Spring Boot'] },
    { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
    { category: 'AI/ML', items: ['Claude API', 'LangChain', 'RAG', 'Pinecone'] },
    { category: 'DevOps', items: ['Docker', 'Kubernetes', 'AWS', 'Vercel'] },
  ];

  return (
    <div className="flex flex-col" style={{ width: '500px', height: 'auto' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] bg-gradient-to-r from-blue-500/10 to-violet-500/10">
        <h2 className="text-lg font-bold text-white/90">👨‍💼 Professional Background</h2>
        <p className="text-xs text-white/40 mt-1">Senior Full-Stack AI Engineer</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[450px]">
        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white/80">Education</h3>
          </div>
          <div className="pl-6 space-y-2 text-sm text-white/60">
            <p className="font-semibold text-white/70">M.S. Computer Science</p>
            <p>Florida Atlantic University (GPA 3.6)</p>
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white/80">Enterprise Experience</h3>
          </div>
          <div className="space-y-3 pl-6">
            {experience.map((exp) => (
              <div
                key={exp.company}
                className={`pb-3 border-b border-white/[0.06] last:border-0 ${
                  exp.highlight ? 'bg-violet-500/10 p-3 rounded-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white/90">{exp.role}</h4>
                  <span className="text-[10px] text-white/30">{exp.period}</span>
                </div>
                <p className="text-xs text-white/50 mb-1">{exp.company}</p>
                <p className="text-xs text-white/60">{exp.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Skills */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white/80">Core Skills</h3>
          </div>
          <div className="pl-6 space-y-3">
            {skills.map((skill) => (
              <div key={skill.category}>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-1.5">
                  {skill.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-1 rounded-md bg-white/[0.06] text-white/70 border border-white/[0.1]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white/80">Certifications</h3>
          </div>
          <div className="pl-6 space-y-1.5 text-sm text-white/60">
            <p>✓ AWS Solutions Architect Associate (SAA-C03)</p>
            <p>✓ DeepLearning.AI LangChain Specialization</p>
            <p>✓ Various cloud & AI certifications</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/[0.06] px-6 py-4 space-y-3">
        <button className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all active:scale-95">
          Schedule Interview
        </button>

        <p className="text-[11px] text-white/40 text-center">
          Available for full-time, contract, and leadership roles
        </p>
      </div>
    </div>
  );
});
