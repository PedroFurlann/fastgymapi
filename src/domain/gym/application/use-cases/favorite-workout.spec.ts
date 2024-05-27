import { FavoriteWorkoutUseCase } from './favorite-workout';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { makeWorkout } from '../../../../../test/factories/make-workout';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: FavoriteWorkoutUseCase;

describe('Favorite Workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new FavoriteWorkoutUseCase(inMemoryWorkoutRepository);
  });

  it('should be able to favorite a workout', async () => {
    const workout = makeWorkout();

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      favorite: true,
      workoutId: workout.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWorkoutRepository.items[0].favorite).toEqual(true);
  });
});
