import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const RiskTrendChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('Last 7 weeks');

  const data = [
    { label: 'W1', score: 45 },
    { label: 'W2', score: 52 },
    { label: 'W3', score: 60 },
    { label: 'W4', score: 58 },
    { label: 'W5', score: 65 },
    { label: 'W6', score: 61 },
    { label: 'W7', score: 62 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Risk score trend</h2>
          <p className="text-xs text-slate-400">Average contract risk over time</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option>Last 7 days</option>
          <option>Last 4 weeks</option>
          <option>Last 7 weeks</option>
          <option>Last 6 months</option>
          <option>Last year</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#0F172A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              formatter={(val: any) => [`${val} / 100`, 'Avg Risk']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6C5CE7"
              strokeWidth={2.5}
              dot={{ fill: '#6C5CE7', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
