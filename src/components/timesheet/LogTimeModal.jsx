import React, { useState, useEffect, useRef } from 'react';
import {
  Check, Settings, ClipboardList, Clock, AlignLeft,
  Search, X, Sparkles, Bug, FileCode, CheckCircle2, ChevronDown
} from 'lucide-react';
import { INITIAL_WORK_ITEMS } from '../../data/mockData';

export default function LogTimeModal({
  isOpen,
  onClose,
  onSave,
  defaultDate = '2026-06-08',
  defaultDateFormatted = '08/Jun/26',
  currentEmployee
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState(defaultDate);
  const [dateFormatted, setDateFormatted] = useState(defaultDateFormatted);
  const [duration, setDuration] = useState('8h');
  const [description, setDescription] = useState('');
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [logAnother, setLogAnother] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate || '2026-06-08');
      setDateFormatted(defaultDateFormatted || '08/Jun/26');
      setSelectedItem(INITIAL_WORK_ITEMS[0]);
      setSearchQuery(INITIAL_WORK_ITEMS[0].code + ' · ' + INITIAL_WORK_ITEMS[0].title);
      setDuration('8h');
      setDescription('');
      setIsSearching(false);
    }
  }, [isOpen, defaultDate, defaultDateFormatted]);

  // Click outside search dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter available work items
  const filteredWorkItems = INITIAL_WORK_ITEMS.filter(item =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parseDurationHours = (val) => {
    if (!val) return 8;
    const clean = String(val).toLowerCase().replace('h', '').replace('m', '').trim();
    const num = parseFloat(clean);
    return isNaN(num) || num <= 0 ? 8 : num;
  };

  const handleSelectWorkItem = (item) => {
    setSelectedItem(item);
    setSearchQuery(`${item.code} · ${item.title}`);
    setIsSearching(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedItem && !searchQuery.trim()) {
      alert('Please select or enter a work item.');
      return;
    }

    setIsSubmitting(true);

    const hours = parseDurationHours(duration);
    const itemCode = selectedItem ? selectedItem.code : (searchQuery.split('·')[0]?.trim() || 'AO-644');
    const itemTitle = selectedItem ? selectedItem.title : (searchQuery.split('·')[1]?.trim() || searchQuery);
    const projId = selectedItem ? selectedItem.projectId : 'PRJ001';
    const projName = selectedItem ? selectedItem.projectName : 'Phoenix Digital Platform';

    const newRecord = {
      id: `TS-${Date.now().toString().slice(-4)}`,
      empId: currentEmployee?.id || 'EMP003',
      empName: currentEmployee?.name || 'Akshay Jadhav',
      date: date,
      dateFormatted: dateFormatted,
      day: getDayName(date),
      taskCode: itemCode,
      taskTitle: itemTitle,
      duration: hours,
      durationStr: `${hours}h`,
      description: description.trim() || `Working on work item ${itemCode}`,
      projectId: projId,
      projectName: projName,
      loggedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Logged'
    };

    setTimeout(() => {
      onSave(newRecord);
      setIsSubmitting(false);

      if (logAnother) {
        setDescription('');
        setDuration('8h');
      } else {
        onClose();
      }
    }, 250);
  };

  // Keyboard shortcut: Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedItem, searchQuery, date, duration, description, logAnother]);

  if (!isOpen) return null;

  function getDayName(dateStr) {
    const d = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return isNaN(d.getDay()) ? 'Mon' : days[d.getDay()];
  }

  return (
    <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header (Screenshot 3) */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Log Time
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              title="Time tracking settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

          {/* Work Items Search Field (Screenshot 3) */}
          <div className="flex items-start gap-3.5" ref={searchRef}>
            <div className="mt-2.5 text-slate-700 shrink-0">
              <ClipboardList className="w-4 h-4" />
            </div>

            <div className="relative flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearching(true)}
                  onChange={(e) => { setSearchQuery(e.target.value); setIsSearching(true); }}
                  placeholder="Search work items"
                  className="w-full pl-3.5 pr-9 py-2.5 text-xs text-slate-800 bg-white border border-amber-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium transition-all"
                />
                <Search className="w-4 h-4 text-slate-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Suggestions Dropdown */}
              {isSearching && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-30 divide-y divide-slate-100">
                  {filteredWorkItems.length > 0 ? (
                    filteredWorkItems.map((item) => (
                      <div
                        key={item.code}
                        onMouseDown={() => handleSelectWorkItem(item)}
                        className="p-2.5 hover:bg-indigo-50/70 transition-colors cursor-pointer flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                            {item.code}
                          </span>
                          <span className="text-slate-800 font-medium truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.projectName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 text-center">
                      No matching work items found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date & Duration Row (Screenshot 3) */}
          <div className="flex items-start gap-3.5">
            <div className="mt-2.5 text-slate-700 shrink-0">
              <Clock className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">

                {/* Date Input */}
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">Date</label>
                  <input
                    type="text"
                    value={dateFormatted}
                    onChange={(e) => { setDateFormatted(e.target.value); }}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#4056d6] font-medium"
                  />
                </div>

                {/* Duration Input */}
                <div className="w-28 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="8h"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-amber-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                  />
                </div>

                {/* Set start and end time helper */}
                <div className="pt-5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowTimeRange(!showTimeRange)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Set start and end time
                  </button>
                </div>

              </div>

              {/* Time Range Selector dropdown when enabled */}
              {showTimeRange && (
                <div className="flex items-center gap-2 pt-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500">From:</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <span className="text-slate-500">To:</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              )}

            </div>
          </div>

          {/* Description Field (Screenshot 3) */}
          <div className="flex items-start gap-3.5">
            <div className="mt-2.5 text-slate-700 shrink-0">
              <AlignLeft className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 block">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#4056d6] transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer Controls & Shortcut Tip (Screenshot 3) */}
          <div className="pt-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">

              {/* Log another checkbox */}
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={logAnother}
                  onChange={(e) => setLogAnother(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#004f98] focus:ring-[#004f98] cursor-pointer"
                />
                <span>Log another</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#004f98] hover:bg-[#003d77] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Logging...' : 'Log time'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </div>

            {/* Tip shortcut note */}
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium">
                <strong>Tip:</strong> ctrl + enter
              </span>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
