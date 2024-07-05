import { HistoryRepository } from '@/domain/gym/application/repositories/history-repository';
import { History } from '@/domain/gym/enterprise/entities/history';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaHistoryMapper } from '../mappers/prisma-history-mapper';

@Injectable()
export class PrismaHistoryRepository implements HistoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(history: History): Promise<void> {
    const data = PrismaHistoryMapper.toPersistence(history);

    await this.prismaService.history.create({
      data,
    });
  }

  async findById(historyId: string): Promise<History> {
    const history = await this.prismaService.history.findUnique({
      where: {
        id: historyId,
      },
    });

    if (!history) {
      return null;
    }

    return PrismaHistoryMapper.toDomain(history);
  }

  async deleteManyByNormalUserId(normalUserId: string): Promise<void> {
    await this.prismaService.history.deleteMany({
      where: {
        normalUserId,
      },
    });
  }

  async deleteManyByCoachId(coachId: string): Promise<void> {
    await this.prismaService.history.deleteMany({
      where: {
        coachId,
      },
    });
  }

  async deleteManyByAthleteId(athleteId: string): Promise<void> {
    await this.prismaService.history.deleteMany({
      where: {
        athleteId,
      },
    });
  }

  async findManyByCoachId(coachId: string): Promise<History[]> {
    const historys = await this.prismaService.history.findMany({
      where: {
        coachId,
      },
    });

    if (!historys) {
      return null;
    }

    return historys.map(PrismaHistoryMapper.toDomain);
  }
  async findManyByAthleteId(athleteId: string): Promise<History[]> {
    const historys = await this.prismaService.history.findMany({
      where: {
        athleteId,
      },
    });

    if (!historys) {
      return null;
    }

    return historys.map(PrismaHistoryMapper.toDomain);
  }

  async findManyByNormalUserId(normalUserId: string): Promise<History[]> {
    const historys = await this.prismaService.history.findMany({
      where: {
        normalUserId,
      },
    });

    if (!historys) {
      return null;
    }

    return historys.map(PrismaHistoryMapper.toDomain);
  }

  async findManyByWorkoutId(workoutId: string): Promise<History[]> {
    const historys = await this.prismaService.history.findMany({
      where: {
        workoutId,
      },
    });

    if (!historys) {
      return null;
    }

    return historys.map(PrismaHistoryMapper.toDomain);
  }
}
