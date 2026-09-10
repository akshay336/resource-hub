import React, { useState } from 'react';
import { Users, UserPlus, Filter, CheckCircle2, Building } from 'lucide-react';
import { INITIAL_EMPLOYEES } from '../data/mockData';
import DataTable, { StatusBadge } from '../components/common/DataTable';
import EmployeeModal from '../components/employees/EmployeeModal';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter by department
  const filteredEmployees = selectedDept === 'ALL'
    ? employees
    : employees.filter(e => e.department.toUpperCase() === selectedDept);

  const columns = [
    { key: 'id', label: 'Employee ID', render: (val) => <span className="font-mono font-bold text-[#4056d6]">{val}</span> },
    {
      key: 'name', label: 'Name', render: (val, row) => (
        <div>
          <strong className="text-slate-900 font-bold block">{val}</strong>
          <span className="text-[11px] text-slate-400">{row.email}</span>
        </div>
      )
    },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    { key: 'location', label: 'Location' },
    { key: 'experience', label: 'Experience (Yrs)', render: (val) => `${val} yrs` },
    { key: 'status', label: 'Status', isStatus: true }
  ];

  const handleSave = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === employeeData.id ? employeeData : e));
      showToast(`Updated record for ${employeeData.name}`);
    } else {
      setEmployees([employeeData, ...employees]);
      showToast(`Added new employee ${employeeData.name}`);
    }
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to deactivate ${row.name} (${row.id})?`)) {
      setEmployees(employees.filter(e => e.id !== row.id));
      showToast(`Deactivated employee record ${row.id}`);
    }
  };

  const departments = ['ALL', 'ENGINEERING', 'QA', 'PMO', 'HR'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Workforce</span>
          <strong className="text-xl font-bold text-slate-900">248 Headcount</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Engineering</span>
          <strong className="text-xl font-bold text-[#4056d6]">142 Engineers</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">QA &amp; Testing</span>
          <strong className="text-xl font-bold text-emerald-600">38 Engineers</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">PMO &amp; Delivery</span>
          <strong className="text-xl font-bold text-purple-600">22 Managers</strong>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Employee Master Directory"
        subtitle="Comprehensive workforce records, organizational roles, skills profile, and employment status."
        columns={columns}
        data={filteredEmployees}
        searchPlaceholder="Search employees by name, ID, title, location..."
        addButtonLabel="+ Add Employee"
        onAdd={() => { setEditingEmployee(null); setIsModalOpen(true); }}
        onEdit={(row) => { setEditingEmployee(row); setIsModalOpen(true); }}
        onDelete={handleDelete}
      // filterComponent={
      //   <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
      //     {departments.map((d) => (
      //       <button
      //         key={d}
      //         onClick={() => setSelectedDept(d)}
      //         className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
      //           selectedDept === d ? 'bg-[#4056d6] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
      //         }`}
      //       >
      //         {d}
      //       </button>
      //     ))}
      //   </div>
      // }
      />

      {/* Add / Edit Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        employee={editingEmployee}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  );
}
