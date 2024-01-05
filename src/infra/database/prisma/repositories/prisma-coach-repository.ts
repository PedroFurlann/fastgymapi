import { CoachRepository } from '@/domain/gym/application/repositories/coach-repository';
import { Coach } from '@/domain/gym/enterprise/entities/coach';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaCoachMapper } from '../mappers/prisma-coach-mapper';

@Injectable()
export class PrismaCoachRepository implements CoachRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(coach: Coach): Promise<void> {
    const data = PrismaCoachMapper.toPersistence(coach);

    await this.prismaService.coach.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<Coach> {
    const coach = await this.prismaService.coach.findUnique({
      where: {
        email,
      },
    });

    if (!coach) {
      return null;
    }

    return PrismaCoachMapper.toDomain(coach);
  }

  async findById(coachId: string): Promise<Coach> {
    const coach = await this.prismaService.coach.findUnique({
      where: {
        id: coachId,
      },
    });

    if (!coach) {
      return null;
    }

    return PrismaCoachMapper.toDomain(coach);
  }

  async update(coach: Coach): Promise<void> {
    const data = PrismaCoachMapper.toPersistence(coach);

    await this.prismaService.coach.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(coachId: string): Promise<void> {
    await this.prismaService.coach.delete({
      where: {
        id: coachId,
      },
    });
  }
}
