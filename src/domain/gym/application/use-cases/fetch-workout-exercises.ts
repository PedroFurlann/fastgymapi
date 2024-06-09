import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Exercise } from '../../enterprise/entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';

interface FetchWorkoutExercisesUseCaseRequest {
  workoutId: string;
}

type FetchWorkoutExercisesUseCaseResponse = Either<
  null,
  { exercises: Exercise[] }
>;
@Injectable()
export class FetchWorkoutExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    workoutId,
  }: FetchWorkoutExercisesUseCaseRequest): Promise<FetchWorkoutExercisesUseCaseResponse> {
    const exercises =
      await this.exerciseRepository.findManyByWorkoutId(workoutId);

    return right({
      exercises,
    });
  }
}
