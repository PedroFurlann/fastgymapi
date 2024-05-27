import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../repositories/workout-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteNormalUserWorkoutUseCaseRequest {
  workoutId: string;
  normalUserId: string;
}

type DeleteNormalUserWorkoutUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteNormalUserWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    normalUserId,
    workoutId,
  }: DeleteNormalUserWorkoutUseCaseRequest): Promise<DeleteNormalUserWorkoutUseCaseResponse> {
    const workout = await this.workoutRepository.findById(workoutId);

    if (!workout) {
      return left(new ResourceNotFoundError());
    }

    if (normalUserId !== workout.normalUserId.toString()) {
      return left(new NotAllowedError());
    }

    await this.workoutRepository.delete(workoutId);

    return right(null);
  }
}
