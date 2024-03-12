import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteNormalUserExerciseUseCaseRequest {
  exerciseId: string;
  normalUserId: string;
}

type DeleteNormalUserExerciseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteNormalUserExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    normalUserId,
    exerciseId,
  }: DeleteNormalUserExerciseUseCaseRequest): Promise<DeleteNormalUserExerciseUseCaseResponse> {
    const exercise = await this.exerciseRepository.findById(exerciseId);

    if (!exercise) {
      return left(new ResourceNotFoundError());
    }

    if (normalUserId !== exercise.normalUserId.toString()) {
      return left(new NotAllowedError());
    }

    await this.exerciseRepository.delete(exerciseId);

    return right(null);
  }
}
