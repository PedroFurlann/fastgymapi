import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HistoryRepository } from '../repositories/history-repository';

interface DeleteNormalUserHistoryUseCaseRequest {
  normalUserId: string;
}

type DeleteNormalUserHistoryUseCaseResponse = Either<NotAllowedError, null>;
@Injectable()
export class DeleteNormalUserHistoryUseCase {
  constructor(private historyRepostiory: HistoryRepository) {}

  async execute({
    normalUserId,
  }: DeleteNormalUserHistoryUseCaseRequest): Promise<DeleteNormalUserHistoryUseCaseResponse> {
    if (!normalUserId) {
      return left(new NotAllowedError());
    }

    await this.historyRepostiory.deleteManyByNormalUserId(normalUserId);

    return right(null);
  }
}
