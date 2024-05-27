import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../repositories/workout-repository';
import { Either, right } from '@/core/either';

interface CreateWorkoutUseCaseRequest {
  workoutId: string;
  favorite: boolean;
}

type CreateWorkoutUseCaseResponse = Either<null, null>;
@Injectable()
export class CreateWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    workoutId,
    favorite,
  }: CreateWorkoutUseCaseRequest): Promise<CreateWorkoutUseCaseResponse> {
    await this.workoutRepository.favoriteWorkout(workoutId, favorite);

    return right(null);
  }
}
