import { Exercise } from '../../enterprise/entities/exercise';
import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from '../repositories/exercise-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface EditNormalUserExerciseUseCaseRequest {
  normalUserId: string;
  title: string;
  dayOfWeek?: string;
  category: string;
  description: string;
  exerciseId: string;
}

type EditNormalUserExerciseUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { exercise: Exercise }
>;
@Injectable()
export class EditNormalUserExerciseUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    normalUserId,
    title,
    dayOfWeek,
    category,
    description,
    exerciseId,
  }: EditNormalUserExerciseUseCaseRequest): Promise<EditNormalUserExerciseUseCaseResponse> {
    const exerciseSelected = await this.exerciseRepository.findById(exerciseId);

    if (!exerciseSelected) {
      return left(new ResourceNotFoundError());
    }

    if (exerciseSelected.normalUserId.toString() !== normalUserId) {
      return left(new NotAllowedError());
    }

    exerciseSelected.title = title;
    exerciseSelected.description = description;
    exerciseSelected.dayOfWeek = dayOfWeek ?? null;
    exerciseSelected.category = category;

    await this.exerciseRepository.update(exerciseSelected);

    return right({
      exercise: exerciseSelected,
    });
  }
}
