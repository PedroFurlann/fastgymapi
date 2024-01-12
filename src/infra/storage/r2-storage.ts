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
import {
  Deleter,
  DeleterParams,
} from '@/domain/gym/application/storage/deleter';
import { AthleteRepository } from '@/domain/gym/application/repositories/athlete-repository';

@Injectable()
export class R2Storage implements Uploader, Deleter {
  private client: S3Client;

  constructor(
    private readonly envService: EnvService,
    private readonly coachRepository: CoachRepository,
    private readonly athleteRepository: AthleteRepository,
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

    const coach = await this.coachRepository.findById(entityId);
    const athlete = await this.athleteRepository.findById(entityId);

    if (coach.avatarUrl) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: coach.avatarUrl,
        }),
      );
    }

    if (athlete.avatarUrl) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: athlete.avatarUrl,
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
      url: uniqueFileName,
    };
  }

  async deleteCoachProfilePhoto({ entityId }: DeleterParams): Promise<void> {
    const coach = await this.coachRepository.findById(entityId);

    const profilePhotoId = coach.avatarUrl;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: profilePhotoId,
      }),
    );

    coach.avatarUrl = null;

    await this.coachRepository.update(coach);
  }
}
