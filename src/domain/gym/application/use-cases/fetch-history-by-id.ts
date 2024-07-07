import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { History } from '../../enterprise/entities/history';
import { HistoryRepository } from '../repositories/history-repository';
import { Exercise } from '../../enterprise/entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';

interface FetchHistoryByIdUseCaseRequest {
  historyId: string;
}

type FetchHistoryByIdUseCaseResponse = Either<
  null,
  {
    history: History;
    exercises: Exercise[];
  }
>;
@Injectable()
export class FetchHistoryByIdUseCase {
  constructor(
    private historyRepository: HistoryRepository,
    private exercisesRepository: ExerciseRepository,
  ) {}

  async execute({
    historyId,
  }: FetchHistoryByIdUseCaseRequest): Promise<FetchHistoryByIdUseCaseResponse> {
    const history = await this.historyRepository.findById(historyId);
    const exercises = await this.exercisesRepository.findManyByWorkoutId(
      history.workoutId.toString(),
    );

    return right({
      history,
      exercises,
    });
  }
}
