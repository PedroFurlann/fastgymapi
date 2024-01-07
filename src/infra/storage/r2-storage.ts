import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  Uploader,
  UploaderParams,
} from '@/domain/gym/application/storage/uploader';
import { CoachRepository } from '@/domain/gym/application/repositories/coach-repository';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(
    private readonly envService: EnvService,
    private readonly coachRepository: CoachRepository,
  ) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload({
    body,
    fileName,
    fileType,
    entityId,
  }: UploaderParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;
    const filePath = `${uniqueFileName}.${fileType}`;

    const coach = await this.coachRepository.findById(entityId);

    if (coach.avatarUrl) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: coach.avatarUrl,
        }),
      );
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: filePath,
    };
  }
}
