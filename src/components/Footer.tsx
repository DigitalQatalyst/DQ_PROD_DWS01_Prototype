import React from 'react';
import { Link } from 'react-router-dom';
import { ProductIdentity } from './ProductIdentity';
export function Footer() {
  return <footer className="bg-primary text-white py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <ProductIdentity variant="dark" />
          <p className="text-[#B5C5F7] text-sm max-w-md">
            DQ's internal execution workspace for governed daily work.
            Connecting tasks, requests, knowledge, workflows, and performance
            visibility.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm text-[#B5C5F7]">
            <li>
              <Link to="/stage-0/orientation" className="hover:text-white transition-colors">
                Stage 0 Orientation
              </Link>
            </li>
            <li>
              <Link to="/stage-0/operating-guide" className="hover:text-white transition-colors">
                Operating Guide
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Marketplaces
          </h4>
          <ul className="space-y-2 text-sm text-[#B5C5F7]">
            <li>
              <Link to="/marketplaces/services" className="hover:text-white transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/marketplaces/task-templates" className="hover:text-white transition-colors">
                Task Templates
              </Link>
            </li>
            <li>
              <Link to="/marketplaces/knowledge" className="hover:text-white transition-colors">
                Knowledge
              </Link>
            </li>
            <li>
              <Link to="/marketplaces/work-directory" className="hover:text-white transition-colors">
                Work Directory
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>;
}