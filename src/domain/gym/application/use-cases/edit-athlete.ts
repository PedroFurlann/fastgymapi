import { Athlete } from '../../enterprise/entities/athlete';
import { Injectable } from '@nestjs/common';
import { AthleteRepository } from '../repositories/athlete-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HashGenerator } from '../cryptography/hash-generator';

interface EditAthleteUseCaseRequest {
  name: string;
  password?: string | null;
  athleteId: string;
  coachId: string;
}

type EditAthleteUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { athlete: Athlete }
>;
@Injectable()
export class EditAthleteUseCase {
  constructor(
    private athleteRepository: AthleteRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    athleteId,
    coachId,
    name,
    password,
  }: EditAthleteUseCaseRequest): Promise<EditAthleteUseCaseResponse> {
    const athleteSelected = await this.athleteRepository.findById(athleteId);

    if (!athleteSelected) {
      return left(new ResourceNotFoundError());
    }

    if (athleteSelected.coachId.toString() !== coachId) {
      return left(new NotAllowedError());
    }

    athleteSelected.name = name;

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password);
      athleteSelected.password = hashedPassword;
    }

    await this.athleteRepository.update(athleteSelected);

    return right({
      athlete: athleteSelected,
    });
  }
}
