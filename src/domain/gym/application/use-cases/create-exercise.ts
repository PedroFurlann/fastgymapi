import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateExerciseUseCaseRequest {
  title: string;
  description: string;
  coachId: string;
}

type CreateExerciseUseCaseResponse = Either<null, { exercise: Exercise }>;
@Injectable()
export class CreateExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    title,
    coachId,
    description,
  }: CreateExerciseUseCaseRequest): Promise<CreateExerciseUseCaseResponse> {
    const exercise = Exercise.create({
      title,
      description,
      coachId: new UniqueEntityID(coachId),
    });

    await this.exerciseRepository.create(exercise);

    return right({
      exercise,
    });
  }
}