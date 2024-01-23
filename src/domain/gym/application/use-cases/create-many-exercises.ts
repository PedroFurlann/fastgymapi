import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateManyExercisesUseCaseRequest {
  exercises: {
    title: string;
    description: string;
    coachId: string;
    athleteId?: string | null;
  }[];
}

type CreateManyExercisesUseCaseResponse = Either<
  null,
  { exercises: Exercise[] }
>;
@Injectable()
export class CreateManyExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    exercises,
  }: CreateManyExercisesUseCaseRequest): Promise<CreateManyExercisesUseCaseResponse> {
    const createdExercises = exercises.map((exercise) => {
      const coachId = new UniqueEntityID(exercise.coachId);
      const athleteId = exercise.athleteId
        ? new UniqueEntityID(exercise.athleteId)
        : null;

      return Exercise.create({
        coachId,
        athleteId,
        title: exercise.title,
        description: exercise.description,
      });
    });

    await this.exerciseRepository.createMany(createdExercises);

    return right({
      exercises: createdExercises,
    });
  }
}
