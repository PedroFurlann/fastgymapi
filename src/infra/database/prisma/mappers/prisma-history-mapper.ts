import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { History } from '@/domain/gym/enterprise/entities/history';
import { Prisma, History as PrismaHistory } from '@prisma/client';

export class PrismaHistoryMapper {
  static toDomain(raw: PrismaHistory): History {
    return History.create(
      {
        elapsedTime: raw.elapsedTime,
        completedAt: raw.completedAt,
        workoutTitle: raw.workoutTitle,
        workoutFavorite: raw.workoutFavorite,
        coachId: raw.coachId ? new UniqueEntityID(raw.coachId) : null,
        athleteId: raw.athleteId ? new UniqueEntityID(raw.athleteId) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
        normalUserId: raw.normalUserId
          ? new UniqueEntityID(raw.normalUserId)
          : null,
        workoutId: raw.workoutId ? new UniqueEntityID(raw.workoutId) : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(history: History): Prisma.HistoryUncheckedCreateInput {
    return {
      id: history.id.toString(),
      elapsedTime: history.elapsedTime,
      completedAt: history.completedAt,
      workoutTitle: history.workoutTitle,
      workoutFavorite: history.workoutFavorite,
      coachId: history.coachId ? history.coachId.toString() : null,
      athleteId: history.athleteId ? history.athleteId.toString() : null,
      normalUserId: history.normalUserId
        ? history.normalUserId.toString()
        : null,
      workoutId: history.workoutId ? history.workoutId.toString() : null,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    };
  }
}
