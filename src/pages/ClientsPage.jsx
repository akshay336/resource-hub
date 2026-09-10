import React, { useState } from 'react';
import { Building2, CheckCircle2, Globe, Users } from 'lucide-react';
import { INITIAL_CLIENTS } from '../data/mockData';
import DataTable from '../components/common/DataTable';
import ClientModal from '../components/clients/ClientModal';

export default function ClientsPage() {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [editingClient, setEditingClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const columns = [
    { key: 'id', label: 'Client ID', render: (val) => (
      <span className="font-mono font-bold text-[#4056d6]">{val}</span>
    )},
    { key: 'name', label: 'Client Enterprise Name', render: (val) => <strong className="text-slate-900 font-bold">{val}</strong> },
    { key: 'contact', label: 'Primary Contact Person' },
    { key: 'country', label: 'Geography / Region', render: (val) => (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>{val}</span>
      </span>
    )},
    { key: 'status', label: 'Account Status', isStatus: true }
  ];

  const handleSave = (clientData) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === clientData.id ? clientData : c));
      showToast(`Updated client ${clientData.name}`);
    } else {
      setClients([clientData, ...clients]);
      showToast(`Added client ${clientData.name}`);
    }
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to deactivate client ${row.name}?`)) {
      setClients(clients.filter(c => c.id !== row.id));
      showToast(`Deactivated client ${row.id}`);
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
        title="Client Accounts Directory"
        subtitle="Global client relationships, enterprise accounts, primary points of contact, and project engagements."
        columns={columns}
        data={clients}
        searchPlaceholder="Search clients by ID, name, contact, region..."
        addButtonLabel="+ Add Client"
        onAdd={() => { setEditingClient(null); setIsModalOpen(true); }}
        onEdit={(row) => { setEditingClient(row); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <ClientModal
        isOpen={isModalOpen}
        client={editingClient}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
