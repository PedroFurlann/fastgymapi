import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { Uploader } from '../storage/uploader';
import { InvalidFileTypeError } from './errors/invalid-file-type-error';

interface UploadAthleteProfilePhotoRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  entityId: string;
}

type UploadAthleteProfilePhotoResponse = Either<InvalidFileTypeError, null>;
@Injectable()
export class UploadAthleteProfilePhotoUseCase {
  constructor(
    private readonly athleteRepository: AthleteRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    entityId,
  }: UploadAthleteProfilePhotoRequest): Promise<UploadAthleteProfilePhotoResponse> {
    if (!/^(image\/(jpeg|png|pdf))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidFileTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
      entityId,
    });

    const athlete = await this.athleteRepository.findById(entityId);

    athlete['avatarUrl'] = url;

    await this.athleteRepository.update(athlete);

    return right(null);
  }
}
