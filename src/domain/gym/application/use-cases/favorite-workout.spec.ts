import { FavoriteWorkoutUseCase } from './favorite-workout';
import { InMemoryWorkoutRepository } from '../../../../../test/repositories/in-memory-workout-repository';
import { makeWorkout } from '../../../../../test/factories/make-workout';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryHistoryRepository } from '../../../../../test/repositories/in-memory-history-repository';
import { makeHistory } from '../../../../../test/factories/make-history';

let inMemoryWorkoutRepository: InMemoryWorkoutRepository;
let inMemoryHistoryRepository: InMemoryHistoryRepository;
let sut: FavoriteWorkoutUseCase;

describe('Favorite Workout', () => {
  beforeEach(() => {
    inMemoryWorkoutRepository = new InMemoryWorkoutRepository();
    inMemoryHistoryRepository = new InMemoryHistoryRepository();
    sut = new FavoriteWorkoutUseCase(
      inMemoryWorkoutRepository,
      inMemoryHistoryRepository,
    );
  });

  it('should be able to favorite a workout', async () => {
    const workout = makeWorkout({
      normalUserId: new UniqueEntityID('normal-user-1'),
    });

    const history1 = makeHistory({
      workoutId: workout.id,
    });

    const history2 = makeHistory({
      workoutId: workout.id,
    });

    await inMemoryWorkoutRepository.create(workout);
    await inMemoryHistoryRepository.create(history1);
    await inMemoryHistoryRepository.create(history2);

    const result = await sut.execute({
      normalUserId: 'normal-user-1',
      favorite: true,
      workoutId: workout.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryWorkoutRepository.items[0].favorite).toEqual(true);
    expect(inMemoryHistoryRepository.items[0].workoutFavorite).toEqual(true);
    expect(inMemoryHistoryRepository.items[1].workoutFavorite).toEqual(true);
  });

  it('should not be able to favorite a workout from another normal user', async () => {
    const workout = makeWorkout(
      {
        normalUserId: new UniqueEntityID('normal-user-1'),
      },
      new UniqueEntityID('workout-1'),
    );

    await inMemoryWorkoutRepository.create(workout);

    const result = await sut.execute({
      normalUserId: 'normal-user-2',
      workoutId: workout.id.toString(),
      favorite: true,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
