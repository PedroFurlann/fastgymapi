import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CoachRepository } from '../repositories/coach-repository';
import { Deleter } from '../storage/deleter';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface DeleteCoachProfilePhotoRequest {
  entityId: string;
}

type DeleteCoachProfilePhotoResponse = Either<ResourceNotFoundError, null>;
@Injectable()
export class DeleteCoachProfilePhoto {
  constructor(
    private readonly coachRepository: CoachRepository,
    private readonly deleter: Deleter,
  ) {}

  async execute({
    entityId,
  }: DeleteCoachProfilePhotoRequest): Promise<DeleteCoachProfilePhotoResponse> {
    await this.deleter.deleteFile({
      entityId,
    });

    const coach = await this.coachRepository.findById(entityId);

    if (!coach.avatarUrl) {
      return left(new ResourceNotFoundError());
    }

    coach.avatarUrl = null;

    await this.coachRepository.update(coach);

    return right(null);
  }
}
