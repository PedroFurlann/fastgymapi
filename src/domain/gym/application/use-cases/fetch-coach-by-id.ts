import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Coach } from '../../enterprise/entities/coach';
import { CoachRepository } from '../repositories/coach-repository';

interface FetchCoachbyidUseCaseRequest {
  coachId: string;
}

type FetchCoachbyidUseCaseResponse = Either<null, { coach: Coach }>;
@Injectable()
export class FetchCoachbyidUseCase {
  constructor(private coachRepository: CoachRepository) {}

  async execute({
    coachId,
  }: FetchCoachbyidUseCaseRequest): Promise<FetchCoachbyidUseCaseResponse> {
    const coach = await this.coachRepository.findById(coachId);

    return right({
      coach,
    });
  }
}
