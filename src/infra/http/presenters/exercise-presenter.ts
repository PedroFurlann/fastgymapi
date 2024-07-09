import { Exercise } from '@/domain/gym/enterprise/entities/exercise';

export class ExercisePresenter {
  static toHTTP(exercise: Exercise) {
    return {
      id: exercise.id.toString(),
      title: exercise.title,
      description: exercise.description,
      category: exercise.category,
      series: exercise.series,
      repetitions: exercise.repetitions,
      weights: exercise.weights,
      mediaUrl: exercise.mediaUrl,
      previewUrl: exercise.previewUrl,
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }
}
