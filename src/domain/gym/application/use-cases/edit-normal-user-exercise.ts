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
  series?: number;
  repetitions?: number[];
  weights?: number[];
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
    title,
    workoutId,
    category,
    description,
    exerciseId,
    series,
    repetitions,
    weights,
  }: EditNormalUserExerciseUseCaseRequest): Promise<EditNormalUserExerciseUseCaseResponse> {
    const exerciseSelected = await this.exerciseRepository.findById(exerciseId);

    if (!exerciseSelected) {
      return left(new ResourceNotFoundError());
    }

    if (exerciseSelected.normalUserId.toString() !== normalUserId) {
      return left(new NotAllowedError());
    }

    exerciseSelected.title = title;
    exerciseSelected.description = description;
    exerciseSelected.category = category;

    if (!workoutId) exerciseSelected.workoutId = null;

    if (series) {
      exerciseSelected.series = series;
    }

    if (repetitions.length > 0) {
      exerciseSelected.repetitions = repetitions;
    }

    if (weights.length > 0) {
      exerciseSelected.weights = weights;
    }

    await this.exerciseRepository.update(exerciseSelected);

    return right({
      exercise: exerciseSelected,
    });
  }
}
