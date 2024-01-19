import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Coach, CoachProps } from '@/domain/gym/enterprise/entities/coach';
import { PrismaCoachMapper } from '@/infra/database/prisma/mappers/prisma-coach-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeCoach(
  override: Partial<CoachProps> = {},
  id?: UniqueEntityID,
) {
  const coach = Coach.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return coach;
}

@Injectable()
export class CoachFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaCoach(data: Partial<CoachProps> = {}): Promise<Coach> {
    const coach = makeCoach(data);

    await this.prismaService.coach.create({
      data: PrismaCoachMapper.toPersistence(coach),
    });

    return coach;
  }
}
