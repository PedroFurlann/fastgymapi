import { Either, left, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { NormalUser } from '../../enterprise/entities/normal-user';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { NormalUserAlreadyExistsError } from './errors/normal-user-alredy-exists-error';

interface RegisterNormalUserUseCaseRequest {
  name: string;
  email: string;
  password?: string;
}

type RegisterNormalUserUseCaseResponse = Either<
  NormalUserAlreadyExistsError,
  {
    normalUser: NormalUser;
  }
>;

@Injectable()
export class RegisterNormalUserUseCase {
  constructor(
    private readonly normalUserRepository: NormalUserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterNormalUserUseCaseRequest): Promise<RegisterNormalUserUseCaseResponse> {
    const normaluserAlreadyExists =
      await this.normalUserRepository.findByEmail(email);

    if (normaluserAlreadyExists) {
      return left(new NormalUserAlreadyExistsError(name));
    }

    let hashedPassword: string;

    if (password) {
      hashedPassword = await this.hashGenerator.hash(password);
    }

    const normalUser = NormalUser.create({
      name,
      email,
      password: hashedPassword ?? null,
    });

    await this.normalUserRepository.create(normalUser);

    return right({
      normalUser,
    });
  }
}
