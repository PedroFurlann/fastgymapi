import { ExerciseRepository } from 'src/domain/gym/application/repositories/exercise-repository';
import { Exercise } from 'src/domain/gym/enterprise/entities/exercise';

export class InMemoryExerciseRepository implements ExerciseRepository {
  public items: Exercise[] = [];

  async create(exercise: Exercise): Promise<void> {
    this.items.push(exercise);
  }

  async findById(id: string): Promise<Exercise> {
    const exercise = this.items.find((item) => item.id.toString() === id);

    if (!exercise) {
      return null;
    }

    return exercise;
  }

  async update(exercise: Exercise): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === exercise.id);

    this.items[itemIndex] = exercise;
  }

  async delete(exerciseId: string): Promise<void> {
    this.items.filter((item) => item.id.toString() !== exerciseId);
  }

  async findManyByCoachId(coachId: string): Promise<Exercise[]> {
    const exercises = this.items.filter(
      (item) => item.coachId.toString() === coachId,
    );

    if (!exercises) {
      return [];
    }

    return exercises;
  }

  async findManyByAthleteId(athleteId: string): Promise<Exercise[]> {
    const exercises = this.items.filter(
      (item) => item.athleteId.toString() === athleteId,
    );

    if (!exercises) {
      return [];
    }

    return exercises;
  }
}
