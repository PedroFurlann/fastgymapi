import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Coach } from '../../enterprise/entities/coach';
import { CoachRepository } from '../repositories/coach-repository';

interface FetchCoachByIdUseCaseRequest {
  coachId: string;
}

type FetchCoachByIdUseCaseResponse = Either<null, { coach: Coach }>;
@Injectable()
export class FetchCoachByIdUseCase {
  constructor(private coachRepository: CoachRepository) {}

  async execute({
    coachId,
  }: FetchCoachByIdUseCaseRequest): Promise<FetchCoachByIdUseCaseResponse> {
    const coach = await this.coachRepository.findById(coachId);

    return right({
      coach,
    });
  }
}
