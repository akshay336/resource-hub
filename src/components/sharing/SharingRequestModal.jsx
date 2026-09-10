import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, X, Loader2, AlertCircle, Calendar, Clock, Percent, ShieldCheck } from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_EMPLOYEES } from '../../data/mockData';

export default function SharingRequestModal({ isOpen, initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    employeeName: 'Rahul Joshi',
    empId: 'EMP003',
    fromProjectId: 'PRJ002',
    fromProjectName: 'Atlas Commerce',
    toProjectId: 'PRJ001',
    toProjectName: 'Phoenix Digital Platform',
    requiredPct: '40%',
    otherPm: 'John Carter',
    start: '2026-10-01',
    end: '2026-12-31',
    status: 'Pending',
    notes: 'Required for Sprint 24 frontend API integration.'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: `RSR-00${Math.floor(4 + Math.random() * 90)}`,
        employeeName: initialData.name || 'Rahul Joshi',
        empId: initialData.id || 'EMP003',
        fromProjectId: initialData.sourceProjId || 'PRJ002',
        fromProjectName: initialData.sourceProjName || 'Atlas Commerce',
        toProjectId: 'PRJ001',
        toProjectName: 'Phoenix Digital Platform',
        requiredPct: initialData.availableBandwidth || '40%',
        otherPm: initialData.sourcePm || 'John Carter',
        start: '2026-10-01',
        end: '2026-12-31',
        status: 'Pending',
        notes: ''
      });
    } else {
      setFormData({
        id: `RSR-00${Math.floor(4 + Math.random() * 90)}`,
        employeeName: 'Rahul Joshi',
        empId: 'EMP003',
        fromProjectId: 'PRJ002',
        fromProjectName: 'Atlas Commerce',
        toProjectId: 'PRJ001',
        toProjectName: 'Phoenix Digital Platform',
        requiredPct: '40%',
        otherPm: 'John Carter',
        start: '2026-10-01',
        end: '2026-12-31',
        status: 'Pending',
        notes: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.requiredPct) {
      setError('Please provide candidate name and requested bandwidth.');
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
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4056d6] flex items-center justify-center font-bold">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Raise Cross-Project Sharing Request</h3>
              <span className="text-[11px] text-slate-400">Path B: Peer-to-Peer PM Bandwidth Negotiation</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Partial Allocation Detection Banner */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                Detected Partial Bandwidth Available
              </span>
              <p className="text-xs text-slate-700">
                <strong>{formData.employeeName}</strong> is partially allocated on <strong>{formData.fromProjectName}</strong>.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-[#4056d6] font-mono font-bold text-xs">
              {formData.requiredPct} Free
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Candidate */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Requested Team Member
              </label>
              <input
                type="text"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] font-semibold"
                required
              />
            </div>

            {/* Required Bandwidth */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Requested Capacity %
              </label>
              <select
                value={formData.requiredPct}
                onChange={(e) => setFormData({ ...formData, requiredPct: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer font-bold text-[#4056d6]"
              >
                <option value="50%">50% (Half Time)</option>
                <option value="40%">40% (2 Days/Week)</option>
                <option value="30%">30% (Partial)</option>
                <option value="25%">25% (Quarter Time)</option>
              </select>
            </div>

            {/* Source Project */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Current Source Project
              </label>
              <input
                type="text"
                value={formData.fromProjectName}
                onChange={(e) => setFormData({ ...formData, fromProjectName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Target Peer PM */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Peer Project Manager
              </label>
              <input
                type="text"
                value={formData.otherPm}
                onChange={(e) => setFormData({ ...formData, otherPm: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sharing Start Date
              </label>
              <input
                type="date"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sharing End Date
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

          {/* Justification Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deliverable Scope &amp; Peer Note
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Need assistance with frontend Redux store architecture for Sprint 24..."
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
              <span>Submit Sharing Request</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
