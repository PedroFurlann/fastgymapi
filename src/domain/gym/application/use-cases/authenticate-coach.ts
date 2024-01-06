import { Either, left, right } from '@/core/either';
import { CoachRepository } from '../repositories/coach-repository';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface AuthenticateCoachUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateCoachUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;
@Injectable()
export class AuthenticateCoachUseCase {
  constructor(
    private readonly coachRepository: CoachRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateCoachUseCaseRequest): Promise<AuthenticateCoachUseCaseResponse> {
    const coach = await this.coachRepository.findByEmail(email);

    if (!coach) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      coach.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: coach.id.toString(),
      isAthlete: false,
    });

    return right({
      accessToken,
    });
  }
}
