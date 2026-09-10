import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Search, ChevronDown, User, Shield, Key,
  LogOut, CheckCircle2, AlertTriangle, Layers, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ currentView, onNavigate }) {
  const { currentUser, logout, switchRole, demoAccounts } = useAuth();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Resource Sharing Approved', desc: 'PM Anjali approved 30% sharing for Sneha Shinde', time: '12m ago', unread: true, targetView: 'Resource Sharing Requests' },
    { id: 2, title: 'New Formal Demand Ticket', desc: 'Delivery Head Sanjay Verma queued ticket RR-2026-002', time: '45m ago', unread: true, targetView: 'Resource Requests' },
    { id: 3, title: 'Bench Aging Alert (>15d)', desc: 'Sneha Shinde exceeded 15 days on bench pool', time: '2h ago', unread: true, targetView: 'Bench Resources' },
    { id: 4, title: 'Certification Expiry', desc: 'PMP credential expires in 14 days', time: '5h ago', unread: false, targetView: 'Certifications' }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkItemRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">

      {/* Left: Dynamic Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium hover:text-slate-600 cursor-pointer" onClick={() => onNavigate('Dashboard')}>
          ResourceHub
        </span>
        <span className="text-slate-300">/</span>
        <h2 className="font-bold text-slate-800 tracking-tight">
          {currentView}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">

        {/* Role Pill Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#4056d6] text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>{currentUser.role}</span>
        </div>

        {/* Notifications Tray */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifications Tray"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[380px] sm:w-[420px] bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden animate-in fade-in duration-150 z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-100 text-[#4056d6] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-[#4056d6] hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      handleMarkItemRead(n.id);
                      if (n.targetView) {
                        setShowNotifications(false);
                        onNavigate(n.targetView);
                      }
                    }}
                    className={`p-3.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? 'bg-indigo-50/30 border-l-2 border-l-[#4056d6]' : ''
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-slate-900 font-bold text-xs">{n.title}</strong>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">{n.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-2.5 text-center border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => { setShowNotifications(false); onNavigate('Notifications'); }}
                  className="text-xs font-bold text-[#4056d6] hover:underline cursor-pointer block w-full text-center"
                >
                  View Full Notification Center &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className={`w-8 h-8 rounded-lg ${currentUser.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs`}>
              {currentUser.avatar}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                {currentUser.name}
              </span>
              <span className="block text-[10px] text-slate-500 truncate max-w-[100px]">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden animate-in fade-in duration-150 z-50">

              {/* User Header Summary */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${currentUser.avatarBg} text-white font-bold text-sm flex items-center justify-center`}>
                    {currentUser.avatar}
                  </div>
                  <div className="truncate">
                    <strong className="text-xs font-bold text-slate-900 block truncate">{currentUser.name}</strong>
                    <span className="text-[11px] text-slate-500 block truncate">{currentUser.email}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-50 text-[#4056d6] font-semibold text-[10px]">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="p-2 space-y-1 text-xs">
                <button
                  onClick={() => { setShowUserMenu(false); onNavigate('Profile'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile &amp; Settings</span>
                </button>
              </div>

              {/* Quick Role Switcher Submenu */}
              <div className="p-2 border-t border-slate-100 bg-slate-50/40">
                <span className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Switch Demo Account
                </span>
                <div className="space-y-0.5 mt-1">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => { switchRole(acc.role); setShowUserMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${acc.role === currentUser.role ? 'bg-indigo-50 text-[#4056d6] font-bold' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <span>{acc.role}</span>
                      {acc.role === currentUser.role && <CheckCircle2 className="w-3 h-3 text-[#4056d6]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Out Button */}
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={() => { setShowUserMenu(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
