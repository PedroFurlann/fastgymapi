import { ExerciseRepository } from '@/domain/gym/application/repositories/exercise-repository';
import { Exercise } from '@/domain/gym/enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaExerciseMapper } from '../mappers/prisma-exercise-mapper';

@Injectable()
export class PrismaExerciseRepository implements ExerciseRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(exercise: Exercise): Promise<void> {
    const data = PrismaExerciseMapper.toPersistence(exercise);

    await this.prismaService.exercise.create({
      data,
    });
  }

  async createMany(exercises: Exercise[]): Promise<void> {
    const data = exercises.map(PrismaExerciseMapper.toPersistence);

    await this.prismaService.exercise.createMany({
      data,
    });
  }

  async findById(exerciseId: string): Promise<Exercise> {
    const exercise = await this.prismaService.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    if (!exercise) {
      return null;
    }

    return PrismaExerciseMapper.toDomain(exercise);
  }

  async update(exercise: Exercise): Promise<void> {
    const data = PrismaExerciseMapper.toPersistence(exercise);

    await this.prismaService.exercise.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(exerciseId: string): Promise<void> {
    await this.prismaService.exercise.delete({
      where: {
        id: exerciseId,
      },
    });
  }

  async deleteMany(exerciseIds: string[]): Promise<void> {
    exerciseIds.forEach(async (id) => {
      await this.delete(id);
    });
  }

  async findManyByCoachId(coachId: string): Promise<Exercise[]> {
    const exercises = await this.prismaService.exercise.findMany({
      where: {
        coachId,
      },
    });

    if (!exercises) {
      return null;
    }

    return exercises.map(PrismaExerciseMapper.toDomain);
  }
  async findManyByAthleteId(athleteId: string): Promise<Exercise[]> {
    const exercises = await this.prismaService.exercise.findMany({
      where: {
        athleteId,
      },
    });

    if (!exercises) {
      return null;
    }

    return exercises.map(PrismaExerciseMapper.toDomain);
  }
}
