import React, { useState, useEffect } from 'react';
import { FileText, X, Loader2, AlertCircle, Plus, Calendar, Clock, Award } from 'lucide-react';
import { INITIAL_PROJECTS } from '../../data/mockData';

export default function ResourceRequestModal({ isOpen, initialData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    projectId: 'PRJ001',
    projectName: 'Phoenix Digital Platform',
    role: 'Senior Angular Developer',
    experience: '4.0 yrs',
    allocation: '100%',
    start: '2026-10-01',
    end: '2026-12-31',
    priority: 'High',
    skills: 'Angular, TypeScript, REST API',
    notes: '',
    status: 'Requested'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const randomNum = Math.floor(5 + Math.random() * 95);
      setFormData({
        id: `RR-2026-0${randomNum < 10 ? '0' + randomNum : randomNum}`,
        projectId: 'PRJ001',
        projectName: 'Phoenix Digital Platform',
        role: 'Senior Frontend Developer',
        experience: '4.0 yrs',
        allocation: '100%',
        start: '2026-10-01',
        end: '2026-12-31',
        priority: 'High',
        skills: 'React, TypeScript, Redux',
        notes: '',
        status: 'Requested'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleProjectChange = (e) => {
    const pId = e.target.value;
    const proj = INITIAL_PROJECTS.find(p => p.id === pId);
    setFormData({
      ...formData,
      projectId: pId,
      projectName: proj ? proj.name : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role || !formData.projectId) {
      setError('Please fill in all mandatory fields.');
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
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4056d6] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {initialData ? 'Edit Resource Request Ticket' : 'Raise Formal Resource Demand'}
              </h3>
              <span className="text-[11px] text-slate-400">
                Directly alerts HR Talent Acquisition &amp; PMO Delivery Operations
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Project */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={handleProjectChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
                required
              >
                {INITIAL_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                ))}
              </select>
            </div>

            {/* Role Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Role / Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Angular Developer"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min. Experience Required
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="2.0 yrs">2.0+ Years (Junior / Mid)</option>
                <option value="3.0 yrs">3.0+ Years (Mid Engineer)</option>
                <option value="4.0 yrs">4.0+ Years (Senior Engineer)</option>
                <option value="5.0 yrs">5.0+ Years (Staff / Specialist)</option>
                <option value="7.0 yrs">7.0+ Years (Lead / Architect)</option>
              </select>
            </div>

            {/* Allocation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Allocation %
              </label>
              <select
                value={formData.allocation}
                onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="100%">100% Full-Time Dedicated</option>
                <option value="50%">50% Half-Time Bandwidth</option>
                <option value="25%">25% Advisory / Support</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Start Date
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
                Expected End Date
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
                Fulfillment Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer font-bold"
              >
                <option value="Critical">🔴 Critical (Immediate / Escalated)</option>
                <option value="High">🟠 High (Next Sprint)</option>
                <option value="Medium">🔵 Medium (Standard Queue)</option>
                <option value="Low">⚪ Low (Pipeline / Planned)</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workflow Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] cursor-pointer"
              >
                <option value="Requested">Requested (New Ticket)</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Approved">Approved</option>
                <option value="Fulfilled">Fulfilled</option>
              </select>
            </div>

          </div>

          {/* Primary Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills &amp; Tech Stack (Tags)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. React, Node.js, AWS, Kubernetes"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6]"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              HR match engine uses these tags to calculate talent match percentages.
            </span>
          </div>

          {/* Business Justification */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Justification &amp; Client Delivery Scope
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Provide context on sprint deliverables, client timeline pressure, or key feature requirements..."
              rows={2}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
              className="px-5 py-2 text-xs font-bold text-white bg-[#4056d6] hover:bg-[#3446b8] rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{initialData ? 'Update Ticket' : 'Submit Formal Request'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
