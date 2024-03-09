import { Either, left, right } from '@/core/either';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateNormalUserUseCaseRequest {
  email: string;
  password?: string;
}

type AuthenticateNormalUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;
@Injectable()
export class AuthenticateNormalUserUseCase {
  constructor(
    private readonly normaluserRepository: NormalUserRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateNormalUserUseCaseRequest): Promise<AuthenticateNormalUserUseCaseResponse> {
    const normalUser = await this.normaluserRepository.findByEmail(email);

    if (!normalUser) {
      return left(new WrongCredentialsError());
    }

    let isPasswordValid: boolean;

    if (password) {
      isPasswordValid = await this.hashComparer.compare(
        password,
        normalUser.password,
      );
    }

    if (password && !isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: normalUser.id.toString(),
      normalUser: true,
    });

    return right({
      accessToken,
    });
  }
}
