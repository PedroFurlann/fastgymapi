import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CoachRepository } from '../repositories/coach-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Deleter } from '../storage/deleter';

interface DeleteCoachProfilePhotoRequest {
  entityId: string;
}

type DeleteCoachProfilePhotoResponse = Either<ResourceNotFoundError, null>;
@Injectable()
export class DeleteCoachProfilePhotoUseCase {
  constructor(
    private readonly coachRepository: CoachRepository,
    private readonly deleter: Deleter,
  ) {}

  async execute({
    entityId,
  }: DeleteCoachProfilePhotoRequest): Promise<DeleteCoachProfilePhotoResponse> {
    const coach = await this.coachRepository.findById(entityId);

    if (!coach.avatarUrl) {
      return left(new ResourceNotFoundError());
    }

    await this.deleter.deleteCoachProfilePhoto({ entityId });

    coach.avatarUrl = null;

    await this.coachRepository.update(coach);

    return right(null);
  }
}
