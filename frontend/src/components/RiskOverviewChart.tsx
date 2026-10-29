import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskOverviewProps {
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

export const RiskOverviewChart: React.FC<RiskOverviewProps> = ({
  highCount = 7,
  mediumCount = 11,
  lowCount = 6
}) => {
  const [filter, setFilter] = useState('This month');
  const total = highCount + mediumCount + lowCount || 24;

  const data = [
    { name: 'High risk', value: highCount, color: '#EF4444' },
    { name: 'Medium risk', value: mediumCount, color: '#F59E0B' },
    { name: 'Low risk', value: lowCount, color: '#10B981' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Risk overview</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option>This week</option>
          <option>This month</option>
          <option>Last 3 months</option>
          <option>This year</option>
        </select>
      </div>

      {/* Donut Chart with Center Text */}
      <div className="relative h-48 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-[11px] text-slate-400 font-medium">total</span>
        </div>
      </div>

      {/* Legend Breakdown */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {data.map((item) => {
          const pct = Math.round((item.value / total) * 100) || 0;
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-900">{item.value}</span>
                <span className="text-slate-400 w-8 text-right font-medium">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
