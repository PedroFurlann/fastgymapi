import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { History } from '../../enterprise/entities/history';
import { HistoryRepository } from '../repositories/history-repository';
import { Workout } from '../../enterprise/entities/workout';
import { WorkoutRepository } from '../repositories/workout-repository';

interface FetchHistoryByIdUseCaseRequest {
  historyId: string;
}

type FetchHistoryByIdUseCaseResponse = Either<
  null,
  {
    history: History;
    workout: Workout;
  }
>;
@Injectable()
export class FetchHistoryByIdUseCase {
  constructor(
    private historyRepository: HistoryRepository,
    private workoutRepository: WorkoutRepository,
  ) {}

  async execute({
    historyId,
  }: FetchHistoryByIdUseCaseRequest): Promise<FetchHistoryByIdUseCaseResponse> {
    const history = await this.historyRepository.findById(historyId);
    const workout = await this.workoutRepository.findById(
      history.workoutId.toString(),
    );

    return right({
      history,
      workout,
    });
  }
}
