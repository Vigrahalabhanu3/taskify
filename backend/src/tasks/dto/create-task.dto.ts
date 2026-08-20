import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  publicId: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task title is required' })
  title: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  description?: string;

  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Invalid task priority' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  priority?: TaskPriority;

  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  dueDate?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  location?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];
}
