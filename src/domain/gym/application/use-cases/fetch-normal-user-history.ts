import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { History } from '../../enterprise/entities/history';
import { HistoryRepository } from '../repositories/history-repository';

interface FetchNormalUserHistoryUseCaseRequest {
  normalUserId: string;
}

type FetchNormalUserHistoryUseCaseResponse = Either<
  null,
  {
    history: History[];
  }
>;
@Injectable()
export class FetchNormalUserHistoryUseCase {
  constructor(private historyRepository: HistoryRepository) {}

  async execute({
    normalUserId,
  }: FetchNormalUserHistoryUseCaseRequest): Promise<FetchNormalUserHistoryUseCaseResponse> {
    const history =
      await this.historyRepository.findManyByNormalUserId(normalUserId);

    return right({
      history,
    });
  }
}
