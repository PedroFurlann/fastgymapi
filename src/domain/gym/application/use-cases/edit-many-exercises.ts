import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface EditManyExercisesUseCaseRequest {
  exercises: {
    id: string;
    title: string;
    description: string;
    category: string;
    athleteId?: string;
    normalUserId?: string;
    workoutId?: string;
    mediaUrl?: string;
    previewUrl?: string;
    series?: number;
    repetitions?: number[];
    weights?: number[];
  }[];
}

type EditManyExercisesUseCaseResponse = Either<null, null>;
@Injectable()
export class EditManyExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    exercises,
  }: EditManyExercisesUseCaseRequest): Promise<EditManyExercisesUseCaseResponse> {
    const editedExercises = exercises.map((exercise) => {
      const athleteId = exercise.athleteId
        ? new UniqueEntityID(exercise.athleteId)
        : null;

      const normalUserId = exercise.normalUserId
        ? new UniqueEntityID(exercise.normalUserId)
        : null;

      const workoutId = exercise.workoutId
        ? new UniqueEntityID(exercise.workoutId)
        : null;

      return Exercise.create(
        {
          athleteId: athleteId ?? null,
          normalUserId: normalUserId ?? null,
          title: exercise.title,
          description: exercise.description,
          category: exercise.category,
          workoutId: workoutId ?? null,
          series: exercise.series ?? null,
          repetitions: exercise.repetitions ?? null,
          weights: exercise.weights ?? null,
          mediaUrl: exercise.mediaUrl ?? null,
          previewUrl: exercise.previewUrl ?? null,
        },
        new UniqueEntityID(exercise.id),
      );
    });

    await this.exerciseRepository.updateMany(editedExercises);

    return right(null);
  }
}
