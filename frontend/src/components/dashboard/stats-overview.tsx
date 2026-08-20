'use client';

import { useTaskStatsQuery } from '@/hooks/use-tasks';
import { ClipboardList, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function StatsOverview() {
  const { data: stats, isLoading } = useTaskStatsQuery();

  const cards = [
    {
      title: 'Total Tasks',
      value: stats?.total ?? 0,
      subtext: 'All your tasks',
      icon: ClipboardList,
      bgIcon: 'bg-purple-100 text-purple-600',
      border: 'border-purple-100',
    },
    {
      title: 'To Do',
      value: stats?.todo ?? 0,
      subtext: 'Tasks to do',
      icon: Clock,
      bgIcon: 'bg-sky-100 text-sky-600',
      border: 'border-sky-100',
    },
    {
      title: 'In Progress',
      value: stats?.inProgress ?? 0,
      subtext: 'Tasks in progress',
      icon: Loader2,
      bgIcon: 'bg-amber-100 text-amber-600',
      border: 'border-amber-100',
    },
    {
      title: 'Done',
      value: stats?.done ?? 0,
      subtext: 'Completed tasks',
      icon: CheckCircle2,
      bgIcon: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-5 bg-white rounded-2xl border ${card.border} shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{card.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
            </div>
            <div className={`p-3 rounded-2xl ${card.bgIcon} shadow-2xs`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
