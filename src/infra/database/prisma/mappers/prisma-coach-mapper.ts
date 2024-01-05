import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Coach } from '@/domain/gym/enterprise/entities/coach';
import { Prisma, Coach as PrismaCoach } from '@prisma/client';

export class PrismaCoachMapper {
  static toDomain(raw: PrismaCoach): Coach {
    return Coach.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        avatarUrl: raw.avatarUrl ? raw.avatarUrl : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(coach: Coach): Prisma.CoachUncheckedCreateInput {
    return {
      id: coach.id.toString(),
      name: coach.name,
      email: coach.email,
      password: coach.password,
    };
  }
}
