import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateManyExercisesUseCaseRequest {
  exercises: {
    title: string;
    description: string;
    category: string;
    athleteId?: string;
    normalUserId?: string;
    workoutId?: string;
    mediaUrl?: string;
    previewUrl?: string;
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
      const athleteId = exercise.athleteId
        ? new UniqueEntityID(exercise.athleteId)
        : null;

      const normalUserId = exercise.normalUserId
        ? new UniqueEntityID(exercise.normalUserId)
        : null;

      const workoutId = exercise.workoutId
        ? new UniqueEntityID(exercise.workoutId)
        : null;

      return Exercise.create({
        athleteId: athleteId ?? null,
        normalUserId: normalUserId ?? null,
        title: exercise.title,
        description: exercise.description,
        category: exercise.category,
        workoutId: workoutId ?? null,
        mediaUrl: exercise.mediaUrl ?? null,
        previewUrl: exercise.previewUrl ?? null,
        series: [1, 2, 3, 4],
        repetitions: [10, 10, 10, 10],
      });
    });

    await this.exerciseRepository.createMany(createdExercises);

    return right({
      exercises: createdExercises,
    });
  }
}
