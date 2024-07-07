import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { History } from '../../enterprise/entities/history';
import { HistoryRepository } from '../repositories/history-repository';

interface FetchNormalUserHistoriesUseCaseRequest {
  normalUserId: string;
}

type FetchNormalUserHistoriesUseCaseResponse = Either<
  null,
  {
    histories: History[];
  }
>;
@Injectable()
export class FetchNormalUserHistoriesUseCase {
  constructor(private historyRepository: HistoryRepository) {}

  async execute({
    normalUserId,
  }: FetchNormalUserHistoriesUseCaseRequest): Promise<FetchNormalUserHistoriesUseCaseResponse> {
    const histories =
      await this.historyRepository.findManyByNormalUserId(normalUserId);

    return right({
      histories,
    });
  }
}
