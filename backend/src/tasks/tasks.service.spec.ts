import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { EmailService } from '../email/email.service';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './enums/task-status.enum';

describe('TasksService Unit Tests & Security Boundaries', () => {
  let tasksService: TasksService;
  let taskModel: any;
  let emailService: jest.Mocked<Partial<EmailService>>;

  const mockUser = {
    userId: '66c4c5a1f2e1a2b3c4d5e6f7',
    email: 'nageswari@email.com',
    name: 'Nageswari',
  };

  const userB_id = '66c4c5a1f2e1a2b3c4d5e888';

  const mockTaskDoc = {
    _id: '66c4c5a1f2e1a2b3c4d5e999',
    title: 'Site Inspection Report',
    description: 'Check site progress',
    status: TaskStatus.TODO,
    priority: 'HIGH',
    userId: mockUser.userId,
    save: jest.fn().mockResolvedValue({
      _id: '66c4c5a1f2e1a2b3c4d5e999',
      title: 'Site Inspection Report',
      dueDate: new Date(),
    }),
  };

  beforeEach(async () => {
    taskModel = jest.fn().mockImplementation(() => mockTaskDoc);
    taskModel.find = jest.fn();
    taskModel.findOne = jest.fn();
    taskModel.findOneAndUpdate = jest.fn();
    taskModel.deleteOne = jest.fn();
    taskModel.countDocuments = jest.fn();

    emailService = {
      sendTaskCreatedNotification: jest.fn().mockResolvedValue(undefined),
      sendTaskCompletedNotification: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: taskModel },
        { provide: EmailService, useValue: emailService },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  describe('Task Security & Scoping', () => {
    it('should throw NotFoundException if User B attempts to access User A task', async () => {
      taskModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        tasksService.findOne('66c4c5a1f2e1a2b3c4d5e999', userB_id),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if User B attempts to delete User A task', async () => {
      taskModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(
        tasksService.remove('66c4c5a1f2e1a2b3c4d5e999', userB_id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Task Status Transitions & Email Trigger', () => {
    it('should trigger task completion email when status transitions to DONE', async () => {
      taskModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '66c4c5a1f2e1a2b3c4d5e999',
          status: TaskStatus.IN_PROGRESS,
          title: 'Site Inspection Report',
        }),
      });

      taskModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: '66c4c5a1f2e1a2b3c4d5e999',
          status: TaskStatus.DONE,
          title: 'Site Inspection Report',
        }),
      });

      await tasksService.update('66c4c5a1f2e1a2b3c4d5e999', { status: TaskStatus.DONE }, mockUser);

      expect(emailService.sendTaskCompletedNotification).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name,
        'Site Inspection Report',
      );
    });
  });
});
