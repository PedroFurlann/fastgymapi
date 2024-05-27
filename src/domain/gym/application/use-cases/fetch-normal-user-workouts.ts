import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Workout } from '../../enterprise/entities/workout';
import { WorkoutRepository } from '../repositories/workout-repository';

interface FetchNormalUserWorkoutsUseCaseRequest {
  normalUserId: string;
}

type FetchNormalUserWorkoutsUseCaseResponse = Either<
  null,
  { workouts: Workout[] }
>;
@Injectable()
export class FetchNormalUserWorkoutsUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    normalUserId,
  }: FetchNormalUserWorkoutsUseCaseRequest): Promise<FetchNormalUserWorkoutsUseCaseResponse> {
    const workouts =
      await this.workoutRepository.findManyByNormalUserId(normalUserId);

    return right({
      workouts,
    });
  }
}
