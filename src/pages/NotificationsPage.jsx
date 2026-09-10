import React, { useState } from 'react';
import {
  Bell, CheckCircle2, Clock, ArrowLeftRight, Award, Flame,
  Sparkles, FileText, Trash2, CheckCheck, Filter, ArrowRight,
  ShieldAlert, UserPlus, Layers, ExternalLink, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../services/api';

export default function NotificationsPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'SHARING' | 'STAFFING' | 'CERTS' | 'BENCH'
  const [toastMessage, setToastMessage] = useState('');

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-001',
      category: 'SHARING',
      title: 'Peer PM Approved Resource Sharing',
      desc: 'PM Anjali Rao accepted your 30% bandwidth sharing request for Sneha Shinde on Phoenix Digital Platform (PRJ001).',
      timestamp: '12m ago',
      unread: true,
      priority: 'High',
      targetView: 'Resource Sharing Requests'
    },
    {
      id: 'NOTIF-002',
      category: 'STAFFING',
      title: 'New Formal Demand Ticket Queued',
      desc: 'Delivery Head Sanjay Verma queued ticket RR-2026-002 (.NET/Azure Cloud Architect, 50% allocation) for Atlas Commerce.',
      timestamp: '45m ago',
      unread: true,
      priority: 'Critical',
      targetView: 'Resource Requests'
    },
    {
      id: 'NOTIF-003',
      category: 'BENCH',
      title: 'Bench Aging Escalation Alert (>15 Days)',
      desc: 'Sneha Shinde (EMP006) has reached 18 days on bench. Immediate allocation sourcing recommended.',
      timestamp: '2h ago',
      unread: true,
      priority: 'Critical',
      targetView: 'Bench Resources'
    },
    {
      id: 'NOTIF-004',
      category: 'CERTS',
      title: 'Credential Expiry Warning (14 Days)',
      desc: 'Project Management Professional (PMP) certification for PM Anjali Rao is expiring on 2026-09-01.',
      timestamp: '5h ago',
      unread: false,
      priority: 'Medium',
      targetView: 'Certifications'
    },
    {
      id: 'NOTIF-005',
      category: 'SHARING',
      title: 'Cross-Project Sharing Request Rejected',
      desc: 'PM Meera Shah declined sharing request RSR-003 for Karan Mehta due to Nova CRM Sprint 25 delivery commitments.',
      timestamp: '1d ago',
      unread: false,
      priority: 'Medium',
      targetView: 'Resource Sharing Requests'
    },
    {
      id: 'NOTIF-006',
      category: 'STAFFING',
      title: 'AI Talent Match Recommendation Available',
      desc: 'AI Matching Engine detected 96.5% talent fit for Phoenix Digital Platform (Sneha Shinde).',
      timestamp: '1d ago',
      unread: false,
      priority: 'High',
      targetView: 'Resource Dashboard'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    showToast('✓ Notification marked as read.');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    showToast('✓ All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('✓ Notification tray cleared.');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showToast('✓ Notification removed.');
  };

  const handleActionJump = (notif) => {
    handleMarkAsRead(notif.id);
    if (onNavigate && notif.targetView) {
      onNavigate(notif.targetView);
    }
  };

  // Filtered Notifications
  const filteredNotifications = notifications.filter(n => {
    if (categoryFilter === 'UNREAD') return n.unread;
    if (categoryFilter === 'ALL') return true;
    return n.category === categoryFilter;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SHARING':
        return <ArrowLeftRight className="w-4 h-4 text-blue-600" />;
      case 'STAFFING':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'BENCH':
        return <Flame className="w-4 h-4 text-rose-600 animate-pulse" />;
      case 'CERTS':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#4056d6]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4056d6] text-[10px] font-bold uppercase tracking-wider">
              Alerts &amp; Notifications
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 19 Notification Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Notification Center &amp; Activity Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time notifications for cross-project sharing decisions, certification renewals, bench aging, and staffing updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
        {[
          { id: 'ALL', label: `All Alerts (${notifications.length})` },
          { id: 'UNREAD', label: `🔴 Unread (${unreadCount})` },
          { id: 'SHARING', label: 'Sharing Decisions' },
          { id: 'STAFFING', label: 'Demand & Staffing' },
          { id: 'BENCH', label: 'Bench & Aging' },
          { id: 'CERTS', label: 'Certifications' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${categoryFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4056d6] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800">You're completely caught up!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No pending notifications or unread action items under this category.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 sm:p-6 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${notif.unread
                    ? 'bg-indigo-50/25 border-l-4 border-l-[#4056d6]'
                    : 'hover:bg-slate-50/60'
                  }`}
              >

                {/* Left: Icon & Notification Body */}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${notif.category === 'BENCH' ? 'bg-rose-50 border border-rose-100' :
                      notif.category === 'SHARING' ? 'bg-blue-50 border border-blue-100' :
                        notif.category === 'STAFFING' ? 'bg-purple-50 border border-purple-100' :
                          'bg-amber-50 border border-amber-100'
                    }`}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {notif.title}
                      </h3>
                      {notif.unread && (
                        <span className="px-2 py-0.5 rounded-full bg-[#4056d6] text-white text-[9px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${notif.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {notif.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {notif.desc}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{notif.timestamp}</span>
                      <span>•</span>
                      <span className="uppercase font-mono text-[10px]">{notif.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.targetView && (
                    <button
                      onClick={() => handleActionJump(notif)}
                      className="px-3.5 py-1.5 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {notif.unread ? (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Mark as Read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Dismiss Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
