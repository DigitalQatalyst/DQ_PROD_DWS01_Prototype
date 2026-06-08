import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { searchSuggestions } from '../../mocks/stage0Home.mock';

interface AIDiscoverySearchProps {
  isNewJoiner: boolean;
}

export function AIDiscoverySearch({ isNewJoiner }: AIDiscoverySearchProps) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');

  const placeholder = isNewJoiner
    ? 'AI Discovery Search - Search onboarding guidance, services, access, knowledge, templates or support...'
    : 'AI Discovery Search - Search tasks, requests, services, templates, knowledge, dashboards, or owners...';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.info(
      query.trim()
        ? `AI Discovery Search prototype results for "${query.trim()}".`
        : 'Enter a search term to explore permission-aware results.'
    );
  };

  return (
    <div className="relative w-full max-w-[820px]">
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="home-ai-discovery-search">
          AI Discovery Search
        </label>
        <div
          className={`flex h-11 items-center gap-3 rounded-input border bg-white px-3 shadow-md transition-shadow sm:px-4 ${
            focused ? 'border-secondary ring-2 ring-secondary/20' : 'border-border-default'
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-button bg-orange-50 text-secondary">
            <Sparkles size={17} strokeWidth={1.7} />
          </span>
          <input
            id="home-ai-discovery-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-primary placeholder:text-text-disabled focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-button text-text-muted hover:bg-navy-50 hover:text-primary"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
        </div>
      </form>
      <p className="mt-3 text-center text-xs text-text-muted">
        Results are permission-aware and based on your workspace access.
      </p>
      {focused && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 rounded-card border border-border-subtle bg-white p-2 shadow-lg">
          <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Suggestions</p>
          <ul className="space-y-1">
            {searchSuggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQuery(item);
                    toast.info(`Searching for ${item}…`);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-primary hover:bg-surface"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
