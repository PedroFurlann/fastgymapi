import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Exercise } from '../../enterprise/entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';

interface FetchExerciseByIdUseCaseRequest {
  exerciseId: string;
}

type FetchExerciseByIdUseCaseResponse = Either<null, { exercise: Exercise }>;
@Injectable()
export class FetchExerciseByIdUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    exerciseId,
  }: FetchExerciseByIdUseCaseRequest): Promise<FetchExerciseByIdUseCaseResponse> {
    const exercise = await this.exerciseRepository.findById(exerciseId);

    return right({
      exercise,
    });
  }
}
