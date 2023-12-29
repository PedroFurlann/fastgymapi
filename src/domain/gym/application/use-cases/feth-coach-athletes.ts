import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Athlete } from '../../enterprise/entities/athlete';
import { AthleteRepository } from '../repositories/athlete-repository';

interface FetchCoachAthletesUseCaseRequest {
  coachId: string;
}

type FetchCoachAthletesUseCaseResponse = Either<null, { athletes: Athlete[] }>;
@Injectable()
export class FetchCoachAthletesUseCase {
  constructor(private athleteRepository: AthleteRepository) {}

  async execute({
    coachId,
  }: FetchCoachAthletesUseCaseRequest): Promise<FetchCoachAthletesUseCaseResponse> {
    const athletes = await this.athleteRepository.findManyByCoachId(coachId);

    return right({
      athletes,
    });
  }
}
