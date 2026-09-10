import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { INITIAL_CERTS } from '../data/mockData';
import DataTable from '../components/common/DataTable';
import CertificationModal from '../components/certs/CertificationModal';

export default function CertificationsPage() {
  const [certs, setCerts] = useState(INITIAL_CERTS);
  const [editingCert, setEditingCert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    { key: 'code', label: 'Cert Code', render: (val) => (
      <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-xs border border-amber-200">
        {val}
      </span>
    )},
    { key: 'name', label: 'Certification Title', render: (val) => <strong className="text-slate-900 font-bold">{val}</strong> },
    { key: 'issuer', label: 'Issuing Authority' },
    { key: 'validUntil', label: 'Valid Until (Expiry Date)' },
    { key: 'status', label: 'Status', isStatus: true }
  ];

  const handleSave = (certData) => {
    if (editingCert) {
      setCerts(certs.map(c => c.code === certData.code ? certData : c));
      showToast(`Updated certification ${certData.name}`);
    } else {
      setCerts([certData, ...certs]);
      showToast(`Added certification ${certData.name}`);
    }
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to remove certification ${row.name}?`)) {
      setCerts(certs.filter(c => c.code !== row.code));
      showToast(`Removed certification ${row.code}`);
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

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Certifications</span>
            <strong className="text-xl font-bold text-slate-900">6 Registered</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active &amp; Compliant</span>
            <strong className="text-xl font-bold text-emerald-600">5 Valid</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Expiring / Renewal Due</span>
            <strong className="text-xl font-bold text-rose-600">1 Due Soon</strong>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Certification Master & Expiry Tracker"
        subtitle="Tracking professional credentials, cloud architect certificates, scrum accreditations, and validity renewal cycles."
        columns={columns}
        data={certs}
        searchPlaceholder="Search certifications..."
        addButtonLabel="+ Add Certification"
        onAdd={() => { setEditingCert(null); setIsModalOpen(true); }}
        onEdit={(row) => { setEditingCert(row); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <CertificationModal
        isOpen={isModalOpen}
        cert={editingCert}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
