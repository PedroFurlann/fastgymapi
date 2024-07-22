import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HashGenerator } from '../cryptography/hash-generator';

interface UpdateNormalUserPasswordUseCaseRequest {
  email: string;
  new_password: string;
}

type UpdateNormalUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;
@Injectable()
export class UpdateNormalUserPasswordUseCase {
  constructor(
    private normalUserRepository: NormalUserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    new_password,
  }: UpdateNormalUserPasswordUseCaseRequest): Promise<UpdateNormalUserPasswordUseCaseResponse> {
    const normalUserSelected =
      await this.normalUserRepository.findByEmail(email);

    if (!normalUserSelected) {
      return left(new ResourceNotFoundError());
    }

    if (normalUserSelected.email.toString() !== email) {
      return left(new NotAllowedError());
    }

    const hashedPassword = await this.hashGenerator.hash(new_password);
    normalUserSelected.password = hashedPassword;

    await this.normalUserRepository.update(normalUserSelected);

    return right(null);
  }
}
