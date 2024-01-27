import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateExerciseUseCaseRequest {
  title: string;
  description: string;
  category: string;
  coachId?: string | null;
  athleteId?: string | null;
  dayOfWeek?: string | null;
}

type CreateExerciseUseCaseResponse = Either<null, { exercise: Exercise }>;
@Injectable()
export class CreateExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    title,
    coachId,
    description,
    category,
    athleteId,
    dayOfWeek,
  }: CreateExerciseUseCaseRequest): Promise<CreateExerciseUseCaseResponse> {
    const exercise = Exercise.create({
      title,
      description,
      category,
    });

    if (athleteId) {
      exercise.athleteId = new UniqueEntityID(athleteId);
    }

    if (coachId) {
      exercise.coachId = new UniqueEntityID(coachId);
    }

    if (dayOfWeek) {
      exercise.dayOfWeek = dayOfWeek;
    }

    await this.exerciseRepository.create(exercise);

    return right({
      exercise,
    });
  }
}
