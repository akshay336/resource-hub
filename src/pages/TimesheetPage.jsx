import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Check, Clock, Calendar as CalendarIcon,
  List, Table, Sparkles, Filter, Settings, Download, Trash2, Edit2,
  Copy, Eye, AlertCircle, CheckCircle2, Shield, User, FolderKanban,
  Zap, ArrowRight, BarChart3, HelpCircle, Layers, ShieldAlert, CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  INITIAL_EMPLOYEES,
  INITIAL_TIMESHEETS,
  INITIAL_PROJECTS,
  INITIAL_WORK_ITEMS
} from '../data/mockData';
import LogTimeModal from '../components/timesheet/LogTimeModal';
import EditTimeModal from '../components/timesheet/EditTimeModal';

export default function TimesheetPage() {
  const { currentUser } = useAuth();

  // RBAC Permission Check
  // Project Manager: Full Access (Add, Edit, Delete, Duplicate)
  // Delivery Head & System Admin: View Access Only
  // HR: No Access (Access Restricted)
  const isPM = currentUser?.role === 'Project Manager';
  const isHR = currentUser?.role === 'HR';
  const isReadOnly = currentUser?.role === 'Delivery Head' || currentUser?.role === 'System Admin';

  // State
  const [timesheets, setTimesheets] = useState(INITIAL_TIMESHEETS);
  const [selectedEmpId, setSelectedEmpId] = useState('EMP003'); // Default to Ajinkya Joshi / Rahul Joshi
  const [activeViewMode, setActiveViewMode] = useState('Timesheet'); // 'Calendar' | 'List' | 'Timesheet'
  const [currentPeriod, setCurrentPeriod] = useState('Current Period -104');
  const [currentWeekLabel, setCurrentWeekLabel] = useState('07 Jun - 13 Jun, 2026');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVisualizeOpen, setIsVisualizeOpen] = useState(false);
  const [selectedLogDay, setSelectedLogDay] = useState({ date: '2026-06-08', formatted: '08/Jun/26' });
  const [activeEditingRecord, setActiveEditingRecord] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Employees List (includes Ajinkya Joshi as primary demo talent)
  const employeeList = useMemo(() => {
    const defaultAjinkya = {
      id: 'EMP003',
      name: 'Akshay Jadhav',
      department: 'Engineering',
      designation: 'Angular Developer',
      avatar: 'AJ',
      avatarBg: 'bg-[#d9381e]',
      project: 'Phoenix Digital Platform (PRJ001)'
    };

    const others = INITIAL_EMPLOYEES.filter(e => e.id !== 'EMP003').map(e => ({
      id: e.id,
      name: e.name,
      department: e.department,
      designation: e.designation,
      avatar: e.name.split(' ').map(n => n[0]).join(''),
      avatarBg: e.id === 'EMP001' ? 'bg-indigo-600' : e.id === 'EMP002' ? 'bg-emerald-600' : 'bg-blue-600',
      project: 'Phoenix Digital Platform (PRJ001)'
    }));

    return [defaultAjinkya, ...others];
  }, []);

  const currentEmployee = employeeList.find(e => e.id === selectedEmpId) || employeeList[0];

  // 7 Days of the Week Definition for 07 Jun - 13 Jun 2026
  const weekDays = [
    { dayName: 'Sun', dayNum: '07', date: '2026-06-07', formatted: '07/Jun/26', targetHours: 0 },
    { dayName: 'Mon', dayNum: '08', date: '2026-06-08', formatted: '08/Jun/26', targetHours: 8 },
    { dayName: 'Tue', dayNum: '09', date: '2026-06-09', formatted: '09/Jun/26', targetHours: 8 },
    { dayName: 'Wed', dayNum: '10', date: '2026-06-10', formatted: '10/Jun/26', targetHours: 8 },
    { dayName: 'Thu', dayNum: '11', date: '2026-06-11', formatted: '11/Jun/26', targetHours: 8 },
    { dayName: 'Fri', dayNum: '12', date: '2026-06-12', formatted: '12/Jun/26', targetHours: 8 },
    { dayName: 'Sat', dayNum: '13', date: '2026-06-13', formatted: '13/Jun/26', targetHours: 0 }
  ];

  // Filtered Timesheets for selected employee
  const employeeTimesheets = useMemo(() => {
    return timesheets.filter(t => t.empId === selectedEmpId || (selectedEmpId === 'EMP003' && (t.empId === 'EMP003' || t.empName === 'Akshay Jadhav')));
  }, [timesheets, selectedEmpId]);

  // Calculate total weekly hours
  const totalWeekHours = useMemo(() => {
    return employeeTimesheets.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  }, [employeeTimesheets]);

  // Handlers
  const handleOpenLogModal = (day) => {
    if (isReadOnly) {
      showToast('⚠️ View-Only Mode: Delivery Head & Admins have audit inspection access only.');
      return;
    }
    setSelectedLogDay(day || { date: '2026-06-08', formatted: '08/Jun/26' });
    setIsLogModalOpen(true);
  };

  const handleSaveNewTime = (newRecord) => {
    setTimesheets(prev => [newRecord, ...prev]);
    showToast(`✓ Logged ${newRecord.durationStr} on ${newRecord.taskCode} for ${newRecord.empName}`);
  };

  const handleOpenEditModal = (record) => {
    if (isReadOnly) {
      showToast('⚠️ View-Only Mode: Only Project Managers can modify time logs.');
      return;
    }
    setActiveEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleSaveUpdatedTime = (updatedRecord) => {
    setTimesheets(prev => prev.map(t => t.id === updatedRecord.id ? updatedRecord : t));
    showToast(`✓ Updated ${updatedRecord.taskCode} (${updatedRecord.durationStr})`);
  };

  const handleDeleteTime = (recordId) => {
    if (isReadOnly) return;
    setTimesheets(prev => prev.filter(t => t.id !== recordId));
    showToast(`✓ Deleted time record`);
  };

  const handleDuplicateTime = (record) => {
    if (isReadOnly) {
      showToast('⚠️ View-Only Mode: Project Managers have modification access.');
      return;
    }
    const duplicated = {
      ...record,
      id: `TS-${Date.now().toString().slice(-4)}`,
      loggedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setTimesheets(prev => [duplicated, ...prev]);
    showToast(`✓ Duplicated ${record.taskCode} (${record.durationStr})`);
  };

  const handleExportCSV = () => {
    const headers = ['Record ID', 'Employee ID', 'Employee Name', 'Date', 'Task Code', 'Task Title', 'Duration (Hours)', 'Project', 'Status'];
    const rows = employeeTimesheets.map(t => [
      t.id, t.empId, t.empName, t.date, t.taskCode, `"${t.taskTitle.replace(/"/g, '""')}"`, t.duration, t.projectName, t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `timesheet_${currentEmployee.name.replace(/\s+/g, '_')}_Jun2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported timesheet for ${currentEmployee.name}`);
  };

  // If HR visits, show access restricted guard
  if (isHR) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-4 max-w-2xl mx-auto my-12 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          The <strong>Timesheet Management</strong> module is accessible exclusively to <strong>Project Managers</strong> (with Add/Update/Delete access) and <strong>Delivery Heads &amp; System Admins</strong> (with View-Only access).
        </p>
        <div className="pt-2">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            Logged in as HR Role
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-150">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row (Screenshot 4) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col xl:flex-row xl:items-center justify-between gap-4">

        {/* Left: Employee Profile Card & Switcher */}
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-full ${currentEmployee.avatarBg || 'bg-[#d9381e]'} text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md`}>
            {currentEmployee.avatar}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight bg-transparent border-0 focus:outline-none cursor-pointer hover:text-[#004f98] transition-colors pr-2"
              >
                {employeeList.map(emp => (
                  <option key={emp.id} value={emp.id} className="text-sm font-medium text-slate-800">
                    {emp.name} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>{currentEmployee.department} Practice</span>
              <span>•</span>
              <span className="text-[#004f98] font-semibold">{currentEmployee.project}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Period, Views, Total Hours (Screenshot 4) */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap xl:flex-nowrap">

          {/* Current Period Dropdown */}
          <div className="relative">
            <select
              value={currentPeriod}
              onChange={(e) => setCurrentPeriod(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#004f98] cursor-pointer shadow-2xs"
            >
              <option value="Current Period -104">Current Period -104</option>
              <option value="Previous Period -103">Previous Period -103</option>
              <option value="Sprint 24 · June">Sprint 24 · June</option>
            </select>
          </div>

          {/* View Modes Switcher: Calendar | List | Timesheet */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['Calendar', 'List', 'Timesheet'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveViewMode(mode)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeViewMode === mode
                  ? 'bg-white text-[#004f98] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Week Hours Progress Gauge */}
          <div className="space-y-1 min-w-[130px]">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Week:</span>
              <span className="text-slate-900 font-mono">{totalWeekHours}h of 40h</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${totalWeekHours >= 40 ? 'bg-emerald-500' : 'bg-emerald-600'
                  }`}
                style={{ width: `${Math.min(100, (totalWeekHours / 40) * 100)}%` }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Sub-Toolbar & Action Banner (Screenshot 4) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">

        {/* Left: Date Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="font-mono">{currentWeekLabel}</span>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => showToast('Navigated to previous week')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Navigated to next week')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => { setCurrentWeekLabel('07 Jun - 13 Jun, 2026'); showToast('Returned to current week'); }}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
          >
            Today
          </button>

          {/* Log All Activities Button (For PM) */}
          {isPM ? (
            <button
              onClick={() => handleOpenLogModal({ date: '2026-06-08', formatted: '08/Jun/26' })}
              className="px-3.5 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer ml-2"
            >
              Log All Activities
            </button>
          ) : (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200 ml-2">
              Auditor View-Only Mode
            </span>
          )}

          {/* Visualize Logged Work button */}
          <button
            onClick={() => setIsVisualizeOpen(true)}
            className="px-3 py-1 text-xs font-bold text-[#004f98] bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#004f98]" />
            <span>Visualize Logged Work</span>
          </button>
        </div>

        {/* Right Tools: Integrations, Insights, Filters, Settings */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => showToast('Syncing with Jira / Azure DevOps worklogs...')}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Integrations</span>
          </button>

          <button
            onClick={() => setIsVisualizeOpen(true)}
            className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50/80 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Insights</span>
          </button>

          <button
            onClick={() => showToast('Filters: Displaying all billable & non-billable worklogs')}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Export Timesheet CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => showToast('Timesheet settings: 40h standard weekly threshold active')}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Timesheet 7-Day Board View (Screenshot 4) */}
      {activeViewMode === 'Timesheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 items-start">
          {weekDays.map((day) => {
            // Find logs for this day
            const dayLogs = employeeTimesheets.filter(t => t.date === day.date || t.day === day.dayName);
            const dayTotalHours = dayLogs.reduce((sum, item) => sum + (Number(item.duration) || 0), 0);
            const isCompletedTarget = day.targetHours > 0 && dayTotalHours >= day.targetHours;

            return (
              <div
                key={day.dayName}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col min-h-[500px] overflow-hidden"
              >

                {/* Day Column Header (Screenshot 4) */}
                <div className="p-3 border-b border-slate-100 bg-slate-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="font-semibold text-slate-600">
                      {day.dayName} <span className="text-slate-900 font-extrabold">{day.dayNum}</span>
                    </span>
                    <span className="font-mono text-slate-700">
                      {dayTotalHours}h of {day.targetHours}h
                    </span>
                  </div>

                  {/* Green indicator bar under day header */}
                  <div className="mt-2 w-full bg-slate-200/80 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isCompletedTarget ? 'bg-emerald-500' : dayTotalHours > 0 ? 'bg-emerald-600' : 'bg-transparent'
                        }`}
                      style={{ width: `${day.targetHours > 0 ? Math.min(100, (dayTotalHours / day.targetHours) * 100) : 0}%` }}
                    />
                  </div>

                  {/* Quick Add Button Under Header (Screenshot 4) */}
                  {isPM ? (
                    <button
                      onClick={() => handleOpenLogModal({ date: day.date, formatted: day.formatted })}
                      className="w-full mt-2 py-1.5 bg-[#e8eef6] hover:bg-[#d6e3f3] text-slate-700 font-bold rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                      title={`Log time on ${day.dayName} ${day.dayNum}`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  ) : (
                    <div className="w-full mt-2 py-1 bg-slate-100 text-slate-400 text-[10px] text-center font-semibold rounded-lg">
                      View Mode
                    </div>
                  )}
                </div>

                {/* Subheader: WORKLOGS (Screenshot 4) */}
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-50 relative">
                  <span className="bg-white px-2 relative z-10">WORKLOGS</span>
                  <div className="absolute top-1/2 left-3 right-3 h-px bg-slate-100 z-0" />
                </div>

                {/* List of Worklog Cards */}
                <div className="p-2.5 space-y-2 flex-1 overflow-y-auto">
                  {dayLogs.map((log) => {
                    const isHovered = hoveredCardId === log.id;

                    return (
                      <div
                        key={log.id}
                        onMouseEnter={() => setHoveredCardId(log.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                        className="relative bg-[#f0f4f9] hover:bg-[#e4ecf7] p-3 rounded-xl border border-slate-200/80 transition-all cursor-pointer group select-none shadow-2xs"
                      >

                        {/* Work item title (Screenshot 4) */}
                        <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                          {log.taskTitle}
                        </p>

                        {/* Card Footer: Green Check + Task Key (e.g. AO-644) + Duration (6h) */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                            <span className="font-mono text-xs font-semibold text-slate-700">
                              {log.taskCode}
                            </span>
                          </div>

                          <span className="font-mono text-xs font-bold text-slate-900">
                            {log.durationStr}
                          </span>
                        </div>

                        {/* Card Hover Action Tooltip Pill (Screenshot 1) */}
                        {isHovered && (
                          <div className="absolute top-2 right-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                            {isPM ? (
                              <div className="bg-[#004f98] text-white p-1 rounded-lg shadow-xl flex items-center gap-1">

                                {/* Delete Action with Tooltip */}
                                <div className="relative group/del">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm(`Delete ${log.taskCode} (${log.durationStr})?`)) {
                                        handleDeleteTime(log.id);
                                      }
                                    }}
                                    className="p-1 hover:bg-[#003d77] rounded transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Edit Action */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(log);
                                  }}
                                  className="p-1 hover:bg-[#003d77] rounded transition-colors cursor-pointer"
                                  title="Edit Record"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Duplicate Action */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateTime(log);
                                  }}
                                  className="p-1 hover:bg-[#003d77] rounded transition-colors cursor-pointer"
                                  title="Duplicate"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                              </div>
                            ) : (
                              <div className="bg-slate-800 text-slate-200 px-2 py-1 rounded-lg shadow-md text-[10px] font-semibold flex items-center gap-1">
                                <Eye className="w-3 h-3 text-slate-400" />
                                <span>View Log</span>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}

                  {dayLogs.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-300 text-xs">
                      <span>No time logged</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* List View Tab (Tabular audit log) */}
      {activeViewMode === 'List' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Detailed Worklog Activity Register
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Itemized entries for {currentEmployee.name} ({currentPeriod})
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-bold text-[#004f98] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Day</th>
                  <th className="py-3 px-3">Task Code</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-3 text-center">Duration</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeTimesheets.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#004f98]">{row.id}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{row.dateFormatted || row.date}</td>
                    <td className="py-3.5 px-3 text-slate-600">{row.day}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {row.taskCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-sm truncate">{row.taskTitle}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900 bg-slate-50/60 rounded">
                      {row.durationStr}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{row.projectName}</td>
                    <td className="py-3.5 px-4 text-right">
                      {isPM ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(row)}
                            className="p-1.5 text-slate-600 hover:text-[#004f98] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTime(row.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View Tab */}
      {activeViewMode === 'Calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">June 2026 Monthly Calendar Heatmap</h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated daily logged capacity for {currentEmployee.name}</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Total Logged: {totalWeekHours}h
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-2 text-center text-xs font-bold text-slate-400 bg-slate-50 rounded-lg">
                {d}
              </div>
            ))}
            {weekDays.map(d => {
              const dayLogs = employeeTimesheets.filter(t => t.date === d.date || t.day === d.dayName);
              const dayTotalHours = dayLogs.reduce((sum, item) => sum + (Number(item.duration) || 0), 0);

              return (
                <div
                  key={d.dayNum}
                  onClick={() => isPM && handleOpenLogModal(d)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer min-h-[90px] flex flex-col justify-between ${dayTotalHours >= 8
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                    : dayTotalHours > 0
                      ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400'
                      : 'bg-slate-50/40 border-slate-100 hover:border-slate-300'
                    }`}
                >
                  <span className="font-extrabold text-sm text-slate-800">{d.dayNum}</span>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 block">{dayTotalHours}h logged</span>
                    <span className="text-[10px] text-slate-400 font-medium">{dayLogs.length} worklogs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Log Time Modal (Screenshot 3) */}
      <LogTimeModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveNewTime}
        defaultDate={selectedLogDay.date}
        defaultDateFormatted={selectedLogDay.formatted}
        currentEmployee={currentEmployee}
      />

      {/* Edit Time Modal (Screenshot 2) */}
      <EditTimeModal
        isOpen={isEditModalOpen}
        record={activeEditingRecord}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUpdatedTime}
        onDelete={handleDeleteTime}
      />

      {/* Visualize Logged Work Modal */}
      {isVisualizeOpen && (
        <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-modal border border-slate-100 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Logged Work Analytics &amp; Breakdown</h3>
                  <span className="text-xs text-slate-400 font-mono">{currentEmployee.name} · {currentWeekLabel}</span>
                </div>
              </div>
              <button
                onClick={() => setIsVisualizeOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">

              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  <span className="text-slate-500 font-medium block">Total Logged</span>
                  <strong className="text-2xl font-extrabold text-indigo-700 font-mono block mt-0.5">{totalWeekHours}h</strong>
                  <span className="text-[10px] text-indigo-600 font-semibold">100% of 40h target</span>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <span className="text-slate-500 font-medium block">Billable Hours</span>
                  <strong className="text-2xl font-extrabold text-emerald-700 font-mono block mt-0.5">{totalWeekHours}h</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% Client Billable</span>
                </div>

                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <span className="text-slate-500 font-medium block">Active Tasks</span>
                  <strong className="text-2xl font-extrabold text-purple-700 font-mono block mt-0.5">{employeeTimesheets.length}</strong>
                  <span className="text-[10px] text-purple-600 font-semibold">4 Unique Issues</span>
                </div>
              </div>

              {/* Task Breakdown Table */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block text-xs">Task Distribution</span>
                <div className="space-y-2">
                  {employeeTimesheets.map(item => (
                    <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="font-mono font-bold text-[#004f98] bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                          {item.taskCode}
                        </span>
                        <span className="text-slate-800 font-medium truncate max-w-xs">{item.taskTitle}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0">{item.durationStr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsVisualizeOpen(false)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Insights
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
