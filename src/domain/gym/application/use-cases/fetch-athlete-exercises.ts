import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Exercise } from '../../enterprise/entities/exercise';
import { ExerciseRepository } from '../repositories/exercise-repository';

interface FetchAthleteExercisesUseCaseRequest {
  athleteId: string;
}

type FetchAthleteExercisesUseCaseResponse = Either<
  null,
  { exercises: Exercise[] }
>;
@Injectable()
export class FetchAthleteExercisesUseCase {
  constructor(private exerciseRepository: ExerciseRepository) {}

  async execute({
    athleteId,
  }: FetchAthleteExercisesUseCaseRequest): Promise<FetchAthleteExercisesUseCaseResponse> {
    const exercises =
      await this.exerciseRepository.findManyByAthleteId(athleteId);

    return right({
      exercises,
    });
  }
}
