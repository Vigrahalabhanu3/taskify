import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  Task,
  PaginatedTaskResponse,
  TaskFilterParams,
  TaskStats,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/types/task.types';

export function useTasksQuery(params: TaskFilterParams) {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined && v !== null),
  );

  return useQuery<PaginatedTaskResponse>({
    queryKey: ['tasks', cleanedParams],
    queryFn: async () => {
      const { data } = await apiClient.get('/tasks', { params: cleanedParams });
      return data;
    },
  });
}

export function useTaskStatsQuery() {
  return useQuery<TaskStats>({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tasks/stats');
      return data.data;
    },
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      const { data } = await apiClient.post('/tasks', newTask);
      return data.data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateTaskInput }) => {
      const { data } = await apiClient.patch(`/tasks/${id}`, input);
      return data.data as Task;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
}
