import { Either, left, right } from '@/core/either';
import { NormalUserRepository } from '../repositories/normal-user-repository';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { NormalUser } from '../../enterprise/entities/normal-user';
import { HashGenerator } from '../cryptography/hash-generator';

interface NormalUserOAuthAuthenticateRequest {
  name?: string;
  email: string;
  avatarUrl?: string;
  password?: string;
}

type NormalUserOAuthAuthenticateResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;
@Injectable()
export class NormalUserOAuthAuthenticate {
  constructor(
    private readonly normalUserRepository: NormalUserRepository,
    private readonly hashComparer: HashComparer,
    private readonly hashGenerator: HashGenerator,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    name,
    email,
    avatarUrl,
    password,
  }: NormalUserOAuthAuthenticateRequest): Promise<NormalUserOAuthAuthenticateResponse> {
    let normalUser = await this.normalUserRepository.findByEmail(email);

    if (!normalUser) {
      let hashedPassword: string;

      if (password) {
        hashedPassword = await this.hashGenerator.hash(password);
      }

      const createdNormalUser = NormalUser.create({
        name,
        email,
        password: hashedPassword ?? null,
        avatarUrl,
      });

      await this.normalUserRepository.create(createdNormalUser);

      normalUser = await this.normalUserRepository.findByEmail(email);
    }

    if (avatarUrl) {
      normalUser.avatarUrl = avatarUrl;
    }

    if (name) {
      normalUser.name;
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
