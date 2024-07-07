import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { makeHistory } from '../../../../../test/factories/make-history';
import { FetchHistoryByIdUseCase } from './fetch-history-by-id';
import { InMemoryExerciseRepository } from '../../../../../test/repositories/in-memory-exercise-repository';
import { makeWorkout } from '../../../../../test/factories/make-workout';
import { makeExercise } from '../../../../../test/factories/make-exercise';

let inMemoryHistoryRepository: InMemoryHistoryRepository;
let inMemoryExrciseRepository: InMemoryExerciseRepository;
let sut: FetchHistoryByIdUseCase;

describe('Fetch history', () => {
  beforeEach(() => {
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    inMemoryExrciseRepository = new InMemoryExerciseRepository();
    sut = new FetchHistoryByIdUseCase(
      inMemoryHistoryRepository,
      inMemoryExrciseRepository,
    );
  });

  it('Fetch history by id', async () => {
    const workout = makeWorkout();
    const history = makeHistory({
      workoutId: workout.id,
    });
    const exercise = makeExercise({
      workoutId: workout.id,
    });

    await inMemoryHistoryRepository.create(history);
    await inMemoryExrciseRepository.create(exercise);

    const result = await sut.execute({
      historyId: history.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.history).toEqual(
      expect.objectContaining({
        elapsedTime: inMemoryHistoryRepository.items[0].elapsedTime,
      }),
    );
    expect(result.value.exercises.length).toEqual(1);
  });
});
