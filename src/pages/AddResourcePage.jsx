import React, { useState } from 'react';
import {
  UserPlus, Search, CheckCircle2, AlertCircle, ArrowLeftRight,
  Sparkles, Shield, Building, Filter, Clock, User, ShieldCheck,
  AlertTriangle, ArrowRight, Check, Zap, UsersRound
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_EMPLOYEES, INITIAL_ALLOCATIONS } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';

export default function AddResourcePage({ onNavigateToSharing, onNavigateToTeam }) {
  const { currentUser } = useAuth();
  const defaultProj = currentUser.assignedProjects[0] || 'PRJ001';

  const [selectedProjectId, setSelectedProjectId] = useState(defaultProj);
  const [requiredRole, setRequiredRole] = useState('Frontend Developer');
  const [requiredAllocation, setRequiredAllocation] = useState('100%');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'BENCH', 'PARTIAL', 'HIGH_MATCH'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [recentAllocations, setRecentAllocations] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const activeProject = INITIAL_PROJECTS.find(p => p.id === selectedProjectId) || INITIAL_PROJECTS[0];

  // Suggested / Available workforce pool matching prototype
  const [candidatePool, setCandidatePool] = useState([
    {
      id: "EMP002",
      name: "Priya Patil",
      role: "Senior Software Engineer",
      currentAllocation: "0%",
      availableBandwidth: "100%",
      source: "Bench",
      skills: ["ANGULAR", "REACT", "NODEJS"],
      location: "Pune",
      matchScore: "95%"
    },
    {
      id: "EMP006",
      name: "Sneha Shinde",
      role: "Senior Software Engineer",
      currentAllocation: "0%",
      availableBandwidth: "100%",
      source: "Bench",
      skills: ["ANGULAR", "REACT", "NODEJS"],
      location: "Pune",
      matchScore: "92%"
    },
    {
      id: "EMP003",
      name: "Rahul Joshi",
      role: "Software Engineer",
      currentAllocation: "60%",
      availableBandwidth: "40%",
      source: "Atlas Commerce (PRJ002)",
      sourceProjId: "PRJ002",
      sourceProjName: "Atlas Commerce",
      sourcePm: "John Carter",
      skills: ["REACT", "NESTJS", "MYSQL"],
      location: "Mumbai",
      matchScore: "88%"
    },
    {
      id: "EMP007",
      name: "Karan Mehta",
      role: "Software Engineer",
      currentAllocation: "75%",
      availableBandwidth: "25%",
      source: "Nova CRM (PRJ004)",
      sourceProjId: "PRJ004",
      sourceProjName: "Nova CRM & Healthcare",
      sourcePm: "Amit Sharma",
      skills: ["ANGULAR", "NODEJS", "MYSQL"],
      location: "Hyderabad",
      matchScore: "84%"
    },
    {
      id: "EMP011",
      name: "Rohan Deshpande",
      role: "Fullstack Developer",
      currentAllocation: "0%",
      availableBandwidth: "100%",
      source: "Bench",
      skills: ["REACT", "DOTNET", "AZURE"],
      location: "Pune",
      matchScore: "90%"
    },
    {
      id: "EMP004",
      name: "Neha Kulkarni",
      role: "Senior QA Engineer",
      currentAllocation: "50%",
      availableBandwidth: "50%",
      source: "Nova CRM (PRJ004)",
      sourceProjId: "PRJ004",
      sourceProjName: "Nova CRM & Healthcare",
      sourcePm: "Amit Sharma",
      skills: ["SELENIUM", "DOCKER", "AGILE"],
      location: "Pune",
      matchScore: "96%"
    }
  ]);

  // Day 11 Requirement: 100% Hard-Limit Allocation Guard
  const handleDirectAllocate = (candidate) => {
    const currNum = parseInt(candidate.currentAllocation) || 0;
    const reqNum = parseInt(requiredAllocation) || 100;

    // 100% Hard-Limit Guard Validation
    if (currNum + reqNum > 100) {
      alert(`❌ 100% Hard-Limit Allocation Guard: Allocating ${reqNum}% will exceed the 100% capacity limit for ${candidate.name} (Current: ${currNum}%, Total: ${currNum + reqNum}%). Please request a partial bandwidth of ${100 - currNum}% or initiate peer sharing.`);
      return;
    }

    const newTotalAlloc = currNum + reqNum;
    const newAvailBandwidth = Math.max(0, 100 - newTotalAlloc);

    // Update candidate pool
    setCandidatePool(candidatePool.map(c => {
      if (c.id === candidate.id) {
        return {
          ...c,
          currentAllocation: `${newTotalAlloc}%`,
          availableBandwidth: `${newAvailBandwidth}%`,
          source: newTotalAlloc === 100 ? 'Fully Allocated' : `Partial (${newAvailBandwidth}% Free)`
        };
      }
      return c;
    }));

    // Record allocation event
    const newAllocRecord = {
      id: `ALC-0${Math.floor(10 + Math.random() * 90)}`,
      empId: candidate.id,
      empName: candidate.name,
      projectId: selectedProjectId,
      projectName: activeProject.name,
      allocation: requiredAllocation,
      start: startDate,
      end: endDate,
      status: 'Active'
    };

    setRecentAllocations([newAllocRecord, ...recentAllocations]);

    showToast(`✓ [Day 11] Direct Bench Allocation Successful: ${candidate.name} (${requiredAllocation}) added immediately to ${activeProject.name}!`);
  };

  const handleRequestSharing = (candidate) => {
    if (onNavigateToSharing) {
      onNavigateToSharing(candidate);
    } else {
      showToast(`Sharing request of ${candidate.availableBandwidth} initiated for ${candidate.name}`);
    }
  };

  // Filter candidates based on tabs & search
  const filteredCandidates = candidatePool.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'BENCH') return c.currentAllocation === '0%';
    if (activeTab === 'PARTIAL') return c.currentAllocation !== '0%' && parseInt(c.availableBandwidth) > 0;
    if (activeTab === 'HIGH_MATCH') return parseInt(c.matchScore) >= 90;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Candidate Name & Role',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
              <span className="font-mono text-[10px] text-slate-400">({row.id})</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{row.role} • 📍 {row.location}</span>
          </div>
        </div>
      )
    },
    {
      key: 'matchScore',
      label: 'Talent Fit',
      render: (val) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
          <Sparkles className="w-3 h-3 text-purple-600" />
          {val}
        </span>
      )
    },
    {
      key: 'currentAllocation',
      label: 'Current Load',
      render: (val) => (
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
          {val}
        </span>
      )
    },
    {
      key: 'availableBandwidth',
      label: 'Free Bandwidth',
      render: (val) => (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          {val} Free
        </span>
      )
    },
    {
      key: 'skills',
      label: 'Technical Skills',
      render: (val) => (
        <div className="flex items-center gap-1 flex-wrap">
          {val.map(s => (
            <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
              {s}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'action',
      label: 'Allocation Action',
      render: (_, row) => {
        const currNum = parseInt(row.currentAllocation) || 0;
        const reqNum = parseInt(requiredAllocation) || 100;
        const willExceed = currNum + reqNum > 100;

        if (row.currentAllocation === '0%' || (!willExceed && parseInt(row.availableBandwidth) >= reqNum)) {
          return (
            <button
              onClick={() => handleDirectAllocate(row)}
              className="px-3.5 py-1.5 bg-[#4056d6] hover:bg-[#3245b5] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title={`Directly allocate ${requiredAllocation} bandwidth to ${activeProject.name}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct Allocate ({requiredAllocation})</span>
            </button>
          );
        }

        if (willExceed) {
          return (
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1"
                title={`Exceeds 100% capacity (${currNum + reqNum}%)`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Exceeds 100%</span>
              </button>

              <button
                onClick={() => handleRequestSharing(row)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] border border-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                title="Initiate peer PM sharing for remaining bandwidth"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Request {row.availableBandwidth}</span>
              </button>
            </div>
          );
        }

        return (
          <button
            onClick={() => handleRequestSharing(row)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] border border-indigo-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Request {row.availableBandwidth}</span>
          </button>
        );
      }
    }
  ];

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
              Staffing Fulfillment Path A
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 11 Direct Bench Allocation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Direct Bench Resource Allocation</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search unassigned bench talent, evaluate 100% hard-capacity limits, and immediately commit candidate to project team.
          </p>
        </div>

        {onNavigateToTeam && (
          <button
            onClick={onNavigateToTeam}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UsersRound className="w-4 h-4 text-emerald-600" />
            <span>View My Project Team →</span>
          </button>
        )}
      </div>

      {/* Project Need Configuration Box & Capacity Guard Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4056d6] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Define Project Staffing Need &amp; Bandwidth</h3>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Hard-Limit Allocation Guard Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Target Project */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer font-semibold"
            >
              {INITIAL_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
              ))}
            </select>
          </div>

          {/* Required Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Role
            </label>
            <select
              value={requiredRole}
              onChange={(e) => setRequiredRole(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
            >
              <option value="Frontend Developer">Frontend Developer (React / Angular)</option>
              <option value="Backend Developer">Backend Developer (.NET / Node)</option>
              <option value="QA Engineer">QA Automation Engineer</option>
              <option value="Technical Architect">Technical Architect</option>
              <option value="DevOps Engineer">DevOps &amp; Cloud Engineer</option>
            </select>
          </div>

          {/* Required Allocation % */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Committed Bandwidth %
            </label>
            <select
              value={requiredAllocation}
              onChange={(e) => setRequiredAllocation(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-indigo-50/60 border border-indigo-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer font-bold text-[#4056d6]"
            >
              <option value="100%">100% Dedicated (Full-Time)</option>
              <option value="75%">75% Dedicated</option>
              <option value="50%">50% Half-Time Bandwidth</option>
              <option value="25%">25% Advisory / Support</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
            />
          </div>

        </div>

      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `All Candidates (${candidatePool.length})` },
            { id: 'BENCH', label: `100% Bench Only (${candidatePool.filter(c => c.currentAllocation === '0%').length})` },
            { id: 'PARTIAL', label: `Partial Available` },
            { id: 'HIGH_MATCH', label: `High Match (>90%)` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                  ? 'bg-[#1e293b] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate or skill..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
          />
        </div>

      </div>

      {/* Main Candidate Matching & Allocation Table */}
      <DataTable
        title={`Available Bench & Workforce Pool (${filteredCandidates.length})`}
        subtitle={`Showing verified talent matching requirements for ${activeProject.name}. Direct allocation commits resource to project roster immediately.`}
        columns={columns}
        data={filteredCandidates}
        searchPlaceholder="Filter candidate by name, skills..."
        enableExport={true}
        exportFileName="bench_allocation_pool.csv"
      />

      {/* Recent Allocations Live Feed (if any committed during session) */}
      {recentAllocations.length > 0 && (
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Recently Committed Direct Allocations (This Session)</span>
            </h4>
            {onNavigateToTeam && (
              <button
                onClick={onNavigateToTeam}
                className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Go to Team Roster →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentAllocations.map(r => (
              <div key={r.id} className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs text-xs flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 block font-bold">{r.empName}</strong>
                  <span className="text-[11px] text-slate-500">{r.projectName}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  {r.allocation} Committed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
