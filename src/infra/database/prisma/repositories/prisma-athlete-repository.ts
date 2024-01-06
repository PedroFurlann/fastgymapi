import { AthleteRepository } from '@/domain/gym/application/repositories/athlete-repository';
import { Athlete } from '@/domain/gym/enterprise/entities/athlete';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAthleteMapper } from '../mappers/prisma-athlete-mapper';

@Injectable()
export class PrismaAthleteRepository implements AthleteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(athlete: Athlete): Promise<void> {
    const data = PrismaAthleteMapper.toPersistence(athlete);

    await this.prismaService.athlete.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<Athlete> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: {
        email,
      },
    });

    if (!athlete) {
      return null;
    }

    return PrismaAthleteMapper.toDomain(athlete);
  }

  async findById(athleteId: string): Promise<Athlete> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: {
        id: athleteId,
      },
    });

    if (!athlete) {
      return null;
    }

    return PrismaAthleteMapper.toDomain(athlete);
  }

  async update(athlete: Athlete): Promise<void> {
    const data = PrismaAthleteMapper.toPersistence(athlete);

    await this.prismaService.athlete.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(athleteId: string): Promise<void> {
    await this.prismaService.athlete.delete({
      where: {
        id: athleteId,
      },
    });
  }

  async findManyByCoachId(coachId: string): Promise<Athlete[]> {
    const athletes = await this.prismaService.athlete.findMany({
      where: {
        coachId,
      },
    });

    if (!athletes) {
      return null;
    }

    return athletes.map(PrismaAthleteMapper.toDomain);
  }
}
