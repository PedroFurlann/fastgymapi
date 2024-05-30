import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { makeWorkout } from '../../../../../test/factories/make-workout';
import { FetchWorkoutByIdUseCase } from './fetch-workout-by-id';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: FetchWorkoutByIdUseCase;

describe('Fetch workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new FetchWorkoutByIdUseCase(inMemoryWorkoutRepository);
  });

  it('Fetch workout by id', async () => {
    const workout = makeWorkout();

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      workoutId: workout.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.workout).toEqual(
      expect.objectContaining({
        title: inMemoryWorkoutRepository.items[0].title,
      }),
    );
  });
});
