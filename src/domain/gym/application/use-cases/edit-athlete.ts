import { Athlete } from '../../enterprise/entities/athlete';
import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface EditAthleteUseCaseRequest {
  athlete: Athlete;
  coachId: string;
}

type EditAthleteUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { athlete: Athlete }
>;
@Injectable()
export class EditAthleteUseCase {
  constructor(private athleteRepository: AthleteRepository) {}

  async execute({
    coachId,
    athlete,
  }: EditAthleteUseCaseRequest): Promise<EditAthleteUseCaseResponse> {
    let athleteSelected = await this.athleteRepository.findById(
      athlete.id.toString(),
    );

    if (!athleteSelected) {
      return left(new ResourceNotFoundError());
    }

    if (athlete.coachId.toString() !== coachId) {
      return left(new NotAllowedError());
    }

    athleteSelected = athlete;

    await this.athleteRepository.update(athleteSelected);

    return right({
      athlete: athleteSelected,
    });
  }
}
