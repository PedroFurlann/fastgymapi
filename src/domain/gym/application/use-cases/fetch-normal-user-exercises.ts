import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Exercise } from '../../enterprise/entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';

interface FetchNormalUserExercisesUseCaseRequest {
  normalUserId: string;
}

type FetchNormalUserExercisesUseCaseResponse = Either<
  null,
  { exercises: Exercise[] }
>;
@Injectable()
export class FetchNormalUserExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    normalUserId,
  }: FetchNormalUserExercisesUseCaseRequest): Promise<FetchNormalUserExercisesUseCaseResponse> {
    const exercises =
      await this.exerciseRepository.findManyByNormalUserId(normalUserId);

    return right({
      exercises,
    });
  }
}
