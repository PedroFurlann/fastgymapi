import { Exercise } from '@/domain/gym/enterprise/entities/exercise';

export class ExercisePresenter {
  static toHTTP(exercise: Exercise) {
    return {
      id: exercise.id.toString(),
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      mediaUrl: exercise.mediaUrl,
      previewUrl: exercise.previewUrl,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
