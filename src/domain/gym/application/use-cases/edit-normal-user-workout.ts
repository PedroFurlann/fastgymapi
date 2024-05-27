import { Workout } from '../../enterprise/entities/workout';
import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../repositories/workout-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface EditNormalUserWorkoutUseCaseRequest {
  normalUserId: string;
  title: string;
  workoutId: string;
}

type EditNormalUserWorkoutUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { workout: Workout }
>;
@Injectable()
export class EditNormalUserWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    normalUserId,
    title,
    workoutId,
  }: EditNormalUserWorkoutUseCaseRequest): Promise<EditNormalUserWorkoutUseCaseResponse> {
    const workoutSelected = await this.workoutRepository.findById(workoutId);

    if (!workoutSelected) {
      return left(new ResourceNotFoundError());
    }

    if (workoutSelected.normalUserId.toString() !== normalUserId) {
      return left(new NotAllowedError());
    }

    workoutSelected.title = title;

    await this.workoutRepository.update(workoutSelected);

    return right({
      workout: workoutSelected,
    });
  }
}
