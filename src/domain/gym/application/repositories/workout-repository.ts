import { Workout } from '../../enterprise/entities/workout';

export abstract class WorkoutRepository {
  abstract create(workout: Workout): Promise<void>;
  abstract findById(workoutId: string): Promise<Workout | null>;
  abstract update(workout: Workout): Promise<void>;
  abstract delete(workoutId: string): Promise<void>;
  abstract findManyByCoachId(coachId: string): Promise<Workout[] | null>;
  abstract findManyByAthleteId(athleteId: string): Promise<Workout[] | null>;
  abstract findManyByNormalUserId(
    normalUserId: string,
  ): Promise<Workout[] | null>;
  abstract favoriteWorkout(
    workoutId: string,
    favorite: boolean,
  ): Promise<void>;
}
