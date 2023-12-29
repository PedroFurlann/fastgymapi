import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Exercise } from '../../enterprise/entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';

interface FetchCoachExercisesUseCaseRequest {
  coachId: string;
}

type FetchCoachExercisesUseCaseResponse = Either<
  null,
  { exercises: Exercise[] }
>;
@Injectable()
export class FetchCoachExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    coachId,
  }: FetchCoachExercisesUseCaseRequest): Promise<FetchCoachExercisesUseCaseResponse> {
    const exercises = await this.exerciseRepository.findManyByCoachId(coachId);

    return right({
      exercises,
    });
  }
}
