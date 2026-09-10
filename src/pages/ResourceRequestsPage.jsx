import React, { useState } from 'react';
import {
  FileText, Plus, Search, Filter, CheckCircle2, Clock,
  AlertCircle, ChevronRight, UserCheck, ShieldAlert, Sparkles, Building2,
  Calendar, Layers, ArrowRight, Tag
} from 'lucide-react';
import { INITIAL_RESOURCE_REQUESTS, INITIAL_PROJECTS } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import ResourceRequestModal from '../components/requests/ResourceRequestModal';
import { useAuth } from '../context/AuthContext';

export default function ResourceRequestsPage({ onNavigateToDashboard }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState(INITIAL_RESOURCE_REQUESTS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL', 'Critical', 'High', 'Medium', 'Planned'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleStatusTransition = (reqId, newStatus) => {
    setRequests(requests.map(r => {
      if (r.id === reqId) {
        return { ...r, status: newStatus };
      }
      return r;
    }));
    showToast(`✓ Request ticket ${reqId} updated to status: "${newStatus}"`);
  };

  const handleSaveRequest = (formData) => {
    const exists = requests.find(r => r.id === formData.id);
    if (exists) {
      setRequests(requests.map(r => r.id === formData.id ? formData : r));
      showToast(`✓ Ticket ${formData.id} details updated.`);
    } else {
      setRequests([formData, ...requests]);
      showToast(`✓ Formal demand ticket ${formData.id} queued successfully for ${formData.projectName || formData.projectId}!`);
    }
  };

  const handleOpenEdit = (item) => {
    setSelectedRequest(item);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  // Filter requests based on both status and priority filters
  const filteredData = requests.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status.toUpperCase().replace(/\s+/g, '_') === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || r.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesStatus && matchesPriority;
  });

  const priorityBadge = (p) => {
    switch (p) {
      case 'Critical':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 Critical</span>;
      case 'High':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🟠 High</span>;
      case 'Medium':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🔵 Medium</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">⚪ Planned</span>;
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Ticket ID',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="font-mono font-bold text-[#4056d6] hover:underline text-left cursor-pointer"
          >
            {val}
          </button>
        </div>
      )
    },
    {
      key: 'projectId',
      label: 'Target Project',
      render: (val) => {
        const proj = INITIAL_PROJECTS.find(p => p.id === val);
        return (
          <div>
            <strong className="text-slate-900 font-bold block text-xs">
              {proj ? proj.name : val}
            </strong>
            <span className="text-[10px] text-slate-400 font-mono">{val}</span>
          </div>
        );
      }
    },
    {
      key: 'role',
      label: 'Required Position',
      render: (val, row) => (
        <div>
          <span className="text-xs font-bold text-slate-800 block">{val}</span>
          <span className="text-[11px] text-slate-500 font-medium">Exp: {row.experience || '3+ yrs'}</span>
        </div>
      )
    },
    {
      key: 'allocation',
      label: 'Allocation',
      render: (val) => (
        <span className="font-bold text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4056d6] border border-indigo-100 inline-block">
          {val}
        </span>
      )
    },
    {
      key: 'start',
      label: 'Fulfillment Window',
      render: (val, row) => (
        <div className="text-[11px] text-slate-600">
          <span className="block font-medium">{val}</span>
          <span className="block text-[10px] text-slate-400">to {row.end}</span>
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => priorityBadge(val)
    },
    {
      key: 'status',
      label: 'Queue Status',
      isStatus: true
    },
    {
      key: 'action',
      label: 'Fulfillment Action',
      render: (_, row) => {
        if (row.status === 'Requested') {
          return (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleStatusTransition(row.id, 'Under Review')}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Clock className="w-3 h-3" />
                <span>Review</span>
              </button>
              {onNavigateToDashboard && (
                <button
                  onClick={() => onNavigateToDashboard('DEM-01')}
                  title="Run Talent Match Engine"
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Match</span>
                </button>
              )}
            </div>
          );
        }
        if (row.status === 'Under Review') {
          return (
            <div className="flex items-center gap-1.5">
              {onNavigateToDashboard ? (
                <button
                  onClick={() => onNavigateToDashboard('DEM-01')}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Match Candidates</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusTransition(row.id, 'Shortlisted')}
                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Shortlist Talent</span>
                </button>
              )}
            </div>
          );
        }
        if (row.status === 'Shortlisted') {
          return (
            <button
              onClick={() => handleStatusTransition(row.id, 'Approved')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Approve &amp; Commit</span>
            </button>
          );
        }
        if (row.status === 'Approved') {
          return (
            <button
              onClick={() => handleStatusTransition(row.id, 'Fulfilled')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3" />
              <span>Mark Fulfilled</span>
            </button>
          );
        }
        return (
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Fulfilled
          </span>
        );
      }
    }
  ];

  // Count summaries
  const totalCount = requests.length;
  const criticalCount = requests.filter(r => r.priority === 'Critical').length;
  const underReviewCount = requests.filter(r => r.status === 'Under Review' || r.status === 'Requested').length;
  const approvedCount = requests.filter(r => r.status === 'Approved' || r.status === 'Fulfilled').length;

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
              Path C Formal Demand Queue
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 14 HR Sourcing Queue</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Requests Master Queue</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Formal staffing tickets raised by Project Managers and Delivery Heads for HR talent sourcing and bench allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Matching Engine</span>
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Raise Resource Request</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Demand Tickets</span>
            <strong className="text-xl font-bold text-slate-900">{totalCount} Active</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Critical Priority</span>
            <strong className="text-xl font-bold text-rose-600">{criticalCount} Escalated</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Under Sourcing / Review</span>
            <strong className="text-xl font-bold text-slate-900">{underReviewCount} Pending</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Approved &amp; Fulfilled</span>
            <strong className="text-xl font-bold text-emerald-700">{approvedCount} Staffed</strong>
          </div>
        </div>

      </div>

      {/* Priority & Status Multi-Filter Bar (Day 14 Requirement) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80">

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Statuses' },
            { id: 'REQUESTED', label: 'Requested' },
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'SHORTLISTED', label: 'Shortlisted' },
            { id: 'APPROVED', label: 'Approved' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${statusFilter === tab.id
                  ? 'bg-[#1e293b] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter Toolbar (Critical, High, Medium, Planned) */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-1">Priority:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'Critical', label: '🔴 Critical' },
            { id: 'High', label: '🟠 High' },
            { id: 'Medium', label: '🔵 Medium' },
            { id: 'Planned', label: '⚪ Planned' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPriorityFilter(p.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${priorityFilter === p.id
                  ? 'bg-[#4056d6] text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

      </div>

      {/* Main Interactive Table */}
      <DataTable
        title={`Formal Resource Demand Queue (${filteredData.length})`}
        subtitle="Track formal staffing tickets, review job requirements, and approve talent allocations."
        data={filteredData}
        columns={columns}
        searchPlaceholder="Search by ID, role, project, priority..."
        enableExport={true}
        exportFileName="resource_requests_queue.csv"
      />

      {/* Modal for Creating / Editing Resource Requests */}
      <ResourceRequestModal
        isOpen={isModalOpen}
        initialData={selectedRequest}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRequest}
      />

    </div>
  );
}
