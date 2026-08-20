import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { EmailService } from '../email/email.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-request.interface';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly emailService: EmailService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: AuthenticatedUser): Promise<TaskDocument> {
    const taskData: any = {
      ...createTaskDto,
      userId: new Types.ObjectId(user.userId),
    };

    if (createTaskDto.dueDate) {
      taskData.dueDate = new Date(createTaskDto.dueDate);
    }

    const newTask = new this.taskModel(taskData);
    const savedTask = await newTask.save();

    // Async Email Notification on Task Creation (non-blocking)
    this.emailService
      .sendTaskCreatedNotification(user.email, user.name, savedTask.title, savedTask.dueDate?.toISOString())
      .catch((err) => this.logger.error(`Error triggering task creation email: ${err.message}`));

    return savedTask;
  }

  async findAll(filterDto: FilterTaskDto, userId: string) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      startDate,
      endDate,
      dueDateFrom,
      dueDateTo,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = filterDto;

    const query: any = { userId: new Types.ObjectId(userId) };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const effectiveStartDate = startDate || dueDateFrom;
    const effectiveEndDate = endDate || dueDateTo;

    if (effectiveStartDate || effectiveEndDate) {
      query.dueDate = {};
      if (effectiveStartDate) {
        query.dueDate.$gte = new Date(effectiveStartDate);
      }
      if (effectiveEndDate) {
        query.dueDate.$lte = new Date(effectiveEndDate);
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { location: searchRegex }];
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortBy]: sortOrder };

    const [tasks, total] = await Promise.all([
      this.taskModel.find(query).sort(sortOptions).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    } as any).exec();

    if (!task) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: AuthenticatedUser): Promise<TaskDocument> {
    const existingTask = await this.findOne(id, user.userId);
    const previousStatus = existingTask.status;

    const updateData: any = { ...updateTaskDto };
    if (updateTaskDto.dueDate) {
      updateData.dueDate = new Date(updateTaskDto.dueDate);
    }

    const updatedTask = (await this.taskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(user.userId) } as any,
      { $set: updateData },
      { new: true },
    ).exec()) as TaskDocument | null;

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }

    // Async Email Notification when task status transitions to DONE
    if (previousStatus !== TaskStatus.DONE && updatedTask.status === TaskStatus.DONE) {
      this.emailService
        .sendTaskCompletedNotification(user.email, user.name, updatedTask.title)
        .catch((err) => this.logger.error(`Error triggering task completion email: ${err.message}`));
    }

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    const result = await this.taskModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    } as any).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }

    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }

  async getStats(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const [total, todo, inProgress, done] = await Promise.all([
      this.taskModel.countDocuments({ userId: userObjId } as any).exec(),
      this.taskModel.countDocuments({ userId: userObjId, status: TaskStatus.TODO } as any).exec(),
      this.taskModel.countDocuments({ userId: userObjId, status: TaskStatus.IN_PROGRESS } as any).exec(),
      this.taskModel.countDocuments({ userId: userObjId, status: TaskStatus.DONE } as any).exec(),
    ]);

    return {
      total,
      todo,
      inProgress,
      done,
    };
  }
}
