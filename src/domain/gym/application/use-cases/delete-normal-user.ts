import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface DeleteNormalUserUseCaseRequest {
  normalUserId: string;
}

type DeleteNormalUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class DeleteNormalUserUseCase {
  constructor(private normalUserRepository: NormalUserRepository) {}

  async execute({
    normalUserId,
  }: DeleteNormalUserUseCaseRequest): Promise<DeleteNormalUserUseCaseResponse> {
    const normalUser = await this.normalUserRepository.findById(normalUserId);

    if (!normalUser) {
      return left(new ResourceNotFoundError());
    }

    await this.normalUserRepository.delete(normalUserId);

    return right(null);
  }
}
