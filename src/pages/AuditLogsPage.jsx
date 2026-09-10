import React, { useState } from 'react';
import {
  ShieldCheck, Filter, Download, Search, CheckCircle2, Clock,
  Calendar, Users, FileText, ArrowRight, Shield, Layers, UserCheck,
  AlertTriangle, RotateCw, Eye, ExternalLink, Terminal, Code
} from 'lucide-react';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import { useAuth } from '../context/AuthContext';

export default function AuditLogsPage() {
  const { currentUser } = useAuth();
  const [actionFilter, setActionFilter] = useState('ALL'); // 'ALL' | 'CREATE' | 'ALLOCATE' | 'APPROVE' | 'REJECT' | 'UPDATE'
  const [entityFilter, setEntityFilter] = useState('ALL'); // 'ALL' | 'Allocation' | 'Resource Request' | 'Sharing Request' | 'Employee' | 'Project'
  const [userFilter, setUserFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedLogPayload, setSelectedLogPayload] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Comprehensive Immutable Audit Trail Master Dataset
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-2026-089',
      timestamp: '2026-09-10 10:45:12',
      actor: 'Meera Nair',
      actorRole: 'HR Manager',
      action: 'APPROVE',
      entityType: 'Resource Request',
      entityId: 'RR-2026-001',
      target: 'Phoenix Digital Platform (PRJ001)',
      ipAddress: '192.168.1.104',
      details: 'Approved & allocated Sneha Shinde (EMP006) with 96.5% AI match score.',
      payload: {
        candidateId: 'EMP006',
        candidateName: 'Sneha Shinde',
        projectId: 'PRJ001',
        allocationPct: '100%',
        matchScore: '96.5%',
        role: 'Senior Frontend Developer'
      }
    },
    {
      id: 'AUD-2026-088',
      timestamp: '2026-09-10 09:30:45',
      actor: 'Anjali Rao',
      actorRole: 'Project Manager',
      action: 'ALLOCATE',
      entityType: 'Allocation',
      entityId: 'ALC-2026-042',
      target: 'Phoenix Digital Platform (PRJ001)',
      ipAddress: '192.168.1.82',
      details: 'Direct bench assignment of Priya Patil (EMP002) at 100% capacity.',
      payload: {
        employeeId: 'EMP002',
        allocation: '100%',
        project: 'PRJ001',
        startDate: '2026-09-15',
        endDate: '2026-12-31'
      }
    },
    {
      id: 'AUD-2026-087',
      timestamp: '2026-09-09 16:15:20',
      actor: 'Anjali Rao',
      actorRole: 'Project Manager',
      action: 'APPROVE',
      entityType: 'Sharing Request',
      entityId: 'RSR-002',
      target: 'Orion Analytics (PRJ003)',
      ipAddress: '192.168.1.82',
      details: 'Accepted peer sharing request for Sneha Shinde (30% bandwidth split).',
      payload: {
        requestId: 'RSR-002',
        fromProject: 'PRJ003',
        toProject: 'PRJ001',
        splitPct: '30%',
        status: 'Accepted'
      }
    },
    {
      id: 'AUD-2026-086',
      timestamp: '2026-09-09 14:02:11',
      actor: 'Meera Shah',
      actorRole: 'Project Manager',
      action: 'REJECT',
      entityType: 'Sharing Request',
      entityId: 'RSR-003',
      target: 'Nova CRM & Healthcare (PRJ004)',
      ipAddress: '192.168.1.95',
      details: 'Rejected bandwidth request for Karan Mehta due to Sprint 25 delivery commitments.',
      payload: {
        requestId: 'RSR-003',
        rejectionReason: 'Resource needed full-time for QA automation phase in Sprint 25'
      }
    },
    {
      id: 'AUD-2026-085',
      timestamp: '2026-09-08 11:20:00',
      actor: 'Sanjay Verma',
      actorRole: 'Delivery Head',
      action: 'CREATE',
      entityType: 'Resource Request',
      entityId: 'RR-2026-002',
      target: 'Atlas Commerce (PRJ002)',
      ipAddress: '192.168.1.10',
      details: 'Raised formal demand ticket for .NET/Azure Cloud Solutions Architect.',
      payload: {
        ticketId: 'RR-2026-002',
        role: '.NET/Azure Engineer',
        priority: 'Critical',
        allocation: '50%',
        experience: '5.0 yrs'
      }
    },
    {
      id: 'AUD-2026-084',
      timestamp: '2026-09-07 15:40:32',
      actor: 'System Admin',
      actorRole: 'System Admin',
      action: 'CREATE',
      entityType: 'Employee',
      entityId: 'EMP015',
      target: 'Master Workforce Directory',
      ipAddress: '192.168.1.1',
      details: 'Provisioned new employee record Ananya Roy (Backend Engineer).',
      payload: {
        empId: 'EMP015',
        name: 'Ananya Roy',
        dept: 'Engineering',
        skills: ['NODEJS', 'NESTJS', 'MYSQL']
      }
    },
    {
      id: 'AUD-2026-083',
      timestamp: '2026-09-06 10:11:05',
      actor: 'Sanjay Verma',
      actorRole: 'Delivery Head',
      action: 'UPDATE',
      entityType: 'Project Structure',
      entityId: 'STR-003',
      target: 'Phoenix Digital Platform (PRJ001)',
      ipAddress: '192.168.1.10',
      details: 'Published locked resource blueprint structure for Sprint 24.',
      payload: {
        structureId: 'STR-003',
        status: 'Published',
        headcountTotal: 7
      }
    },
    {
      id: 'AUD-2026-082',
      timestamp: '2026-09-05 09:18:22',
      actor: 'Anjali Rao',
      actorRole: 'Project Manager',
      action: 'ALLOCATE',
      entityType: 'Allocation',
      entityId: 'ALC-003',
      target: 'Atlas Commerce (PRJ002)',
      ipAddress: '192.168.1.82',
      details: 'Allocated Rahul Joshi 100% to Atlas Commerce with approved blueprint match.',
      payload: {
        employee: 'Rahul Joshi',
        allocation: '100%',
        project: 'PRJ002'
      }
    }
  ]);

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    const matchesUser = userFilter === 'ALL' || log.actor === userFilter;
    return matchesAction && matchesEntity && matchesUser;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">CREATE</span>;
      case 'ALLOCATE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">ALLOCATE</span>;
      case 'APPROVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">APPROVE</span>;
      case 'REJECT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">REJECT</span>;
      case 'UPDATE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">UPDATE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">{action}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Actor', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Target Context', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      l.action,
      `"${l.entityType}"`,
      l.entityId,
      `"${l.target}"`,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `resourcehub_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Immutable audit trail exported to CSV!');
  };

  const columns = [
    {
      key: 'id',
      label: 'Log Reference',
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#4056d6] block text-xs">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.timestamp}</span>
        </div>
      )
    },
    {
      key: 'actor',
      label: 'Actor / User',
      render: (val, row) => (
        <div>
          <strong className="text-slate-900 font-bold block text-xs">{val}</strong>
          <span className="text-[11px] text-slate-500 font-medium">{row.actorRole}</span>
        </div>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (val) => getActionBadge(val)
    },
    {
      key: 'entityType',
      label: 'Entity Type & Target',
      render: (val, row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">
            {val}: <strong className="font-mono text-[#4056d6]">{row.entityId}</strong>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">{row.target}</span>
        </div>
      )
    },
    {
      key: 'details',
      label: 'Audit Remarks & Event Description',
      render: (val, row) => (
        <div className="max-w-md">
          <p className="text-xs text-slate-700 leading-relaxed">{val}</p>
          <span className="text-[10px] text-slate-400 font-mono">Client IP: {row.ipAddress}</span>
        </div>
      )
    },
    {
      key: 'payload',
      label: 'Payload',
      render: (_, row) => (
        <button
          onClick={() => setSelectedLogPayload(row)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
          title="Inspect JSON Payload"
        >
          <Code className="w-3.5 h-3.5" />
          <span>JSON</span>
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
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Compliance &amp; Governance
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Day 18 Audit Trail Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Immutable Activity Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-proof chronological trail tracking CREATE, ALLOCATE, APPROVE, REJECT, and system operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#4056d6] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Audit Records</span>
            <strong className="text-xl font-bold text-slate-900">{auditLogs.length} Events</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Allocation Decisions</span>
            <strong className="text-xl font-bold text-emerald-700">
              {auditLogs.filter(l => l.action === 'ALLOCATE' || l.action === 'APPROVE').length} Confirmed
            </strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Security Integrity</span>
            <strong className="text-xl font-bold text-purple-700">100% Immutable</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Rejected Sharing</span>
            <strong className="text-xl font-bold text-rose-600">
              {auditLogs.filter(l => l.action === 'REJECT').length} Logged
            </strong>
          </div>
        </div>

      </div>

      {/* Multi-Filter Toolbar (Action, Entity Type, User) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">

        {/* Action Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-1">Action:</span>
          {['ALL', 'CREATE', 'ALLOCATE', 'APPROVE', 'REJECT', 'UPDATE'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${actionFilter === act
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {act}
            </button>
          ))}
        </div>

        {/* Entity Type and User Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">Entity:</span>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-[#4056d6] cursor-pointer"
            >
              <option value="ALL">All Entity Types</option>
              <option value="Allocation">Allocation</option>
              <option value="Resource Request">Resource Request</option>
              <option value="Sharing Request">Sharing Request</option>
              <option value="Employee">Employee</option>
              <option value="Project Structure">Project Structure</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">Actor:</span>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-[#4056d6] cursor-pointer"
            >
              <option value="ALL">All Users</option>
              <option value="Anjali Rao">Anjali Rao (PM)</option>
              <option value="Sanjay Verma">Sanjay Verma (DH)</option>
              <option value="Meera Nair">Meera Nair (HR)</option>
              <option value="System Admin">System Admin</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Immutable Audit Log DataTable */}
      <DataTable
        title={`Compliance Audit Trail Records (${filteredLogs.length})`}
        subtitle="Chronological system activity logs. Every action is recorded with cryptographic timestamp and actor ID."
        data={filteredLogs}
        columns={columns}
        searchPlaceholder="Search audit logs by ID, user, action, project, remarks..."
        enableExport={true}
        exportFileName="system_activity_audit_log.csv"
      />

      {/* JSON Payload Inspection Modal */}
      {selectedLogPayload && (
        <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedLogPayload.id} • {selectedLogPayload.action}
                </span>
              </div>
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>Actor: <strong>{selectedLogPayload.actor}</strong> ({selectedLogPayload.actorRole})</span>
                <span>IP: <strong>{selectedLogPayload.ipAddress}</strong></span>
              </div>
              <div className="text-slate-400">
                Timestamp: <strong>{selectedLogPayload.timestamp}</strong>
              </div>
              <div className="text-slate-300">
                Target: <strong>{selectedLogPayload.target}</strong>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">State Payload:</span>
                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 overflow-x-auto border border-slate-800 text-[11px] leading-relaxed">
                  {JSON.stringify(selectedLogPayload.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
