import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `Invalid file type '${file.mimetype}'. Only images, PDFs, Word docs, and plain text files are allowed.`,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Please select a valid file to upload (Max size 5MB)');
    }
    const data = await this.uploadService.uploadFile(file);
    return {
      success: true,
      message: 'File uploaded successfully',
      data,
    };
  }
}
