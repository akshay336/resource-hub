import React, { useState } from 'react';
import {
  UsersRound, UserPlus, ArrowLeftRight, CheckCircle2, Shield,
  Calendar, Clock, AlertTriangle, Edit3, UserMinus, Sparkles
} from 'lucide-react';
import { INITIAL_ALLOCATIONS, INITIAL_PROJECTS, INITIAL_EMPLOYEES } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import ModifyAllocationModal from '../components/teams/ModifyAllocationModal';
import { useAuth } from '../context/AuthContext';

export default function MyProjectTeamPage({ onNavigateToAddResource, onNavigateToSharingRequests }) {
  const { currentUser } = useAuth();

  const myProjectId = currentUser.assignedProjects[0] || 'PRJ001';
  const myProject = INITIAL_PROJECTS.find(p => p.id === myProjectId) || INITIAL_PROJECTS[0];

  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const myTeamAllocations = allocations.filter(a => a.projectId === myProjectId);

  // Compute team statistics
  const totalMembers = myTeamAllocations.length;
  const totalFTE = myTeamAllocations.reduce((sum, a) => sum + (parseInt(a.allocation) || 0), 0);
  const fullTimeMembers = myTeamAllocations.filter(a => a.allocation === '100%').length;
  const partialMembers = myTeamAllocations.filter(a => a.allocation !== '100%').length;

  const handleModify = (row) => {
    setEditingAllocation(row);
    setIsModalOpen(true);
  };

  const handleSaveModification = (updated) => {
    setAllocations(allocations.map(a => a.id === updated.id ? updated : a));
    showToast(`✓ Updated allocation & duration for ${updated.empName} (${updated.allocation})`);
  };

  const handleRelease = (row) => {
    if (window.confirm(`Are you sure you want to release ${row.empName} from ${myProject.name}? This will return their ${row.allocation} capacity to the available bench pool.`)) {
      setAllocations(allocations.filter(a => a.id !== row.id));
      showToast(`✓ Released ${row.empName} back to available capacity.`);
    }
  };

  const columns = [
    {
      key: 'empId',
      label: 'Employee ID',
      render: (val) => (
        <span className="font-mono font-bold text-[#4056d6]">{val}</span>
      )
    },
    {
      key: 'empName',
      label: 'Team Member & Role',
      render: (val, row) => {
        const emp = INITIAL_EMPLOYEES.find(e => e.id === row.empId || e.name === val);
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {val.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
              <span className="text-[11px] text-slate-500 font-medium">
                {emp ? emp.designation : (row.role || 'Software Engineer')}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'allocation',
      label: 'Committed Bandwidth',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${val === '100%'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-indigo-50 text-[#4056d6] border border-indigo-100'
          }`}>
          {val} Dedicated
        </span>
      )
    },
    {
      key: 'start',
      label: 'Assignment Duration',
      render: (val, row) => (
        <div className="text-xs text-slate-700">
          <span className="font-semibold block">{val}</span>
          <span className="text-[10px] text-slate-400 block">to {row.end} (Roll-off)</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Allocation Status',
      isStatus: true
    },
    {
      key: 'actions',
      label: 'Manage Team Member',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleModify(row)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Modify Duration & Allocation %"
          >
            <Edit3 className="w-3 h-3 text-slate-500" />
            <span>Modify</span>
          </button>

          <button
            onClick={() => handleRelease(row)}
            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Release from Project"
          >
            <UserMinus className="w-3 h-3 text-rose-600" />
            <span>Release</span>
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
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              Project Team Roster
            </span>
            <span className="text-xs text-slate-400">• Day 10 PM Team View</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Project Team</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active roster of employees currently allocated to <strong>{myProject.name}</strong> ({myProject.id}).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={() => onNavigateToSharingRequests && onNavigateToSharingRequests()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sharing Requests</span>
          </button>

          <button
            onClick={() => onNavigateToAddResource && onNavigateToAddResource()}
            className="px-4 py-2 bg-[#4056d6] hover:bg-[#3245b5] text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Resource</span>
          </button>
        </div>
      </div>

      {/* Top Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <UsersRound className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Team Roster</span>
            <strong className="text-xl font-bold text-slate-900">{totalMembers} Engineers</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Dedicated FTE</span>
            <strong className="text-xl font-bold text-slate-900">{totalFTE}% Capacity</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Full-Time Dedicated</span>
            <strong className="text-xl font-bold text-slate-900">{fullTimeMembers} Members (100%)</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Shared Bandwidth</span>
            <strong className="text-xl font-bold text-slate-900">{partialMembers} Shared Seats</strong>
          </div>
        </div>

      </div>

      {/* Main Table */}
      <DataTable
        title={`Active Team Allocations: ${myProject.name}`}
        subtitle="Manage assigned team members, adjust roll-off dates, or release talent back to available bench pool."
        columns={columns}
        data={myTeamAllocations}
        searchPlaceholder="Search assigned team members..."
        enableExport={true}
        exportFileName="my_project_team_roster.csv"
      />

      {/* Modal for Modifying Allocation Duration */}
      <ModifyAllocationModal
        isOpen={isModalOpen}
        allocation={editingAllocation}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModification}
      />

    </div>
  );
}
