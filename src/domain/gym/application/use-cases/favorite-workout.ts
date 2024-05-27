import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../repositories/workout-repository';
import { Either, right } from '@/core/either';

interface FavoriteWorkoutUseCaseRequest {
  workoutId: string;
  favorite: boolean;
}

type FavoriteWorkoutUseCaseResponse = Either<null, null>;
@Injectable()
export class FavoriteWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    workoutId,
    favorite,
  }: FavoriteWorkoutUseCaseRequest): Promise<FavoriteWorkoutUseCaseResponse> {
    await this.workoutRepository.favoriteWorkout(workoutId, favorite);

    return right(null);
  }
}
