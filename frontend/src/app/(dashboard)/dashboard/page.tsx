'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { TaskFilters } from '@/components/dashboard/task-filters';
import { TaskTable } from '@/components/dashboard/task-table';
import { Modal } from '@/components/ui/modal';
import { TaskForm } from '@/components/tasks/task-form';
import { useCreateTaskMutation } from '@/hooks/use-tasks';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateTaskInput } from '@/types/task.types';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createTaskMutation = useCreateTaskMutation();

  const handleCreateTask = async (data: CreateTaskInput) => {
    await createTaskMutation.mutateAsync(data);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s on your plate today.</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary" className="shadow-md">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsOverview />

      {/* Filter & Controls */}
      <TaskFilters />

      {/* Task Table */}
      <TaskTable onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        maxWidth="xl"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          isLoading={createTaskMutation.isPending}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
