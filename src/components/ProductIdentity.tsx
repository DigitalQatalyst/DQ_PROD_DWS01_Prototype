import React from 'react';
import { Link } from 'react-router-dom';
interface ProductIdentityProps {
  variant?: 'light' | 'dark';
}
export function ProductIdentity({
  variant = 'light'
}: ProductIdentityProps) {
  const isDark = variant === 'dark';
  return <Link to="/home" className="flex items-baseline gap-1 hover:opacity-80 transition-opacity">
      <span className={`text-[18px] font-bold ${isDark ? 'text-white' : 'text-primary'}`}>
        DWS.01
      </span>
      <span className={`text-[15px] font-medium ${isDark ? 'text-[#B5C5F7]' : 'text-[#454560]'}`}>
        / Work.Space4.0
      </span>
    </Link>;
}
