import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Deleter } from '../storage/deleter';

interface DeleteNormalUserProfilePhotoRequest {
  entityId: string;
}

type DeleteNormalUserProfilePhotoResponse = Either<ResourceNotFoundError, null>;
@Injectable()
export class DeleteNormalUserProfilePhotoUseCase {
  constructor(
    private readonly normalUserRepository: NormalUserRepository,
    private readonly deleter: Deleter,
  ) {}

  async execute({
    entityId,
  }: DeleteNormalUserProfilePhotoRequest): Promise<DeleteNormalUserProfilePhotoResponse> {
    const normalUser = await this.normalUserRepository.findById(entityId);

    if (!normalUser.avatarUrl) {
      return left(new ResourceNotFoundError());
    }

    await this.deleter.deleteNormalUserProfilePhoto({ entityId });

    normalUser.avatarUrl = null;

    await this.normalUserRepository.update(normalUser);

    return right(null);
  }
}
