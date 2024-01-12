import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Athlete } from '../../enterprise/entities/athlete';
import { AthleteRepository } from '../repositories/athlete-repository';

interface FetchAthleteByIdUseCaseRequest {
  athleteId: string;
}

type FetchAthleteByIdUseCaseResponse = Either<null, { athlete: Athlete }>;
@Injectable()
export class FetchAthleteByIdUseCase {
  constructor(private athleteRepository: AthleteRepository) {}

  async execute({
    athleteId,
  }: FetchAthleteByIdUseCaseRequest): Promise<FetchAthleteByIdUseCaseResponse> {
    const athlete = await this.athleteRepository.findById(athleteId);

    return right({
      athlete,
    });
  }
}
