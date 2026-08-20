'use client';

import { useFilterStore } from '@/store/use-filter-store';
import { Search, X, Calendar, ArrowUpDown } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/types/task.types';

export function TaskFilters() {
  const {
    search,
    status,
    priority,
    startDate,
    endDate,
    sortBy,
    order,
    setSearch,
    setStatus,
    setPriority,
    setDateRange,
    setSortBy,
    setOrder,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters =
    search || status || priority || startDate || endDate || sortBy !== 'createdAt' || order !== 'desc';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-3 lg:space-y-0 lg:flex lg:flex-wrap lg:items-center lg:gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] w-full lg:w-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid wrapper for mobile select controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-2 w-full lg:w-auto">
        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus | '')}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority | '')}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Sorting Dropdown */}
        <div className="col-span-2 sm:col-span-1 flex items-center justify-between gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
          <div className="flex items-center gap-1 min-w-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 ml-1" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent py-1 text-xs sm:text-sm text-slate-700 focus:outline-none cursor-pointer truncate"
            >
              <option value="createdAt">Sort: Created</option>
              <option value="dueDate">Sort: Due</option>
              <option value="priority">Sort: Priority</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
          <button
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100/50 rounded-lg transition cursor-pointer flex-shrink-0"
            title={`Order: ${order.toUpperCase()}`}
          >
            {order.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 w-full lg:w-auto">
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-600">Range:</span>
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setDateRange(e.target.value, endDate)}
          className="bg-transparent focus:outline-none text-xs text-slate-700"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setDateRange(startDate, e.target.value)}
          className="bg-transparent focus:outline-none text-xs text-slate-700"
        />
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full lg:w-auto px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition duration-150 border border-rose-200 cursor-pointer"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
