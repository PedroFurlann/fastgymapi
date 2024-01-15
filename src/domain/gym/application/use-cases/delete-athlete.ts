import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteAthleteUseCaseRequest {
  athleteId: string;
}

type DeleteAthleteUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteAthleteUseCase {
  constructor(private athleteRepository: AthleteRepository) {}

  async execute({
    athleteId,
  }: DeleteAthleteUseCaseRequest): Promise<DeleteAthleteUseCaseResponse> {
    const athlete = await this.athleteRepository.findById(athleteId);

    if (!athlete) {
      return left(new ResourceNotFoundError());
    }

    await this.athleteRepository.delete(athleteId);

    return right(null);
  }
}
