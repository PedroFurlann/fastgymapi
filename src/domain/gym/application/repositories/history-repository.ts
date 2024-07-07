import { History } from '../../enterprise/entities/history';

export abstract class HistoryRepository {
  abstract create(history: History): Promise<void>;
  abstract findById(historyId: string): Promise<History | null>;
  abstract updateManyByWorkoutId(
    workoutId: string,
    workoutTitle: string,
    workoutFavorite: boolean,
  ): Promise<void>;
  abstract deleteManyByNormalUserId(normalUserId: string): Promise<void>;
  abstract deleteManyByCoachId(coachId: string): Promise<void>;
  abstract deleteManyByAthleteId(userId: string): Promise<void>;
  abstract findManyByCoachId(athleteId: string): Promise<History[] | null>;
  abstract findManyByAthleteId(athleteId: string): Promise<History[] | null>;
  abstract findManyByNormalUserId(
    normalUserId: string,
  ): Promise<History[] | null>;
  abstract findManyByWorkoutId(workoutId: string): Promise<History[] | null>;
}
