import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowUpDown, ArrowUp, ArrowDown, 
  Download, Edit2, Trash2, Eye, ChevronLeft, ChevronRight,
  Filter, CheckCircle, AlertCircle
} from 'lucide-react';

export function StatusBadge({ status }) {
  if (!status) return null;
  const s = String(status).toLowerCase();

  let bgClass = "bg-slate-100 text-slate-700 border-slate-200";
  
  if (/active|approved|allocated|completed|healthy/i.test(s)) {
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (/critical|rejected|cancelled|expired|danger/i.test(s)) {
    bgClass = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (/requested|under review|review|planned|shortlisted|warning|expiring/i.test(s)) {
    bgClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (/info|matched|partial|high/i.test(s)) {
    bgClass = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${bgClass}`}>
      {status}
    </span>
  );
}

export default function DataTable({
  columns,
  data = [],
  title,
  subtitle,
  searchPlaceholder = "Search records...",
  onAdd,
  addButtonLabel = "+ Add New",
  onEdit,
  onDelete,
  onView,
  filterComponent,
  customActions
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter & Search
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(row => {
        return Object.values(row).some(val => 
          val && String(val).toLowerCase().includes(q)
        );
      });
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  // CSV Export
  const exportToCSV = () => {
    if (!filteredData.length) return;
    const headerRow = columns.map(c => `"${c.label}"`).join(',');
    const dataRows = filteredData.map(row => {
      return columns.map(c => `"${row[c.key] !== undefined ? row[c.key] : ''}"`).join(',');
    }).join('\n');

    const csvContent = `${headerRow}\n${dataRows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || 'Data_Export').replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      
      {/* Header & Controls Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex-1 min-w-0 pr-2">
          {title && <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{subtitle}</p>}
        </div>

        {/* Actions Toolbar - Kept strictly in 1 single horizontal line */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full sm:w-56 lg:w-64 pl-8 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] transition-all"
            />
          </div>

          {/* Custom Filter Slot */}
          {filterComponent}

          {/* CSV Export */}
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            title="Export to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="inline">Export CSV</span>
          </button>

          {/* Custom Action Button Slot */}
          {customActions}

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-[#4056d6] hover:bg-[#3245b5] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{addButtonLabel}</span>
            </button>
          )}

        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`py-3.5 px-4 font-bold ${col.sortable !== false ? 'cursor-pointer hover:bg-slate-100/60 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable !== false && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-[#4056d6]" /> : <ArrowDown className="w-3 h-3 text-[#4056d6]" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="py-3.5 px-4 text-right font-bold">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                  {columns.map((col) => {
                    const value = row[col.key];

                    if (col.render) {
                      return (
                        <td key={col.key} className="py-3.5 px-4 whitespace-nowrap">
                          {col.render(value, row)}
                        </td>
                      );
                    }

                    if (col.isStatus || /status|priority|availability/i.test(col.key)) {
                      return (
                        <td key={col.key} className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={value} />
                        </td>
                      );
                    }

                    return (
                      <td key={col.key} className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-800">
                        {value !== undefined && value !== null ? String(value) : '-'}
                      </td>
                    );
                  })}

                  {/* Actions Column */}
                  {(onEdit || onDelete || onView) && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#4056d6] hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-600">No records found matching your criteria</p>
                    <p className="text-[11px] text-slate-400">Try adjusting your search terms or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/40">
        <div>
          Showing <span className="font-semibold text-slate-800">{filteredData.length ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to <span className="font-semibold text-slate-800">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of <span className="font-semibold text-slate-800">{filteredData.length}</span> records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <span className="px-3 py-1 font-semibold text-slate-700 bg-white rounded-lg border border-slate-200">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
