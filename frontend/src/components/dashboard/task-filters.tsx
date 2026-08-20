'use client';

import { useFilterStore } from '@/store/use-filter-store';
import { Search, X, Calendar } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/types/task.types';

export function TaskFilters() {
  const {
    search,
    status,
    priority,
    startDate,
    endDate,
    setSearch,
    setStatus,
    setPriority,
    setDateRange,
    resetFilters,
  } = useFilterStore();

  const hasActiveFilters = search || status || priority || startDate || endDate;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title, location..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus | '')}
        className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 transition"
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
        className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-500 transition"
      >
        <option value="">All Priority</option>
        <option value="LOW">Low Priority</option>
        <option value="MEDIUM">Medium Priority</option>
        <option value="HIGH">High Priority</option>
      </select>

      {/* Date Range Picker */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setDateRange(e.target.value, endDate)}
          className="bg-transparent focus:outline-none text-xs"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setDateRange(startDate, e.target.value)}
          className="bg-transparent focus:outline-none text-xs"
        />
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition duration-150 border border-rose-200"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
