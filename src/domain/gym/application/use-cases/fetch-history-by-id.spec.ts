import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { makeHistory } from '../../../../../test/factories/make-history';
import { FetchHistoryByIdUseCase } from './fetch-history-by-id';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { makeWorkout } from '../../../../../test/factories/make-workout';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let sut: FetchHistoryByIdUseCase;

describe('Fetch history', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    sut = new FetchHistoryByIdUseCase(
      inMemoryHistoryRepository,
      inMemoryWorkoutRepository,
    );
  });

  it('Fetch history by id', async () => {
    const workout = makeWorkout();
    const history = makeHistory({
      workoutId: workout.id,
    });

    await inMemoryWorkoutRepository.create(workout);
    await inMemoryHistoryRepository.create(history);

    const result = await sut.execute({
      historyId: history.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.history).toEqual(
      expect.objectContaining({
        elapsedTime: inMemoryHistoryRepository.items[0].elapsedTime,
      }),
    );
    expect(result.value.workout).toEqual(
      expect.objectContaining({
        title: inMemoryWorkoutRepository.items[0].title,
      }),
    );
  });
});
