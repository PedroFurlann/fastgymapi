import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteExerciseUseCaseRequest {
  exerciseId: string;
  coachId: string;
}

type DeleteExerciseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    coachId,
    exerciseId,
  }: DeleteExerciseUseCaseRequest): Promise<DeleteExerciseUseCaseResponse> {
    const exercise = await this.exerciseRepository.findById(exerciseId);

    if (!exercise) {
      return left(new ResourceNotFoundError());
    }

    if (coachId !== exercise.coachId.toString()) {
      return left(new NotAllowedError());
    }

    await this.exerciseRepository.delete(exerciseId);

    return right(null);
  }
}
