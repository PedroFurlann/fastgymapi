import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Deleter } from '../storage/deleter';

interface DeleteAthleteProfilePhotoRequest {
  entityId: string;
}

type DeleteAthleteProfilePhotoResponse = Either<ResourceNotFoundError, null>;
@Injectable()
export class DeleteAthleteProfilePhoto {
  constructor(
    private readonly athleteRepository: AthleteRepository,
    private readonly deleter: Deleter,
  ) {}

  async execute({
    entityId,
  }: DeleteAthleteProfilePhotoRequest): Promise<DeleteAthleteProfilePhotoResponse> {
    const athlete = await this.athleteRepository.findById(entityId);

    if (!athlete.avatarUrl) {
      return left(new ResourceNotFoundError());
    }

    await this.deleter.deleteAthleteProfilePhoto({ entityId });

    await this.athleteRepository.update(athlete);

    return right(null);
  }
}
