import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Exercise } from '@/domain/gym/enterprise/entities/exercise';
import { Prisma, Exercise as PrismaExercise } from '@prisma/client';

export class PrismaExerciseMapper {
  static toDomain(raw: PrismaExercise): Exercise {
    return Exercise.create(
      {
        title: raw.title,
        description: raw.description,
        coachId: raw.coachId ? new UniqueEntityID(raw.coachId) : null,
        athleteId: raw.athleteId ? new UniqueEntityID(raw.athleteId) : null,
        createdAt: raw.createdAt,
        mediaUrl: raw.mediaUrl ? raw.mediaUrl : null,
        previewUrl: raw.previewUrl ? raw.previewUrl : null,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
        category: raw.category,
        series: raw.series,
        repetitions: raw.repetitions,
        normalUserId: raw.normalUserId
          ? new UniqueEntityID(raw.normalUserId)
          : null,
        workoutId: raw.workoutId ? new UniqueEntityID(raw.workoutId) : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    exercise: Exercise,
  ): Prisma.ExerciseUncheckedCreateInput {
    return {
      id: exercise.id.toString(),
      coachId: exercise.coachId ? exercise.coachId.toString() : null,
      title: exercise.title,
      description: exercise.description,
      series: exercise.series,
      repetitions: exercise.repetitions,
      category: exercise.category,
      athleteId: exercise.athleteId ? exercise.athleteId.toString() : null,
      normalUserId: exercise.normalUserId
        ? exercise.normalUserId.toString()
        : null,
      workoutId: exercise.workoutId ? exercise.workoutId.toString() : null,
      mediaUrl: exercise.mediaUrl,
      previewUrl: exercise.previewUrl,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
