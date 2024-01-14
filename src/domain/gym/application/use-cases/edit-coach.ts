import { Coach } from '../../enterprise/entities/coach';
import { Injectable } from '@nestjs/common';
import { CoachRepository } from '../repositories/coach-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { HashGenerator } from '../cryptography/hash-generator';

interface EditCoachUseCaseRequest {
  name: string;
  password?: string | null;
  coachId: string;
}

type EditCoachUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { coach: Coach }
>;
@Injectable()
export class EditCoachUseCase {
  constructor(
    private coachRepository: CoachRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    coachId,
    name,
    password,
  }: EditCoachUseCaseRequest): Promise<EditCoachUseCaseResponse> {
    const coachSelected = await this.coachRepository.findById(coachId);

    if (!coachSelected) {
      return left(new ResourceNotFoundError());
    }

    if (coachSelected.id.toString() !== coachId) {
      return left(new NotAllowedError());
    }

    coachSelected.name = name;

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password);
      coachSelected.password = hashedPassword;
    }

    await this.coachRepository.update(coachSelected);

    return right({
      coach: coachSelected,
    });
  }
}
