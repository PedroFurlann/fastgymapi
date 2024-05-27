import { WorkoutRepository } from 'src/domain/gym/application/repositories/workout-repository';
import { Workout } from 'src/domain/gym/enterprise/entities/workout';

export class InMemoryWorkoutRepository implements WorkoutRepository {
  public items: Workout[] = [];

  async create(workout: Workout): Promise<void> {
    this.items.push(workout);
  }

  async findById(id: string): Promise<Workout> {
    const workout = this.items.find((item) => item.id.toString() === id);

    if (!workout) {
      return null;
    }

    return workout;
  }

  async update(workout: Workout): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === workout.id);

    this.items[itemIndex] = workout;
  }

  async delete(workoutId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === workoutId,
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByCoachId(coachId: string): Promise<Workout[]> {
    const workouts = this.items.filter(
      (item) => item.coachId.toString() === coachId,
    );

    if (!workouts) {
      return [];
    }

    return workouts;
  }

  async findManyByAthleteId(athleteId: string): Promise<Workout[]> {
    const workouts = this.items.filter(
      (item) => item.athleteId.toString() === athleteId,
    );

    if (!workouts) {
      return [];
    }

    return workouts;
  }

  async findManyByNormalUserId(normalUserId: string): Promise<Workout[]> {
    const workouts = this.items.filter(
      (item) => item.normalUserId.toString() === normalUserId,
    );

    if (!workouts) {
      return [];
    }

    return workouts;
  }

  async favoriteWorkout(workoutId: string, favorite: boolean): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === workoutId,
    );

    this.items[itemIndex].favorite = favorite;
  }
}
