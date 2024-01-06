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
      coachId: athlete.id.toString(),
    };
  }
}
