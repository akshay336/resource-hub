import React, { useState, useMemo } from 'react';
import { 
  Grid3X3, Users, AlertTriangle, CheckCircle2, 
  ArrowRight, Plus, Download, Sparkles, Building2, Shield,
  Lock, Unlock, ShieldCheck, FileCheck
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_PROJECT_STRUCTURES } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import ProjectStructureModal from '../components/projects/ProjectStructureModal';
import StaffingGapMeter, { GapStatusBadge } from '../components/common/StaffingGapMeter';
import { calculateRoleGap, calculateProjectGapSummary } from '../utils/gapEngine';
import { useAuth } from '../context/AuthContext';

export default function ProjectStructurePage({ defaultProjectId, pmOnly = false, onNavigateToAddResource }) {
  const { currentUser } = useAuth();

  // If PM, default to their assigned project; otherwise default to defaultProjectId or PRJ001
  const initialProjId = pmOnly ? (currentUser.assignedProjects[0] || 'PRJ001') : (defaultProjectId || 'PRJ001');
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjId);
  const [structures, setStructures] = useState(INITIAL_PROJECT_STRUCTURES);
  const [editingStructure, setEditingStructure] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Project Blueprint Publish & Lock state map (Day 7 Requirement)
  const [blueprintStatusMap, setBlueprintStatusMap] = useState({
    PRJ001: 'Published',
    PRJ002: 'Published',
    PRJ003: 'Draft',
    PRJ004: 'Draft'
  });

  const isPublished = blueprintStatusMap[selectedProjectId] === 'Published';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleTogglePublish = () => {
    const nextStatus = isPublished ? 'Draft' : 'Published';
    setBlueprintStatusMap(prev => ({ ...prev, [selectedProjectId]: nextStatus }));
    if (nextStatus === 'Published') {
      showToast(`✓ Staffing Blueprint for ${selectedProjectId} Published & Locked for PM fulfillment!`);
    } else {
      showToast(`Blueprint for ${selectedProjectId} unlocked for revisions.`);
    }
  };

  // Filter structures by selected project
  const projectRows = useMemo(() => {
    return structures.filter(s => s.projectId === selectedProjectId);
  }, [structures, selectedProjectId]);

  const activeProject = INITIAL_PROJECTS.find(p => p.id === selectedProjectId) || INITIAL_PROJECTS[0];

  // Day 9 Gap Engine calculation: Gap = max(0, Required - Allocated)
  const { totalRequired, totalAllocated, totalGap, fulfillmentPct, isFullyStaffed } = useMemo(() => {
    return calculateProjectGapSummary(projectRows);
  }, [projectRows]);

  const columns = [
    { key: 'role', label: 'Required Role / Discipline', render: (val) => (
      <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
    )},
    { key: 'requiredCount', label: 'Required Seats', render: (val) => (
      <span className="font-bold text-slate-800 text-xs px-2.5 py-1 bg-slate-100 rounded-lg">
        {val} {val === 1 ? 'member' : 'members'}
      </span>
    )},
    { key: 'allocatedCount', label: 'Currently Allocated', render: (val, row) => (
      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg ${
        val >= row.requiredCount ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {val} / {row.requiredCount} fulfilled
      </span>
    )},
    { key: 'allocationPct', label: 'Required Allocation %', render: (val) => (
      <span className="font-semibold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
        {val} capacity
      </span>
    )},
    { key: 'gap', label: 'Staffing Gap Status', render: (_, row) => {
      const gap = calculateRoleGap(row.requiredCount, row.allocatedCount);
      return <GapStatusBadge gap={gap} />;
    }},
    { key: 'progress', label: 'Fulfillment Meter', render: (_, row) => (
      <StaffingGapMeter requiredCount={row.requiredCount} allocatedCount={row.allocatedCount} />
    )},
    { key: 'action', label: 'Staffing Action', render: (_, row) => {
      const gap = calculateRoleGap(row.requiredCount, row.allocatedCount);
      return (
        <button
          onClick={() => {
            if (gap > 0 && onNavigateToAddResource) {
              onNavigateToAddResource(row);
            } else {
              showToast(`Managing allocations for ${row.role}`);
            }
          }}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            gap > 0 
              ? 'bg-[#4056d6] hover:bg-[#3245b5] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {gap > 0 ? 'Fulfill Gap →' : 'Manage'}
        </button>
      );
    }}
  ];

  const handleSave = (structData) => {
    if (editingStructure) {
      setStructures(structures.map(s => s.id === structData.id ? structData : s));
      showToast(`Updated structure for ${structData.role}`);
    } else {
      setStructures([...structures, structData]);
      showToast(`Added ${structData.role} to blueprint`);
    }
  };

  const handleDelete = (row) => {
    if (isPublished && !window.confirm(`This blueprint is currently Locked. Remove ${row.role}?`)) {
      return;
    }
    setStructures(structures.filter(s => s.id !== row.id));
    showToast(`Removed ${row.role} from blueprint`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Project Selector & Blueprint Header */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4056d6] text-[10px] font-bold uppercase tracking-wider">
              {pmOnly ? 'PM Assigned Blueprint' : 'Delivery Head Blueprint Master'}
            </span>
            <span className="text-xs text-slate-400">• Day 9 Staffing Gap Engine</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
              isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isPublished ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
              {isPublished ? 'Published & Locked' : 'Draft Mode'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {pmOnly ? 'Project Staffing Blueprint & Gaps' : 'Project Resource Structure Blueprint'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pmOnly 
              ? `View required roles, allocated bandwidth, and fulfill staffing gaps for ${activeProject.name}.`
              : 'Delivery Head defines project team composition, required headcount, and target allocation percentages.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {!pmOnly ? (
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 pl-2 hidden sm:inline">Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-white text-slate-900 text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer shadow-2xs"
              >
                {INITIAL_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-[#4056d6]">
              {activeProject.id} — {activeProject.name}
            </div>
          )}

          {/* Publish / Lock Blueprint Toggle Button (Day 7 Requirement) */}
          {!pmOnly && (
            <button
              onClick={handleTogglePublish}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isPublished 
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isPublished ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked (Click to Unlock)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Publish &amp; Lock Blueprint</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => { setEditingStructure(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-[#4056d6] hover:bg-[#3245b5] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Role</span>
          </button>
        </div>
      </div>

      {/* Blueprint Live Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Target Seats</span>
          <strong className="text-2xl font-bold text-slate-900">{totalRequired} Headcount</strong>
          <span className="text-[11px] text-slate-400 block mt-0.5">Across {projectRows.length} required disciplines</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Currently Allocated</span>
          <strong className="text-2xl font-bold text-emerald-600">{totalAllocated} Active</strong>
          <span className="text-[11px] text-emerald-600 font-medium block mt-0.5">Assigned to team roster</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Open Staffing Gap</span>
          <strong className={`text-2xl font-bold ${totalGap > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {totalGap} {totalGap === 1 ? 'Seat Unfilled' : 'Seats Unfilled'}
          </strong>
          <span className={`text-[11px] font-medium block mt-0.5 ${totalGap > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
            {totalGap > 0 ? 'Gap = max(0, Req - Alloc)' : 'Project 100% staffed'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Fulfillment Health</span>
          <strong className="text-2xl font-bold text-[#4056d6]">{fulfillmentPct}% Fulfilled</strong>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#4056d6] rounded-full" style={{ width: `${fulfillmentPct}%` }}></div>
          </div>
        </div>

      </div>

      {/* Main Structure DataTable */}
      <DataTable
        title={`Staffing Blueprint: ${activeProject.name}`}
        subtitle={`Required roles, target allocation %, and automated gap calculations for ${selectedProjectId}.`}
        columns={columns}
        data={projectRows}
        searchPlaceholder="Search roles in blueprint..."
        onEdit={(row) => { setEditingStructure(row); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <ProjectStructureModal
        isOpen={isModalOpen}
        structure={editingStructure}
        selectedProjectId={selectedProjectId}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
