'use client';

import { useRouter } from 'next/navigation';
import { TaskForm } from '@/components/tasks/task-form';
import { useCreateTaskMutation } from '@/hooks/use-tasks';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CreateTaskInput } from '@/types/task.types';

export default function NewTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTaskMutation();

  const handleCreateTask = async (data: CreateTaskInput) => {
    await createTaskMutation.mutateAsync(data);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">Create New Task</h1>
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={createTaskMutation.isPending}
          onCancel={() => router.push('/dashboard')}
        />
      </div>
    </div>
  );
}
