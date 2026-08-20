import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Task } from '@/types/task.types';

export function useTaskDetailQuery(id: string) {
  return useQuery<Task>({
    queryKey: ['task', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
