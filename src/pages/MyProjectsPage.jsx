import React, { useState } from 'react';
import {
  FolderKanban, UsersRound, Calendar, ArrowRight, Grid3X3,
  Shield, CheckCircle2, AlertTriangle, UserPlus, ArrowLeftRight,
  Sparkles, Building2, Clock, LayoutGrid, List
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_PROJECT_STRUCTURES, INITIAL_ALLOCATIONS, INITIAL_CLIENTS } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';

export default function MyProjectsPage({ onNavigateToStructure, onNavigateToTeam, onNavigateToAddResource, onNavigateToSharing }) {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState('CARDS'); // 'CARDS' or 'TABLE'
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter strictly to projects assigned to this PM (or all if Super Admin)
  const myProjects = INITIAL_PROJECTS.filter(p =>
    currentUser.assignedProjects.includes('ALL') ||
    currentUser.assignedProjects.includes(p.id) ||
    p.pm === currentUser.name
  );

  // Summary Metrics across my assigned projects
  const totalMyProjects = myProjects.length;

  // Calculate total allocations across my projects
  const myAllocations = INITIAL_ALLOCATIONS.filter(a =>
    myProjects.some(p => p.id === a.projectId)
  );

  // Calculate gaps across my projects
  const myStructures = INITIAL_PROJECT_STRUCTURES.filter(s =>
    myProjects.some(p => p.id === s.projectId)
  );
  const totalRequiredSeats = myStructures.reduce((sum, s) => sum + s.requiredCount, 0);
  const totalAllocatedSeats = myStructures.reduce((sum, s) => sum + s.allocatedCount, 0);
  const totalMyGaps = Math.max(0, totalRequiredSeats - totalAllocatedSeats);

  const columns = [
    {
      key: 'id', label: 'Project ID', render: (val) => (
        <span className="font-mono font-bold text-[#4056d6]">{val}</span>
      )
    },
    {
      key: 'name', label: 'My Assigned Project', render: (val, row) => (
        <div>
          <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
          <span className="text-[11px] text-slate-500">Client: {row.client}</span>
        </div>
      )
    },
    { key: 'pm', label: 'Lead Manager', render: (val) => <span className="font-semibold text-slate-800">{val} (You)</span> },
    { key: 'start', label: 'Start Date' },
    { key: 'end', label: 'End Date' },
    { key: 'priority', label: 'Priority', isStatus: true },
    { key: 'status', label: 'Status', isStatus: true },
    {
      key: 'actions', label: 'Delivery Actions', render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToStructure && onNavigateToStructure(row.id)}
            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
          >
            <Grid3X3 className="w-3 h-3" />
            <span>Blueprint &amp; Gaps</span>
          </button>
          <button
            onClick={() => onNavigateToTeam && onNavigateToTeam(row.id)}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
          >
            <UsersRound className="w-3 h-3" />
            <span>My Team</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              PM Scoped Access
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 8 Scoped Delivery Cockpit</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Assigned Projects Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Displaying delivery health, staffing blueprints, and allocated team members scoped to <strong>{currentUser.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'CARDS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards View</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'TABLE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Scoped Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">My Active Engagements</span>
            <strong className="text-xl font-bold text-slate-900">{totalMyProjects} Portfolio</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UsersRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active Team Members</span>
            <strong className="text-xl font-bold text-slate-900">{myAllocations.length} Allocated</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Open Staffing Gap</span>
            <strong className={`text-xl font-bold ${totalMyGaps > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {totalMyGaps > 0 ? `${totalMyGaps} Position Needed` : 'Fully Staffed'}
            </strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Delivery Status</span>
            <strong className="text-xl font-bold text-emerald-600">On Schedule</strong>
          </div>
        </div>

      </div>

      {/* Cards View: Detailed Rich Project Summary Cards (Day 8 Deliverable) */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myProjects.map((proj) => {
            const client = INITIAL_CLIENTS.find(c => c.name === proj.client) || {
              name: proj.client,
              country: 'USA',
              contact: 'John Carter'
            };
            const projStructures = INITIAL_PROJECT_STRUCTURES.filter(s => s.projectId === proj.id);
            const projAllocations = INITIAL_ALLOCATIONS.filter(a => a.projectId === proj.id);

            const reqCount = projStructures.reduce((sum, s) => sum + s.requiredCount, 0);
            const allocCount = projStructures.reduce((sum, s) => sum + s.allocatedCount, 0);
            const gap = Math.max(0, reqCount - allocCount);
            const fulfillmentPct = reqCount > 0 ? Math.round((allocCount / reqCount) * 100) : 100;

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:border-[#4056d6]/40 transition-all p-6 space-y-5 flex flex-col justify-between"
              >
                {/* Card Top Section */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#4056d6] bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                          {proj.id}
                        </span>
                        <StatusBadge status={proj.priority} />
                        <StatusBadge status={proj.status} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight pt-1">
                        {proj.name}
                      </h3>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Client Metadata Bar */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Client Account</span>
                      <strong className="text-slate-900 block font-bold">{client.name}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Region</span>
                      <span className="text-slate-700 font-medium">📍 {client.country}</span>
                    </div>
                  </div>

                  {/* Timeline Horizon */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Timeline Horizon</span>
                      </span>
                      <span className="text-slate-800 font-semibold">
                        {proj.start} to {proj.end}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4056d6] rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  {/* Staffing Status Progress */}
                  <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Grid3X3 className="w-3.5 h-3.5 text-[#4056d6]" />
                        <span>Staffing Fulfillment ({allocCount}/{reqCount} Seats)</span>
                      </span>
                      <span className="font-mono font-bold text-[#4056d6]">{fulfillmentPct}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${fulfillmentPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        style={{ width: `${fulfillmentPct}%` }}
                      />
                    </div>

                    {gap > 0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700 pt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Staffing Gap: {gap} open seat(s) require bench allocation.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Team roster 100% fulfilled based on blueprint.</span>
                      </div>
                    )}
                  </div>

                  {/* Active Team Member Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Allocated Team Members ({projAllocations.length})
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {projAllocations.map(a => (
                        <div
                          key={a.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs text-slate-800"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#4056d6] text-white font-bold text-[9px] flex items-center justify-center">
                            {a.empName.split(' ').map(n => n[0]).join('')}
                          </span>
                          <span className="font-semibold">{a.empName}</span>
                          <span className="text-[10px] text-indigo-600 font-mono font-bold">({a.allocation})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons Footer */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onNavigateToStructure && onNavigateToStructure(proj.id)}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                    <span>Blueprint &amp; Gaps</span>
                  </button>

                  <button
                    onClick={() => onNavigateToTeam && onNavigateToTeam(proj.id)}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UsersRound className="w-3.5 h-3.5" />
                    <span>My Team Roster</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <DataTable
          title="My Assigned Projects Table"
          subtitle="Tabular roster of client deliveries scoped to you."
          columns={columns}
          data={myProjects}
          searchPlaceholder="Search my projects..."
          enableExport={true}
          exportFileName="my_assigned_projects.csv"
        />
      )}

    </div>
  );
}
