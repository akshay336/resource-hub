import React, { useState, useEffect } from 'react';
import { Grid3X3, X, Loader2, AlertCircle } from 'lucide-react';
import { INITIAL_PROJECTS } from '../../data/mockData';

export default function ProjectStructureModal({ isOpen, structure, selectedProjectId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    projectId: selectedProjectId || 'PRJ001',
    projectName: '',
    role: 'Frontend Developer',
    requiredCount: 2,
    allocatedCount: 0,
    allocationPct: '100%'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (structure) {
      setFormData({ ...structure });
    } else {
      const proj = INITIAL_PROJECTS.find(p => p.id === (selectedProjectId || 'PRJ001'));
      setFormData({
        id: `STR-0${Math.floor(10 + Math.random() * 90)}`,
        projectId: selectedProjectId || 'PRJ001',
        projectName: proj?.name || 'Phoenix Digital Platform',
        role: 'Frontend Developer',
        requiredCount: 2,
        allocatedCount: 0,
        allocationPct: '100%'
      });
    }
    setError('');
  }, [structure, selectedProjectId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.requiredCount <= 0) {
      setError('Required headcount must be at least 1.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const proj = INITIAL_PROJECTS.find(p => p.id === formData.projectId);
      onSave({
        ...formData,
        projectName: proj?.name || formData.projectName
      });
      setLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4056d6] flex items-center justify-center font-bold">
              <Grid3X3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {structure ? 'Edit Resource Structure' : 'Add Required Role to Project Blueprint'}
              </h3>
              <span className="text-[11px] text-slate-400">Staffing Blueprint Configuration</span>
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

          {/* Project Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Project
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
            >
              {INITIAL_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Role Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Role / Skill
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="Project Manager">Project Manager</option>
                <option value="Technical Lead">Technical Lead</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Technical Architect">Technical Architect</option>
              </select>
            </div>

            {/* Required Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Headcount (Seats)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.requiredCount}
                onChange={(e) => setFormData({ ...formData, requiredCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Target Allocation % */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Allocation % per Member
              </label>
              <select
                value={formData.allocationPct}
                onChange={(e) => setFormData({ ...formData, allocationPct: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="100%">100% (Full-Time Dedicated)</option>
                <option value="75%">75% (Majority Allocation)</option>
                <option value="50%">50% (Part-Time Half)</option>
                <option value="25%">25% (Advisory / Support)</option>
              </select>
            </div>

            {/* Currently Allocated (Editable only on update) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currently Allocated Count
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.allocatedCount}
                onChange={(e) => setFormData({ ...formData, allocatedCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
              />
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
                  Saving Blueprint...
                </>
              ) : (
                structure ? 'Update Structure' : 'Add to Blueprint'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
