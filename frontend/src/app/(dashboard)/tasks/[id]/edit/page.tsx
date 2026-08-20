'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTaskDetailQuery } from '@/hooks/use-task-detail';
import { useUpdateTaskMutation } from '@/hooks/use-tasks';
import { TaskForm } from '@/components/tasks/task-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { CreateTaskInput } from '@/types/task.types';

export default function TaskEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const router = useRouter();

  const { data: task, isLoading, isError } = useTaskDetailQuery(taskId);
  const updateMutation = useUpdateTaskMutation();

  const handleUpdateTask = async (data: CreateTaskInput) => {
    await updateMutation.mutateAsync({ id: taskId, input: data });
    router.push(`/tasks/${taskId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-600">Task not found or access denied.</p>
        <Link href="/dashboard" className="text-indigo-600 text-sm font-semibold mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href={`/tasks/${taskId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to task detail</span>
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">Edit Task</h1>
        <TaskForm
          initialData={task}
          onSubmit={handleUpdateTask}
          isLoading={updateMutation.isPending}
          onCancel={() => router.push(`/tasks/${taskId}`)}
        />
      </div>
    </div>
  );
}
