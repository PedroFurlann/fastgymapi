import { NormalUser } from '../../enterprise/entities/normal-user';
import { Injectable } from '@nestjs/common';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HashGenerator } from '../cryptography/hash-generator';

interface EditNormalUserUseCaseRequest {
  name: string;
  password?: string | null;
  normalUserId: string;
}

type EditNormalUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { normalUser: NormalUser }
>;
@Injectable()
export class EditNormalUserUseCase {
  constructor(
    private normalUserRepository: NormalUserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    normalUserId,
    name,
    password,
  }: EditNormalUserUseCaseRequest): Promise<EditNormalUserUseCaseResponse> {
    const normalUserSelected =
      await this.normalUserRepository.findById(normalUserId);

    if (!normalUserSelected) {
      return left(new ResourceNotFoundError());
    }

    if (normalUserSelected.id.toString() !== normalUserId) {
      return left(new NotAllowedError());
    }

    normalUserSelected.name = name;

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password);
      normalUserSelected.password = hashedPassword;
    }

    await this.normalUserRepository.update(normalUserSelected);

    return right({
      normalUser: normalUserSelected,
    });
  }
}
