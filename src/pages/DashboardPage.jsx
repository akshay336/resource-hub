import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import {
  RotateCw, TrendingUp, Users, FolderKanban, Hourglass,
  FileText, Calendar, CheckCircle2, ArrowRight, Sparkles,
  Layers, ExternalLink, ChevronRight, AlertTriangle, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_PROJECTS, INITIAL_RESOURCE_REQUESTS } from '../data/mockData';

export default function DashboardPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setToastMessage('Refreshing live metrics and resource allocations...');
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey(prev => prev + 1); // Triggers smooth chart re-animation
      setToastMessage('Dashboard metrics up to date!');
      setTimeout(() => setToastMessage(''), 2500);
    }, 600);
  };

  // Monthly Resource Utilization 2026 Data (Matching exact prototype values with Recharts animation support)
  const monthlyUtilization = [
    { month: 'Jan', val: 68, billable: 58, target: 80 },
    { month: 'Feb', val: 72, billable: 62, target: 80 },
    { month: 'Mar', val: 76, billable: 65, target: 80 },
    { month: 'Apr', val: 79, billable: 68, target: 80 },
    { month: 'May', val: 81, billable: 71, target: 80 },
    { month: 'Jun', val: 78, billable: 67, target: 80 },
    { month: 'Jul', val: 84, billable: 73, target: 80 },
    { month: 'Aug', val: 82, billable: 72, target: 80 },
    { month: 'Sep', val: 86, billable: 76, target: 80 },
    { month: 'Oct', val: 88, billable: 78, target: 80 },
    { month: 'Nov', val: 85, billable: 75, target: 80 },
    { month: 'Dec', val: 90, billable: 80, target: 80 }
  ];

  // Employee Allocation Mix (58% 100% allocated, 20% 50-99%, 13% 1-49%, 9% Bench)
  const allocationMix = [
    { name: '100% allocated', value: 58, count: 144, color: '#3b82f6' },
    { name: '50–99%', value: 20, count: 50, color: '#10b981' },
    { name: '1–49%', value: 13, count: 32, color: '#f59e0b' },
    { name: 'Bench', value: 9, count: 22, color: '#ef4444' }
  ];

  // Custom Tooltip for Dashboard Bar Chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1">
            <strong className="text-indigo-300 font-bold">{label} 2026</strong>
            <span className="text-[10px] text-emerald-400 font-semibold">Target: 80%</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-slate-200">
            <span>Utilization:</span>
            <strong className="text-white font-mono text-sm">{data.val}%</strong>
          </div>
          <div className="text-[11px] text-slate-400">
            Billable contribution: <strong className="text-slate-200">{data.billable}%</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Dashboard Donut Chart
  const CustomDonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <strong className="text-slate-200">{data.name}</strong>
          </div>
          <div className="mt-1 text-slate-300 flex justify-between gap-4">
            <span>Share: <strong>{data.value}%</strong></span>
            <span>Headcount: <strong>{data.count}</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Open Requests for Dashboard Table (matches exact prototype)
  const openRequests = [
    {
      id: 'RR-2026-001',
      project: 'PRJ001',
      role: 'Senior Angular Developer',
      exp: '4.0',
      allocation: '100%',
      start: '01 Oct 2026',
      end: '31 Dec 2026',
      priority: 'High',
      status: 'Requested'
    },
    {
      id: 'RR-2026-002',
      project: 'PRJ002',
      role: '.NET/Azure Engineer',
      exp: '5.0',
      allocation: '50%',
      start: '15 Sep 2026',
      end: '15 Dec 2026',
      priority: 'Critical',
      status: 'Under Review'
    },
    {
      id: 'RR-2026-003',
      project: 'PRJ003',
      role: 'Node.js Developer',
      exp: '3.0',
      allocation: '100%',
      start: '01 Nov 2026',
      end: '31 Jan 2027',
      priority: 'Medium',
      status: 'Shortlisted'
    }
  ];

  // Upcoming Availability (matches exact prototype)
  const upcomingAvailability = [
    {
      name: 'Sneha Shinde',
      current: '0%',
      availableFrom: '12 Sep 2026',
      skills: 'Angular, React',
      status: 'Available'
    },
    {
      name: 'Priya Patil',
      current: '0%',
      availableFrom: '15 Sep 2026',
      skills: 'React, Node.js',
      status: 'Available'
    },
    {
      name: 'Rahul Joshi',
      current: '60%',
      availableFrom: '01 Nov 2026',
      skills: 'React, MySQL',
      status: 'Partial (40%)'
    },
    {
      name: 'Karan Mehta',
      current: '75%',
      availableFrom: '15 Oct 2026',
      skills: 'Angular, MySQL',
      status: 'Partial (25%)'
    }
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'text-rose-600 font-bold';
      case 'High':
        return 'text-amber-600 font-bold';
      default:
        return 'text-slate-600 font-medium';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Requested</span>;
      case 'Under Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Under Review</span>;
      case 'Shortlisted':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Shortlisted</span>;
      case 'Approved':
      case 'Available':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{status}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  // Calculations for Donut Chart SVG (Circumference = 2 * PI * r = 2 * 3.14159 * 58 ≈ 364.4)
  // Segments:
  // 1. Blue (100% allocated): 58% -> 211.35
  // 2. Green (50-99%): 20% -> 72.88
  // 3. Orange (1-49%): 13% -> 47.37
  // 4. Red (Bench): 9% -> 32.80
  const C = 364.4;
  const seg1 = 0.58 * C; // 211.35
  const seg2 = 0.20 * C; // 72.88
  const seg3 = 0.13 * C; // 47.37
  const seg4 = 0.09 * C; // 32.80

  const offset1 = 0;
  const offset2 = -seg1;
  const offset3 = -(seg1 + seg2);
  const offset4 = -(seg1 + seg2 + seg3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dashboard Title & Refresh Header (Matching screenshot exactly) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">
            Resource Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Executive overview of workforce, projects, allocation and staffing demand.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#4056d6]' : 'text-slate-500'}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 5 Top KPI Metric Cards (Matching screenshot layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Total Employees */}
        <div
          onClick={() => onNavigate && onNavigate('Employees')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-slate-500 block">Total Employees</span>
          <strong className="text-3xl font-extrabold text-slate-900 block mt-1 tracking-tight">248</strong>
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">
            +12 this quarter
          </span>
        </div>

        {/* Active Projects */}
        <div
          onClick={() => onNavigate && onNavigate(currentUser.role === 'Project Manager' ? 'My Projects' : 'Projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-slate-500 block">Active Projects</span>
          <strong className="text-3xl font-extrabold text-slate-900 block mt-1 tracking-tight">37</strong>
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">
            +5 this month
          </span>
        </div>

        {/* Avg. Utilization */}
        <div
          onClick={() => onNavigate && onNavigate('Utilization')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-slate-500 block">Avg. Utilization</span>
          <strong className="text-3xl font-extrabold text-slate-900 block mt-1 tracking-tight">82%</strong>
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">
            +4.2 pts
          </span>
        </div>

        {/* Open Requests */}
        <div
          onClick={() => onNavigate && onNavigate('Resource Requests')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <span className="text-xs font-semibold text-slate-500 block">Open Requests</span>
          <strong className="text-3xl font-extrabold text-slate-900 block mt-1 tracking-tight">14</strong>
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">
            6 high priority
          </span>
        </div>

        {/* Bench Resources */}
        <div
          onClick={() => onNavigate && onNavigate('Bench Resources')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:border-[#4056d6] transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <span className="text-xs font-semibold text-slate-500 block">Bench Resources</span>
          <strong className="text-3xl font-extrabold text-slate-900 block mt-1 tracking-tight">19</strong>
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">
            7 available now
          </span>
        </div>

      </div>

      {/* Middle Visual Section: Monthly Utilization (Bar Chart) & Employee Allocation Mix (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Card: Monthly Resource Utilization Bar Chart (2 Cols) */}
        <div
          onClick={() => onNavigate && onNavigate('Utilization')}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between hover:border-[#4056d6] transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>Monthly Resource Utilization</span>
                <span className="text-xs text-[#4056d6] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ View Full Analytics</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Target Benchmark: <strong className="text-emerald-600">80.0%</strong> • Average: <strong className="text-indigo-600">81.2%</strong>
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              2026
            </span>
          </div>

          {/* Animated Recharts 12-Month Bar Chart */}
          <div className="h-60 w-full pt-1" key={`bar-${refreshKey}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyUtilization}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#f1f5f9' }}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#f1f5f9' }}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  unit="%"
                />
                <Tooltip content={<CustomBarTooltip />} />
                <ReferenceLine
                  y={80}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Bar
                  dataKey="val"
                  fill="#4056d6"
                  radius={[5, 5, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#4056d6]" />
                <span>Monthly Actual</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 border-t border-dashed border-emerald-500" />
                <span>Target 80%</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Interactive Bar Hover Active</span>
          </div>

        </div>

        {/* Right Card: Employee Allocation Mix Animated Donut Chart (1 Col) */}
        <div
          onClick={() => onNavigate && onNavigate('Utilization')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between hover:border-[#4056d6] transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-base font-bold text-slate-900">Employee Allocation Mix</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Workforce distribution tiers</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Mix
            </span>
          </div>

          {/* Animated Recharts Donut Canvas */}
          <div className="relative h-56 w-full flex items-center justify-center" key={`donut-${refreshKey}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {allocationMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 block leading-tight">82%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Allocated</span>
            </div>
          </div>

          {/* Legend Matching Exact Prototype Specification */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs pt-3 border-t border-slate-100">
            {allocationMix.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 text-[11px] truncate font-medium">
                  {item.name} <strong className="text-slate-900">{item.value}%</strong>
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Section: Open Resource Requests (Left) & Upcoming Availability (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left: Open Resource Requests Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">

          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Open Resource Requests</h3>
            <button
              onClick={() => onNavigate && onNavigate('Resource Requests')}
              className="text-xs font-bold text-[#4056d6] hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold text-[11px]">
                  <th className="py-3 px-4">Request</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">Allocation</th>
                  <th className="py-3 px-3">Start</th>
                  <th className="py-3 px-3">End</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {openRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4056d6]">{req.id}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{req.project}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">{req.role}</td>
                    <td className="py-3.5 px-3 text-slate-600">{req.exp}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{req.allocation}</td>
                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{req.start}</td>
                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{req.end}</td>
                    <td className={`py-3.5 px-3 ${getPriorityStyle(req.priority)}`}>{req.priority}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right: Upcoming Availability Table (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">

          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Upcoming Availability</h3>
            <button
              onClick={() => onNavigate && onNavigate('Bench Resources')}
              className="text-xs font-bold text-[#4056d6] hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Next 30 days
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-2">Current</th>
                  <th className="py-3 px-3">Available From</th>
                  <th className="py-3 px-3">Skills</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingAvailability.map((emp) => (
                  <tr key={emp.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{emp.name}</td>
                    <td className="py-3.5 px-2 text-slate-600">{emp.current}</td>
                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{emp.availableFrom}</td>
                    <td className="py-3.5 px-3 text-slate-600 text-[11px] truncate max-w-[110px]">{emp.skills}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(emp.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
