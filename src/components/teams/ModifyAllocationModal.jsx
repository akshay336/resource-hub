import React, { useState, useEffect } from 'react';
import { UsersRound, X, Loader2, AlertCircle, Calendar, Clock, Percent } from 'lucide-react';

export default function ModifyAllocationModal({ isOpen, allocation, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    empId: '',
    empName: '',
    projectId: '',
    projectName: '',
    role: 'Software Engineer',
    allocation: '100%',
    start: '2026-01-01',
    end: '2026-12-31',
    status: 'Active',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (allocation) {
      setFormData({
        ...allocation,
        role: allocation.role || 'Software Engineer',
        notes: allocation.notes || ''
      });
    }
    setError('');
  }, [allocation, isOpen]);

  if (!isOpen || !allocation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.start || !formData.end) {
      setError('Please select valid start and roll-off dates.');
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <UsersRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Modify Allocation &amp; Roll-off Duration
              </h3>
              <span className="text-[11px] text-slate-400">
                Team Member: <strong>{formData.empName}</strong> ({formData.empId})
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Member Info Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {formData.empName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <strong className="text-slate-900 text-xs block">{formData.empName}</strong>
                <span className="text-[11px] text-slate-500 font-medium">Assigned to: {formData.projectName || formData.projectId}</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#4056d6] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {formData.empId}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Allocation Bandwidth % */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Committed Bandwidth %
              </label>
              <select
                value={formData.allocation}
                onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer font-bold"
              >
                <option value="100%">100% Dedicated Full-Time</option>
                <option value="75%">75% Dedicated</option>
                <option value="50%">50% Half-Time Bandwidth</option>
                <option value="40%">40% Partial Bandwidth</option>
                <option value="25%">25% Advisory / Support</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Allocation Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="Active">Active (On Project)</option>
                <option value="Planned">Planned (Future Start)</option>
                <option value="Offboarding">Offboarding Soon</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assignment Start Date
              </label>
              <input
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Roll-off Date */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Planned Roll-off Date
              </label>
              <input
                type="date"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

          </div>

          {/* Allocation Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Extension / Modification Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Extended for Sprint 26 release milestone; bandwidth split with PRJ002..."
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 font-bold text-white bg-[#4056d6] hover:bg-[#3446b8] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
