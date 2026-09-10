import React, { useState } from 'react';
import { UsersRound, CheckCircle2, Calendar, FolderKanban } from 'lucide-react';
import { INITIAL_ALLOCATIONS, INITIAL_PROJECTS } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';

export default function ProjectTeamsPage() {
  const [allocations, setAllocations] = useState(INITIAL_ALLOCATIONS);
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredAllocations = selectedProject === 'ALL'
    ? allocations
    : allocations.filter(a => a.projectId === selectedProject);

  const columns = [
    { key: 'empId', label: 'Employee ID', render: (val) => (
      <span className="font-mono font-bold text-[#4056d6]">{val}</span>
    )},
    { key: 'empName', label: 'Allocated Team Member', render: (val) => (
      <strong className="text-slate-900 font-bold block">{val}</strong>
    )},
    { key: 'projectId', label: 'Project ID', render: (val) => (
      <span className="font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
        {val}
      </span>
    )},
    { key: 'projectName', label: 'Project Title', render: (val) => <span className="font-medium text-slate-800">{val}</span> },
    { key: 'allocation', label: 'Committed Allocation %', render: (val) => (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
        val === '100%' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
      }`}>
        {val} Allocation
      </span>
    )},
    { key: 'start', label: 'Start Date' },
    { key: 'end', label: 'Roll-off Date' },
    { key: 'status', label: 'Status', isStatus: true }
  ];

  const handleDelete = (row) => {
    if (window.confirm(`Release ${row.empName} from ${row.projectName}?`)) {
      setAllocations(allocations.filter(a => a.id !== row.id));
      showToast(`Released ${row.empName} from ${row.projectName}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main DataTable */}
      <DataTable
        title="Project Team Membership & Allocation Roster"
        subtitle="Current active staffing assignments, committed allocation percentages, and scheduled roll-off dates."
        columns={columns}
        data={filteredAllocations}
        searchPlaceholder="Search team allocations by employee or project..."
        onDelete={handleDelete}
        filterComponent={
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedProject('ALL')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedProject === 'ALL' ? 'bg-[#4056d6] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ALL
            </button>
            {INITIAL_PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedProject === p.id ? 'bg-[#4056d6] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.id}
              </button>
            ))}
          </div>
        }
      />

    </div>
  );
}
