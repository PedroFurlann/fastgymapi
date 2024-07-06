import { History } from '@/domain/gym/enterprise/entities/history';

export class HistoryPresenter {
  static toHTTP(history: History) {
    return {
      id: history.id.toString(),
      elapsedTime: history.elapsedTime,
      workoutTitle: history.workoutTitle,
      workoutFavorite: history.workoutFavorite,
      completedAt: history.completedAt,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    };
  }
}
