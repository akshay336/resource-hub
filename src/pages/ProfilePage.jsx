import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, Calendar, 
  ShieldCheck, Key, Edit3, CheckCircle2, Lock, Sparkles, Layers,
  CheckCircle, FolderKanban, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

export default function ProfilePage() {
  const { currentUser } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
          <div className={`w-20 h-20 rounded-2xl ${currentUser.avatarBg} text-white font-bold text-2xl flex items-center justify-center shadow-md`}>
            {currentUser.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4056d6] font-bold text-xs">
                {currentUser.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Employee
              </span>
            </div>
            
            <p className="text-sm font-medium text-slate-600 mt-1">
              {currentUser.designation} • <span className="text-slate-500">{currentUser.department}</span>
            </p>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentUser.location || 'Pune, India'}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {currentUser.joinedDate || 'Jan 2022'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto z-10">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex-1 md:flex-initial px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex-1 md:flex-initial px-4 py-2 bg-[#4056d6] hover:bg-[#3245b5] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
        </div>

      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Organization & Security */}
        <div className="space-y-6">
          
          {/* Corporate Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-[#4056d6]" />
              <span>Corporate Information</span>
            </h3>

            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Employee ID</span>
                <strong className="text-slate-800 font-mono">{currentUser.id}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Business Unit</span>
                <strong className="text-slate-800">Enterprise Digital Engineering</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Reporting Head</span>
                <strong className="text-slate-800">Sanjay Verma (VP Delivery)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Work Phone</span>
                <strong className="text-slate-800">{currentUser.phone || '+91 98200 12345'}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Employment Type</span>
                <strong className="text-slate-800">Full-Time Regular</strong>
              </div>
            </div>
          </div>

          {/* Security & Access Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security &amp; Session</span>
            </h3>

            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Authentication Mode</span>
                <strong className="text-slate-800">Enterprise SSO / JWT</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Session Status</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Last Password Change</span>
                <strong className="text-slate-800">Today</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Scopes, Projects & Permissions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* RBAC Capabilities */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4056d6]" />
                <span>Granted Role Permissions (RBAC)</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">Role: {currentUser.role}</span>
            </div>

            <p className="text-xs text-slate-500">
              Your account has been provisioned with the following operational capabilities in ResourceHub:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentUser.permissions.map((perm, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-xs font-semibold text-slate-800 block capitalize">
                      {perm.replace(/_/g, ' ')}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Authorized operational scope for {currentUser.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Delivery Scope */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#4056d6]" />
              <span>Assigned Projects &amp; Delivery Scope</span>
            </h3>

            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#4056d6] font-bold uppercase tracking-wider block">Assigned Project Scope</span>
                <strong className="text-sm font-bold text-slate-800 block mt-0.5">
                  {currentUser.assignedProjectName || (currentUser.assignedProjects.includes('ALL') ? 'All Enterprise Projects (Global Access)' : currentUser.assignedProjects.join(', '))}
                </strong>
                <span className="text-xs text-slate-500">
                  {currentUser.role === 'Project Manager' ? 'Responsible for team staffing, gap fulfillment & cross-project bandwidth' : 'Delivery governance & portfolio oversight'}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-xs">
                {currentUser.role === 'Project Manager' ? 'Assigned PM' : 'Global Scope'}
              </span>
            </div>
          </div>

          {/* Core Technical & Domain Skills */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Specializations &amp; Competencies</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {(currentUser.skills || ['Agile / Scrum', 'Enterprise Architecture', 'Team Leadership']).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSaveSuccess={showToast}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={showToast}
      />

    </div>
  );
}
