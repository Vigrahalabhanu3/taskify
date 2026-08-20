import { TaskPriority } from '@/types/task.types';
import { cn } from '@/lib/utils';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  const styles: Record<TaskPriority, { label: string; bg: string; text: string }> = {
    LOW: {
      label: 'Low',
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-600',
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-amber-50 border-amber-200/80',
      text: 'text-amber-700',
    },
    HIGH: {
      label: 'High',
      bg: 'bg-rose-50 border-rose-200/80',
      text: 'text-rose-700',
    },
  };

  const current = styles[priority] || styles.MEDIUM;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md border',
        current.bg,
        current.text,
        className,
      )}
    >
      {current.label}
    </span>
  );
}
