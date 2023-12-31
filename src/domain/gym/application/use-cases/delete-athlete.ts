import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteAthleteUseCaseRequest {
  athleteId: string;
  coachId: string;
}

type DeleteAthleteUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteAthleteUseCase {
  constructor(private athleteRepository: AthleteRepository) {}

  async execute({
    coachId,
    athleteId,
  }: DeleteAthleteUseCaseRequest): Promise<DeleteAthleteUseCaseResponse> {
    const athlete = await this.athleteRepository.findById(athleteId);

    if (!athlete) {
      return left(new ResourceNotFoundError());
    }

    if (coachId !== athlete.coachId.toString()) {
      return left(new NotAllowedError());
    }

    await this.athleteRepository.delete(athleteId);

    return right(null);
  }
}
