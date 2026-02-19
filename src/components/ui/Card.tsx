import type { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={cn("bg-white rounded-xl border border-gray-200 shadow-sm p-4", className)}>
    {children}
  </div>
);
