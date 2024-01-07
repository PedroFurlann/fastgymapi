import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CoachRepository } from '../repositories/coach-repository';
import { Uploader } from '../storage/uploader';
import { InvalidFileType } from './errors/invalid-file-type-error';

interface UploadCoachProfilePhotoRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  entityId: string;
}

type UploadCoachProfilePhotoResponse = Either<InvalidFileType, null>;
@Injectable()
export class UploadCoachProfilePhoto {
  constructor(
    private readonly coachRepository: CoachRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    entityId,
  }: UploadCoachProfilePhotoRequest): Promise<UploadCoachProfilePhotoResponse> {
    if (!/^(image\/(jpeg|png|pdf))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidFileType(fileType));
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
      entityId,
    });

    const coach = await this.coachRepository.findById(entityId);

    coach.avatarUrl = url;

    await this.coachRepository.update(coach);

    return right(null);
  }
}
