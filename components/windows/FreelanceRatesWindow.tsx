// components/windows/FreelanceRatesWindow.tsx
// Freelance rates and packages
'use client';

import { memo } from 'react';
import { Check, MessageSquare, Calendar } from 'lucide-react';

export const FreelanceRatesWindow = memo(function FreelanceRatesWindow() {
  const packages = [
    {
      name: 'Small Project',
      price: '$2,500 - $5,000',
      description: 'Features, APIs, integrations',
      duration: '2-4 weeks',
      features: ['5-10 features', 'API integration', 'Database setup', 'Basic testing'],
    },
    {
      name: 'Medium Project',
      price: '$5,000 - $15,000',
      description: 'Full applications, SaaS, platforms',
      duration: '4-8 weeks',
      features: ['Full-stack app', 'Auth system', 'Dashboard', 'Deployment ready'],
      popular: true,
    },
    {
      name: 'Large Project',
      price: '$15,000+',
      description: 'Complex systems, AI integration',
      duration: '8+ weeks',
      features: ['Scalable architecture', 'AI/ML features', 'Real-time systems', 'Custom solutions'],
    },
  ];

  return (
    <div className="flex flex-col" style={{ width: '600px', height: 'auto' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold text-white/90">💰 Rates & Packages</h2>
        <p className="text-xs text-white/40 mt-1">Custom quotes available for any project</p>
      </div>

      {/* Packages Grid */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-[400px]">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`relative rounded-xl border-2 p-4 transition-all ${
              pkg.popular
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2]'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 right-4 bg-emerald-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}

            {/* Title & Price */}
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-sm font-bold text-white/90">{pkg.name}</h3>
              <span className="text-emerald-400 font-bold text-lg">{pkg.price}</span>
            </div>

            {/* Description */}
            <p className="text-xs text-white/50 mb-3">{pkg.description}</p>

            {/* Duration */}
            <div className="flex items-center gap-1 text-xs text-white/40 mb-3">
              <Calendar className="w-3 h-3" />
              {pkg.duration}
            </div>

            {/* Features */}
            <div className="space-y-1.5">
              {pkg.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-xs text-white/60">
                  <Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/[0.06] px-6 py-4 space-y-3">
        <button className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Get a Custom Quote
        </button>

        <p className="text-[11px] text-white/40 text-center">
          Available for contract, hourly, or project-based work
        </p>
      </div>
    </div>
  );
});
