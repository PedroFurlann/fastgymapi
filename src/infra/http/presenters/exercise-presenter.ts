import { Exercise } from '@/domain/gym/enterprise/entities/exercise';

export class ExercisePresenter {
  static toHTTP(exercise: Exercise) {
    return {
      id: exercise.id.toString(),
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      videoUrl: exercise.videoUrl,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
