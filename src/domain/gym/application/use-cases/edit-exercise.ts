import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface EditExerciseUseCaseRequest {
  exercise: Exercise;
  coachId: string;
}

type EditExerciseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { exercise: Exercise }
>;
@Injectable()
export class EditExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    coachId,
    exercise,
  }: EditExerciseUseCaseRequest): Promise<EditExerciseUseCaseResponse> {
    let exerciseSelected = await this.exerciseRepository.findById(
      exercise.id.toString(),
    );

    if (!exerciseSelected) {
      return left(new ResourceNotFoundError());
    }

    if (exercise.id.toString() !== coachId) {
      return left(new NotAllowedError());
    }

    exerciseSelected = exercise;

    await this.exerciseRepository.update(exerciseSelected);

    return right({
      exercise: exerciseSelected,
    });
  }
}
