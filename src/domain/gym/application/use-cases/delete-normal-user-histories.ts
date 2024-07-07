import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HistoryRepository } from '../repositories/history-repository';

interface DeleteNormalUserHistoriesUseCaseRequest {
  normalUserId: string;
}

type DeleteNormalUserHistoriesUseCaseResponse = Either<NotAllowedError, null>;
@Injectable()
export class DeleteNormalUserHistoriesUseCase {
  constructor(private historyRepostiory: HistoryRepository) {}

  async execute({
    normalUserId,
  }: DeleteNormalUserHistoriesUseCaseRequest): Promise<DeleteNormalUserHistoriesUseCaseResponse> {
    if (!normalUserId) {
      return left(new NotAllowedError());
    }

    await this.historyRepostiory.deleteManyByNormalUserId(normalUserId);

    return right(null);
  }
}
