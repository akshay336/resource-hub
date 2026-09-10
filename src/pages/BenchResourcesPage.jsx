import React, { useState } from 'react';
import {
  Hourglass, AlertTriangle, CheckCircle2, UserPlus, Sparkles,
  Search, Filter, Clock, Users, Building, ShieldAlert, Award,
  Calendar, ArrowRight, Radar, Flame, AlertCircle, Bookmark, Check
} from 'lucide-react';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import { INITIAL_EMPLOYEES, INITIAL_PROJECTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function BenchResourcesPage({ onNavigateToAddResource, onNavigateToMatching }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('BENCH_DIRECTORY'); // 'BENCH_DIRECTORY' | 'ROLLOFF_RADAR'
  const [agingFilter, setAgingFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'NORMAL'
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  // Bench workforce database with aging metrics
  const [benchData, setBenchData] = useState([
    {
      id: 'EMP006',
      name: 'Sneha Shinde',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Pune',
      experience: '5.5',
      daysOnBench: 18,
      status: 'Available',
      skills: ['ANGULAR', 'REACT', 'NODEJS'],
      certifications: 'Azure Fundamentals',
      costPerMonth: '$4,200',
      lastProject: 'Alpha Core (PRJ-OLD-01)'
    },
    {
      id: 'EMP007',
      name: 'Karan Mehta',
      designation: 'Software Engineer',
      department: 'Engineering',
      location: 'Hyderabad',
      experience: '3.5',
      daysOnBench: 24,
      status: 'Interviews Ongoing',
      skills: ['ANGULAR', 'NODEJS', 'MYSQL'],
      certifications: 'Oracle Associate',
      costPerMonth: '$3,100',
      lastProject: 'Delta Payments (PRJ-OLD-04)'
    },
    {
      id: 'EMP012',
      name: 'Tanvi Saxena',
      designation: 'QA Automation Engineer',
      department: 'QA',
      location: 'Bangalore',
      experience: '5.0',
      daysOnBench: 32,
      status: 'Upskilling',
      skills: ['SELENIUM', 'DOCKER', 'AGILE'],
      certifications: 'ISTQB Expert',
      costPerMonth: '$3,800',
      lastProject: 'HealthShield (PRJ-OLD-08)'
    },
    {
      id: 'EMP002',
      name: 'Priya Patil',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Pune',
      experience: '6.0',
      daysOnBench: 8,
      status: 'Available',
      skills: ['ANGULAR', 'REACT', 'NODEJS'],
      certifications: 'AWS Solutions Architect',
      costPerMonth: '$4,500',
      lastProject: 'FinServe Mobile (PRJ-OLD-02)'
    },
    {
      id: 'EMP011',
      name: 'Rohan Deshpande',
      designation: 'Fullstack Developer',
      department: 'Engineering',
      location: 'Pune',
      experience: '4.2',
      daysOnBench: 5,
      status: 'Available',
      skills: ['REACT', 'DOTNET', 'AZURE'],
      certifications: 'AZ-104 Associate',
      costPerMonth: '$3,400',
      lastProject: 'Omni Retail (PRJ-OLD-03)'
    },
    {
      id: 'EMP014',
      name: 'Siddharth Rao',
      designation: 'DevOps Specialist',
      department: 'Cloud & DevOps',
      location: 'Bangalore',
      experience: '4.8',
      daysOnBench: 12,
      status: 'Available',
      skills: ['K8S', 'DOCKER', 'AZURE'],
      certifications: 'CKA Certified',
      costPerMonth: '$4,100',
      lastProject: 'Cloud Infra Migration'
    },
    {
      id: 'EMP015',
      name: 'Ananya Roy',
      designation: 'Backend Engineer',
      department: 'Engineering',
      location: 'Mumbai',
      experience: '3.0',
      daysOnBench: 16,
      status: 'Interviews Ongoing',
      skills: ['NODEJS', 'NESTJS', 'MYSQL'],
      certifications: 'Node.js Pro',
      costPerMonth: '$2,900',
      lastProject: 'Secure Vault API'
    }
  ]);

  // 30-Day Roll-off Radar Forecast Data
  const upcomingRollOffs = [
    {
      id: 'EMP001',
      name: 'Amit Sharma',
      designation: 'Technical Lead',
      currentProject: 'Phoenix Digital Platform (PRJ001)',
      currentAllocation: '50%',
      rollOffDate: '30 Sep 2026',
      daysToRollOff: 20,
      skills: ['DOTNET', 'AZURE', 'DOCKER', 'AGILE'],
      riskLevel: 'Planned',
      nextStatus: '100% Free Available'
    },
    {
      id: 'EMP003',
      name: 'Rahul Joshi',
      designation: 'Software Engineer',
      currentProject: 'Atlas Commerce (PRJ002)',
      currentAllocation: '100%',
      rollOffDate: '31 Oct 2026',
      daysToRollOff: 51,
      skills: ['REACT', 'NESTJS', 'MYSQL'],
      riskLevel: 'Medium',
      nextStatus: '100% Free Available'
    },
    {
      id: 'EMP005',
      name: 'Vikram Deshmukh',
      designation: 'Technical Architect',
      currentProject: 'Atlas Commerce (PRJ002)',
      currentAllocation: '50%',
      rollOffDate: '15 Dec 2026',
      daysToRollOff: 96,
      skills: ['DOTNET', 'AZURE', 'K8S', 'RAG'],
      riskLevel: 'Planned',
      nextStatus: '50% Bandwidth Released'
    },
    {
      id: 'EMP004',
      name: 'Neha Kulkarni',
      designation: 'Senior QA Engineer',
      currentProject: 'Nova CRM & Healthcare (PRJ004)',
      currentAllocation: '50%',
      rollOffDate: '31 Mar 2027',
      daysToRollOff: 202,
      skills: ['SELENIUM', 'DOCKER', 'AGILE'],
      riskLevel: 'Planned',
      nextStatus: '50% Bandwidth Released'
    }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleQuickAssign = (emp) => {
    showToast(`✓ Opened direct assignment dispatcher for ${emp.name} (${emp.id})`);
    if (onNavigateToAddResource) {
      onNavigateToAddResource(emp);
    }
  };

  const handleInitiateSourcing = (emp) => {
    showToast(`✓ Matching ${emp.name} against open demand pipeline!`);
    if (onNavigateToMatching) {
      onNavigateToMatching();
    }
  };

  // Filtered Bench Data
  const filteredBenchData = benchData.filter(item => {
    const matchesAging = agingFilter === 'ALL'
      ? true
      : agingFilter === 'CRITICAL'
        ? item.daysOnBench > 15
        : item.daysOnBench <= 15;
    const matchesDept = departmentFilter === 'ALL' || item.department === departmentFilter;
    return matchesAging && matchesDept;
  });

  const criticalAgingCount = benchData.filter(b => b.daysOnBench > 15).length;
  const totalBenchCost = benchData.reduce((sum, b) => sum + parseInt(b.costPerMonth.replace(/[^0-9]/g, '') || 0), 0);

  // Bench Directory Table Columns
  const benchColumns = [
    {
      key: 'id',
      label: 'Emp ID',
      render: (val) => <span className="font-mono font-bold text-[#4056d6]">{val}</span>
    },
    {
      key: 'name',
      label: 'Employee Name & Role',
      render: (val, row) => (
        <div>
          <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
          <span className="text-[11px] text-slate-500 font-medium">{row.designation} • {row.department}</span>
        </div>
      )
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val} yrs</span>
    },
    {
      key: 'daysOnBench',
      label: 'Bench Aging Tracker',
      render: (val) => {
        if (val > 15) {
          return (
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>{val} Days (Aging Alert &gt;15d)</span>
              </span>
              <span className="block text-[10px] text-rose-600 font-semibold pl-1">
                Escalated to Delivery Head
              </span>
            </div>
          );
        }
        if (val > 10) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>{val} Days (Warning)</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{val} Days (Normal)</span>
          </span>
        );
      }
    },
    {
      key: 'skills',
      label: 'Core Competencies',
      render: (val) => (
        <div className="flex items-center gap-1 flex-wrap">
          {val.map(s => (
            <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
              {s}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Base Hub',
      render: (val) => <span className="text-xs text-slate-700 font-medium">📍 {val}</span>
    },
    {
      key: 'status',
      label: 'Bench Status',
      isStatus: true
    },
    {
      key: 'action',
      label: 'Allocation Action',
      render: (_, row) => (
        <button
          onClick={() => handleQuickAssign(row)}
          className="px-3.5 py-1.5 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Allocate</span>
        </button>
      )
    }
  ];

  // Roll-off Radar Table Columns
  const rollOffColumns = [
    {
      key: 'id',
      label: 'Emp ID',
      render: (val) => <span className="font-mono font-bold text-[#4056d6]">{val}</span>
    },
    {
      key: 'name',
      label: 'Team Member',
      render: (val, row) => (
        <div>
          <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
          <span className="text-[11px] text-slate-500 font-medium">{row.designation}</span>
        </div>
      )
    },
    {
      key: 'currentProject',
      label: 'Current Project Assignment',
      render: (val, row) => (
        <div>
          <span className="text-xs font-bold text-slate-800 block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">Current Alloc: {row.currentAllocation}</span>
        </div>
      )
    },
    {
      key: 'rollOffDate',
      label: 'Scheduled Roll-off',
      render: (val, row) => (
        <div className="space-y-0.5">
          <strong className="text-xs font-bold text-slate-900 block">{val}</strong>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${row.daysToRollOff <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
            }`}>
            In {row.daysToRollOff} Days ({row.daysToRollOff <= 30 ? '30-Day Radar' : 'Future Window'})
          </span>
        </div>
      )
    },
    {
      key: 'skills',
      label: 'Skills',
      render: (val) => (
        <div className="flex items-center gap-1 flex-wrap">
          {val.slice(0, 3).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded bg-indigo-50 text-[#4056d6] text-[10px] font-mono font-bold">
              {s}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'nextStatus',
      label: 'Roll-off Forecast',
      render: (val) => (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
          {val}
        </span>
      )
    },
    {
      key: 'action',
      label: 'Pre-staff Action',
      render: (_, row) => (
        <button
          onClick={() => handleInitiateSourcing(row)}
          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pre-Allocate</span>
        </button>
      )
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
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              Talent Reserve &amp; Sourcing
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 17 Bench Aging &amp; Roll-off Radar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bench Management &amp; Roll-off Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Proactive bench aging escalation alerts (&gt;15 days), cost burn monitoring, and 30-day roll-off forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('BENCH_DIRECTORY')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'BENCH_DIRECTORY'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Bench Directory ({benchData.length})
            </button>
            <button
              onClick={() => setActiveTab('ROLLOFF_RADAR')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${activeTab === 'ROLLOFF_RADAR'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Radar className="w-3.5 h-3.5 text-purple-600" />
              <span>30-Day Roll-off Radar ({upcomingRollOffs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Bench */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Bench Pool</span>
            <strong className="text-xl font-bold text-slate-900">{benchData.length} Engineers</strong>
          </div>
        </div>

        {/* Critical Aging (>15 Days Alert) */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-rose-800 font-bold block">Aging Alert (&gt;15 Days)</span>
            <strong className="text-xl font-bold text-rose-600">{criticalAgingCount} Escalated</strong>
          </div>
        </div>

        {/* Deployment Ready */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Immediate Deployment</span>
            <strong className="text-xl font-bold text-emerald-700">
              {benchData.filter(b => b.status === 'Available').length} Ready
            </strong>
          </div>
        </div>

        {/* Monthly Bench Cost Impact */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Monthly Bench Burn</span>
            <strong className="text-xl font-bold text-slate-900">${totalBenchCost.toLocaleString()} / mo</strong>
          </div>
        </div>

      </div>

      {/* Main Content: Bench Directory Tab vs Roll-off Radar Tab */}
      {activeTab === 'BENCH_DIRECTORY' ? (
        <div className="space-y-4">

          {/* Sourcing & Aging Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">

            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">Aging Filter:</span>
              {[
                { id: 'ALL', label: 'All Bench Talent' },
                { id: 'CRITICAL', label: `🔴 >15 Days Aging Alert (${criticalAgingCount})` },
                { id: 'NORMAL', label: '🟢 ≤15 Days (Normal)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAgingFilter(f.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${agingFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs font-bold border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#4056d6] cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="QA">Quality Assurance</option>
                <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
              </select>
            </div>

          </div>

          {/* Bench Workforce Master DataTable */}
          <DataTable
            title={`Active Bench Workforce Directory (${filteredBenchData.length})`}
            subtitle="Search unallocated talent, monitor days on bench, and immediately dispatch direct allocations."
            data={filteredBenchData}
            columns={benchColumns}
            searchPlaceholder="Search by name, ID, skills, location, previous project..."
            enableExport={true}
            exportFileName="bench_workforce_aging.csv"
          />

        </div>
      ) : (
        <div className="space-y-4">

          {/* Roll-off Radar Explainer Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-300">
                <Radar className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider">30-Day Roll-off Radar System</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Project Roll-off &amp; Bandwidth Release Forecast
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Anticipate project completions before resources return to bench. Pre-allocate rolling-off talent directly into pipeline demand tickets.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
                <span className="text-[10px] text-slate-300 uppercase block font-semibold">Radar Horizon</span>
                <strong className="text-base font-bold text-emerald-300">30 - 90 Days</strong>
              </div>
            </div>
          </div>

          {/* Roll-off Forecast Table */}
          <DataTable
            title="Scheduled Roll-off Horizon"
            subtitle="Engineers scheduled for partial or complete project release within upcoming sprint cycles."
            data={upcomingRollOffs}
            columns={rollOffColumns}
            searchPlaceholder="Search roll-off by employee, project, skill..."
            enableExport={true}
            exportFileName="roll_off_radar_forecast.csv"
          />

        </div>
      )}

    </div>
  );
}
