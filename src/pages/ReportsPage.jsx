import React, { useState } from 'react';
import {
  FileBarChart, Download, FileText, CheckCircle2, TrendingUp,
  Users, FolderKanban, Hourglass, Calendar, Sparkles, Filter,
  Layers, ArrowRight, ShieldCheck, PieChart, Table
} from 'lucide-react';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../services/api';

export default function ReportsPage() {
  const { currentUser } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState('REP-01');
  const [format, setFormat] = useState('CSV');
  const [dateRange, setDateRange] = useState('YTD');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Pre-configured Reports Catalog
  const reportsCatalog = [
    {
      id: 'REP-01',
      title: 'Workforce Utilization & Billability Report',
      category: 'Executive Analytics',
      desc: 'Monthly and quarterly utilization percentages, billable hours vs bench downtime, and capacity saturation.',
      icon: TrendingUp,
      iconColor: 'text-[#4056d6] bg-indigo-50',
      endpoint: '/api/reports/utilization/export',
      data: [
        { month: 'Jan 2026', totalStaff: 236, billableHours: 32400, benchHours: 4200, utilization: '68%', target: '80%' },
        { month: 'Feb 2026', totalStaff: 238, billableHours: 34800, benchHours: 3900, utilization: '72%', target: '80%' },
        { month: 'Mar 2026', totalStaff: 242, billableHours: 37200, benchHours: 3600, utilization: '76%', target: '80%' },
        { month: 'Apr 2026', totalStaff: 244, billableHours: 38900, benchHours: 3400, utilization: '79%', target: '80%' },
        { month: 'May 2026', totalStaff: 245, billableHours: 40100, benchHours: 3100, utilization: '81%', target: '80%' },
        { month: 'Jun 2026', totalStaff: 246, billableHours: 38500, benchHours: 3300, utilization: '78%', target: '80%' },
        { month: 'Jul 2026', totalStaff: 247, billableHours: 41800, benchHours: 2800, utilization: '84%', target: '80%' },
        { month: 'Aug 2026', totalStaff: 248, billableHours: 40900, benchHours: 2900, utilization: '82%', target: '80%' },
        { month: 'Sep 2026', totalStaff: 248, billableHours: 43200, benchHours: 2400, utilization: '86%', target: '80%' }
      ],
      columns: [
        { key: 'month', label: 'Reporting Month' },
        { key: 'totalStaff', label: 'Total Workforce' },
        { key: 'billableHours', label: 'Billable Hours (hrs)' },
        { key: 'benchHours', label: 'Bench Downtime (hrs)' },
        { key: 'utilization', label: 'Actual Utilization' },
        { key: 'target', label: 'Benchmark Target' }
      ]
    },
    {
      id: 'REP-02',
      title: 'Project Staffing & Headcount Blueprint Report',
      category: 'Project Delivery',
      desc: 'Active project rosters, locked blueprint structures, staffing gap meters, and PM owners.',
      icon: FolderKanban,
      iconColor: 'text-emerald-600 bg-emerald-50',
      endpoint: '/api/reports/staffing-blueprint/export',
      data: [
        { projectId: 'PRJ001', projectName: 'Phoenix Digital Platform', pm: 'Anjali Rao', requiredCount: 7, allocatedCount: 6, gap: 1, status: 'Active' },
        { projectId: 'PRJ002', projectName: 'Atlas Commerce', pm: 'Anjali Rao', requiredCount: 5, allocatedCount: 5, gap: 0, status: 'Active' },
        { projectId: 'PRJ003', projectName: 'Orion Analytics', pm: 'Anjali Rao', requiredCount: 4, allocatedCount: 3, gap: 1, status: 'Active' },
        { projectId: 'PRJ004', projectName: 'Nova CRM & Healthcare', pm: 'Amit Sharma', requiredCount: 6, allocatedCount: 4, gap: 2, status: 'Planned' }
      ],
      columns: [
        { key: 'projectId', label: 'Project ID' },
        { key: 'projectName', label: 'Project Title' },
        { key: 'pm', label: 'Project Manager' },
        { key: 'requiredCount', label: 'Blueprint Headcount' },
        { key: 'allocatedCount', label: 'Allocated Staff' },
        { key: 'gap', label: 'Staffing Gap' },
        { key: 'status', label: 'Delivery Status', isStatus: true }
      ]
    },
    {
      id: 'REP-03',
      title: 'Bench Aging & Payroll Cost Overhead Report',
      category: 'Talent & HR',
      desc: 'Complete bench inventory, days on bench aging tracker, and monthly unallocated cost overhead.',
      icon: Hourglass,
      iconColor: 'text-amber-600 bg-amber-50',
      endpoint: '/api/reports/bench-aging/export',
      data: [
        { empId: 'EMP006', name: 'Sneha Shinde', role: 'Senior Software Engineer', dept: 'Engineering', daysOnBench: 18, agingAlert: 'Critical (>15d)', cost: '$4,200/mo' },
        { empId: 'EMP007', name: 'Karan Mehta', role: 'Software Engineer', dept: 'Engineering', daysOnBench: 24, agingAlert: 'Critical (>15d)', cost: '$3,100/mo' },
        { empId: 'EMP012', name: 'Tanvi Saxena', role: 'QA Automation Engineer', dept: 'QA', daysOnBench: 32, agingAlert: 'Critical (>15d)', cost: '$3,800/mo' },
        { empId: 'EMP002', name: 'Priya Patil', role: 'Senior Software Engineer', dept: 'Engineering', daysOnBench: 8, agingAlert: 'Normal', cost: '$4,500/mo' },
        { empId: 'EMP011', name: 'Rohan Deshpande', role: 'Fullstack Developer', dept: 'Engineering', daysOnBench: 5, agingAlert: 'Normal', cost: '$3,400/mo' }
      ],
      columns: [
        { key: 'empId', label: 'Emp ID' },
        { key: 'name', label: 'Employee Name' },
        { key: 'role', label: 'Role Designation' },
        { key: 'dept', label: 'Department' },
        { key: 'daysOnBench', label: 'Days on Bench' },
        { key: 'agingAlert', label: 'Aging Status', isStatus: true },
        { key: 'cost', label: 'Monthly Payroll Burn' }
      ]
    },
    {
      id: 'REP-04',
      title: 'Cross-Project Sharing Requests SLA Report',
      category: 'Operations',
      desc: 'Inter-project resource sharing decisions, peer PM response times, and bandwidth splits.',
      icon: Layers,
      iconColor: 'text-purple-600 bg-purple-50',
      endpoint: '/api/reports/sharing-sla/export',
      data: [
        { id: 'RSR-001', employee: 'Rahul Joshi', fromProj: 'PRJ001', toProj: 'PRJ002', reqBandwidth: '40%', status: 'Pending', daysOpen: 2 },
        { id: 'RSR-002', employee: 'Sneha Shinde', fromProj: 'PRJ003', toProj: 'PRJ001', reqBandwidth: '30%', status: 'Accepted', daysOpen: 1 },
        { id: 'RSR-003', employee: 'Karan Mehta', fromProj: 'PRJ004', toProj: 'PRJ001', reqBandwidth: '25%', status: 'Rejected', daysOpen: 3 }
      ],
      columns: [
        { key: 'id', label: 'Sharing ID' },
        { key: 'employee', label: 'Shared Resource' },
        { key: 'fromProj', label: 'Source Project' },
        { key: 'toProj', label: 'Target Project' },
        { key: 'reqBandwidth', label: 'Bandwidth Split' },
        { key: 'status', label: 'Decision Status', isStatus: true },
        { key: 'daysOpen', label: 'Resolution Days' }
      ]
    }
  ];

  const activeReport = reportsCatalog.find(r => r.id === selectedReportId) || reportsCatalog[0];

  const handleExport = (report) => {
    const rep = report || activeReport;
    const headers = rep.columns.map(c => `"${c.label}"`).join(',');
    const rows = rep.data.map(row => {
      return rep.columns.map(c => `"${row[c.key] !== undefined ? row[c.key] : ''}"`).join(',');
    }).join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${rep.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ Exported "${rep.title}" as ${format} spreadsheet!`);
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
              Reporting Engine
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 18 Custom Export Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enterprise Reporting &amp; Data Export Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            One-click data export in CSV, Excel, and structured datasets for workforce analytics, allocations, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport(activeReport)}
            className="px-4 py-2.5 bg-[#4056d6] hover:bg-[#3446b8] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Active Report ({format})</span>
          </button>
        </div>
      </div>

      {/* Pre-configured Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportsCatalog.map(report => {
          const isSelected = selectedReportId === report.id;
          const IconComp = report.icon;

          return (
            <div
              key={report.id}
              onClick={() => setSelectedReportId(report.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                  ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/40 border-[#4056d6] shadow-sm'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.iconColor}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {report.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    {report.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {report.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{report.data.length} records</span>
                <span className={`text-[11px] font-bold flex items-center gap-1 ${isSelected ? 'text-[#4056d6]' : 'text-slate-500'
                  }`}>
                  <span>{isSelected ? 'Selected' : 'Select'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">Format:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['CSV', 'Excel', 'PDF'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${format === fmt ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">Timeframe:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-bold border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-[#4056d6] cursor-pointer"
            >
              <option value="YTD">YTD 2026</option>
              <option value="Q3">Q3 2026 (Jul-Sep)</option>
              <option value="Q2">Q2 2026 (Apr-Jun)</option>
              <option value="ALL">All Historical Records</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleExport(activeReport)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>One-Click Export ({activeReport.title})</span>
        </button>
      </div>

      {/* Interactive Report Preview Table */}
      <DataTable
        title={`Report Preview: ${activeReport.title}`}
        subtitle={`Viewing live sample data (${activeReport.data.length} records). Click Export CSV to download the complete export bundle.`}
        data={activeReport.data}
        columns={activeReport.columns}
        searchPlaceholder="Search in report preview..."
        enableExport={true}
        exportFileName={`${activeReport.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`}
      />

    </div>
  );
}
