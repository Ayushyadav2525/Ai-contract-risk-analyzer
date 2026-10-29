import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  BarChart3, 
  GitCompare, 
  BookOpen, 
  Library, 
  Settings, 
  HelpCircle, 
  LogOut, 
  User 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const workspaceNavs = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Contract', path: '/upload', icon: UploadCloud },
    { name: 'Legal Agreements', path: '/agreements', icon: FileText },
    { name: 'My Contracts', path: '/contracts', icon: FileText },
    { name: 'Risk Reports', path: '/reports', icon: BarChart3 },
    { name: 'Compare Contracts', path: '/compare', icon: GitCompare },
  ];

  const libraryNavs = [
    { name: 'Playbooks', path: '/playbooks', icon: BookOpen },
    { name: 'Clause Library', path: '/clause-library', icon: Library },
  ];

  const accountNavs = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help & Support', path: '/help', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-white text-xs tracking-wide leading-tight uppercase">
            AI Contract Risk Analyzer
          </h1>
          <p className="text-[10px] text-purple-400 font-semibold leading-none mt-1">
            ContractAI Engine
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {/* Workspace */}
        <div>
          <h2 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            WORKSPACE
          </h2>
          <nav className="space-y-1">
            {workspaceNavs.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Library */}
        <div>
          <h2 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            LIBRARY
          </h2>
          <nav className="space-y-1">
            {libraryNavs.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Account */}
        <div>
          <h2 className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            ACCOUNT
          </h2>
          <nav className="space-y-1">
            {accountNavs.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
              AY
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Ayush Yadav</p>
              <p className="text-[10px] text-slate-400">Admin</p>
            </div>
          </div>
          <button
            title="Logout"
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700/50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
