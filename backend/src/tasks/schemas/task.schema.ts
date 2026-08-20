import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export type TaskDocument = Task & Document;

export interface IAttachment {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.TODO, index: true })
  status: TaskStatus;

  @Prop({ required: true, enum: TaskPriority, default: TaskPriority.MEDIUM, index: true })
  priority: TaskPriority;

  @Prop({ type: Date, required: false, index: true })
  dueDate?: Date;

  @Prop({ trim: true, default: '' })
  location: string;

  @Prop({
    type: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
    default: [],
  })
  attachments: IAttachment[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ userId: 1, status: 1, priority: 1, dueDate: 1 });
