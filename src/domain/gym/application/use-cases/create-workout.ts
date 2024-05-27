import { Workout } from '../../enterprise/entities/workout';
import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../repositories/workout-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateWorkoutUseCaseRequest {
  title: string;
  coachId?: string | null;
  athleteId?: string | null;
  normalUserId?: string | null;
}

type CreateWorkoutUseCaseResponse = Either<null, { workout: Workout }>;
@Injectable()
export class CreateWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute({
    title,
    coachId,
    normalUserId,
    athleteId,
  }: CreateWorkoutUseCaseRequest): Promise<CreateWorkoutUseCaseResponse> {
    const workout = Workout.create({
      title,
    });

    if (athleteId) {
      workout.athleteId = new UniqueEntityID(athleteId);
    }

    if (coachId) {
      workout.coachId = new UniqueEntityID(coachId);
    }

    if (coachId) {
      workout.coachId = new UniqueEntityID(coachId);
    }

    if (normalUserId) {
      workout.normalUserId = new UniqueEntityID(normalUserId);
    }

    await this.workoutRepository.create(workout);

    return right({
      workout,
    });
  }
}
