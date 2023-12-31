import { Coach } from '../../enterprise/entities/coach';
import { Injectable } from '@nestjs/common';
import { CoachRepository } from '../repositories/coach-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface EditCoachUseCaseRequest {
  coach: Coach;
  coachId: string;
}

type EditCoachUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { coach: Coach }
>;
@Injectable()
export class EditCoachUseCase {
  constructor(private coachRepository: CoachRepository) {}

  async execute({
    coachId,
    coach,
  }: EditCoachUseCaseRequest): Promise<EditCoachUseCaseResponse> {
    let coachSelected = await this.coachRepository.findById(
      coach.id.toString(),
    );

    if (!coachSelected) {
      return left(new ResourceNotFoundError());
    }

    if (coach.id.toString() !== coachId) {
      return left(new NotAllowedError());
    }

    coachSelected = coach;

    await this.coachRepository.update(coachSelected);

    return right({
      coach: coachSelected,
    });
  }
}
