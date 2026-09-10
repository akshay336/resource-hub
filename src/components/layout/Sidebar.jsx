import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Boxes, Award, Building2, 
  FolderKanban, Grid3X3, UsersRound, FileText, CalendarDays, 
  Hourglass, CalendarClock, PieChart, Gauge, FileBarChart, 
  Bell, Sliders, ShieldCheck, UserPlus, ArrowLeftRight,
  ChevronLeft, ChevronRight, LogOut, Layers, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Icon Map resolver
const iconMap = {
  LayoutDashboard,
  Users,
  Boxes,
  Award,
  Building2,
  FolderKanban,
  Grid3X3,
  UsersRound,
  FileText,
  CalendarDays,
  Hourglass,
  CalendarClock,
  PieChart,
  Gauge,
  FileBarChart,
  Bell,
  Sliders,
  ShieldCheck,
  UserPlus,
  ArrowLeftRight
};

export default function Sidebar({ currentView, onNavigate, isCollapsed, onToggleCollapse }) {
  const { currentUser, roleNavigation, logout, switchRole, demoAccounts } = useAuth();

  // Group navigation items
  const groups = roleNavigation.reduce((acc, item) => {
    const groupName = item.group || 'General';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {});

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 bg-[#111827] text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
      isCollapsed ? 'w-[76px]' : 'w-[260px]'
    }`}>
      
      {/* Top Header & Brand */}
      <div>
        
        {/* Brand Bar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4056d6] to-[#6b7cff] flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-base font-bold text-white tracking-tight">
                  Resource<span className="text-[#8492ff]">Hub</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Enterprise Portal
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Demo Role Switcher Box (Matches Prototype Role Switcher) */}
        <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
          {!isCollapsed ? (
            <div className="bg-[#1d2638] border border-[#303a4e] rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#8492ff]" /> Active Demo Role
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value)}
                className="w-full bg-[#111827] text-white text-xs font-medium border border-[#3a4559] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6b7cff] cursor-pointer"
              >
                <option value="System Admin">System Admin</option>
                <option value="Delivery Head">Delivery Head</option>
                <option value="Project Manager">Project Manager</option>
                <option value="HR">HR Manager</option>
              </select>
            </div>
          ) : (
            <div className="flex justify-center" title={`Current Role: ${currentUser.role}`}>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-[#8492ff] flex items-center justify-center font-bold text-xs">
                {currentUser.role.slice(0, 2).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Navigation Menu Items */}
        <div className="overflow-y-auto max-h-[calc(100vh-250px)] px-3 py-3 space-y-4">
          {Object.entries(groups).map(([groupTitle, items]) => (
            <div key={groupTitle} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {groupTitle}
                </div>
              )}

              {items.map((item) => {
                const IconComponent = iconMap[item.icon] || LayoutDashboard;
                const isActive = currentView === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => onNavigate(item.name)}
                    title={isCollapsed ? item.name : ''}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#27334c] text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8492ff]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom User Profile Card & Sign Out */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <button
              onClick={() => onNavigate('Profile')}
              className="flex items-center gap-2.5 overflow-hidden text-left hover:opacity-80 transition-opacity cursor-pointer flex-1"
            >
              <div className={`w-8 h-8 rounded-lg ${currentUser.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                {currentUser.avatar}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{currentUser.designation}</span>
              </div>
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            title="Sign Out"
            className="w-full flex justify-center py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

    </aside>
  );
}
