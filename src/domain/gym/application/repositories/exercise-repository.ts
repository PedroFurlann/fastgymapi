import { Exercise } from '../../enterprise/entities/exercise';

export abstract class ExerciseRepository {
  abstract create(exercise: Exercise): Promise<void>;
  abstract createMany(exercises: Exercise[]): Promise<void>;
  abstract findById(exerciseId: string): Promise<Exercise | null>;
  abstract update(exercise: Exercise): Promise<void>;
  abstract delete(exerciseId: string): Promise<void>;
  abstract deleteMany(exerciseIds: string[]): Promise<void>;
  abstract findManyByCoachId(coachId: string): Promise<Exercise[] | null>;
  abstract findManyByAthleteId(athleteId: string): Promise<Exercise[] | null>;
  abstract findManyByNormalUserId(
    normalUserId: string,
  ): Promise<Exercise[] | null>;
}
