import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ReferenceLine
} from 'recharts';
import {
  TrendingUp, Users, FolderKanban, Hourglass, PieChart as PieChartIcon,
  Download, Filter, RotateCw, CheckCircle2, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Sparkles, Building2, Calendar, Layers, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/DataTable';

export default function UtilizationPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState('2026');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast('Refreshing executive utilization data & forecast models...');
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey(prev => prev + 1);
      showToast('✓ Utilization metrics updated successfully!');
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['Month', 'Total Utilization (%)', 'Billable (%)', 'Non-Billable (%)', 'Target (%)'];
    const rows = monthlyUtilizationData.map(d => [d.month, d.utilization, d.billable, d.nonBillable, d.target]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `resourcehub_utilization_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Utilization dataset exported as CSV!');
  };

  // 12-Month Utilization Trend Data (Recharts format)
  const monthlyUtilizationData = [
    { month: 'Jan', utilization: 68, billable: 58, nonBillable: 10, target: 80 },
    { month: 'Feb', utilization: 72, billable: 62, nonBillable: 10, target: 80 },
    { month: 'Mar', utilization: 76, billable: 65, nonBillable: 11, target: 80 },
    { month: 'Apr', utilization: 79, billable: 68, nonBillable: 11, target: 80 },
    { month: 'May', utilization: 81, billable: 71, nonBillable: 10, target: 80 },
    { month: 'Jun', utilization: 78, billable: 67, nonBillable: 11, target: 80 },
    { month: 'Jul', utilization: 84, billable: 73, nonBillable: 11, target: 80 },
    { month: 'Aug', utilization: 82, billable: 72, nonBillable: 10, target: 80 },
    { month: 'Sep', utilization: 86, billable: 76, nonBillable: 10, target: 80 },
    { month: 'Oct', utilization: 88, billable: 78, nonBillable: 10, target: 80 },
    { month: 'Nov', utilization: 85, billable: 75, nonBillable: 10, target: 80 },
    { month: 'Dec', utilization: 90, billable: 80, nonBillable: 10, target: 80 }
  ];

  // Allocation Mix Donut Data (Recharts format)
  const allocationMixData = [
    { name: '100% Allocated', value: 58, count: 144, color: '#3b82f6' },
    { name: '50–99% Allocated', value: 20, count: 50, color: '#10b981' },
    { name: '1–49% Allocated', value: 13, count: 32, color: '#f59e0b' },
    { name: 'Bench', value: 9, count: 22, color: '#ef4444' }
  ];

  // Department Breakdown
  const departmentBreakdown = [
    { dept: 'Engineering & Architecture', headCount: 142, billablePct: 86, avgUtil: 88, benchCount: 8, status: 'Optimal' },
    { dept: 'Quality Assurance & Testing', headCount: 48, billablePct: 81, avgUtil: 84, benchCount: 4, status: 'Optimal' },
    { dept: 'Cloud, DevOps & Infra', headCount: 32, billablePct: 91, avgUtil: 92, benchCount: 2, status: 'High Demand' },
    { dept: 'PMO & Delivery Management', headCount: 18, billablePct: 94, avgUtil: 95, benchCount: 1, status: 'High Demand' },
    { dept: 'Data, AI & Analytics', headCount: 8, billablePct: 75, avgUtil: 78, benchCount: 4, status: 'Under-utilized' }
  ];

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[160px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1">
            <strong className="text-indigo-300 font-bold">{label} 2026</strong>
            <span className="text-[10px] text-slate-400">Target: 80%</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Total Utilization:</span>
            <strong className="text-white font-mono font-bold text-sm">{data.utilization}%</strong>
          </div>
          <div className="flex items-center justify-between text-emerald-400 text-[11px]">
            <span>• Billable Work:</span>
            <span className="font-mono font-semibold">{data.billable}%</span>
          </div>
          <div className="flex items-center justify-between text-amber-400 text-[11px]">
            <span>• Internal / Enablement:</span>
            <span className="font-mono font-semibold">{data.nonBillable}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Donut Chart
  const CustomDonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
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
              Executive Analytics
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 16 Utilization Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Workforce Utilization &amp; Productivity Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive tracking of organizational allocation efficiency, 12-month utilization trends, and bench mix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* 4 High-Level KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Workforce */}
        <div
          onClick={() => onNavigate && onNavigate('Employees')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4056d6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">248</strong>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12 this quarter (92.4% Active)</span>
          </div>
        </div>

        {/* Active Projects */}
        <div
          onClick={() => onNavigate && onNavigate(currentUser.role === 'Project Manager' ? 'My Projects' : 'Projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">37</strong>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+5 this month (100% on track)</span>
          </div>
        </div>

        {/* Avg Utilization */}
        <div
          onClick={() => onNavigate && onNavigate('Resource Dashboard')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Avg. Utilization</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">82.4%</strong>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2 pts vs 80% Target</span>
          </div>
        </div>

        {/* Bench Workforce */}
        <div
          onClick={() => onNavigate && onNavigate('Bench Resources')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#4056d6] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Bench Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">19</strong>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mt-1">
            <span>7 available now (9% total pool)</span>
          </div>
        </div>

      </div>

      {/* Main Charts Section: 12-Month Utilization Bar Chart (2 Cols) & Employee Allocation Mix Donut (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Recharts Interactive Monthly Utilization Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Resource Utilization Trend (2026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target benchmark: <strong className="text-emerald-600">80.0%</strong> • Peak utilization: <strong className="text-indigo-600">90.0% (Dec)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Above Target</span>
              </span>
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          <div className="h-72 w-full pt-2" key={`util-bar-${refreshKey}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyUtilizationData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%"
                />
                <Tooltip content={<CustomBarTooltip />} />
                <ReferenceLine
                  y={80}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{ value: 'Target: 80%', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }}
                />
                <Bar
                  dataKey="utilization"
                  fill="#4056d6"
                  radius={[6, 6, 0, 0]}
                  name="Utilization Rate"
                  isAnimationActive={true}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Bar Legend */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#4056d6]" />
                <span className="font-semibold text-slate-700">Actual Monthly Utilization</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 border-t-2 border-dashed border-emerald-500" />
                <span className="font-semibold text-slate-700">Organizational Benchmark (80%)</span>
              </span>
            </div>
            <span className="font-mono text-slate-400 font-bold">12-Month Average: 81.2%</span>
          </div>

        </div>

        {/* Right: Recharts Interactive Employee Allocation Mix Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between">

          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Employee Allocation Mix</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution across workforce tiers</p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Live</span>
          </div>

          {/* Recharts Pie / Donut Chart */}
          <div className="relative h-60 w-full flex items-center justify-center" key={`util-pie-${refreshKey}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {allocationMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label Overlay */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 block">82%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Allocated</span>
            </div>
          </div>

          {/* 4-Tier Legend Matching Prototype */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2.5 text-xs pt-3 border-t border-slate-100">
            {allocationMixData.map(item => (
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

      {/* Department Breakdown Table & Productivity Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Departmental Utilization &amp; Headcount Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Efficiency metrics across core practice divisions and specialized engineering guilds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Division:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-bold border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#4056d6] cursor-pointer"
            >
              <option value="ALL">All Practice Areas</option>
              <option value="ENG">Engineering</option>
              <option value="QA">Quality Assurance</option>
              <option value="CLOUD">Cloud &amp; DevOps</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 font-semibold text-[11px]">
                <th className="py-3.5 px-6">Department Practice</th>
                <th className="py-3.5 px-4 text-center">Total Staff</th>
                <th className="py-3.5 px-4 text-center">Billable %</th>
                <th className="py-3.5 px-6">Current Avg Utilization</th>
                <th className="py-3.5 px-4 text-center">Bench Count</th>
                <th className="py-3.5 px-6 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentBreakdown.map((row) => (
                <tr key={row.dept} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{row.dept}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-semibold text-slate-700">
                    {row.headCount}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-emerald-700">
                    {row.billablePct}%
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.avgUtil >= 90 ? 'bg-indigo-600' : row.avgUtil >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          style={{ width: `${row.avgUtil}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs">{row.avgUtil}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold ${row.benchCount > 5 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {row.benchCount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${row.status === 'High Demand'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : row.status === 'Optimal'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
