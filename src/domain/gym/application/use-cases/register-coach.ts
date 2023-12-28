import { Either, left, right } from 'src/core/either';
import { Coach } from '../../enterprise/entities/coach';
import { Injectable } from '@nestjs/common';
import { CoachRepository } from '../repositories/coach-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { CoachAlreadyExistsError } from './errors/coach-alreay-exists-error';

interface RegisterCoachUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterCoachUseCaseResponse = Either<
  CoachAlreadyExistsError,
  { coach: Coach }
>;
@Injectable()
export class RegisterCoachUseCase {
  constructor(
    private coachRepository: CoachRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterCoachUseCaseRequest): Promise<RegisterCoachUseCaseResponse> {
    const coachAlreadyExists = await this.coachRepository.findByEmail(email);

    if (coachAlreadyExists) {
      return left(new CoachAlreadyExistsError(name));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const coach = Coach.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.coachRepository.create(coach);

    return right({
      coach,
    });
  }
}
