import { create } from 'zustand';
import { TaskStatus, TaskPriority } from '@/types/task.types';

interface FilterState {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  startDate: string;
  endDate: string;
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | '') => void;
  setPriority: (priority: TaskPriority | '') => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setSortBy: (sortBy: string) => void;
  setOrder: (order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  status: '',
  priority: '',
  startDate: '',
  endDate: '',
  sortBy: 'createdAt',
  order: 'desc',
  page: 1,
  limit: 10,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setPriority: (priority) => set({ priority, page: 1 }),
  setDateRange: (startDate, endDate) => set({ startDate, endDate, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setOrder: (order) => set({ order, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      search: '',
      status: '',
      priority: '',
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
    }),
}));
