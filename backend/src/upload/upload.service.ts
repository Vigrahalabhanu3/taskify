import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

export interface UploadResult {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file provided for upload');
    }

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    // Fallback if Cloudinary credentials are mock or not set
    if (!cloudName || cloudName === 'demo' || !apiKey || apiKey === '1234567890') {
      this.logger.log(`Cloudinary API keys not configured. Generating mock file upload URL for ${file.originalname}`);
      const mockPublicId = `taskify/${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`;
      return {
        url: `https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60`,
        publicId: mockPublicId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'taskify',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            return reject(new BadRequestException(`File upload failed: ${error.message}`));
          }
          if (!result) {
            return reject(new BadRequestException('File upload failed: Empty response from Cloudinary'));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
