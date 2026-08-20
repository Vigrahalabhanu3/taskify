'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { WeatherWidget } from '../weather/weather-widget';
import { Task, CreateTaskInput, Attachment } from '@/types/task.types';
import { apiClient } from '@/lib/api-client';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  location: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function TaskForm({ initialData, onSubmit, isLoading = false, onCancel }: TaskFormProps) {
  const [attachments, setAttachments] = useState<Attachment[]>(initialData?.attachments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'TODO',
      priority: initialData?.priority || 'MEDIUM',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      location: initialData?.location || '',
    },
  });

  const locationValue = watch('location');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedAttachment: Attachment = response.data.data;
      setAttachments((prev) => [...prev, uploadedAttachment]);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (publicId: string) => {
    setAttachments((prev) => prev.filter((a) => a.publicId !== publicId));
  };

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      attachments,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <Input
        label="Title *"
        placeholder="e.g. Site Inspection Report"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Detailed notes or task objectives..."
          className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          {...register('description')}
        />
      </div>

      {/* Status, Priority, Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Status"
          options={[
            { label: 'To Do', value: 'TODO' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Done', value: 'DONE' },
          ]}
          {...register('status')}
        />

        <Select
          label="Priority"
          options={[
            { label: 'Low', value: 'LOW' },
            { label: 'Medium', value: 'MEDIUM' },
            { label: 'High', value: 'HIGH' },
          ]}
          {...register('priority')}
        />

        <Input
          label="Due Date"
          type="date"
          {...register('dueDate')}
        />
      </div>

      {/* Location with Live Weather Preview */}
      <div className="space-y-3">
        <Input
          label="Location (City / Region)"
          placeholder="e.g. Hyderabad, Bengaluru, Visakhapatnam"
          {...register('location')}
        />
        {locationValue && locationValue.trim().length > 0 && (
          <div className="mt-2">
            <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
              Live Weather Preview
            </span>
            <WeatherWidget location={locationValue} />
          </div>
        )}
      </div>

      {/* Attachments Section */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Attachment(s) (Cloudinary Upload)
        </label>

        {/* Existing uploaded files */}
        {attachments.length > 0 && (
          <div className="space-y-2 mb-3">
            {attachments.map((att) => (
              <div
                key={att.publicId}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="font-semibold truncate">{att.originalName}</span>
                  <span className="text-slate-400">({formatFileSize(att.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.publicId)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload dropzone */}
        <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition bg-slate-50/50">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-8 h-8 text-indigo-500 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {isUploading ? 'Uploading to Cloudinary...' : 'Click or drop file to attach'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Supports images, PDFs, documents up to 5MB</p>
          </div>
        </div>
        {uploadError && <p className="text-xs text-rose-600 font-medium">{uploadError}</p>}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
