import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Workout } from '../../enterprise/entities/workout';
import { WorkoutRepository } from '../repositories/workout-repository';

interface FetchWorkoutByIdUseCaseRequest {
  workoutId: string;
}

type FetchWorkoutByIdUseCaseResponse = Either<null, { workout: Workout }>;
@Injectable()
export class FetchWorkoutByIdUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    workoutId,
  }: FetchWorkoutByIdUseCaseRequest): Promise<FetchWorkoutByIdUseCaseResponse> {
    const workout = await this.workoutRepository.findById(workoutId);

    return right({
      workout,
    });
  }
}
