'use client';

import Link from 'next/link';
import { useTasksQuery, useDeleteTaskMutation, useUpdateTaskMutation } from '@/hooks/use-tasks';
import { useFilterStore } from '@/store/use-filter-store';
import { TaskStatusBadge } from '../tasks/task-status-badge';
import { TaskPriorityBadge } from '../tasks/task-priority-badge';
import { WeatherWidget } from '../weather/weather-widget';
import { EmptyState } from '../ui/empty-state';
import { TableSkeleton } from '../ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Edit2, Trash2, Eye, MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TaskStatus } from '@/types/task.types';

interface TaskTableProps {
  onOpenCreateModal?: () => void;
}

export function TaskTable({ onOpenCreateModal }: TaskTableProps) {
  const { search, status, priority, startDate, endDate, sortBy, order, page, limit, setPage } = useFilterStore();

  const { data, isLoading, isError } = useTasksQuery({
    page,
    limit,
    search,
    status,
    priority,
    startDate,
    endDate,
    sortBy,
    order,
  });

  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  const tasks = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleStatusToggle = (taskId: string, currentStatus: TaskStatus) => {
    let nextStatus: TaskStatus = 'TODO';
    if (currentStatus === 'TODO') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'DONE';
    else if (currentStatus === 'DONE') nextStatus = 'TODO';

    updateMutation.mutate({ id: taskId, input: { status: nextStatus } });
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(taskId);
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (isError) {
    return (
      <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 my-6">
        Failed to load tasks. Please check your network connection or log in again.
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Try adjusting your filters or create a new task to get started."
        actionLabel="+ New Task"
        onAction={onOpenCreateModal}
      />
    );
  }

  const startRecord = (meta.page - 1) * meta.limit + 1;
  const endRecord = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Mobile Card List (visible on screens < 768px) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/tasks/${task._id}`}
                  className="font-bold text-slate-900 text-base hover:text-indigo-600 transition block line-clamp-1"
                >
                  {task.title}
                </Link>
                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{task.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/tasks/${task._id}`}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/tasks/${task._id}/edit`}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button onClick={() => handleStatusToggle(task._id, task.status)} className="cursor-pointer">
                <TaskStatusBadge status={task.status} />
              </button>
              <TaskPriorityBadge priority={task.priority} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(task.dueDate)}
                </span>
                {task.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {task.location}
                  </span>
                )}
              </div>
              <WeatherWidget location={task.location} compact />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (visible on screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Title</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Weather</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-slate-50/60 transition duration-150 group">
                <td className="py-4 px-5 max-w-xs">
                  <Link href={`/tasks/${task._id}`} className="font-semibold text-slate-800 hover:text-indigo-600 transition block truncate">
                    {task.title}
                  </Link>
                  {task.description && (
                    <p className="text-xs text-slate-400 truncate max-w-xs">{task.description}</p>
                  )}
                </td>

                <td className="py-4 px-4">
                  <button
                    onClick={() => handleStatusToggle(task._id, task.status)}
                    title="Click to toggle status"
                    className="hover:scale-105 transition cursor-pointer"
                  >
                    <TaskStatusBadge status={task.status} />
                  </button>
                </td>

                <td className="py-4 px-4">
                  <TaskPriorityBadge priority={task.priority} />
                </td>

                <td className="py-4 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                  {formatDate(task.dueDate)}
                </td>

                <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                  {task.location ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {task.location}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <WeatherWidget location={task.location} compact />
                </td>

                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <div className="relative inline-block text-left">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/tasks/${task._id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/tasks/${task._id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-800">{startRecord}</strong> to{' '}
          <strong className="text-slate-800">{endRecord}</strong> of{' '}
          <strong className="text-slate-800">{meta.total}</strong> tasks
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: meta.totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  page === pageNum
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
            disabled={page === meta.totalPages || meta.totalPages === 0}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
