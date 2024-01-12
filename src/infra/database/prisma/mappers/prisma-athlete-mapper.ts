import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Athlete } from '@/domain/gym/enterprise/entities/athlete';
import { Prisma, Athlete as PrismaAthlete } from '@prisma/client';

export class PrismaAthleteMapper {
  static toDomain(raw: PrismaAthlete): Athlete {
    return Athlete.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        coachId: new UniqueEntityID(raw.id),
        avatarUrl: raw.avatarUrl ? raw.avatarUrl : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(athlete: Athlete): Prisma.AthleteUncheckedCreateInput {
    return {
      id: athlete.id.toString(),
      name: athlete.name,
      email: athlete.email,
      password: athlete.password,
      avatarUrl: athlete.avatarUrl,
      coachId: athlete.id.toString(),
      createdAt: athlete.createdAt,
      updatedAt: athlete.updatedAt,
    };
  }
}
