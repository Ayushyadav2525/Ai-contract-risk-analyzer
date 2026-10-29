import React from 'react';
import { TrendingUp, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  subValue?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  subValue
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-purple-200 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="mt-3 flex items-baseline space-x-1.5">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {subValue && <span className="text-sm font-semibold text-slate-500">{subValue}</span>}
      </div>

      <div className="mt-2 flex items-center text-[11px] font-medium text-emerald-600">
        <TrendingUp className="w-3 h-3 mr-1" />
        <span>{change}</span>
      </div>
    </div>
  );
};
