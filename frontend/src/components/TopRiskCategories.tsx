import React from 'react';
import { ShieldAlert, AlertTriangle, XCircle, Scale, CreditCard } from 'lucide-react';

export const TopRiskCategories: React.FC = () => {
  const categories = [
    { name: 'Indemnity', icon: ShieldAlert, count: 12, progress: 85, color: 'bg-red-500' },
    { name: 'Limitation of Liability', icon: AlertTriangle, count: 9, progress: 72, color: 'bg-red-500' },
    { name: 'Termination', icon: XCircle, count: 7, progress: 55, color: 'bg-amber-500' },
    { name: 'Governing Law', icon: Scale, count: 5, progress: 40, color: 'bg-amber-500' },
    { name: 'Payment Terms', icon: CreditCard, count: 4, progress: 30, color: 'bg-emerald-500' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <h2 className="text-sm font-bold text-slate-900 mb-4">Top risk categories</h2>
      <div className="space-y-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                  <span className="font-bold text-slate-900 ml-2">{cat.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-300`}
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
