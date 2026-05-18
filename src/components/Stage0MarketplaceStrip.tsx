import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
export function Stage0MarketplaceStrip() {
  const navigate = useNavigate();
  return <section className="max-w-5xl mx-auto">
      <div className="bg-primary rounded-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-secondary">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Need something else?
            </h2>
            <p className="text-navy-200 text-sm">
              Explore the marketplaces for services, templates, knowledge, and
              analytics.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => navigate('/marketplaces/services')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-button font-semibold hover:bg-surface transition-colors shadow-sm">
            Open Marketplaces
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>;
}