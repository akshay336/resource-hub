import React from 'react';
import { 
  X, FolderKanban, Building2, User, Calendar, Clock, 
  Grid3X3, UsersRound, ArrowRight, ShieldCheck, CheckCircle2,
  AlertTriangle, Sparkles, Layers, FileText
} from 'lucide-react';
import { INITIAL_PROJECT_STRUCTURES, INITIAL_ALLOCATIONS, INITIAL_CLIENTS } from '../../data/mockData';
import { StatusBadge } from '../common/DataTable';

export default function ProjectDrawer({ isOpen, project, onClose, onNavigateToStructure, onNavigateToAddResource }) {
  if (!isOpen || !project) return null;

  // Find linked Client
  const clientInfo = INITIAL_CLIENTS.find(c => c.name === project.client) || {
    name: project.client,
    country: 'USA',
    contact: 'Primary Client Rep',
    status: 'Active'
  };

  // Find Blueprint Roles for this project
  const projectStructures = INITIAL_PROJECT_STRUCTURES.filter(s => s.projectId === project.id);
  const totalRequired = projectStructures.reduce((acc, s) => acc + s.requiredCount, 0);
  const totalAllocated = projectStructures.reduce((acc, s) => acc + s.allocatedCount, 0);
  const totalGap = Math.max(0, totalRequired - totalAllocated);

  // Find Active Allocations for this project
  const teamAllocations = INITIAL_ALLOCATIONS.filter(a => a.projectId === project.id);

  return (
    <div className="fixed inset-0 z-50 !m-0 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4056d6] to-[#6b7cff] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#4056d6]">{project.id}</span>
                  <StatusBadge status={project.priority} />
                  <StatusBadge status={project.status} />
                </div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                  {project.name}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Roles</span>
                <strong className="text-base font-bold text-slate-900 block mt-0.5">{totalRequired || 4} Staff</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated</span>
                <strong className="text-base font-bold text-emerald-600 block mt-0.5">{totalAllocated || 2} Staff</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Staffing Gap</span>
                <strong className={`text-base font-bold block mt-0.5 ${totalGap > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {totalGap > 0 ? `-${totalGap} Open` : 'Fulfilled'}
                </strong>
              </div>
            </div>

            {/* Client & Ownership Info */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#4056d6]" />
                <span>Enterprise Client Account</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Client Name</span>
                  <strong className="text-slate-900 font-bold block mt-0.5">{clientInfo.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Account Region</span>
                  <strong className="text-slate-800 font-medium block mt-0.5">📍 {clientInfo.country}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Primary Client Contact</span>
                  <span className="text-slate-800 font-medium block mt-0.5">{clientInfo.contact}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Contract Health</span>
                  <span className="text-emerald-600 font-bold block mt-0.5">✓ Active &amp; Good Standing</span>
                </div>
              </div>
            </div>

            {/* Project Timeline & PM Lead */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#4056d6]" />
                <span>Governance &amp; Schedule</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[11px] block">Assigned Project Manager</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {project.pm.split(' ').map(n => n[0]).join('')}
                    </div>
                    <strong className="text-slate-900 font-bold">{project.pm}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block">Timeline Horizon</span>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.start} to {project.end}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Staffing Blueprint Structure Snapshot */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Grid3X3 className="w-3.5 h-3.5 text-[#4056d6]" />
                  <span>Resource Blueprint ({projectStructures.length} Roles)</span>
                </h3>
                {onNavigateToStructure && (
                  <button
                    onClick={() => { onClose(); onNavigateToStructure(project.id); }}
                    className="text-[11px] text-[#4056d6] font-bold hover:underline cursor-pointer"
                  >
                    Edit Blueprint →
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                {projectStructures.length > 0 ? (
                  projectStructures.map(s => {
                    const gap = Math.max(0, s.requiredCount - s.allocatedCount);
                    return (
                      <div key={s.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <strong className="text-slate-900 block">{s.role}</strong>
                          <span className="text-[11px] text-slate-400">Committed: {s.allocationPct}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-700 font-semibold block">
                            {s.allocatedCount} / {s.requiredCount} Staff
                          </span>
                          {gap > 0 ? (
                            <span className="text-[10px] font-bold text-rose-600">Gap: -{gap} Needed</span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600">✓ Fully Staffed</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No roles published yet for this project.
                  </div>
                )}
              </div>
            </div>

            {/* Team Roster Snapshot */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UsersRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Current Team Roster ({teamAllocations.length})</span>
                </h3>
              </div>

              <div className="space-y-2">
                {teamAllocations.length > 0 ? (
                  teamAllocations.map(a => (
                    <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {a.empName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <strong className="text-slate-900 block">{a.empName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{a.empId}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[#4056d6] font-bold text-xs border border-indigo-100">
                        {a.allocation}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200/80">
                    No team members directly allocated yet.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close Drawer
            </button>

            <div className="flex items-center gap-2">
              {onNavigateToStructure && (
                <button
                  onClick={() => { onClose(); onNavigateToStructure(project.id); }}
                  className="px-3.5 py-2 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span>Blueprint &amp; Gaps</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
