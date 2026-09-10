import React, { useState } from 'react';
import {
  CalendarClock, Calendar, CheckCircle2, Clock,
  AlertCircle, Plus, Filter, Users, TrendingUp, Sparkles, Building, Radar, ArrowRight, UserPlus
} from 'lucide-react';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import { INITIAL_LEAVES, INITIAL_EMPLOYEES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function ResourceAvailabilityPage({ onNavigateToAddResource }) {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('ROLLOFF'); // 'ROLLOFF' | 'LEAVES' | 'CAPACITY'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 30-Day Roll-off Radar Data (Day 17)
  const rollOffData = [
    {
      id: 'EMP001',
      name: 'Amit Sharma',
      role: 'Technical Lead',
      project: 'Phoenix Digital Platform (PRJ001)',
      currentAlloc: '50%',
      rollOffDate: '30 Sep 2026',
      daysRemaining: 20,
      forecastBandwidth: '100% Free Available',
      skills: ['DOTNET', 'AZURE', 'DOCKER', 'AGILE'],
      status: 'Planned Roll-off'
    },
    {
      id: 'EMP003',
      name: 'Rahul Joshi',
      role: 'Software Engineer',
      project: 'Atlas Commerce (PRJ002)',
      currentAlloc: '100%',
      rollOffDate: '31 Oct 2026',
      daysRemaining: 51,
      forecastBandwidth: '100% Free Available',
      skills: ['REACT', 'NESTJS', 'MYSQL'],
      status: 'Upcoming Release'
    },
    {
      id: 'EMP005',
      name: 'Vikram Deshmukh',
      role: 'Technical Architect',
      project: 'Atlas Commerce (PRJ002)',
      currentAlloc: '50%',
      rollOffDate: '15 Dec 2026',
      daysRemaining: 96,
      forecastBandwidth: '50% Released',
      skills: ['DOTNET', 'AZURE', 'K8S', 'RAG'],
      status: 'Planned Roll-off'
    }
  ];

  // 3-Month Capacity Matrix Data
  const capacityMatrix = [
    { id: 'EMP001', name: 'Amit Sharma', role: 'Technical Lead', sep: '50% (PRJ001)', oct: '50% (PRJ001)', nov: '100% Free (Roll-off)' },
    { id: 'EMP002', name: 'Priya Patil', role: 'Senior Software Engineer', sep: '100% (PRJ001)', oct: '100% Free (Bench)', nov: '100% Free (Bench)' },
    { id: 'EMP003', name: 'Rahul Joshi', role: 'Software Engineer', sep: '60% (PRJ002)', oct: '60% (PRJ002)', nov: '100% Free (Roll-off)' },
    { id: 'EMP004', name: 'Neha Kulkarni', role: 'Senior QA Engineer', sep: '50% (PRJ004)', oct: '50% (PRJ004)', nov: '50% (PRJ004)' },
    { id: 'EMP005', name: 'Vikram Deshmukh', role: 'Technical Architect', sep: '50% (PRJ002)', oct: '50% (PRJ002)', nov: '50% (PRJ002)' },
    { id: 'EMP006', name: 'Sneha Shinde', role: 'Senior Software Engineer', sep: '100% Free (Bench)', oct: '100% Free (Bench)', nov: '100% Free (Bench)' }
  ];

  const rollOffColumns = [
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
          <span className="text-[11px] text-slate-500 font-medium">{row.role}</span>
        </div>
      )
    },
    {
      key: 'project',
      label: 'Current Project Assignment',
      render: (val, row) => (
        <div>
          <span className="text-xs font-bold text-slate-800 block">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">Current: {row.currentAlloc}</span>
        </div>
      )
    },
    {
      key: 'rollOffDate',
      label: 'Roll-off Date Window',
      render: (val, row) => (
        <div>
          <strong className="text-xs font-bold text-slate-900 block">{val}</strong>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${row.daysRemaining <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
            }`}>
            In {row.daysRemaining} Days ({row.daysRemaining <= 30 ? '30-Day Radar' : 'Future Window'})
          </span>
        </div>
      )
    },
    {
      key: 'forecastBandwidth',
      label: 'Post-Roll-off Bandwidth',
      render: (val) => (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
          {val}
        </span>
      )
    },
    {
      key: 'skills',
      label: 'Skills Profile',
      render: (val) => (
        <div className="flex items-center gap-1 flex-wrap">
          {val.slice(0, 3).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
              {s}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'action',
      label: 'Pre-staff Action',
      render: (_, row) => (
        <button
          onClick={() => {
            showToast(`✓ Opened allocation planner for ${row.name}`);
            if (onNavigateToAddResource) onNavigateToAddResource();
          }}
          className="px-3 py-1.5 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Pre-Allocate</span>
        </button>
      )
    }
  ];

  const leaveColumns = [
    {
      key: 'id',
      label: 'Leave Ref',
      render: (val) => <span className="font-mono font-bold text-[#4056d6]">{val}</span>
    },
    {
      key: 'empName',
      label: 'Employee Name',
      render: (val, row) => (
        <div>
          <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
          <span className="text-[10px] text-slate-400 font-mono">{row.empId}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Leave Category',
      render: (val) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800">
          {val}
        </span>
      )
    },
    {
      key: 'from',
      label: 'Time Off Window',
      render: (val, row) => (
        <div className="text-xs text-slate-700">
          <span className="font-semibold">{val}</span>
          <span className="text-slate-400"> to </span>
          <span className="font-semibold">{row.to}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Approval Status',
      isStatus: true
    }
  ];

  const capacityColumns = [
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
          <span className="text-[11px] text-slate-500 font-medium">{row.role}</span>
        </div>
      )
    },
    {
      key: 'sep',
      label: 'Sep 2026 Bandwidth',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${val.includes('Free') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-[#4056d6] border border-indigo-100'
          }`}>
          {val}
        </span>
      )
    },
    {
      key: 'oct',
      label: 'Oct 2026 Bandwidth',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${val.includes('Free') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-[#4056d6] border border-indigo-100'
          }`}>
          {val}
        </span>
      )
    },
    {
      key: 'nov',
      label: 'Nov 2026 Bandwidth (Roll-off Forecast)',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${val.includes('Roll-off') ? 'bg-amber-50 text-amber-800 border border-amber-200' : val.includes('Free') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-[#4056d6] border border-indigo-100'
          }`}>
          {val}
        </span>
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
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              Capacity &amp; Roll-off Radar
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 17 Availability Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resource Availability &amp; Roll-off Radar</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            30-day roll-off forecast calendar, multi-month capacity matrix, and planned employee time-off schedule.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('ROLLOFF')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'ROLLOFF'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Radar className="w-3.5 h-3.5 text-purple-600" />
            <span>30-Day Roll-off Radar ({rollOffData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('LEAVES')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'LEAVES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Planned Leaves ({leaves.length})
          </button>
          <button
            onClick={() => setActiveTab('CAPACITY')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${activeTab === 'CAPACITY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            90-Day Bandwidth Matrix
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">30-Day Roll-off Forecast</span>
            <strong className="text-xl font-bold text-slate-900">{rollOffData.length} Releases</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Approved Time Off</span>
            <strong className="text-xl font-bold text-slate-900">{leaves.length} Leaves</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Net Free Bandwidth</span>
            <strong className="text-xl font-bold text-emerald-700">340 Hours/wk</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Allocation Saturation</span>
            <strong className="text-xl font-bold text-slate-900">88.5%</strong>
          </div>
        </div>

      </div>

      {/* Main Content View Switch */}
      {activeTab === 'ROLLOFF' ? (
        <DataTable
          title="30-Day Roll-off Radar & Project Release Horizon"
          subtitle="Forecast resources scheduled for release within the next 30 to 90 days. Pre-staff them to upcoming pipeline demand."
          data={rollOffData}
          columns={rollOffColumns}
          searchPlaceholder="Search roll-off by employee, role, project, skills..."
          enableExport={true}
          exportFileName="roll_off_radar_30days.csv"
        />
      ) : activeTab === 'LEAVES' ? (
        <DataTable
          title="Scheduled Time Off & Leaves Calendar"
          subtitle="View approved leaves and planned personal time-off across project teams."
          data={leaves}
          columns={leaveColumns}
          searchPlaceholder="Search by employee, leave type, status..."
          enableExport={true}
          exportFileName="leaves_forecast.csv"
        />
      ) : (
        <DataTable
          title="90-Day Bandwidth & Roll-off Matrix"
          subtitle="Forward-looking allocation heatmap across September, October, and November 2026."
          data={capacityMatrix}
          columns={capacityColumns}
          searchPlaceholder="Search by employee name or role..."
          enableExport={true}
          exportFileName="capacity_roll_off_matrix.csv"
        />
      )}

    </div>
  );
}
