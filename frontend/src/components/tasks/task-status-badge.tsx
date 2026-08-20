import { TaskStatus } from '@/types/task.types';
import { cn } from '@/lib/utils';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const styles: Record<TaskStatus, { label: string; bg: string; text: string; dot: string }> = {
    TODO: {
      label: 'To Do',
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-indigo-50 border-indigo-200/80',
      text: 'text-indigo-700',
      dot: 'bg-indigo-500 animate-pulse',
    },
    DONE: {
      label: 'Done',
      bg: 'bg-emerald-50 border-emerald-200/80',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
  };

  const current = styles[status] || styles.TODO;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs',
        current.bg,
        current.text,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', current.dot)} />
      {current.label}
    </span>
  );
}
