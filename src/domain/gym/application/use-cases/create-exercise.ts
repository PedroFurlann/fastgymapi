import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface CreateExerciseUseCaseRequest {
  title: string;
  description: string;
  coachId: string;
  athleteId?: string | null;
}

type CreateExerciseUseCaseResponse = Either<null, { exercise: Exercise }>;
@Injectable()
export class CreateExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    title,
    coachId,
    description,
    athleteId,
  }: CreateExerciseUseCaseRequest): Promise<CreateExerciseUseCaseResponse> {
    const exercise = Exercise.create({
      title,
      description,
      coachId: new UniqueEntityID(coachId),
    });

    const coachExercises =
      await this.exerciseRepository.findManyByCoachId(coachId);

    const exerciseAlreadyExist = coachExercises.find(
      (exercise) => exercise.title === title,
    );

    if (exerciseAlreadyExist) {
      await this.exerciseRepository.delete(exerciseAlreadyExist.id.toString());
    }

    if (athleteId) {
      exercise.athleteId = new UniqueEntityID(athleteId);
    }

    await this.exerciseRepository.create(exercise);

    return right({
      exercise,
    });
  }
}
