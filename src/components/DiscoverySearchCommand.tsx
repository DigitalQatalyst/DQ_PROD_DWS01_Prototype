import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Briefcase, FileText, BookOpen, CheckSquare, Inbox, BarChart2, User } from 'lucide-react';

interface SearchResult {
  id: string;
  group: string;
  title: string;
  subtitle: string;
}

export function DiscoverySearchCommand() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // Mock data for search
  const groups = [{
    id: 'services',
    label: 'Services',
    icon: Briefcase,
    route: '/marketplaces/services'
  }, {
    id: 'templates',
    label: 'Task templates',
    icon: FileText,
    route: '/marketplaces/task-templates'
  }, {
    id: 'knowledge',
    label: 'Knowledge',
    icon: BookOpen,
    route: '/marketplaces/knowledge'
  }, {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    route: '/workspace/my-tasks'
  }, {
    id: 'requests',
    label: 'Requests',
    icon: Inbox,
    route: '/workspace/my-requests'
  }, {
    id: 'dashboards',
    label: 'Dashboards',
    icon: BarChart2,
    route: '/marketplaces/analytics'
  }, {
    id: 'owners',
    label: 'Owners',
    icon: User,
    route: '/marketplaces/work-directory'
  }];
  // Mock results based on query
  const getResults = () => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    // If it's the specific test case from the spec
    if (lowerQuery.includes('map discovery') || lowerQuery.includes('truncation')) {
      return [{
        id: 'TSK-1006',
        group: 'tasks',
        title: 'Map Discovery Search result groups with a deliberately long task name to test truncation behaviour in table and cards',
        subtitle: 'Draft • Medium Priority'
      }];
    }
    // Generic mock results
    return groups.flatMap((group) => {
      if (group.label.toLowerCase().includes(lowerQuery)) {
        return [{
          id: `nav-${group.id}`,
          group: group.id,
          title: `Go to ${group.label}`,
          subtitle: 'Navigation'
        }];
      }
      return [];
    });
  };
  const results = getResults();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery('');
    }
  }, [isOpen]);
  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    if (result.id.startsWith('nav-')) {
      const group = groups.find((g) => g.id === result.group);
      if (group) navigate(group.route);
    } else {
      // In a real app, this would open the DetailPanel or navigate to the item
      console.log('Selected item:', result);
    }
  };
  return <>
      <button onClick={() => setIsOpen(true)} className="hidden h-10 w-52 items-center gap-2 rounded-button border-[1.5px] border-border-default bg-white px-4 text-text-muted transition-colors hover:bg-navy-50 focus:outline-none focus:ring-4 focus:ring-primary/10 md:flex xl:w-64">
        <Search size={16} strokeWidth={1.5} />
        <span className="flex-1 text-left text-sm">Global search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border-strong bg-white px-1.5 font-mono text-[10px] font-medium text-text-muted">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {isOpen && <div className="fixed inset-0 z-[200] bg-primary/20 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
          <div className="w-full max-w-[720px] bg-white rounded-modal shadow-xl border border-border-default overflow-hidden flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center px-4 border-b border-border-subtle">
              <Search size={20} strokeWidth={1.5} className="text-text-muted shrink-0" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services, templates, knowledge, tasks..." className="flex-1 h-14 px-4 bg-transparent outline-none text-text-primary placeholder:text-text-muted" />
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-button hover:bg-surface text-text-muted hover:text-text-primary">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="overflow-y-auto p-2">
              {!query ? <div className="p-4">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Suggested Groups
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {groups.map((group) => {
                const Icon = group.icon;
                return <button key={group.id} onClick={() => {
                  setIsOpen(false);
                  navigate(group.route);
                }} className="flex items-center gap-3 p-3 rounded-button hover:bg-surface text-left">
                          <div className="text-primary">
                            <Icon size={18} strokeWidth={1.5} />
                          </div>
                          <span className="text-sm font-medium text-text-primary">
                            {group.label}
                          </span>
                        </button>;
              })}
                  </div>
                </div> : results.length > 0 ? <div className="py-2">
                  {results.map((result) => <button key={result.id} onClick={() => handleSelect(result)} className="w-full flex flex-col gap-1 p-3 rounded-button hover:bg-surface text-left">
                      <span className="text-sm font-medium text-text-primary truncate w-full">
                        {result.title}
                      </span>
                      <span className="text-xs text-text-muted">
                        {result.subtitle}
                      </span>
                    </button>)}
                </div> : <div className="p-12 text-center">
                  <p className="text-sm text-text-muted">
                    No permitted result found for this persona
                  </p>
                </div>}
            </div>
          </div>

          {/* Click outside overlay */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>}
    </>;
}
