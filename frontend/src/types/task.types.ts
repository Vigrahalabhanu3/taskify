export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Attachment {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  location?: string;
  attachments?: Attachment[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterParams {
  page?: number;
  limit?: number;
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export interface PaginatedTaskResponse {
  success: boolean;
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  location?: string;
  attachments?: Attachment[];
}

export type UpdateTaskInput = Partial<CreateTaskInput>;
