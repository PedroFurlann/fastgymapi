import { Workout } from '@/domain/gym/enterprise/entities/workout';

export class WorkoutPresenter {
  static toHTTP(workout: Workout) {
    return {
      id: workout.id.toString(),
      title: workout.title,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
    };
  }
}
