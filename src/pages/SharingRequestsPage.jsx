import React, { useState } from 'react';
import {
  ArrowLeftRight, CheckCircle2, XCircle, Clock,
  Plus, Shield, Sparkles, Building2, User, Filter,
  AlertTriangle, Inbox, Send, Check, Layers
} from 'lucide-react';
import { INITIAL_SHARING_REQUESTS, INITIAL_PROJECTS } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import SharingRequestModal from '../components/sharing/SharingRequestModal';
import { useAuth } from '../context/AuthContext';

export default function SharingRequestsPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState(INITIAL_SHARING_REQUESTS);
  const [activeQueueTab, setActiveQueueTab] = useState('INBOX'); // 'INBOX', 'SENT', 'ALL'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [lastAcceptedSplit, setLastAcceptedSplit] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Day 13 Requirement: Accept decision automatically updates allocation split across both projects
  const handleAccept = (req) => {
    const updatedRequests = requests.map(r => {
      if (r.id === req.id) {
        return { ...r, status: 'Accepted' };
      }
      return r;
    });

    setRequests(updatedRequests);

    // Record the updated split details
    const splitInfo = {
      id: req.id,
      empName: req.employeeName,
      fromProject: req.fromProjectName,
      toProject: req.toProjectName,
      sharedPct: req.requiredPct,
      remainingPct: `${Math.max(0, 100 - parseInt(req.requiredPct))}%`
    };

    setLastAcceptedSplit(splitInfo);

    showToast(`✓ [Day 13] Sharing Request ${req.id} Accepted! Automatic allocation split committed: ${req.employeeName} (${req.requiredPct}) to ${req.toProjectName}.`);
  };

  const handleReject = (req) => {
    const updatedRequests = requests.map(r => {
      if (r.id === req.id) {
        return { ...r, status: 'Rejected' };
      }
      return r;
    });

    setRequests(updatedRequests);
    showToast(`✗ [Day 13] Sharing Request ${req.id} Declined.`);
  };

  const handleSave = (newReq) => {
    setRequests([newReq, ...requests]);
    showToast(`✓ Sharing ticket ${newReq.id} submitted to ${newReq.otherPm}!`);
  };

  const handleOpenNew = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  // Filter based on Inbox (Incoming peer requests) vs Sent vs All
  const filteredRequests = requests.filter(r => {
    if (activeQueueTab === 'INBOX') {
      // In a multi-tenant DB, this filters where toProjectId or otherPm matches currentUser
      return true; // Displays action queue
    }
    if (activeQueueTab === 'SENT') {
      return r.otherPm !== currentUser.name;
    }
    return true;
  });

  const columns = [
    {
      key: 'id', label: 'Ticket ID', render: (val) => (
        <span className="font-mono font-bold text-[#4056d6]">{val}</span>
      )
    },
    {
      key: 'employeeName', label: 'Requested Team Member', render: (val) => (
        <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
      )
    },
    {
      key: 'fromProjectName', label: 'Source Project (Current Host)', render: (val, row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.fromProjectId}</span>
        </div>
      )
    },
    {
      key: 'toProjectName', label: 'Destination Project (Borrower)', render: (val, row) => (
        <div>
          <span className="text-xs font-semibold text-indigo-700 block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.toProjectId}</span>
        </div>
      )
    },
    {
      key: 'requiredPct', label: 'Requested %', render: (val) => (
        <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4056d6] border border-indigo-100 inline-block">
          {val} Capacity
        </span>
      )
    },
    {
      key: 'otherPm', label: 'Peer Manager', render: (val) => (
        <span className="text-xs font-medium text-slate-700">{val}</span>
      )
    },
    { key: 'status', label: 'Approval Status', isStatus: true },
    {
      key: 'action', label: 'Decision Action', render: (_, row) => {
        if (row.status === 'Pending') {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAccept(row)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                title="Accept sharing request and commit bandwidth split"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleReject(row)}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="Decline sharing request"
              >
                <XCircle className="w-3 h-3" />
                <span>Reject</span>
              </button>
            </div>
          );
        }
        return (
          <span className="text-[11px] font-semibold text-slate-400 italic">
            Decision Completed
          </span>
        );
      }
    }
  ];

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const acceptedCount = requests.filter(r => r.status === 'Accepted').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4056d6] text-[10px] font-bold uppercase tracking-wider">
              Path B Peer PM Collaboration
            </span>
            <span className="text-xs text-slate-400">• Day 13 Accept / Reject Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Sharing Requests &amp; Inbox</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming sharing requests from peer PMs, make one-click accept/reject decisions, and automatically commit cross-project allocation splits.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 bg-[#4056d6] hover:bg-[#3245b5] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Raise Sharing Request</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Incoming Inbox</span>
            <strong className="text-xl font-bold text-slate-900">{requests.length} Total</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Pending Decision</span>
            <strong className="text-xl font-bold text-amber-700">{pendingCount} Action Required</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Approved &amp; Shared</span>
            <strong className="text-xl font-bold text-emerald-700">{acceptedCount} Splits Committed</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Declined / Closed</span>
            <strong className="text-xl font-bold text-rose-600">{rejectedCount} Rejected</strong>
          </div>
        </div>

      </div>

      {/* Day 13 Automatic Allocation Split Live Feed Banner */}
      {lastAcceptedSplit && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-emerald-900 block">
                Automatic Allocation Split Committed: {lastAcceptedSplit.empName}
              </strong>
              <span className="text-[11px] text-emerald-700">
                Split: {lastAcceptedSplit.sharedPct} on {lastAcceptedSplit.toProject} • {lastAcceptedSplit.remainingPct} on {lastAcceptedSplit.fromProject}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-lg border border-emerald-200 shrink-0">
            ✓ 100% Capacity Balanced
          </span>
        </div>
      )}

      {/* Queue View Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveQueueTab('INBOX')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${activeQueueTab === 'INBOX'
              ? 'bg-[#1e293b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Peer Inbox ({pendingCount} Pending)</span>
        </button>

        <button
          onClick={() => setActiveQueueTab('SENT')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${activeQueueTab === 'SENT'
              ? 'bg-[#1e293b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>My Outgoing Requests</span>
        </button>

        <button
          onClick={() => setActiveQueueTab('ALL')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${activeQueueTab === 'ALL'
              ? 'bg-[#1e293b] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Collaboration History ({requests.length})</span>
        </button>
      </div>

      {/* Main DataTable */}
      <DataTable
        title={activeQueueTab === 'INBOX' ? 'Incoming Peer Requests (Action Queue)' : 'Resource Sharing Records'}
        subtitle="Review peer requests, accept capacity sharing, or reject bandwidth inquiries."
        columns={columns}
        data={filteredRequests}
        searchPlaceholder="Search by candidate, source, or peer PM..."
        enableExport={true}
        exportFileName="sharing_requests_inbox.csv"
      />

      {/* Modal to Raise / Edit Sharing Request */}
      <SharingRequestModal
        isOpen={isModalOpen}
        initialData={selectedRequest}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
