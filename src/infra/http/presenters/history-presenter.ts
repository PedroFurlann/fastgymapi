import { History } from '@/domain/gym/enterprise/entities/history';

export class HistoryPresenter {
  static toHTTP(history: History) {
    return {
      id: history.id.toString(),
      elapsedTime: history.elapsedTime,
      completedAt: history.completedAt,
      workoutId: history.workoutId,
      createdAt: history.createdAt,
      updatedAt: history.updatedAt,
    };
  }
}
