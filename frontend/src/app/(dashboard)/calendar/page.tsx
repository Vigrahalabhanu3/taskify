'use client';

import React, { useState } from 'react';
import { useTasksQuery } from '@/hooks/use-tasks';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: tasksResponse, isLoading } = useTasksQuery({ limit: 100 });

  const tasks = tasksResponse?.data || [];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), day));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-[500px] bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Task Calendar</h1>
            <p className="text-xs text-slate-500">View and manage tasks scheduled across the month</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-md hover:bg-white text-slate-600 transition cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-md hover:bg-white text-slate-600 transition cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Day Header Labels */}
        <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50 text-center py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[500px]">
          {daysInMonth.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`p-2 min-h-[100px] transition ${
                  !isSameMonth(day, currentMonth) ? 'bg-slate-50/50 text-slate-300' : 'bg-white'
                } ${isCurrentDay ? 'bg-indigo-50/20' : ''}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${
                      isCurrentDay
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  )}
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayTasks.map((task) => (
                    <Link
                      key={task._id}
                      href={`/tasks/${task._id}`}
                      className="block p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 transition group"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {task.status === 'DONE' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        ) : task.status === 'IN_PROGRESS' ? (
                          <Clock className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="text-[11px] font-medium text-slate-800 group-hover:text-indigo-600 truncate">
                          {task.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
