import { Either, left, right } from 'src/core/either';
import { Athlete } from '../../enterprise/entities/athlete';
import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { AthleteAlreadyExistsError } from './errors/athlete-already-exists-error';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

interface RegisterAthleteUseCaseRequest {
  name: string;
  email: string;
  password: string;
  coachId: string;
}

type RegisterAthleteUseCaseResponse = Either<
  AthleteAlreadyExistsError,
  { athlete: Athlete }
>;
@Injectable()
export class RegisterAthleteUseCase {
  constructor(
    private athleteRepository: AthleteRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    coachId,
  }: RegisterAthleteUseCaseRequest): Promise<RegisterAthleteUseCaseResponse> {
    const athleteAlreadyExists =
      await this.athleteRepository.findByEmail(email);

    if (athleteAlreadyExists) {
      return left(new AthleteAlreadyExistsError(name));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const athlete = Athlete.create({
      name,
      email,
      password: hashedPassword,
      coachId: new UniqueEntityID(coachId),
    });

    await this.athleteRepository.create(athlete);

    return right({
      athlete,
    });
  }
}
