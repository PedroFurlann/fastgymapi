import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Exercise } from '@/domain/gym/enterprise/entities/exercise';
import { Prisma, Exercise as PrismaExercise } from '@prisma/client';

export class PrismaExerciseMapper {
  static toDomain(raw: PrismaExercise): Exercise {
    return Exercise.create(
      {
        title: raw.title,
        description: raw.description,
        coachId: new UniqueEntityID(raw.coachId),
        athleteId: raw.athleteId ? new UniqueEntityID(raw.athleteId) : null,
        createdAt: raw.createdAt,
        videoUrl: raw.videoUrl ? raw.videoUrl : null,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
        category: raw.category,
        dayOfWeek: raw.dayOfWeek ? raw.dayOfWeek : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    exercise: Exercise,
  ): Prisma.ExerciseUncheckedCreateInput {
    return {
      id: exercise.id.toString(),
      coachId: exercise.coachId?.toString(),
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      dayOfWeek: exercise.dayOfWeek,
      athleteId: exercise.athleteId?.toString(),
      videoUrl: exercise.videoUrl,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
