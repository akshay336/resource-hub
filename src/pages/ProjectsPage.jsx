import React, { useState } from 'react';
import { FolderKanban, CheckCircle2, Calendar, Shield, ArrowRight, Grid3X3, Eye, Plus } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectDrawer from '../components/projects/ProjectDrawer';

export default function ProjectsPage({ onNavigateToStructure, onNavigateToAddResource }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [editingProject, setEditingProject] = useState(null);
  const [inspectingProject, setInspectingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredProjects = selectedPriority === 'ALL'
    ? projects
    : projects.filter(p => p.priority.toUpperCase() === selectedPriority.toUpperCase());

  const handleInspect = (project) => {
    setInspectingProject(project);
    setIsDrawerOpen(true);
  };

  const columns = [
    { key: 'id', label: 'Project ID', render: (val, row) => (
      <button
        onClick={() => handleInspect(row)}
        className="font-mono font-bold text-[#4056d6] hover:underline cursor-pointer text-left"
      >
        {val}
      </button>
    )},
    { key: 'name', label: 'Project Title', render: (val, row) => (
      <div 
        onClick={() => handleInspect(row)}
        className="cursor-pointer group"
      >
        <strong className="text-slate-900 font-bold block group-hover:text-[#4056d6] transition-colors">{val}</strong>
        <span className="text-[11px] text-slate-500">Client: {row.client}</span>
      </div>
    )},
    { key: 'pm', label: 'Assigned PM', render: (val) => (
      <div className="flex items-center gap-1.5">
        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
          {val.split(' ').map(n => n[0]).join('')}
        </span>
        <span className="font-medium text-slate-800">{val}</span>
      </div>
    )},
    { key: 'start', label: 'Start Date' },
    { key: 'end', label: 'End Date' },
    { key: 'priority', label: 'Priority', isStatus: true },
    { key: 'status', label: 'Status', isStatus: true },
    { key: 'actions', label: 'Inspect & Blueprint', render: (_, row) => (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handleInspect(row)}
          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
          title="Open Project Details Drawer"
        >
          <Eye className="w-3 h-3 text-slate-500" />
          <span>Details</span>
        </button>
        <button
          onClick={() => onNavigateToStructure ? onNavigateToStructure(row.id) : null}
          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] font-semibold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
          title="View Staffing Blueprint"
        >
          <Grid3X3 className="w-3 h-3" />
          <span>Blueprint</span>
        </button>
      </div>
    )}
  ];

  const handleSave = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
      showToast(`Updated project ${projectData.name}`);
    } else {
      setProjects([projectData, ...projects]);
      showToast(`Created new project ${projectData.name}`);
    }
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to deactivate project ${row.name}?`)) {
      setProjects(projects.filter(p => p.id !== row.id));
      showToast(`Deactivated project ${row.id}`);
    }
  };

  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Active Projects</span>
          <strong className="text-xl font-bold text-slate-900">37 Portfolios</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">High / Critical Priority</span>
          <strong className="text-xl font-bold text-rose-600">19 Projects</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Avg Project Duration</span>
          <strong className="text-xl font-bold text-[#4056d6]">9.2 Months</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Delivery Health</span>
          <strong className="text-xl font-bold text-emerald-600">94% On Track</strong>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Project Lifecycle & Delivery Planning"
        subtitle="Master directory of client deliveries, project timelines, assigned managers, and delivery priority."
        columns={columns}
        data={filteredProjects}
        searchPlaceholder="Search projects by ID, title, client, PM..."
        addButtonLabel="+ Create Project"
        onAdd={() => { setEditingProject(null); setIsModalOpen(true); }}
        onEdit={(row) => { setEditingProject(row); setIsModalOpen(true); }}
        onDelete={handleDelete}
        filterComponent={
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {priorities.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedPriority === p ? 'bg-[#4056d6] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      {/* Add / Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        project={editingProject}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      {/* Project Details & Metadata Drawer */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        project={inspectingProject}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateToStructure={onNavigateToStructure}
        onNavigateToAddResource={onNavigateToAddResource}
      />

    </div>
  );
}
