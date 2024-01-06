import { Either, left, right } from '@/core/either';
import { AthleteRepository } from '../repositories/athlete-repository';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateAthleteUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateAthleteUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;
@Injectable()
export class AuthenticateAthleteUseCase {
  constructor(
    private readonly athleteRepository: AthleteRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAthleteUseCaseRequest): Promise<AuthenticateAthleteUseCaseResponse> {
    const athlete = await this.athleteRepository.findByEmail(email);

    if (!athlete) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      athlete.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: athlete.id.toString(),
      isAthlete: false,
    });

    return right({
      accessToken,
    });
  }
}
