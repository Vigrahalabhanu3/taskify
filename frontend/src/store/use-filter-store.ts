import { create } from 'zustand';
import { TaskStatus, TaskPriority } from '@/types/task.types';

interface FilterState {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | '') => void;
  setPriority: (priority: TaskPriority | '') => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  status: '',
  priority: '',
  startDate: '',
  endDate: '',
  page: 1,
  limit: 10,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPriority: (priority) => set({ priority, page: 1 }),
  setDateRange: (startDate, endDate) => set({ startDate, endDate, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      search: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: '',
      page: 1,
    }),
}));
