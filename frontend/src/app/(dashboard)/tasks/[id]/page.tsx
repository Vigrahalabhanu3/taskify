'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTaskDetailQuery } from '@/hooks/use-task-detail';
import { useDeleteTaskMutation } from '@/hooks/use-tasks';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { WeatherWidget } from '@/components/weather/weather-widget';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatFileSize } from '@/lib/utils';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  Download,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const router = useRouter();

  const { data: task, isLoading, isError } = useTaskDetailQuery(taskId);
  const deleteMutation = useDeleteTaskMutation();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(taskId, {
        onSuccess: () => router.push('/dashboard'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm my-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Task Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">
          The requested task may have been deleted or you do not have permission to view it.
        </p>
        <Link href="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tasks</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/tasks/${task._id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Task Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-md space-y-6 sm:space-y-8">
        {/* Header: Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {task.title}
            </h1>
            <div className="flex items-center gap-3">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>

        {/* Description Section */}
        {task.description && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-sm whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Meta Grid: Due Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100/60 text-indigo-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Due Date</p>
              <p className="text-sm font-bold text-slate-800">{formatDate(task.dueDate)}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100/60 text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Location</p>
              <p className="text-sm font-bold text-slate-800">{task.location || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Live Weather Card */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Weather Forecast</h3>
          <WeatherWidget location={task.location} />
        </div>

        {/* Attachments Section */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Attachment(s)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {task.attachments.map((att) => (
                <div
                  key={att.publicId}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-xs transition"
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <div className="p-2 bg-indigo-100/80 rounded-xl text-indigo-600 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{att.originalName}</p>
                      <p className="text-[10px] text-slate-400">{formatFileSize(att.size)}</p>
                    </div>
                  </div>

                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Download attachment"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created / Updated Timestamps */}
        <div className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-100 text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Created At: {formatDate(task.createdAt, 'dd MMM yyyy, hh:mm a')}</span>
          </div>
          <div>Updated At: {formatDate(task.updatedAt, 'dd MMM yyyy, hh:mm a')}</div>
        </div>
      </div>
    </div>
  );
}
