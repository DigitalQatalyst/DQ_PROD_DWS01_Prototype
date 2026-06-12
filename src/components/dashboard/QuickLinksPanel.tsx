import { Link } from 'react-router-dom';
import { ArrowUpRight, Lightbulb } from 'lucide-react';
import { dashboardQuickLinks } from '../../mocks/associateDashboard.mock';

export function QuickLinksPanel() {
  return (
    <section className="dq-card flex h-full flex-col">
      <h2 className="dq-card-title">Quick links</h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {dashboardQuickLinks.map(({ label, route, icon: Icon }) => (
          <Link
            key={label}
            to={route}
            className="group relative flex min-h-[52px] items-center gap-3 rounded-btn border border-border-default bg-white px-3.5 py-3 transition duration-200 hover:border-dq-orange hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
          >
            <Icon
              size={18}
              strokeWidth={1.5}
              className="shrink-0 text-dq-orange transition-colors group-hover:text-dq-orange"
              aria-hidden
            />
            <span className="pr-5 text-sm font-medium leading-snug text-primary">{label}</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.5}
              className="absolute right-3 top-3 text-gray-400 transition-colors group-hover:text-dq-orange"
              aria-hidden
            />
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-btn bg-orange-50 px-4 py-3">
        <Lightbulb size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-warning" aria-hidden />
        <p className="text-sm leading-relaxed text-gray-700">
          Tip: Use the dashboard to jump into the most urgent work first.
        </p>
      </div>
    </section>
  );
}
