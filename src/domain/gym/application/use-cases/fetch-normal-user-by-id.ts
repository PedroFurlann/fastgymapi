import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { NormalUser } from '../../enterprise/entities/normal-user';
import { NormalUserRepository } from '../repositories/normal-user-repository';

interface FetchNormalUserByIdUseCaseRequest {
  normalUserId: string;
}

type FetchNormalUserByIdUseCaseResponse = Either<
  null,
  { normalUser: NormalUser }
>;
@Injectable()
export class FetchNormalUserByIdUseCase {
  constructor(private normalUserRepository: NormalUserRepository) {}

  async execute({
    normalUserId,
  }: FetchNormalUserByIdUseCaseRequest): Promise<FetchNormalUserByIdUseCaseResponse> {
    const normalUser = await this.normalUserRepository.findById(normalUserId);

    return right({
      normalUser,
    });
  }
}
