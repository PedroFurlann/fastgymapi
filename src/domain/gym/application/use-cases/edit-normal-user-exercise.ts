import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface EditNormalUserExerciseUseCaseRequest {
  normalUserId: string;
  title: string;
  category: string;
  description: string;
  workoutId?: string;
  exerciseId: string;
  series?: number[];
  repetitions?: number[];
}

type EditNormalUserExerciseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { exercise: Exercise }
>;
@Injectable()
export class EditNormalUserExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    normalUserId,
    workoutId,
    exerciseId,
    series,
    repetitions,
  }: EditNormalUserExerciseUseCaseRequest): Promise<EditNormalUserExerciseUseCaseResponse> {
    const exerciseSelected = await this.exerciseRepository.findById(exerciseId);

    if (!exerciseSelected) {
      return left(new ResourceNotFoundError());
    }

    if (exerciseSelected.normalUserId.toString() !== normalUserId) {
      return left(new NotAllowedError());
    }

    if (!workoutId) exerciseSelected.workoutId = null;

    if (repetitions.length > 0) {
      exerciseSelected.repetitions = repetitions;
    }

    if (series.length > 0) {
      exerciseSelected.series = series;
    }

    await this.exerciseRepository.update(exerciseSelected);

    return right({
      exercise: exerciseSelected,
    });
  }
}
