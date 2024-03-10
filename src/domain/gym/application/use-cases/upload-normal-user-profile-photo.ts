import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { Uploader } from '../storage/uploader';
import { InvalidFileTypeError } from './errors/invalid-file-type-error';

interface UploadNormalUserProfilePhotoRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
  entityId: string;
}

type UploadNormalUserProfilePhotoResponse = Either<InvalidFileTypeError, null>;
@Injectable()
export class UploadNormalUserProfilePhotoUseCase {
  constructor(
    private readonly normalUserRepository: NormalUserRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    entityId,
  }: UploadNormalUserProfilePhotoRequest): Promise<UploadNormalUserProfilePhotoResponse> {
    if (!/^(image\/(jpeg|png|pdf))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidFileTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
      entityId,
    });

    const normalUser = await this.normalUserRepository.findById(entityId);

    normalUser['avatarUrl'] = url;

    await this.normalUserRepository.update(normalUser);

    return right(null);
  }
}
