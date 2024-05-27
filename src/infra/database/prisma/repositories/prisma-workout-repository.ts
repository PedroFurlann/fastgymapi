import { WorkoutRepository } from '@/domain/gym/application/repositories/workout-repository';
import { Workout } from '@/domain/gym/enterprise/entities/workout';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaWorkoutMapper } from '../mappers/prisma-workout-mapper';

@Injectable()
export class PrismaWorkoutRepository implements WorkoutRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(workout: Workout): Promise<void> {
    const data = PrismaWorkoutMapper.toPersistence(workout);

    await this.prismaService.workout.create({
      data,
    });
  }

  async findById(workoutId: string): Promise<Workout> {
    const workout = await this.prismaService.workout.findUnique({
      where: {
        id: workoutId,
      },
    });

    if (!workout) {
      return null;
    }

    return PrismaWorkoutMapper.toDomain(workout);
  }

  async update(workout: Workout): Promise<void> {
    const data = PrismaWorkoutMapper.toPersistence(workout);

    await this.prismaService.workout.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async delete(workoutId: string): Promise<void> {
    await this.prismaService.workout.delete({
      where: {
        id: workoutId,
      },
    });
  }

  async findManyByCoachId(coachId: string): Promise<Workout[]> {
    const workouts = await this.prismaService.workout.findMany({
      where: {
        coachId,
      },
    });

    if (!workouts) {
      return null;
    }

    return workouts.map(PrismaWorkoutMapper.toDomain);
  }
  async findManyByAthleteId(athleteId: string): Promise<Workout[]> {
    const workouts = await this.prismaService.workout.findMany({
      where: {
        athleteId,
      },
    });

    if (!workouts) {
      return null;
    }

    return workouts.map(PrismaWorkoutMapper.toDomain);
  }

  async findManyByNormalUserId(normalUserId: string): Promise<Workout[]> {
    const workouts = await this.prismaService.workout.findMany({
      where: {
        normalUserId,
      },
    });

    if (!workouts) {
      return null;
    }

    return workouts.map(PrismaWorkoutMapper.toDomain);
  }

  async favoriteWorkout(workoutId: string, favorite: boolean): Promise<void> {
    await this.prismaService.workout.update({
      where: {
        id: workoutId,
      },
      data: {
        favorite,
      },
    });
  }
}
