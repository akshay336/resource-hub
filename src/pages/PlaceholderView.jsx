import React from 'react';
import { Sparkles, ArrowRight, Layers, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PlaceholderView({ viewName, onNavigate }) {
  const { currentUser } = useAuth();

  const moduleScheduleMap = {
    'Employees': { week: 'Week 1', day: 'Day 4', desc: 'Employee Directory with search, status filters, and Add/Edit Employee modal.' },
    'Skills': { week: 'Week 1', day: 'Day 5', desc: 'Technical Skills Catalog across Frontend, Backend, Database, Cloud & DevOps.' },
    'Certifications': { week: 'Week 1', day: 'Day 5', desc: 'Certifications Master tracking credentials, validity, and renewal alerts.' },
    'Clients': { week: 'Week 1', day: 'Day 5', desc: 'Client master and business relationship directory.' },
    'Projects': { week: 'Week 2', day: 'Day 6', desc: 'Project Directory with Client Name, PM Owner, Timeline, and Priority badges.' },
    'My Projects': { week: 'Week 2', day: 'Day 8', desc: 'Scoped Project Dashboard for PMs showing assigned projects.' },
    'Project Resource Structure': { week: 'Week 2', day: 'Day 7', desc: 'Delivery Head Staffing Blueprint grid (Role, Count, % Allocation).' },
    'Project Structure': { week: 'Week 2', day: 'Day 7', desc: 'Assigned Project Staffing Blueprint and gap analysis.' },
    'Project Teams': { week: 'Week 2', day: 'Day 10', desc: 'Active team member allocations and project assignments.' },
    'My Project Team': { week: 'Week 2', day: 'Day 10', desc: 'Active roster of resources allocated to your assigned project.' },
    'Add Resource': { week: 'Week 3', day: 'Day 11', desc: 'Direct Bench Allocation search with 100% hard-allocation limit guard.' },
    'Resource Sharing Requests': { week: 'Week 3', day: 'Day 12-13', desc: 'Cross-project bandwidth sharing requests with Peer PM Accept/Reject workflow.' },
    'Resource Requests': { week: 'Week 3', day: 'Day 14', desc: 'Formal staffing ticket demand queue for HR & Delivery Head.' },
    'Resource Allocation': { week: 'Week 3', day: 'Day 11', desc: 'Enterprise allocation planning and date overlap checks.' },
    'Bench Resources': { week: 'Week 4', day: 'Day 17', desc: 'Dedicated bench workforce directory with aging alerts (>15 days).' },
    'Resource Availability': { week: 'Week 3', day: 'Day 11', desc: 'Planned leaves and capacity forecast calendar.' },
    'Utilization': { week: 'Week 4', day: 'Day 16', desc: 'Enterprise utilization KPIs, billable vs non-billable mix, and charts.' },
    'Resource Dashboard': { week: 'Week 3', day: 'Day 15', desc: 'Automated Candidate Matching score engine (Skills, Exp, Avail).' },
    'Reports': { week: 'Week 4', day: 'Day 18', desc: 'Exportable utilization and staffing forecast reports.' },
    'Notifications': { week: 'Week 4', day: 'Day 19', desc: 'Interactive notifications center and alerts.' },
    'Administration': { week: 'Week 4', day: 'Day 18', desc: 'System configuration and global parameters.' },
    'Audit Logs': { week: 'Week 4', day: 'Day 18', desc: 'Immutable activity audit trail for compliance.' }
  };

  const info = moduleScheduleMap[viewName] || {
    week: 'Upcoming',
    day: 'Scheduled',
    desc: 'Enterprise module scheduled for implementation in the 4-week sprint plan.'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4056d6] text-[10px] font-bold uppercase tracking-wider">
              {info.week} • {info.day}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Active Role: {currentUser.role}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{viewName}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{info.desc}</p>
        </div>

        <button
          onClick={() => onNavigate('Profile')}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4056d6] text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>View My Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Module Card Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4056d6] to-[#6b7cff] text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Layers className="w-7 h-7" />
        </div>
        
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-bold text-slate-800">
            {viewName} Module Ready for Development
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The layout shell, RBAC permissions, and authentication routing for <strong>{viewName}</strong> are active. 
            Detailed tables, forms, and data structures will be populated in according sprint days.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
          <Clock className="w-3.5 h-3.5 text-[#4056d6]" />
          <span>Scheduled implementation: <strong>{info.week} ({info.day})</strong></span>
        </div>
      </div>

    </div>
  );
}
