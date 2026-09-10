import React, { useState, useEffect } from 'react';
import { FolderKanban, X, Loader2, AlertCircle } from 'lucide-react';
import { INITIAL_CLIENTS, INITIAL_EMPLOYEES } from '../../data/mockData';

export default function ProjectModal({ isOpen, project, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    client: 'Acme Technologies',
    pm: 'Anjali Rao',
    start: '2026-01-01',
    end: '2026-12-31',
    status: 'Active',
    priority: 'High'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract PM options from employees
  const pmOptions = INITIAL_EMPLOYEES.filter(e => /Manager|Lead|Delivery/i.test(e.designation));

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    } else {
      setFormData({
        id: `PRJ00${Math.floor(5 + Math.random() * 90)}`,
        name: '',
        client: INITIAL_CLIENTS[0]?.name || 'Acme Technologies',
        pm: 'Anjali Rao',
        start: '2026-09-01',
        end: '2027-03-31',
        status: 'Planned',
        priority: 'Medium'
      });
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a Project Name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {project ? 'Edit Project Master Record' : 'Create New Enterprise Project'}
              </h3>
              <span className="text-[11px] text-slate-400">Project Delivery Master</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Project ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Code / ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] font-mono uppercase"
                required
              />
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Title / Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Phoenix Digital Platform"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Client Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enterprise Client
              </label>
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                {INITIAL_CLIENTS.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.country})</option>
                ))}
              </select>
            </div>

            {/* Assigned PM */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Project Manager (PM)
              </label>
              <select
                value={formData.pm}
                onChange={(e) => setFormData({ ...formData, pm: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                {pmOptions.map(pm => (
                  <option key={pm.id} value={pm.name}>{pm.name} ({pm.designation})</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target End Date
              </label>
              <input
                type="date"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Delivery Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Planned">Planned</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#4056d6] hover:bg-[#3245b5] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                project ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
