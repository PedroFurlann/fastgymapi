import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../repositories/workout-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HistoryRepository } from '../repositories/history-repository';

interface FavoriteWorkoutUseCaseRequest {
  normalUserId: string;
  workoutId: string;
  favorite: boolean;
}

type FavoriteWorkoutUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class FavoriteWorkoutUseCase {
  constructor(
    private workoutRepository: WorkoutRepository,
    private historyRepository: HistoryRepository,
  ) {}

  async execute({
    normalUserId,
    workoutId,
    favorite,
  }: FavoriteWorkoutUseCaseRequest): Promise<FavoriteWorkoutUseCaseResponse> {
    const workoutSelected = await this.workoutRepository.findById(workoutId);
    const history = await this.historyRepository.findManyByWorkoutId(workoutId);

    if (!workoutSelected) {
      return left(new ResourceNotFoundError());
    }

    if (workoutSelected.normalUserId.toString() !== normalUserId) {
      return left(new NotAllowedError());
    }

    await this.workoutRepository.favoriteWorkout(workoutId, favorite);

    if (history.length > 0) {
      await this.historyRepository.updateManyByWorkoutId(
        workoutId,
        workoutSelected.title,
        favorite,
      );
    }

    return right(null);
  }
}
