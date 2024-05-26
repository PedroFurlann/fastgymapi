import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Workout } from '@/domain/gym/enterprise/entities/workout';
import { Prisma, Workout as PrismaWorkout } from '@prisma/client';

export class PrismaWorkoutMapper {
  static toDomain(raw: PrismaWorkout): Workout {
    return Workout.create(
      {
        title: raw.title,
        coachId: raw.coachId ? new UniqueEntityID(raw.coachId) : null,
        athleteId: raw.athleteId ? new UniqueEntityID(raw.athleteId) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
        normalUserId: raw.normalUserId
          ? new UniqueEntityID(raw.normalUserId)
          : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(workout: Workout): Prisma.WorkoutUncheckedCreateInput {
    return {
      id: workout.id.toString(),
      coachId: workout.coachId ? workout.coachId.toString() : null,
      title: workout.title,
      athleteId: workout.athleteId ? workout.athleteId.toString() : null,
      normalUserId: workout.normalUserId
        ? workout.normalUserId.toString()
        : null,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
    };
  }
}
