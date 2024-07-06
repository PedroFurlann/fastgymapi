import { History } from '../../enterprise/entities/history';
import { Injectable } from '@nestjs/common';
import { HistoryRepository } from '../repositories/history-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateHistoryUseCaseRequest {
  elapsedTime: number;
  completedAt: Date;
  workoutId: string;
  coachId?: string | null;
  athleteId?: string | null;
  normalUserId?: string | null;
}

type CreateHistoryUseCaseResponse = Either<null, { history: History }>;
@Injectable()
export class CreateHistoryUseCase {
  constructor(private historyRepository: HistoryRepository) {}

  async execute({
    elapsedTime,
    completedAt,
    coachId,
    workoutId,
    normalUserId,
    athleteId,
  }: CreateHistoryUseCaseRequest): Promise<CreateHistoryUseCaseResponse> {
    const history = History.create({
      elapsedTime,
      workoutId: new UniqueEntityID(workoutId),
      completedAt,
    });

    if (athleteId) {
      history.athleteId = new UniqueEntityID(athleteId);
    }

    if (coachId) {
      history.coachId = new UniqueEntityID(coachId);
    }

    if (normalUserId) {
      history.normalUserId = new UniqueEntityID(normalUserId);
    }

    await this.historyRepository.create(history);

    return right({
      history,
    });
  }
}
